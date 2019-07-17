import {combineReducers} from "redux";
import commonReducer from "./module/common/reducers/commonReducer";
import couponReducer from "./module/coupon/reducers/couponReducer";
import couponDetailReducer from "./module/coupon/reducers/couponDetailReducer";
import receiveCouponReducer from "./module/coupon/reducers/receiveCouponReducer";
import exampleReducer from "./module/example/reducers/exampleReducer";
import memberReducer from "./module/member/reducers/memberReducer";
import ydyPatientReducer from "./module/member/reducers/ydyPatientReducer";
import cardReducer from "./module/card/reducers/cardReducer";
import bargainReducer from "./module/bargain/reducers/bargainReducer";
import productState from "./module/product/reducers/productReducer";
import addressReducer from "./module/address/reducers/addressReducer";
import integralProductReducer from "./module/integral/reducers/integralProductReducer";
import integralOrderReducer from "./module/integral/reducers/integralOrderReducer";
import memberSignInGiveIntegralReducer from "./module/integral/reducers/memberSignInGiveIntegralReducer";
import couponExchangeReducer from './module/integral/reducers/couponExchangeReducer';
import bigTurntableActivityReducer from './module/integral/reducers/bigTurntableActivityReducer';
import indexReducer from './module/index/reducers/indexReducer'
import shopDetailReducer from './module/shop/reducers/shopDetailReducer';
import memberCenterIntegralReducer from './module/integral/reducers/memberCenterIntegralReducer';
import normalCartReducer from './module/cart/reducers/normalCartReducer';
import normalCartSettlementReducer from './module/cart/reducers/normalCartSettlementReducer';
import prescriptionReducer from './module/prescription/reducers/prescriptionReducer';
import prescriptionRegisterReducer from './module/prescription/reducers/prescriptionRegisterReducer';
import memberSignInOrSignUpReducer from './module/member/reducers/memberSignInOrSignUpReducer';
import orderListReducer from './module/order/reducers/orderListReducer';
import productDemoReducer from './module/product/reducers/productDemoReducer';
import msgInfoReducer from './module/msg/reducers/msgInfoReducer';
import infoDetailReducer from "./module/msg/reducers/infoDetailReducer";
import orderProductCommentReducer from './module/order/reducers/orderProductCommentReducer';
import productCommentDetailsReducer from './module/order/reducers/orderProductCommentDetailsReducer';
import orderCommentListReducer from './module/order/reducers/OrderCommentListReducer';
import mallIndexReducer from './module/mall/index/reducers/mallIndexReducer';
import scanReceiveCouponReducer from './module/coupon/reducers/scanReceiveCouponReducer';
import yearMeetingReceiveReducer from './module/coupon/reducers/yearMeetingReceiveReducer';
import useCouponReducer from './module/coupon/reducers/useCouponReducer';
import doubleElevenReducer from './module/activity/reducers/doubleElevenReducer';
import doubleTwelveReducer from './module/activity/reducers/doubleTwelveReducer';
import newMemberExclusiveReducer from './module/activity/reducers/newMemberExclusiveReducer';
import memberPromoteReducer from './module/promoter/reducers/memberPromoteReducer';
import fullReductionProductReducer from './module/activity/reducers/FullReductionProductReducer';
import bargainActivityPageReducer from './module/bargain/reducers/bargainActivityReducer';
import bargainAddressReducer from './module/bargain/reducers/bargainAddressReducer';
import bargainSettlementReducer from './module/bargain/reducers/bargainSettlementReducer';
import couponGiftPackDetailsReducer from './module/coupon/reducers/couponGiftPackDetailsReducer';
import interrogationRecordReducer from './module/member/reducers/interrogationRecordReducer';
import receiveShareCouponReducer from './module/coupon/reducers/receiveShareCouponReducer';

import couponReceiveListReducer from  './module/coupon/reducers/couponReceiveListReducer';
import storedValueReducer from  './module/member/reducers/storedValueReducer';
import accountTransLogReducer from  './module/member/reducers/billingListReducer';

/**
 * @author chencheng
 * @date 2018/3/19
 * 这里合并所有的 reducer
 * 这里注意key的名称：模块名称+State
 * 比如 exampleState:exampleReducer，就表示在 store 中定义一个叫 exampleState 的分支，也就是我们后续读取exampleState时的名称
 */
const rootReducer = combineReducers({
    commonState: commonReducer,
    memberState: memberReducer,
    ydyPatientState: ydyPatientReducer,
    cardState: cardReducer,
    bargainState: bargainReducer,
    exampleState: exampleReducer,
    indexState: indexReducer,
    memberCenterIntegralState: memberCenterIntegralReducer,
    integralProductState: integralProductReducer,
    integralOrderState: integralOrderReducer,
    productState: productState,
    couponState: couponReducer,
    couponDetailState:couponDetailReducer,
    turntableState: bigTurntableActivityReducer,
    shopDetailState:shopDetailReducer,
    addressState: addressReducer,
    normalCartState: normalCartReducer,
    prescriptionState: prescriptionReducer,
    prescriptionRegisterState: prescriptionRegisterReducer,
    normalCartSettlementState: normalCartSettlementReducer,
    couponExchangeState: couponExchangeReducer,
    integralSignInState: memberSignInGiveIntegralReducer,
    memberSignInOrSignUpState: memberSignInOrSignUpReducer,
    orderListState: orderListReducer,
    receiveCouponState: receiveCouponReducer,
    productDemoSate: productDemoReducer,
    infoDetailState: infoDetailReducer,
    orderProductCommentState:orderProductCommentReducer,
    msgInfoSate: msgInfoReducer,
    productCommentDetailsSate: productCommentDetailsReducer,
    orderCommentListState : orderCommentListReducer,
    mallIndexState: mallIndexReducer,
    scanReceiveCouponReducerSate : scanReceiveCouponReducer,
    yearMeetingReceiveSate : yearMeetingReceiveReducer,
    useCouponReducerSate : useCouponReducer,
    doubleElevenState : doubleElevenReducer,
    doubleTwelveState: doubleTwelveReducer,
    newMemberExclusiveState: newMemberExclusiveReducer,
    memberPromoteState : memberPromoteReducer,
    fullReductionProductState:fullReductionProductReducer,
    bargainActivityPageState:bargainActivityPageReducer,
    bargainAddressState: bargainAddressReducer,
    bargainSettlementState: bargainSettlementReducer,
    couponGiftPackDetailsState:couponGiftPackDetailsReducer,
    interrogationRecordState:interrogationRecordReducer,
    receiveShareCouponState:receiveShareCouponReducer,
    couponReceiveListState:couponReceiveListReducer,
    storedValueState:storedValueReducer,
    accountTransLogState:accountTransLogReducer
});

export default rootReducer
