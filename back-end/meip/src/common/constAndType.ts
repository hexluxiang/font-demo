import { Request as ExpRequest, Response as ExpResponse } from "express";

const WIKI_BASE_URL = "/open-apis/wiki/v2";
const GET_WIKI_SON_NODE_LIST_URL = WIKI_BASE_URL + "/spaces/"; // 获取知识空间子节点列表
const GET_WIKI_NODE_INFO_URL = WIKI_BASE_URL + "/spaces/get_node?token="; //获取空间节点信息
const CREATE_WIKI_SPACE_NODE_URL = GET_WIKI_SON_NODE_LIST_URL; //创建知识空间节点

const SHEET_BASE_URL = "/open-apis/sheets/v2/spreadsheets/";
const GET_SHEET_METAINFO_URL = SHEET_BASE_URL; //获取表格元数据、读取表格单个范围
const MERGE_SHEET_RANGE_URL = SHEET_BASE_URL; //合并单元格
const INSER_SHEET_DATA_RANGES_URL = "/values_batch_update"; //向多个范围写入数据
const SET_SHEET_RANGE_STYLE_URL = "/styles_batch_update"; //设置单元格样式
const DELETE_SHEET_RANGE_URL = "/dimension_range"; //删除行、列
const GET_SHEET_RANGE_LIST_URL = "/dataValidation"; //查询下拉列表设置
const UPDATE_SHEET_RANGE_LIST_URL = "/dataValidation"; //更新下拉列表设置
const OPERATION_SHEET_URL = "/sheets_batch_update"; //增加工作表，复制工作表、删除工作表
const READ_SHEET_SINGLE_URL = "/values"; //读取单个范围数据

// const GET_ACCESS_TOKEN_URL = "/feishu/get-token.php"; // 获取令牌
const GET_ACCESS_TOKEN_URL = "http://192.168.22.42:8001/feishu/get-token.php"; // 获取令牌
const OPEN_FEISHU_BASE_URL = "https://open.feishu.cn/";

const SPACE_ID_PROD = "7340956538574176260"; //线上生产环境SPACE_ID固定不变
const SPACE_ID_DEV = "7157911317150875651"; //"7197610230099296259"; //开发环境SPACE_ID
const ACCESS_TOKEN = "t-g1045v8PK4LUFOS7XQK6HXHAJ4J7M5GJS5RTUWYP"; //临时令牌token 后期使用接口获取
const ACCESS_TOKEN_EXPIRATION = 3600; //ACCESS_TOKEN缓存时间

enum EOBJ_TOKEN {
    doc = "doc",
    sheet = "sheet",
    mindnote = "mindnote",
    bitable = "bitable",
    file = "file",
    docx = "docx",
}

enum EReuqestMethods {
    GET = "get",
    POST = "post",
    DELETE = "delete",
    PUT = "put",
}

//知识空间子列表item
type TWikiSonItems = {
    has_child: boolean;
    node_token: string;
    node_type: string;
    obj_token: string;
    obj_type: string;
    origin_node_token: string;
    origin_space_id: string;
    parent_node_token: string;
    space_id: string;
    title: string;
};

type TSheetMetaInfo = {
    titleName: string; //表格名-一般是是姓名
    sheets: TMetaInfoItems[];
};

//表格元数据Item
type TMetaInfoItems = {
    sheetId: string;
    title: string;
};

//多个范围
type TValueRanges = {
    range: string;
    values: Array<Array<string>>;
};

//个人能力
enum EABILITY_TYPE {
    "无明显变化" = 0,
    "鼓励-承担灰色地带任务" = 1,
    "鼓励-承担团队特殊任务" = 2,
    "鼓励-超量" = 3,
    "小范围鼓励" = 4,
    "个人能力成长" = 5,
    "个人能力明显突破" = 6,
    "促进企业/部门突破" = 7,
    "促进中心/公司突破" = 8,
}

type TAbilityEnumKeys = keyof typeof EABILITY_TYPE;

//知识空间节点信息
type TWikiNodeInfo = {
    obj_token: string;
    obj_type: string;
    title: string;
    node_token: string;
};

export {
    GET_WIKI_SON_NODE_LIST_URL,
    GET_ACCESS_TOKEN_URL,
    SPACE_ID_DEV,
    ACCESS_TOKEN,
    OPEN_FEISHU_BASE_URL,
    GET_SHEET_METAINFO_URL,
    ACCESS_TOKEN_EXPIRATION,
    CREATE_WIKI_SPACE_NODE_URL,
    ExpRequest,
    ExpResponse,
    EOBJ_TOKEN,
    EReuqestMethods,
    EABILITY_TYPE,
};

export type { TWikiSonItems, TMetaInfoItems, TValueRanges, TSheetMetaInfo, TAbilityEnumKeys, TWikiNodeInfo };
