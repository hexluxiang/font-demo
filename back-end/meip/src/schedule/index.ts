/*
 * @Description: 
 * @Version: 1.0
 * @Autor: Helx
 * @Date: 2024-05-24 19:14:54
 * @LastEditors: Helx
 * @LastEditTime: 2024-05-29 23:37:22
 */
import {getMonthReviewResult} from '../routes/Summary/api';
const schedule = require("node-schedule");


function fetchData() {
    console.log("执行定时任务...");
    // 在这里编写你的数据获取逻辑
}

// 创建一个规则对象，表示每周一到周五的9点、12点、15点和18点
const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [new schedule.Range(1, 5)]; // 周一到周五
rule.hour = [9, 12, 15, 18]; // 9点、12点、15点和18点

// 使用schedule.scheduleJob来设置任务, 现在的任务是3分支执行一次
let job: any = null;
const startScheduleTask = () => {
    // 启动定时任务
    job = schedule.scheduleJob("*/10 * * * *", async function () {
        fetchData();
        await getMonthReviewResult();
    });
};

// 如果你需要在某个时刻停止任务，可以调用job.cancel()
// job.cancel();

export { startScheduleTask };
