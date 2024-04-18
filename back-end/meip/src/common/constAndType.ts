import { Request as ExpRequest, Response as ExpResponse } from "express";

const GET_ACCESS_TOKEN_URL = "http://192.168.22.42:8001/feishu/get-token.php"; // 获取令牌
const OPEN_FEISHU_BASE_URL = "https://open.feishu.cn/";
const WIKI_BASE_URL = "/open-apis/wiki/v2";
const GET_WIKI_SON_NODE_LIST_URL = WIKI_BASE_URL + "/spaces/"; // 获取知识空间子节点列表
const GET_WIKI_NODE_INFO_URL = WIKI_BASE_URL + "/spaces/get_node?token="; //获取空间节点信息
const CREATE_WIKI_SPACE_NODE_URL = GET_WIKI_SON_NODE_LIST_URL; //创建知识空间节点

export { GET_ACCESS_TOKEN_URL, ExpRequest, ExpResponse };
