/*
 * @Description: 
 * @Version: 1.0
 * @Autor: Helx
 * @Date: 2024-05-24 20:40:37
 * @LastEditors: Helx
 * @LastEditTime: 2024-05-29 23:36:08
 */
import {
    GET_WIKI_SON_NODE_LIST_URL,
    EOBJ_TOKEN,
    SPACE_ID_DEV,
    GET_ACCESS_TOKEN_URL,
    ACCESS_TOKEN,
    GET_SHEET_METAINFO_URL,
    EABILITY_TYPE
} from '../../common/constAndType';
import type {
    TWikiSonItems,
    TMetaInfoItems,
    TValueRanges,
    TSheetMetaInfo,
    TAbilityEnumKeys
} from "../../common/constAndType";

import { getWikiSonNodeListMethod, getSheetMetaInfo } from '../../common/method';
import { handleRequest } from '../../common/request';
import { compareArrIsEqual } from '../../common/tools';
import { db, closeSqliteDb } from "../../database/index";

const date = new Date();
const month = date.getMonth() + 1; //当前月
const year = String(date.getFullYear()).slice(2); // 年份后两位 如：24


const NODE_TOKEN = 'TFZcwhVRgi1MxXkbuAXcvWrLnBx'; // DRvDwfjxHibMbIkGtV5ckyVbnaf
/**
 * 遍历获取每个人的月评数据
 * @param nodeToken 
 * @param sheetSpaceId 
 * @param previousResult 
 */
export const getMonthReviewResult = async (
    nodeToken: string = NODE_TOKEN,
    sheetSpaceId: string = SPACE_ID_DEV,
    previousResult?: TWikiSonItems
): Promise<TWikiSonItems[]> => {
    const reqUrl = GET_WIKI_SON_NODE_LIST_URL + sheetSpaceId + "/nodes?parent_node_token=" + nodeToken;
    const dataItemArr: TWikiSonItems[] = await getWikiSonNodeListMethod(reqUrl);
    // console.log("dataItemArr", dataItemArr);

    for (let i = 0; i < dataItemArr.length; i++) {
        const item = dataItemArr[i];
        //不存在子节点
        if (!item.has_child) {
            //获取表格数据
            if (item.obj_type === EOBJ_TOKEN.sheet) {
                //缓存已获取的数据(再次点击不发请求)TODO...

                // const wikiNodeInfo: WikiNodeInfo = await getWikiNodeInfoMethod(item.node_token, accessToken);
                const { title, obj_token, node_token } = item;
                if (title.includes("个人模板") || title.includes("月评汇总")) {
                    continue;
                }
                //获取每个人的sheet表格
                const sheetMetaInfo: TSheetMetaInfo = (await getSheetMetaInfo(obj_token));

                const sheetMetaInfoSheetId = sheetMetaInfo.sheets.find((mateInfo) =>
                    mateInfo.title.includes(`${year}-${month}月`)
                )?.sheetId;

                if (!sheetMetaInfoSheetId) {
                    continue;
                }

                const sheetResult: TValueRanges[] = await getSheetRangeInfo(
                    obj_token,
                    sheetMetaInfoSheetId +
                    "!B2:L2," +
                    sheetMetaInfoSheetId +
                    "!L5:L30," +
                    sheetMetaInfoSheetId +
                    "!I5:I30," +
                    sheetMetaInfoSheetId +
                    "!J5:J30," +
                    sheetMetaInfoSheetId +
                    "!K5:K30"
                );
                // console.log('sheetResult', sheetResult);

                handlePersonInfo(sheetResult, previousResult, node_token, sheetMetaInfoSheetId);
            }
        } else {
            // 还有子节点，递归
            await getMonthReviewResult(item.node_token, item.space_id, item);
        }
    }

    return dataItemArr;
};

//处理获取到每个人的数据
const handlePersonInfo = (
    valueRange: TValueRanges[],
    preRes: TWikiSonItems | undefined,
    nodeToken: string,
    sheetId: string
) => {
    //‘能力提升’获取最高级
    let maxAbilityIndex = 0;
    const personInfo = valueRange[0].values[0];
    let abilityArr = valueRange[1].values.flat();
    abilityArr = abilityArr.filter((item) => Object.values(EABILITY_TYPE).includes(item)); //能力提升上级评
    abilityArr.length > 0 &&
        abilityArr.map((item, index: number) => {
            if (
                EABILITY_TYPE[item as TAbilityEnumKeys] > EABILITY_TYPE[abilityArr[maxAbilityIndex] as TAbilityEnumKeys]
            ) {
                maxAbilityIndex = index;
            }
            return item;
        });
    const abilityText = abilityArr.length > 0 ? abilityArr[maxAbilityIndex] : "N/A";
    personInfo.push(abilityText);
    personInfo[5] = preRes?.title.split("-")[0] || "N/A";
    const completeForSelf = handleCompleteStatus(valueRange[2].values); //完成情况自评
    const completeForLeader = handleCompleteStatus(valueRange[3].values); //完成情况上级
    const abilityForSelfArr = valueRange[4].values
        .flat()
        .filter((item) => Object.values(EABILITY_TYPE).includes(item)); //能力提升自评
    const isHeightLight =
        compareArrIsEqual(completeForSelf as Array<string>, completeForLeader as Array<string>) &&
        compareArrIsEqual(abilityForSelfArr, abilityArr); //完成情况和能力自评两个有一个是false单元格就高亮
    personInfo.push(String(isHeightLight));
    console.log("personInfo:", personInfo);
    const ADD_USER_SQL = "insert OR IGNORE into usersInfo (nodeToken, name, currentLevel, firstDepart, secondDepart, month, times) values(?, ?, ?,?, ?, ?,?)";
    db.run(ADD_USER_SQL, [nodeToken, personInfo[1], personInfo[6], personInfo[3], personInfo[5], `${year}-${month}月`, new Date().getTime().toString()], err => {
        if (err) {
            console.log("15 - err:", err);
            throw new Error(err.message);
        }
    });
};

/**
 * 过滤完成情况选项
 * @param arr
 * @returns
 */
const handleCompleteStatus = (arr: Array<null | Array<string> | Array<[]>>) => {
    return arr
        .flat()
        .filter(
            (i) =>
                i &&
                typeof i !== "object" &&
                !i.includes("能力提升") &&
                !i.includes("月度之星") &&
                !i.includes("完成情况") &&
                !(i.length > 15)
        );
};

//获取表格数据
const getSheetRangeInfo = async (objToken: string, sheetRanges: string) => {
    const { data } = await handleRequest(
        GET_SHEET_METAINFO_URL + objToken + "/values_batch_get?ranges=" + sheetRanges
    );

    return data.data.valueRanges;
};