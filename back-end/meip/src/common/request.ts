import axios, { AxiosRequestConfig } from "axios";
import { OPEN_FEISHU_BASE_URL, EReuqestMethods, ACCESS_TOKEN, ACCESS_TOKEN_EXPIRATION } from "./constAndType";

import { getAccessToken, accessTokenCache, fetchNewAccessTokenKey } from "./method";
type PickValueType<T, K extends keyof T> = T[K];

type Headers = PickValueType<AxiosRequestConfig, "headers">;

type RequestOptions = {
    data?: any; // eslint-disable-line
    method?: EReuqestMethods;
    headers?: Headers;
};
// 创建一个公共的 Axios 方法
export const handleRequest = async (url: string, options?: RequestOptions): Promise<any> => {
    const accessToken = await getAccessToken();

    // 根据不同的请求方法处理请求体（data）
    const config = {
        url,
        method: options?.method || EReuqestMethods.GET,
        headers: {
            Authorization: "Bearer " + accessToken,
            ...options?.headers,
        },
        data: options?.data,
    };
    axios.defaults.baseURL = OPEN_FEISHU_BASE_URL;

    const responseData = await axios(config);
    if (responseData.status !== 200 || responseData.data.code !== 0) {
        throw new Error("Sorry, network error, plaese try again later");
    }

    if (responseData.data.code === 99991663) {
        const newAccessTokenKey = await fetchNewAccessTokenKey();
        accessTokenCache.set("ACCESS_TOKEN_KEY", newAccessTokenKey, ACCESS_TOKEN_EXPIRATION);
    }
    // console.log('responseData', responseData.data);

    return responseData;
};
