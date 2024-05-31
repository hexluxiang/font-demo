/*
 * @Description:
 * @Version: 1.0
 * @Autor: Helx
 * @Date: 2024-05-01 12:04:16
 * @LastEditors: Helx
 * @LastEditTime: 2024-05-25 12:17:27
 */
import { ExpRequest, ExpResponse, SPACE_ID_DEV } from "../../common/constAndType";
import type { TWikiNodeInfo, TMetaInfoItems } from "../../common/constAndType";
import { getSheetMetaInfo } from "../../common/method";
import { getMonthReviewResult, createWikiSpaceNode } from "./api";
import { handleRequest } from "../../common/request";

/**
 * 处理汇总的路由
 *
 */

const Summary = async (req: ExpRequest, res: ExpResponse) => {
    const { docNodeUrl, curDate } = req.query;
    // 1. 创建文档 2.查询sqlite数据 3.sqlite数据如果为空现查，sqlite如果有直接插入创建的文档中
    // 成功：返回code: 0， 创建的文档的token，插入的条数
    //失败：code: 1，失败原因
    let code = 0;
    try {
    } catch (error) {
        code = 1;
    }

    // const resData = await getMonthReviewResult();
    res.status(200).json({ code: 0, result: {}, path: req.path });
};

//新建sheet表头数据
const getSheetHeadData = (sheetId: string, month: string) => {
    return [
        {
            range: sheetId + "!A1:E1",
            values: [["姓名", "当前职级", "一级部门", "二级部门", month]],
        },
        {
            range: sheetId + "!E2:F2",
            values: [["绩效", "能力提升"]],
        },
    ];
};

//创建新wiki
const createNewWikiSheet = async (spaceId: string, pNodeToken: string, sheetTitle: string) => {
    //第一次汇总创建wiki，获取sheet元数据，合并单元格，插入表头，设置样式
    const createInfo: TWikiNodeInfo = await createWikiSpaceNode(spaceId, pNodeToken, sheetTitle);
    // createWikiObjToken.current = createInfo.obj_token;
    const newSheetMetaInfo: TMetaInfoItems[] = (await getSheetMetaInfo(createInfo.obj_token)).sheets;
    // newSheetId.current = newSheetMetaInfo[0].sheetId;

    const valueRanges = [...getSheetHeadData(newSheetMetaInfo[0].sheetId, "5月")];

    // await handelInsertSheetDataRanges(createInfo.obj_token, valueRanges);
    // await handleSetSheetRangeStyle(createInfo.obj_token, getRangeStyleData(newSheetMetaInfo[0].sheetId));

    // MERGE_SHEET_ARR.forEach((range) => {
    //     handelMergeSheetRange(createInfo.obj_token, newSheetMetaInfo[0].sheetId + range);
    // });
};

export default Summary;
