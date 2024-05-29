/*
 * @Description: 
 * @Version: 1.0
 * @Autor: Helx
 * @Date: 2024-04-13 12:04:16
 * @LastEditors: Helx
 * @LastEditTime: 2024-05-05 17:06:23
 */
import { ExpRequest, ExpResponse } from "../common/constAndType";
import { getAccessToken } from "../common/method";

/**
 * 生成模板路由
 *
 */

const CreateNextModule = async (req: ExpRequest, res: ExpResponse) => {
    const ACCESS_TOKEN = 't-g10455gCA2NHCBT6JU7PKDWM7YBUKEV7IEK7BLX4'; // await getAccessToken();
    // console.log("ACCESS_TOKEN", ACCESS_TOKEN);
    console.log('req:', req.body);
    

    res.status(200).json({ name: "helx", age: 200, data: ACCESS_TOKEN, path: req.path });
};

export default CreateNextModule;
