/*
 * @Description: 
 * @Version: 1.0
 * @Autor: Helx
 * @Date: 2024-05-01 12:04:16
 * @LastEditors: Helx
 * @LastEditTime: 2024-05-25 12:17:27
 */
import { ExpRequest, ExpResponse } from "../../common/constAndType";
import { getAccessToken } from "../../common/method";
import { getMonthReviewResult } from './api'

/**
 * 处理汇总的路由
 *
 */

const Summary = async (req: ExpRequest, res: ExpResponse) => {
    const ACCESS_TOKEN = await getAccessToken();
    // console.log("ACCESS_TOKEN", ACCESS_TOKEN);
    const resData = await getMonthReviewResult();
    res.status(200).json({ name: "helx", age: 200, resData, path: req.path });
}


export default Summary;
