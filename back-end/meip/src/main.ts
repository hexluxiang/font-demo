import express from "express";
// import sqlite3 from "sqlite3";
import {initializeDatabase} from './database'
import router from "./routes";
const app = express();
const PORT = 3111;


// initializeDatabase();
console.log('process.env.NODE_ENV', process.env.NODE_ENV);


// 加载路由
app.use(router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
