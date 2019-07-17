import * as type from "../constants/ActionTypes";

const prescriptioRegisternState = {
    prescriptionDetailData: {},  //订单详情
    prescriptionRegisterAddress: {
        receiverAddrId: 0,
        receiverName: "",
        receiverMobile: "",
        receiverAddr: ""
    },
    productDetail: {
        picture:"",
        productNm:"",
        priceDouble:"",
        productId:"",
    },

};

export default function (state = prescriptioRegisternState, action) {
    switch (action.type) {
        case type.PRESCRIPTION_REGISTER_GET_PRODUCT_DETAIL:
            return Object.assign({}, state, {
                productDetail: action.productDetail
            });
        case type.PRESCRIPTION_REGISTER_ADDRESS:
            return Object.assign({}, state, {
                prescriptionRegisterAddress: action.prescriptionRegisterAddress
            });

        default:
            return state;
    }
}
