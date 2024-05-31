/*
 * @Description: T
 * @Version: 1.0
 * @Autor: Helx
 * @Date: 2024-05-01 12:04:16
 * @LastEditors: Helx
 * @LastEditTime: 2024-05-25 11:33:53
 */
import axios from "axios";
const NodeCache = require("node-cache");

import {
    GET_WIKI_SON_NODE_LIST_URL,
    EOBJ_TOKEN,
    SPACE_ID_DEV,
    GET_ACCESS_TOKEN_URL,
    ACCESS_TOKEN,
    GET_SHEET_METAINFO_URL,
    ACCESS_TOKEN_EXPIRATION,
} from "./constAndType";

import type { TWikiSonItems, TMetaInfoItems, TValueRanges } from "./constAndType";
import { handleRequest } from "../common/request";

/**
 *获取访问令牌
 * @returns 令牌
 */
export const accessTokenCache = new NodeCache({ stdTTL: 0, checkperiod: ACCESS_TOKEN_EXPIRATION });
export const getAccessToken = async (): Promise<string> => {
    const accessTokenKey = accessTokenCache.get("ACCESS_TOKEN_KEY");

    if (accessTokenKey) {
        return accessTokenKey;
    }
    //重新获取accessTokenKey
    const newAccessTokenKey = await fetchNewAccessTokenKey();

    // 将新获取的accessTokenKey存入缓存，过期时间设置为2小时（7200秒）
    accessTokenCache.set("ACCESS_TOKEN_KEY", newAccessTokenKey, ACCESS_TOKEN_EXPIRATION);
    return newAccessTokenKey;
};

/**
 * 从服务器获取新的accessTokenKey
 * @returns {Promise<string>}
 */
export const fetchNewAccessTokenKey = async (): Promise<string> => {
    const { data } = await axios.get(GET_ACCESS_TOKEN_URL);
    return data;
};

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
