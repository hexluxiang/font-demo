import express from "express";
import { db, closeSqliteDb } from "../database";
import Summary from "./summary";
import FixModule from "./fixModule";
import CreateNextModule from './createNextModule'
const router = express.Router();

const ADD_USER_SQL = "insert into users (url, name, age, times) values(?, ?, ?,?)";
router.get("/addUser", (req, res) => {
    try {
        console.log('9- req.path',req.path);
        
        const { name, age } = req.query;
        if (!name || !age) {
            throw new Error("请插入数据");
        }
        db.run(ADD_USER_SQL, [req.path, name, age, new Date().getTime().toString()], err => {
            if (err) {
                console.log("15 - err:", err);
                throw new Error(err.message);
            }
        });
        res.status(200).json({ code: 0, data: "", msg: "success" });
    } catch (error) {
        res.status(400).json({ code: 1, data: "", msg: error });
    }
});

router.get("/getUser", (req, res) => {
    try {
        const { name } = req.query;
        if (!name) {
            throw new Error("请输入查询名字");
        }
        db.all("SELECT * FROM users where name = ?", [name], (err, rows) => {
            if (err) {
                console.log(err); // 如果出现错误就输出错误信息
                throw new Error(err.message);
            }
            console.log('40 - rows', rows); // 输出查询结果
            res.status(200).json({ code: 0, data: rows, msg: "success" });
        });
    } catch (error) {
        res.status(400).json({ code: 1, data: "", msg: error });
    }
});

/**
 * 汇总
 */
router.get("/summary", Summary);

/**
 * 同步模板
 * 
 */
router.post("/fixModule", FixModule);

/**
 * 生成模板
 * 
 */
router.post("/createNextModule", CreateNextModule);


// 模拟从第三方服务获取数据的函数
const fetchDataFromThirdParty = (url: string) => {
    return new Promise((resolve, reject) => {
        // 这里应该是调用第三方服务的实际代码
        // 为了示例，我们简单地返回一个模拟的数据和延迟
        setTimeout(() => {
            const mockData = `Data for ${url} at ${Date.now()}`;
            resolve(mockData);
        }, 1000); // 假设第三方服务响应需要1秒
    });
};

export default router;
