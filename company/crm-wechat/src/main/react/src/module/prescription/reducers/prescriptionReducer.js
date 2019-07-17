import * as type from "../constants/ActionTypes";

const INIT_PARAMS = {
    orderStat: "",      //订单状态
};

const ADDRESS = {
    name: "",
    mobile: "",
    addressDetail: ""
};

const prescriptionState = {
    params: INIT_PARAMS,         //搜索参数
    prescriptionPage: {          //列表分页数据
        page: 0,
        size: 10,
        prescriptions: []
    },
    prescriptionDetailData: {},  //订单详情
    orderNumInfo: [],            //订单数量
    showInvoice: false,          //显示发票信息
    prescriptionLogDetail: {},   //订单日志信息
    logisticsDetail: {},         //订单物流信息
    address: ADDRESS,       //初始地址
    isShowRuleDescriptionLayer: false, //设置是否显示规则说明弹层
    isShowaddSelectAddressLayer: false, //设置是否显示新增选择地址弹层
    isShowNeedInvoiceLayer: false, //是否显示添加发票页面
    isDecoction: false, //是否代煎
    isGravida: false, //是否孕妇
    isExternalUse: false,//是否 外用
    isNeedInvoice: false,//是否 开具 发票
    userSex: "SECRET",//性别类型
    decoctionRuleDescription: "",//性别类型
    nvoiceTitle: "",//发票抬头
    nvoiceTfn: "",//发票的税号
    buyNum: "",//数量
    files: [],
    age: "",
    userRemark: "",
};

export default function (state = prescriptionState, action) {
    switch (action.type) {
        case type.WAP_PRESCRIPTION_LIST:
            return Object.assign({}, state, {
                prescriptionPage: action.prescriptionPage
            });
        case type.WAP_PRESCRIPTION_DETAIL:
            return Object.assign({}, state, {
                prescriptionDetailData: action.prescriptionDetailData
            });
        case type.WAP_PRESCRIPTION_LIST_SET_PARAMS:
            return Object.assign({}, state, {
                params: action.data
            });
        case type.WAP_PRESCRIPTION_LIST_GET_ORDER_NUM:
            return Object.assign({}, state, {
                orderNumInfo: action.orderNumInfo
            });
        case type.WAP_PRESCRIPTION_DETAIL_SHOW_INVOICE:
            return Object.assign({}, state, {
                showInvoice: action.showInvoice
            });
        case type.WAP_PRESCRIPTION_LOG_DETAIL:
            return Object.assign({}, state, {
                prescriptionLogDetail: action.prescriptionLogDetail
            });
        case type.WAP_PRESCRIPTION_LOGISTICS_DETAIL:
            return Object.assign({}, state, {
                logisticsDetail: action.logisticsDetail
            });
        case type.PRESCRIPTION_ADD_SET_IS_SHOW_RULE_DESCRIPTION_LAYER:
            return Object.assign({}, state, {
                isShowRuleDescriptionLayer: action.isShowRuleDescriptionLayer
            });
        case type.PRESCRIPTION_ADD_SET_USER_REMARK:
            return Object.assign({}, state, {
                userRemark: action.userRemark
            });
        case type.PRESCRIPTION_ADD_SET_BUY_NUM:
            return Object.assign({}, state, {
                buyNum: action.buyNum
            });
        case type.PRESCRIPTION_ADD_SET_FILES:
            return Object.assign({}, state, {
                files: action.files
            });
        case type.PRESCRIPTION_ADD_SET_IS_SHOW_NEED_INVOICE_LAYER:
            return Object.assign({}, state, {
                isShowNeedInvoiceLayer: action.isShowNeedInvoiceLayer
            });
        case type.PRESCRIPTION_ADD_SET_IS_DECOCTION:
            return Object.assign({}, state, {
                isDecoction: !state.isDecoction
            });
        case type.PRESCRIPTION_ADD_SET_IS_GRAVIDA:
            return Object.assign({}, state, {
                isGravida: !state.isGravida
            });
        case type.PRESCRIPTION_ADD_SET_IS_EXTERNAL_USE:
            return Object.assign({}, state, {
                isExternalUse: !state.isExternalUse
            });
        case type.PRESCRIPTION_ADD_SET_IS_NEED_INVOICE:
            return Object.assign({}, state, {
                isNeedInvoice: !state.isNeedInvoice,
                nvoiceTitle: "",
                nvoiceTfn: ""
            });
        case type.PRESCRIPTION_ADD_SET_INVOICE:
            return Object.assign({}, state, {
                nvoiceTitle: action.nvoiceTitle,//发票抬头
                nvoiceTfn: action.nvoiceTfn//发票的税号
            });
        case type.PRESCRIPTION_ADD_SET_USER_SEX:
            return Object.assign({}, state, {
                userSex: action.userSex
            });
        case type.PRESCRIPTION_ADD_SET_NVOICE_TFN:
            return Object.assign({}, state, {
                nvoiceTfn: action.nvoiceTfn
            });
        case type.PRESCRIPTION_ADD_SET_NVOICE_TITLE:
            return Object.assign({}, state, {
                nvoiceTitle: action.nvoiceTitle
            });
        case type.PRESCRIPTION_ADD_SET_AGE:
            return Object.assign({}, state, {
                age: action.age
            });
        case type.PRESCRIPTION_ADD_SET_DECOCTION_RULE_DESCRIPTION:
            return Object.assign({}, state, {
                decoctionRuleDescription: action.decoctionRuleDescription
            });
        case type.PRESCRIPTION_ADD_SET_DECOCTION_ADDRESS:
            return Object.assign({}, state, {
                address: action.address
            });
        case type.PRESCRIPTION_ADD_SET_IS_SHOW_SELECT_ADDRESS_LAYER:
            return Object.assign({}, state, {
                isShowaddSelectAddressLayer: !state.isShowaddSelectAddressLayer
            });
        default:
            return state;
    }
}
