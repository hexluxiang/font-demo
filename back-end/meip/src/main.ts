/*
 * @Description: 
 * @Version: 1.0
 * @Autor: Helx
 * @Date: 2024-05-01 12:04:16
 * @LastEditors: Helx
 * @LastEditTime: 2024-05-29 23:21:45
 */
import express from "express";
// import sqlite3 from "sqlite3";
import { initializeDatabase } from './database'
import { startScheduleTask } from './schedule'
import router from "./routes";
const app = express();
const PORT = 3111;

startScheduleTask();
initializeDatabase();
console.log('process.env.NODE_ENV', process.env.NODE_ENV);

// 使用 express.json() 中间件来解析JSON请求体  
app.use(express.json());
// 加载路由
app.use(router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
