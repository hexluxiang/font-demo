/**
 *  background.js
 * 
 * 作用：background.js 是后台脚本文件，可长期运行(插件安装后一直运行，并且可以持续处理插件的逻辑)而不依赖于任何特定页面。
 * 使用场景：background.js 可以处理插件的全局功能、响应浏览器事件，并与其他插件组件（如 content.js）进行通信。它通常用于管理插件的生命周期、处理事件、与浏览器 API 进行交互，以及处理来自其他插件部分的请求。
 * 示例用途：在插件启动时初始化数据、处理消息和通知、监听标签页变化、与服务器通信等。
 */

// const sendRequest = (url, method, data, header) => {
//     return new Promise(function (resolve, reject) {
//         var xhr = new XMLHttpRequest();
//         xhr.open(method, url, true);
//         if (xhr.readyState === XMLHttpRequest.OPENED && header) {
//             xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
//             xhr.setRequestHeader("Authorization", "Bearer " + header.token);
//         }
//         xhr.onreadystatechange = function () {
//             if (xhr.readyState === 4) {
//                 if (xhr.status === 200) {
//                     resolve(xhr.responseText);
//                 } else if (xhr.status === 400) {
//                     const responseData = JSON.parse(xhr.response);
//                     alert(responseData.msg);
//                     reject(new Error(responseData.msg));
//                 } else {
//                     reject(new Error("Request is error"));
//                 }
//             }
//         };
//         if (data) {
//             xhr.send(JSON.stringify(data));
//         } else {
//             xhr.send();
//         }
//     });
// };
// chrome.tabs.executeScript({
//     code: 'document.body.style.backgroundColor="green"',
// });

// chrome.browserAction.onClicked.addListener(function (tab) {
//     console.log("tab:", tab);
//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//         var currentUrl = tabs[0].url;
//         console.log("chrome.browserAction.onClicked", currentUrl);
//         // 在控制台输出当前地址栏的地址
//         // 这里你可以将获取到的地址进行其他操作，比如发送给服务器等等
//     });

//     chrome.tabs.executeScript({
//         code: 'document.body.style.backgroundColor="green"',
//     });
// });

// const GET_ACCESSTOKEN_URL = "http://192.168.22.41:5173/getToken/feishu/get-token.php"; // 获取token链接
// const WIKI_BASE_URL = "https://open.feishu.cn/open-apis/wiki/v2/spaces/"; // 创建文档api
// const space_id = "7351322032795762716"; //7197610230099296259  //7157911317150875651  spaceid
// let accessToken = ""; //访问token

// const createNewFile = async (fatherWikiUrl, fileName) => {
//     const url = fatherWikiUrl.split("?")[0];
//     const match = url.match(/\/wiki\/(.*)/);
//     var wikiToken = match && match[1];
//     console.log("wikiToken:", wikiToken);
//     const res = await sendRequest(GET_ACCESSTOKEN_URL, "GET");
//     accessToken = res;
//     console.log("accessToken", accessToken);
//     const createInfo = await createWikiSpaceNode(wikiToken, fileName);
//     console.log("createInfo:", createInfo);
// };

// 创建wiki节点
// const createWikiSpaceNode = async (pNodeToken, fileName) => {
//     const params = {
//         obj_type: "docx",
//         parent_node_token: pNodeToken,
//         node_type: "origin",
//         title: fileName,
//     };
//     const { data } = await sendRequest(WIKI_BASE_URL + space_id + "/nodes", "POST", params, {
//         token: accessToken,
//     });

//     return data;
// };

// 创建右键菜单
// chrome.runtime.onInstalled.addListener(function () {
//     chrome.contextMenus.create({
//         id: "newTable",
//         title: "新建表格",
//         contexts: ["all"],
//     });

//     chrome.contextMenus.create({
//         id: "newDocument",
//         title: "新建文档",
//         contexts: ["all"],
//     });

//     // 添加菜单点击事件监听器
//     chrome.contextMenus.onClicked.addListener(function (info, tab) {
//         if (info.menuItemId === "newTable") {
//             // 处理 "新建表格" 菜单点击事件
//             console.log("新建表格被点击了");
//             const promptInfo = prompt("确定要在当前文档下创建子文档？请输入文档名称");
//             if (promptInfo) {
//                 createNewFile(info.pageUrl, promptInfo);
//             }
//         } else if (info.menuItemId === "newDocument") {
//             // 处理 "新建文档" 菜单点击事件
//             const promptInfo = prompt("确定要在当前文档下创建子文档？请输入文档名称");
//             if (promptInfo) {
//                 createNewFile(info.pageUrl, promptInfo);
//             }
//         }
//     });
// });
