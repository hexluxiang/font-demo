import { ExpRequest, ExpResponse } from "../common/constAndType";
import { getAccessToken } from "../common/method";

/**
 * 同步模板路由
 *
 */

const FixModule = async (req: ExpRequest, res: ExpResponse) => {
    const ACCESS_TOKEN = await getAccessToken();
    console.log("ACCESS_TOKEN", ACCESS_TOKEN);
    res.status(200).json({ name: "helx", age: 200, ACCESS_TOKEN, path: req.path });
};

export default FixModule;
