import * as type from '../constants/ActionTypes';
import {wxPay} from "../../common/actions/jssdkAction";
/**
 * 设置是否显示规则说明弹层
 */
export function setIsShowRuleDescriptionLayer(isShowRuleDescriptionLayer){
    return (dispatch) => {
        dispatch({
            type: type.PRESCRIPTION_ADD_SET_IS_SHOW_RULE_DESCRIPTION_LAYER,
            isShowRuleDescriptionLayer: isShowRuleDescriptionLayer
        })
    }
}
/**
 * 是否显示添加地址页面
 */
export function setIsShowNeedInvoiceLayer(isShowNeedInvoiceLayer){
    return (dispatch) => {
        dispatch({
            type: type.PRESCRIPTION_ADD_SET_IS_SHOW_NEED_INVOICE_LAYER,
            isShowNeedInvoiceLayer: isShowNeedInvoiceLayer
        })
    }
}
/**
 * 设置文件地址
 */
export function setFiles(files){
    return (dispatch) => {
        dispatch({
            type: type.PRESCRIPTION_ADD_SET_FILES,
            files: files
        })
    }
}
/**
 * 设置数量
 */
export function setBuyNum(buyNum){
    return (dispatch) => {
        dispatch({
            type: type.PRESCRIPTION_ADD_SET_BUY_NUM,
            buyNum: buyNum
        })
    }
}
/**
 * 设置备注
 */
export function setUserRemark(userRemark){
    return (dispatch) => {
        dispatch({
            type: type.PRESCRIPTION_ADD_SET_USER_REMARK,
            userRemark: userRemark
        })
    }
}
export function setAge(age){
    return (dispatch) => {
        dispatch({
            type: type.PRESCRIPTION_ADD_SET_AGE,
            age: age
        })
    }
}
export function setNvoiceTitle(nvoiceTitle){
    return (dispatch) => {
        dispatch({
            type: type.PRESCRIPTION_ADD_SET_NVOICE_TITLE,
            nvoiceTitle: nvoiceTitle
        })
    }
}
export function setNvoiceTfn(nvoiceTfn){
    return (dispatch) => {
        dispatch({
            type: type.PRESCRIPTION_ADD_SET_NVOICE_TFN,
            nvoiceTfn: nvoiceTfn
        })
    }
}

/**
 * 设置搜索参数
 * @param params
 * @returns {function(*)}
 */
export function setParams(params) {
    return (dispatch) => {
        dispatch({
            type: type.WAP_PRESCRIPTION_LIST_SET_PARAMS,
            data: params
        });
    }
}

/**
 * 拍单购药列表
 */
export function pagePrescriptionList(params, page, size, prescriptionList=[]) {
    return (dispatch) => {
        const url = '/wap/prescriptionOrder/pagePrescriptionOrder?page=' + page + "&size=" + size + "&orderStat=" + params.orderStat;
        window.jsonFetch(
            url,
            {},
            json => {
                dispatch(setParams(params));
                const action = {
                    type: type.WAP_PRESCRIPTION_LIST,
                    prescriptionPage: Object.assign({},json,{
                        page: page,
                        size: size,
                        prescriptions:prescriptionList.concat(json.data)
                    })
                };
                dispatch(action);
            }
        );
    }
}

/**
 * 拍单购药详情
 * @param id
 * @returns {function(*)}
 */
export function findPrescriptionDetail(id) {
    return (dispatch) => {
        const url = '/wap/prescriptionOrder/findPrescriptionOrderDetail/' + id;
        window.jsonFetch(
            url,
            {},
            json => {
                dispatch({
                    type: type.WAP_PRESCRIPTION_DETAIL,
                    prescriptionDetailData: json
                });
            }
        );
    }
}

/**
 * 获取订单数量
 * @returns {function(*)}
 */
export function getOrderStateNum() {
    return (dispatch) => {
        const url = '/wap/prescriptionOrder/getOrderStateNum';
        window.jsonFetch(
            url,
            {},
            json => {
                const action = {
                    type: type.WAP_PRESCRIPTION_LIST_GET_ORDER_NUM,
                    orderNumInfo:json
                };
                dispatch(action);
            }
        );
    }
}

//发票弹窗
export function setShowInvoice(showInvoice) {
    return function (dispatch) {
        dispatch({
            type: type.WAP_PRESCRIPTION_DETAIL_SHOW_INVOICE,
            showInvoice: showInvoice
        });
    }
}

/**
 * 拍单购药日志详情
 * @param id
 * @returns {function(*)}
 */
export function findPrescriptionLogDetail(id) {
    return (dispatch) => {
        const url = '/wap/prescriptionOrder/findPrescriptionLogDetail/' + id;
        window.jsonFetch(
            url,
            {},
            json => {
                dispatch({
                    type: type.WAP_PRESCRIPTION_LOG_DETAIL,
                    prescriptionLogDetail: json
                });
            }
        );
    }
}

