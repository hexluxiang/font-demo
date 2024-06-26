/*
 * @Description:
 * @Version: 1.0
 * @Autor: Helx
 * @Date: 2024-05-01 12:04:16
 * @LastEditors: Helx
 * @LastEditTime: 2024-05-29 23:35:51
 */
import sqlite3 from "sqlite3";

export let db: sqlite3.Database;
// SQLite数据库文件路径
const DB_PATH = "./sqliteData/test.db";

// 缓存过期时间（以毫秒为单位），例如：5分钟
const CACHE_EXPIRATION = 5 * 60 * 1000;

export async function initializeDatabase() {
    // 设置SQLite数据库
    db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log("Connected to the in-memory SQlite database.");
    });

    // 创建表、索引等初始化操作
    // 创建缓存表（如果尚不存在）
    // db.run('DROP TABLE users');//删除表

    // 员工个人信息表
    const CREATE_USERINFO = `CREATE TABLE IF NOT EXISTS usersInfo
        (sheetId TEXT, 
            name TEXT, 
            currentLevel TEXT, 
            firstDepart TEXT, 
            secondDepart TEXT, 
            selfPerformance TEXT, 
            leaderPerformance TEXT,
            isHeightLight TEXT,  
            month TEXT,
            times TEXT, 
            PRIMARY KEY (name, sheetId))`;
    db.run(CREATE_USERINFO);

    // const CREATE_WORK_STATE_INFO = `
    // CREATE TABLE IF NOT EXISTS workStateInfo
    //     (
    //         name TEXT PRIMARY KEY,
    //         completeForSelf TEXT,
    //         completeForLeader TEXT,
    //         abilityForSelf TEXT,
    //         abilityForLeader TEXT,
    //         selfPerformance TEXT,
    //         leaderPerformance TEXT,
    //         month TEXT,
    //         times TEXT)"
    // `
    // db.run(CREATE_WORK_STATE_INFO);
}

export const closeSqliteDb = () => {
    // 当你完成所有操作后，记得关闭每个数据库连接
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log("database1.db closed 2");
    });
};

// 导出其他数据库操作函数，例如查询、插入等
export async function getUserById(id: number) {
    // 执行SQL查询并返回结果
    // ...
}
