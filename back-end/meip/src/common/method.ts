/*
 * @Description: T
 * @Version: 1.0
 * @Autor: Helx
 * @Date: 2024-05-01 12:04:16
 * @LastEditors: Helx
 * @LastEditTime: 2024-05-25 11:33:53
 */
import axios from "axios";

import {
    GET_WIKI_SON_NODE_LIST_URL,
    EOBJ_TOKEN,
    SPACE_ID_DEV,
    GET_ACCESS_TOKEN_URL,
    ACCESS_TOKEN,
    GET_SHEET_METAINFO_URL
} from './constAndType';

import type {
    TWikiSonItems,
    TMetaInfoItems,
    TValueRanges,
} from "./constAndType";
import { handleRequest } from '../common/request'


/**
 * 
 * @returns 令牌
 */
export const getAccessToken = async () => {
    return ACCESS_TOKEN;
    const { data } = await axios.get(GET_ACCESS_TOKEN_URL);
    return data;
}



//获取知识空间子列表
export const getWikiSonNodeListMethod = async (url: string) => {
    const { data } = await handleRequest(url);

    return data.data.items.map((item: TWikiSonItems) => item);
};


//获取表格元数据
export const getSheetMetaInfo = async (objToken: string) => {
    const { data } = await handleRequest(GET_SHEET_METAINFO_URL + objToken + "/metainfo");

    return {
        sheets: data.data.sheets.map((item: TMetaInfoItems) => item),
        titleName: data.data.properties.title,
    };
};