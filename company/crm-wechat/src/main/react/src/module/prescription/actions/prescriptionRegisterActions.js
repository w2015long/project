import * as type from "../constants/ActionTypes";

/**
 * 获取商品详情
 */
export function getProductDetail(platformType, productId) {
    return (dispatch) => {
        const url = '/wap/product/getProductSimpleDetail?productId=' + productId + '&platformType=' + platformType;
        window.jsonFetch(
            url,
            {},
            json => {
                let productDetail = {
                    productId: json.productId ,
                    picture: json.picture ? json.picture.split(",")[0] : "",
                    productNm: json.productNm,
                    priceDouble: json.memberPriceDouble ? "￥" + json.memberPriceDouble.toFixed(2) : "￥" + json.priceDouble.toFixed(2),
                };
                dispatch({
                    type: type.PRESCRIPTION_REGISTER_GET_PRODUCT_DETAIL,
                    productDetail: productDetail
                });
            }
        );
    }
}


/**
 * 提交登记
 * @param data
 * @param history
 * @returns {Function}
 */
export function submitPrescriptionRegister(data, history, callbackFuns = () => {
}) {
    return (dispatch) => {
        window.showConfirm("是否提交登记", () => {
            const url = '/wap/prescription/savePrescriptionRegister';
            window.textFetch(
                url,
                {
                    method: 'POST',
                    body: JSON.stringify(data)
                },
                json => {
                    callbackFuns(data);

                }
            );
        });
    }
}
/**
 * 获取收货地址
 */
export function getMemberDefaultAddr() {
    return (dispatch) => {

        const url = '/wap/receiverAddr/getMemberDefaultAddr';
        window.jsonFetch(
            url,
            {},
            json => {
                console.log(json);
                let prescriptionRegisterAddress = {
                    receiverAddrId: json.receiverAddrId,
                    receiverName: json.receiverName,
                    receiverMobile: json.contactTel,
                    receiverAddr: json.deliveryAddr + json.detailAddr
                };
                dispatch({
                    type: type.PRESCRIPTION_REGISTER_ADDRESS,
                    prescriptionRegisterAddress: prescriptionRegisterAddress,
                })
            },
            error => {
                return true;
            }
        );
    }
}