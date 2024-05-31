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
    EABILITY_TYPE,
    EReuqestMethods,
    CREATE_WIKI_SPACE_NODE_URL,
} from "../../common/constAndType";
import type {
    TWikiSonItems,
    TMetaInfoItems,
    TValueRanges,
    TSheetMetaInfo,
    TAbilityEnumKeys,
} from "../../common/constAndType";

import { getWikiSonNodeListMethod, getSheetMetaInfo } from "../../common/method";
import { handleRequest } from "../../common/request";
import { compareArrIsEqual } from "../../common/tools";
import { db, closeSqliteDb } from "../../database/index";

const date = new Date();
const month = date.getMonth() + 1; //当前月
const year = String(date.getFullYear()).slice(2); // 年份后两位 如：24

const NODE_TOKEN = "DRvDwfjxHibMbIkGtV5ckyVbnaf"; // DRvDwfjxHibMbIkGtV5ckyVbnaf TFZcwhVRgi1MxXkbuAXcvWrLnBx

type TMonthReview = {
    nodeToken: string;
    sheetSpaceId: string;
    currentMonth: number;
    previousResult?: TWikiSonItems;
};
/**
 * 遍历获取每个人的月评数据
 * @param nodeToken
 * @param sheetSpaceId
 * @param previousResult
 */
export const getMonthReviewResult = async ({
    nodeToken,
    sheetSpaceId,
    currentMonth,
    previousResult,
}: TMonthReview): Promise<TWikiSonItems[]> => {
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
                const sheetMetaInfo: TSheetMetaInfo = await getSheetMetaInfo(obj_token);

                const sheetMetaInfoSheetId = sheetMetaInfo.sheets.find((mateInfo) =>
                    mateInfo.title.includes(`${year}-${currentMonth}月`)
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

                handlePersonInfo(sheetResult, previousResult, node_token, sheetMetaInfoSheetId, currentMonth);
            }
        } else {
            // 还有子节点，递归
            await getMonthReviewResult({
                nodeToken: item.node_token,
                sheetSpaceId: item.space_id,
                previousResult: item,
                currentMonth: currentMonth,
            });
        }
    }

    return dataItemArr;
};

//处理获取到每个人的数据，插入数据表
const handlePersonInfo = (
    valueRange: TValueRanges[],
    preRes: TWikiSonItems | undefined,
    nodeToken: string,
    sheetId: string,
    currentMonth: number = month
) => {
    //‘能力提升’获取最高级
    let maxAbilityIndex = 0;
    const personInfo = valueRange[0].values[0] || [];
    let abilityArr = valueRange[1].values.flat() || [];
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
    const abilityForSelfArr =
        valueRange[4].values.flat().filter((item) => Object.values(EABILITY_TYPE).includes(item)) || []; //能力提升自评
    const isHeightLight =
        compareArrIsEqual(completeForSelf as Array<string>, completeForLeader as Array<string>) &&
        compareArrIsEqual(abilityForSelfArr, abilityArr); //完成情况和能力自评两个有一个是false单元格就高亮
    personInfo.push(isHeightLight ? "0" : "1");
    console.log("personInfo:", personInfo);
    //插入数据存在则更新
    const ADD_USER_SQL = `insert OR IGNORE into usersInfo 
            (sheetId, name, currentLevel, firstDepart, secondDepart,  selfPerformance,  leaderPerformance, isHeightLight,  month,  times) 
        values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT (sheetId, name) DO UPDATE 
            SET
                currentLevel = excluded.currentLevel,
                firstDepart = excluded.firstDepart,
                secondDepart = excluded.secondDepart,
                selfPerformance = excluded.selfPerformance, 
                leaderPerformance = excluded.leaderPerformance,
                isHeightLight = excluded.isHeightLight,
                month = excluded.month,
                times = excluded.times
            `; // isHeightLight 是否高亮 0 否 1 是
    db.run(
        ADD_USER_SQL,
        [
            sheetId,
            personInfo[1],
            personInfo[6],
            personInfo[3],
            personInfo[5],
            personInfo[8],
            personInfo[10],
            personInfo[personInfo.length - 1],
            `${year}-${currentMonth}月`,
            date.getTime().toString(),
        ],
        (err) => {
            if (err) {
                console.log("err:", err);
                throw new Error(err.message);
            }
        }
    );
};

/**
 * 过滤完成情况选项
 * @param arr
 * @returns
 */
const handleCompleteStatus = (arr: Array<Array<string> | Array<[]> | null>) => {
    if (!Array.isArray(arr)) {
        console.warn("Input is not an array.");
        return [];
    }
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
    const { data } = await handleRequest(GET_SHEET_METAINFO_URL + objToken + "/values_batch_get?ranges=" + sheetRanges);

    return data.data.valueRanges;
};

/**
 * 创建Wiki空间节点
 * @param spaceId 空间ID，用于指定要创建节点的空间
 * @param pNodeToken 父节点的token，指定新节点的父节点
 * @param sheetTitle 表格标题，新创建的节点标题将基于此标题添加“月月评汇总”后缀
 * @returns 返回创建的节点信息
 */
export const createWikiSpaceNode = async (spaceId: string, pNodeToken: string, sheetTitle: string) => {
    // 准备请求参数，包括节点类型、父节点token、标题等
    const params = {
        obj_type: "sheet",
        parent_node_token: pNodeToken,
        node_type: "origin",
        title: sheetTitle + "月月评汇总",
    };
    // 发起请求创建Wiki空间节点
    const { data } = await handleRequest(CREATE_WIKI_SPACE_NODE_URL + spaceId + "/nodes", {
        method: EReuqestMethods.POST,
        data: params,
    });

    return data.data.node;
};