/**
 * 获取物流详情
 * @param shipperCode  快递公司代码
 * @param logisticCode 快递单号
 * @returns {function(*)}
 */
export function findLogisticsDetail(shipperCode, logisticCode) {
    return (dispatch) => {
        const url = '/wap/prescriptionOrder/findLogisticsDetail?shipperCode=' + shipperCode + "&logisticCode=" + logisticCode;
        window.jsonFetch(
            url,
            {},
            json => {
                dispatch({
                    type: type.WAP_PRESCRIPTION_LOGISTICS_DETAIL,
                    logisticsDetail: json
                });
            }
        );
    }
}

/**
 * 确认收货
 */
export function changeOrderState(prescriptionOrderId, orderState, callback) {
    return (dispatch) => {
        const url = '/wap/prescriptionOrder/changeOrderState?prescriptionOrderId='+prescriptionOrderId+"&orderState="+orderState;
        window.jsonFetch(
            url,
            {},
            json => {
                callback(true);
            }
        );
    }
}

/**
 * 微信支付
 * @param orderId 订单ID
 * @param history
 * @returns {function(*)}
 */
export function prescriptionPay(orderId, history) {
    wxPay(
        'PRESCRIPTION',
        orderId,
        function () {//支付成功
            history.push('/prescription/list');
        },
        function () {//支付失败
            window.warningTip('支付失败');
        },
        function () {//取消支付
            window.warningTip('您已取消支付');
        }
    );
}
/**
 * 是否代煎
 */
export function setIsDecoction(){
    return (dispatch) => {
        dispatch({
            type: type.PRESCRIPTION_ADD_SET_IS_DECOCTION,
        })
    }
}

/**
 * 是否孕妇
 */
export function setIsGravida(){
    return (dispatch) => {
        dispatch({
            type: type.PRESCRIPTION_ADD_SET_IS_GRAVIDA,
        })
    }
}
/**
 * 是否 外用
 */
export function setIsExternalUse(isExternalUse){
    return (dispatch) => {
        dispatch({
            type: type.PRESCRIPTION_ADD_SET_IS_EXTERNAL_USE,
        })
    }
}

/**
 * /是否 开具 发票
 */
export function setInvoice(nvoiceTitle="",nvoiceTfn=""){
    return (dispatch) => {
        dispatch({
            type: type.PRESCRIPTION_ADD_SET_INVOICE,
            nvoiceTitle: nvoiceTitle,
            nvoiceTfn: nvoiceTfn
        })
    }
}
/**
 *  开具 发票 详情
 */
export function setIsNeedInvoice(){
    return (dispatch) => {
        dispatch({
            type: type.PRESCRIPTION_ADD_SET_IS_NEED_INVOICE,

        })
    }
}

/**
 * /性别类型
 */
export function setuserSex(userSex){
    return (dispatch) => {
        dispatch({
            type: type.PRESCRIPTION_ADD_SET_USER_SEX,
            userSex: userSex
        })
    }
}

/**
 * 获取代煎规则说明
 */
export function getDecoctionRuleDescription(){
    return (dispatch) => {

        const url = '/wap/prescriptionOrder/getDecoctionRuleDescription';
        window.textFetch(
            url,
            {},
            json => {
                dispatch({
                    type:  type.PRESCRIPTION_ADD_SET_DECOCTION_RULE_DESCRIPTION,
                    decoctionRuleDescription: json
                })
            },
            error =>{return true; }
        );
    }
}
/**
 * 获取收货地址
 */
export function getAddrDetail(){
    return (dispatch) => {

        const url = '/wap/receiverAddr/getMemberDefaultAddr';
        window.jsonFetch(
            url,
            {},
            json => {
                dispatch({
                    type:  type.PRESCRIPTION_ADD_SET_DECOCTION_ADDRESS,
                    address: {name:json.receiverName,mobile:json.contactTel,addressDetail:json.deliveryAddr+json.detailAddr}
                })
            },
            error =>{return true; }
        );
    }
}
export function addressSelectCallback(data){
    return (dispatch) => {
        dispatch({
            type: type.PRESCRIPTION_ADD_SET_DECOCTION_ADDRESS,
            address: {name:data.receiverName,mobile:data.contactTel,addressDetail:data.deliveryAddr+data.detailAddr}
        })
    }
}
/**
 * 设置地址选择添加弹层
 * @returns {function(*)}
 */
export function setIsShowSelectAddressLayer(){
    return (dispatch) => {
        dispatch({
            type: type.PRESCRIPTION_ADD_SET_IS_SHOW_SELECT_ADDRESS_LAYER,

        })
    }
}
/**
 * 提交
 */
export function savePrescriptionOrder(data,callbackFun) {
    return() => {
        window.textFetch(
            '/wap/prescriptionOrder/savePrescriptionOrder',
            {
                method: 'POST',
                body: JSON.stringify(data)
            },
            json => {
                if (typeof callbackFun === "function"){
                    callbackFun();
                }
            },
         error =>{return true; }
        );
    }
}