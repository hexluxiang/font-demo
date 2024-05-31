/*
 * @Description:
 * @Version: 1.0
 * @Autor: Helx
 * @Date: 2024-05-24 19:14:54
 * @LastEditors: Helx
 * @LastEditTime: 2024-05-29 23:37:22
 */
import { getMonthReviewResult } from "../routes/Summary/api";
import { SPACE_ID_DEV } from "../common/constAndType";
const schedule = require("node-schedule");

// 创建一个规则对象，表示每周一到周五的9点、12点、15点和18点
const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [new schedule.Range(1, 5)]; // 周一到周五
rule.hour = [9, 10, 12, 15, 18]; // 9点、12点、15点和18点

// 使用schedule.scheduleJob来设置任务, 现在的任务是3分支执行一次 "*/3 * * * *"
let job: any = null;
const startScheduleTask = () => {
    // 启动定时任务
    job = schedule.scheduleJob("*/3 * * * *", async function () {
        const now = new Date();
        console.log("定时任务执行时间：", now.getHours(), ":", now.getMinutes(), ":", now.getSeconds());
        const NODE_TOKEN = "DRvDwfjxHibMbIkGtV5ckyVbnaf"; // DRvDwfjxHibMbIkGtV5ckyVbnaf TFZcwhVRgi1MxXkbuAXcvWrLnBx
        const currentMonth = now.getMonth() + 1; // 获取当前月份
        const previousMonth = currentMonth - 1;
        [previousMonth, currentMonth].map(async (month) => {
            await getMonthReviewResult({ nodeToken: NODE_TOKEN, sheetSpaceId: SPACE_ID_DEV, currentMonth: month });
        });
    });
};

// 如果你需要在某个时刻停止任务，可以调用job.cancel()
// job.cancel();

export { startScheduleTask };
