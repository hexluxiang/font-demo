/**
 * popup.js
 *
 * 作用：popup.js 是弹出窗口页面上的脚本文件，该页面通过点击插件图标弹出。
 * 使用场景：popup.js 可用于为弹出窗口提供交互功能，例如用户配置选项、发送消息给其他插件部分，或执行与插件相关的特定操作。
 * 示例用途：处理用户界面上的按钮点击事件、与 background.js 或 content.js 通信、显示插件状态、更新页面元素等。
 *
 */
// const GET_ACCESSTOKEN_URL = "http://192.168.22.41:5173/getToken/feishu/get-token.php"; // 获取token链接
// const WIKI_BASE_URL = "https://open.feishu.cn/open-apis/wiki/v2/spaces/"; // 创建文档api
// const space_id = "7351322032795762716";
// let accessToken = ""; //访问token
// let wikiUrl = "";
const DOMIAN = "yeastardigital.feishu.cn"; // 星纵知识库域名
const CREATE_WIKI_NODE_URL = "http://192.168.22.42:8001/feishu/api.php?action=createNode"; // 直接请求后端接口地址，飞书api和token获取都在后端发起

/**
 * 处理谷歌tabs
 * @param {*} callBack
 */
const handleChromeTab = (callBack) => {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs.length > 0) {
                resolve(tabs[0].url);
                callBack && callBack(tabs);
            } else {
                reject(new Error("没有找到活动标签页"));
            }
        });
    });
};

/**
 * 处理创建
 * @param {*} objType
 * @returns
 */
const createNewFile = async (objType) => {
    const fatherWikiUrl = await handleChromeTab();
    console.log("fatherWikiUrl:", fatherWikiUrl);
    if (!validateDomain(fatherWikiUrl)) {
        console.log("请访问正确的网址");
        return;
    }

    if (!confirm("确定要在当前文档创建子文档吗?")) {
        return;
    }
    const url = fatherWikiUrl.split("?")[0];
    const match = url.match(/\/wiki\/(.*)/);
    const wikiToken = match && match[1];
    console.log("wikiToken:", wikiToken);
    // const res = await sendRequest(GET_ACCESSTOKEN_URL, "GET"); // 获取令牌
    // accessToken = res;
    if (!wikiToken) {
        console.log("父节点不能为空");
        return;
    }
    const createInfo = await createWikiSpaceNode(wikiToken, objType);
    console.log("createInfo:", createInfo);

    if (JSON.parse(createInfo).code === 0) {
        handleChromeTab((tabs) => {
            console.log("tabs:", tabs);
            // 刷新当前标签页
            chrome.tabs.reload(tabs[0].id);
        });
    }
};

/**
 * 创建wiki节点
 * @param {*} pNodeToken 父节点
 * @param {*} objType 创建类型
 * @returns
 */
const createWikiSpaceNode = async (pNodeToken, objType) => {
    const params = {
        obj_type: objType,
        parent_node_token: pNodeToken,
        node_type: "origin",
        // title: fileName,
    };
    const data = await sendRequest(CREATE_WIKI_NODE_URL, "POST", params);
    return data;
};

/**
 * 校验地址
 * @param {*} url 地址
 * @param {*} domain 域名
 * @returns
 */
const validateDomain = (url) => {
    const parsedUrl = new URL(url); // 解析 URL 并获取主机名
    const hostname = parsedUrl.hostname;
    const regex = new RegExp(`^(https?:\/\/)?([a-z0-9]+\.)*${DOMIAN}$`, "i"); // 将域名字符串转换为正则表达式

    return regex.test(hostname);
};

/**
 * 监听DOM加载，绑定点击事件
 */
document.addEventListener("DOMContentLoaded", function () {
    const listItems = document.querySelectorAll("#node-list li");
    // 遍历列表项并为每个列表项添加点击事件监听器
    listItems.forEach(function (item) {
        item.addEventListener("click", async function () {
            const value = item.getAttribute("value");
            // 点击事件处理程序
            console.log("创建类型value:", value);
            switch (value) {
                case "docx":
                    createNewFile(value);
                    break;
                case "sheet":
                    createNewFile(value);
                    break;
                case "bitable":
                    createNewFile(value);
                    break;
                case "mindnote":
                    createNewFile(value);
                    break;
                default:
                    return;
            }
        });
    });
});

/**
 * 封装xhr请求
 * @param {*} url
 * @param {*} method
 * @param {*} data
 * @param {*} header
 * @returns
 */
const sendRequest = (url, method, data, header) => {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        if (xhr.readyState === XMLHttpRequest.OPENED) {
            xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            // xhr.setRequestHeader("Authorization", "Bearer " + header.token);
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(xhr.responseText);
                } else if (xhr.status === 400) {
                    const responseData = JSON.parse(xhr.response);
                    alert(responseData.msg);
                    reject(new Error(responseData.msg));
                } else {
                    reject(new Error("Request is error"));
                }
            }
        };
        if (data) {
            xhr.send(JSON.stringify(data));
        } else {
            xhr.send();
        }
    });
};
