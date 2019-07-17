import React from "react";
import {HashRouter, Route, Switch} from "react-router-dom";
import asyncLoadComponent from "./AsyncLoadable";
import AuthorizedRoute from "./AuthorizedRoute";

/**
 * @author chencheng
 * @date 2018/3/19
 * 这里不要直接调用import进行静态导入
 * 因为：当用户访问某个页面的时候，我不希望把所有的组件都进行加载，只需要加载相应页面的组件即可。
 * 所以：请使用扩展的 asyncLoadComponent 方法达到代码分割的作用
 */

const ExampleIndex = asyncLoadComponent(()=> import ('./module/example/components/ExampleIndex'));
const Example1 = asyncLoadComponent(()=> import ('./module/example/components/Example1'));
const Example2 = asyncLoadComponent(()=> import ('./module/example/components/Example2'));
const JsSdkExample = asyncLoadComponent(()=> import ('./module/example/components/JsSdkExample'));
// const WxPayAccept = asyncLoadComponent(()=> import ('./module/example/components/WxPayAccept'));
// const WxPayTest = asyncLoadComponent(()=> import ('./module/example/components/WxPayTest'));

const FileUploadExample = asyncLoadComponent(()=> import ('./module/example/components/FileUploadExample'));
const CountDownExample = asyncLoadComponent(()=> import ('./module/example/components/CountDownExample'));

const MemberIndex = asyncLoadComponent(()=> import ('./module/member/components/MemberIndex'));
const Card = asyncLoadComponent(() => import ('./module/card/components/Card'));
const MemberDetail = asyncLoadComponent(()=> import ('./module/member/components/MemberDetail'));
const MemberValidateMobile = asyncLoadComponent(()=> import ('./module/member/components/MemberValidateMobile'));
const MemberChangeMobile = asyncLoadComponent(()=> import ('./module/member/components/MemberChangeMobile'));
const MemberInterest = asyncLoadComponent(()=> import ('./module/member/components/MemberInterest'));

const Index = asyncLoadComponent(()=> import ('./module/index/components/Index'));
const NearByShop = asyncLoadComponent(()=> import ('./module/index/components/NearByShop'));
const SelectAddr = asyncLoadComponent(()=> import ('./module/index/components/SelectAddr'));
const CouponList = asyncLoadComponent(()=> import ('./module/coupon/components/CouponList'));
const MyCouponList = asyncLoadComponent(()=> import ('./module/coupon/components/MyCouponList'));
const CouponDetail = asyncLoadComponent(()=> import ('./module/coupon/components/CouponDetail'));
const ReceiveCoupon = asyncLoadComponent(()=> import ('./module/coupon/components/ReceiveCoupon'));
const ShopDetail = asyncLoadComponent(()=> import ('./module/shop/components/ShopDetail'));
const PharmacistList = asyncLoadComponent(()=> import ('./module/index/components/PharmacistList'));

const ReceiverAddressList = asyncLoadComponent(()=> import ('./module/address/components/ReceiverAddressList'));
const ReceiverAddressAdd = asyncLoadComponent(()=> import ('./module/address/components/ReceiverAddressAdd'));
// const ReceiverAddressSearch = asyncLoadComponent(()=> import ('./module/address/components/ReceiverAddressSearch'));
const ReceiverAddressEdit = asyncLoadComponent(()=> import ('./module/address/components/ReceiverAddressEdit'));

const ShopComplaint = asyncLoadComponent(()=> import ('./module/shop/components/ShopComplaint'));
const ProductDetail = asyncLoadComponent(()=> import ('./module/product/components/ProductDetail'));
const CommentPoint = asyncLoadComponent(() => import ('./module/product/components/CommentPoint'));
const ShopProductSearch = asyncLoadComponent(()=> import ('./module/product/components/ShopProductSearch'));
const ShopProductList = asyncLoadComponent(()=> import ('./module/product/components/ShopProductList'));
const B2cProductList = asyncLoadComponent(()=> import ('./module/product/components/B2cProductList'));
const B2cProductSearch = asyncLoadComponent(()=> import ('./module/product/components/B2cProductSearch'));
const ProductDemo = asyncLoadComponent(()=> import ('./module/product/components/ProductDemo'));
const B2cProductClassify = asyncLoadComponent(()=> import ('./module/product/components/B2cProductClassify'));
const BarCodeScan = asyncLoadComponent(() => import ('./module/product/components/BarCodeScan'));
const BarCodeManualInput = asyncLoadComponent(() => import ('./module/product/components/BarCodeManualInput'));
const SupportSellByShop = asyncLoadComponent(() => import ('./module/product/components/SupportSellByShop'));
const NewShopProductList = asyncLoadComponent(()=> import ('./module/product/components/NewShopProductList'));
const CouponExchangeList = asyncLoadComponent(()=> import ('./module/integral/components/CouponExchangeList'));
const MemberCenterIntegralRecord = asyncLoadComponent(()=> import ('./module/integral/components/MemberCenterIntegralRecord'));
const MemberCenterIntegral = asyncLoadComponent(()=> import ('./module/integral/components/MemberCenterIntegral'));
const IntegralProductList = asyncLoadComponent(()=> import ('./module/integral/components/IntegralProductList'));
const IntegralProductDetail = asyncLoadComponent(()=> import ('./module/integral/components/IntegralProductDetail'));
const IntegralProductExchange = asyncLoadComponent(()=> import ('./module/integral/components/IntegralProductExchange'));
const IntegralOrderList = asyncLoadComponent(()=> import ('./module/integral/components/IntegralOrderList'));
const IntegralOrderDetail = asyncLoadComponent(()=> import ('./module/integral/components/IntegralOrderDetail'));

const BigTurntableActivity = asyncLoadComponent(()=> import ('./module/integral/components/BigTurntableActivity'));
const BigTurntableWinningRecord = asyncLoadComponent(()=> import ('./module/integral/components/BigTurntableWinningRecord'));
const OrderList = asyncLoadComponent(()=> import ('./module/order/components/OrderList'));
const OrderDetail = asyncLoadComponent(()=> import ('./module/order/components/OrderDetail'));
const NormalCart = asyncLoadComponent(()=> import ('./module/cart/components/NormalCart'));
const NormalCartSettlement = asyncLoadComponent(()=> import ('./module/cart/components/NormalCartSettlement'));
const CouponSelector = asyncLoadComponent(()=> import ('./module/cart/components/CouponSelector'));
const ForgetPayPassword = asyncLoadComponent(()=> import ('./module/cart/components/ForgetPayPassword'));
const Invoice = asyncLoadComponent(()=> import ('./module/cart/components/Invoice'));
const PrescriptionAdd = asyncLoadComponent(()=> import ('./module/prescription/components/PrescriptionAdd.js'));
const PrescriptionAddAddr = asyncLoadComponent(()=> import ('./module/prescription/components/PrescriptionAddAddr.js'));
// const MemberSignInOrSignUp = asyncLoadComponent(()=> import ('./module/member/components/MemberSignInOrSignUp.js'));
const MemberCard = asyncLoadComponent(()=> import ('./module/member/components/MemberCard.js'));
const MemberLoginIn = asyncLoadComponent(()=> import ('./module/member/components/MemberLoginIn.js'));
const Authentication = asyncLoadComponent(()=> import ('./module/member/components/Authentication.js'));
const PerfectingInformation = asyncLoadComponent(()=> import ('./module/member/components/PerfectingInformation.js'));
const BillingList = asyncLoadComponent(()=> import ('./module/member/components/BillingList.js'));
const BillingDetails = asyncLoadComponent(()=> import ('./module/member/components/BillingDetails.js'));
const MemberSignInGiveIntegral = asyncLoadComponent(()=> import ('./module/integral/components/MemberSignInGiveIntegral.js'));

const YdyPatientList = asyncLoadComponent(()=> import ('./module/member/components/YdyPatientList.js'));
const YdyPatientDetail = asyncLoadComponent(()=> import ('./module/member/components/YdyPatientDetail.js'));
const YdyInShopList = asyncLoadComponent(()=> import ('./module/member/components/YdyInShopList.js'));

const PrescriptionList = asyncLoadComponent(()=> import ('./module/prescription/components/PrescriptionList'));
const PrescriptionDetail = asyncLoadComponent(()=> import ('./module/prescription/components/PrescriptionDetail'));
const PrescriptionLogDetail = asyncLoadComponent(()=> import ('./module/prescription/components/PrescriptionLogDetail'));
const PrescriptionLogistics = asyncLoadComponent(()=> import ('./module/prescription/components/PrescriptionLogistics'));
const PrescriptionRegister = asyncLoadComponent(()=> import ('./module/prescription/components/PrescriptionRegister.js'));

const LogisticsInfo = asyncLoadComponent(()=> import ('./module/common/components/LogisticsInfo'));
const MallIndex = asyncLoadComponent(()=> import ('./module/mall/index/components/MallIndex'));

const Info = asyncLoadComponent(()=> import ('./module/msg/components/Info'));
const InfoDetail = asyncLoadComponent(() => import ('./module/msg/components/InfoDetail'));
const OrderProductCommentDetails =  asyncLoadComponent(()=> import('./module/order/components/OrderProductCommentDetails'));
const OrderProductComment = asyncLoadComponent(() => import('./module/order/components/OrderProductComment'));
const OrderComment = asyncLoadComponent(() => import('./module/order/components/OrderComment'));

const ScanReceiveCoupon = asyncLoadComponent(() => import('./module/coupon/components/ScanReceiveCoupon'));
const UseCoupon = asyncLoadComponent(() => import('./module/coupon/components/UseCoupon'));
const YearMeetingReceive = asyncLoadComponent(() => import('./module/coupon/components/YearMeetingReceive'));

const DoubleEleven = asyncLoadComponent(() => import('./module/activity/components/DoubleEleven'));
const DoubleTwelve = asyncLoadComponent(() => import('./module/activity/components/DoubleTwelve'));
const DoubleDenier = asyncLoadComponent(() => import('./module/activity/components/DoubleDenier'));
const NewYear = asyncLoadComponent(() => import('./module/activity/components/NewYear'));
const LanternFestival = asyncLoadComponent(() => import('./module/activity/components/LanternFestival'));
const WomensDay = asyncLoadComponent(() => import('./module/activity/components/WomensDay'));
const NewMemberExclusive = asyncLoadComponent(() => import('./module/activity/components/NewMemberExclusive'));
const BargainActivity = asyncLoadComponent(() => import('./module/bargain/components/BargainActivityList'));
const BargainSettlement = asyncLoadComponent(() => import('./module/bargain/components/BargainSettlement'));
const MemberPromoterAction = asyncLoadComponent(() => import('./module/promoter/components/MemberPromoter'));
const Bargain = asyncLoadComponent(() => import('./module/bargain/components/Bargain'));
const AgainBargainReceive = asyncLoadComponent(() => import('./module/bargain/components/PrizeReceiveAddressList'));
const FullReductionProduct = asyncLoadComponent(() => import('./module/activity/components/FullReductionProduct'));
const CouponGiftPackDetails = asyncLoadComponent(() => import('./module/coupon/components/CouponGiftPackDetails'));
const InterrogationRecord = asyncLoadComponent(()=>import('./module/member/components/InterrogationRecordList'));
const InterrogationRecordDetails = asyncLoadComponent(()=>import('./module/member/components/InterrogationRecordDetails'));
const ReceiveShareCoupon = asyncLoadComponent(() => import('./module/coupon/components/ReceiveShareCoupon'));
const CouponReceiveList = asyncLoadComponent(()=> import ('./module/coupon/components/CouponReceiveList'));
const YearMetaphase = asyncLoadComponent(()=> import ('./module/activity/components/YearMetaphase'));

const CouponApplyShopList = asyncLoadComponent(()=> import ('./module/coupon/components/CouponApplyShopList'));
const StoreValueDemo = asyncLoadComponent(()=> import ('./module/member/components/StoreValueDemo'));
const MemberStoredValueBalance = asyncLoadComponent(()=>import('./module/member/components/MemberStoredValueBalance'));
const StoredValueRecharge = asyncLoadComponent(()=>import('./module/member/components/StoredValueRecharge'));
const RechargeSuccess = asyncLoadComponent(()=>import('./module/member/components/RechargeSuccess'));
const RechargeFailure = asyncLoadComponent(()=>import('./module/member/components/RechargeFailure'));
/**
 * 1、 所有的页面路由都在这里配置
 * 2、 添加一个新的路由，只需添加一个新的Route节点即可
 * 3、 路由有先后顺序，比如
 *          <Route path="/example*" component={Example1}/>
 *          <Route path="/example2" component={Example2}/>
 *          当我访问 /example2 时，实际访问的是 Example1，因为 /example* 能够匹配上 /example2 ，这时就直接返回Example1了
 *          所以路由/example2应该放在/example*前面
 * 4、路由可以带路径参数，比如
 *          <Route path="/example2/:name" component={Example2}/>
 *          在Example2中获取路径参数：this.props.match.params.name
 * 5、path的值支持通配符 * ，比如
 *          /example*，匹配所有example开头的路由
 * 6、AuthorizedRoute与Route
 *          普通页面用Route
 *          如果需要登录才能访问，则用AuthorizedRoute
 */

const MenuRouter = ()=>{
    return (
        <HashRouter onUpdate={() => window.scrollTo(0, 0)}>
            <Switch>
                {/*示例、测试*/}
                <Route path="/example/1" component={Example1} />
                <Route path="/example/2/:name" component={Example2}/>
                <Route path="/example/jssdk" component={JsSdkExample}/>
                <Route path="/example/fileUpload" component={FileUploadExample}/>
                <Route path="/example/countDown" component={CountDownExample}/>
                <Route path="/example/index" component={ExampleIndex}/>
                {/*<Route path="/settlement/NORMAL_1" component={WxPayAccept}/>*/}
                {/*<Route path="/settlement/:type_orderId" component={WxPayTest}/>/!*注意参数格式：结算类型_订单id*!/*/}

                {/*门店首页-附近门店*/}
                <Route path="/index/nearby" component={NearByShop}/>
                {/*门店首页-选择地址*/}
                <AuthorizedRoute path="/index/selectAddr" component={SelectAddr}/>
                {/*门店首页-药师咨询*/}
                <Route path="/index/pharmacist" component={PharmacistList}/>
                {/*门店首页-领优惠券*/}
                <AuthorizedRoute path="/index/receive/coupon/supportReceive" component={ReceiveCoupon}/>
                {/*门店首页*/}
                <Route path="/index" component={Index}/>

                {/*用户中心*/}
                <AuthorizedRoute path="/member/index" component={MemberIndex}/>
                {/*用户中心-我的优惠券 旧版*/}
                {/*<AuthorizedRoute path="/coupon/list" component={CouponList}/>*/}
                {/*用户中心-我的优惠券- 0.1版本*/}
                <AuthorizedRoute path="/coupon/list" component={MyCouponList}/>
                {/*用户中心-我的优惠券- 详情 0.1版本*/}
                <AuthorizedRoute path="/myCoupon/detail/:couponPermissionId" component={CouponDetail}/>
                {/*用户中心-我的积分兑换记录*/}
                <AuthorizedRoute path="/member/integral/record" component={MemberCenterIntegralRecord}/>
                {/*用户中心-我的积分*/}
                <AuthorizedRoute path="/member/integral/index" component={MemberCenterIntegral}/>
                {/*用户中心-签到领积分*/}
                <AuthorizedRoute path="/member/integral/sign" component={MemberSignInGiveIntegral}/>
                {/*用户中心-会员详情*/}
                <AuthorizedRoute path="/member/detail" component={MemberDetail}/>
                {/*用户中心-更换手机号码校验*/}
                <AuthorizedRoute path="/member/mobile/validate" component={MemberValidateMobile}/>
                {/*用户中心-修改手机号码*/}
                <AuthorizedRoute path="/member/mobile/change" component={MemberChangeMobile}/>
                {/*用户中心-会员权益*/}
                <AuthorizedRoute path="/member/interest" component={MemberInterest}/>
                {/*储值 - 我的余额*/}
                <AuthorizedRoute path="/member/myStoredValueBalance" component={MemberStoredValueBalance}/>
                {/*储值 - 充值中心*/}
                <AuthorizedRoute path="/storedValue/recharge" component={StoredValueRecharge}/>
                {/*储值 - 充值成功*/}
                <AuthorizedRoute path="/storedValue/successFul/:amount" component={RechargeSuccess}/>
                {/*储值 - 充值失败*/}
                <AuthorizedRoute path="/storedValue/failure/:errorMsg" component={RechargeFailure}/>
                {/*登录与注册*/}
                {/*<Route path="/member/signInOrSignUp?callBackUrl=" component={MemberSignInOrSignUp}/>*/}
                <Route path="/member/memberLoginIn" component={MemberLoginIn}/>
                <Route path="/member/memberCard" component={MemberCard}/>
                {/* 身份验证 */}
                <AuthorizedRoute path="/member/authentication" component={Authentication}/>
                {/* 完善信息 */}
                <AuthorizedRoute path="/member/perfectingInformation" component={PerfectingInformation}/>
                {/* 账单列表 */}
                <AuthorizedRoute path="/member/billingList" component={BillingList}/>
                {/* 账单详情 */}
                <AuthorizedRoute path="/member/billingDetails/:transLogId" component={BillingDetails}/>

                {/*友德医会员患者列表*/}
                <AuthorizedRoute path="/ydy/patient/list" component={YdyPatientList}/>
                <AuthorizedRoute path="/ydy/patient/detail/:patientIndex" component={YdyPatientDetail}/>
                <AuthorizedRoute path="/ydy/patient/detail" component={YdyPatientDetail}/>
                {/* 友德医问诊记录 - 列表*/}
                <AuthorizedRoute path="/ydy/interrogationRecord/list" component={InterrogationRecord}/>
                {/* 友德医问诊记录 - 详情*/}
                <AuthorizedRoute path="/ydy/interrogationRecord/details/:inquiryId" component={InterrogationRecordDetails}/>
                {/* 友德医有货门店 - 列表*/}
                <AuthorizedRoute path="/ydy/inShop/list/:prescriptionId" component={YdyInShopList}/>

                {/*积分-兑换优惠劵*/}
                <AuthorizedRoute path="/integral/exchange" component={CouponExchangeList}/>
                {/*积分商品列表*/}
                <AuthorizedRoute path="/integral/product/list" component={IntegralProductList}/>
                {/*积分商品详情*/}
                <AuthorizedRoute path="/integral/product/detail/:id" component={IntegralProductDetail}/>
                {/*积分商品兑换*/}
                <AuthorizedRoute path="/integral/product/exchange" component={IntegralProductExchange}/>

                {/*积分订单列表*/}
                <AuthorizedRoute path="/integral/order/list" component={IntegralOrderList}/>
                {/*积分订单详情*/}
                <AuthorizedRoute path="/integral/order/detail/:id" component={IntegralOrderDetail}/>

                {/*积分-大转盘活动*/}
                <AuthorizedRoute path="/integral/turntable" component={BigTurntableActivity}/>
                {/*积分-大转盘活动-中奖页面*/}
                <AuthorizedRoute path="/integral/winningRecord" component={BigTurntableWinningRecord}/>

                {/*订单列表*/}
                <AuthorizedRoute path="/order/list/:orderState" component={OrderList}/>
                {/*订单详情*/}
                <AuthorizedRoute path="/order/detail/:id" component={OrderDetail}/>
                {/*我的评价*/}
                <AuthorizedRoute path="/order/comment/:orderId/:orderState" component={OrderComment}/>
                {/*我的评价-列表*/}
                <AuthorizedRoute path="/order/comment" component={OrderProductComment}/>
                {/*我的评价-订单评论详情*/}
                <AuthorizedRoute path="/order/commentDetails/:id" component={OrderProductCommentDetails}/>


                {/*收货地址列表*/}
                <AuthorizedRoute path="/address/list" component={ReceiverAddressList}/>
                {/*添加收货地址*/}
                <AuthorizedRoute path="/address/add" component={ReceiverAddressAdd}/>
                {/*编辑收货地址*/}
                <AuthorizedRoute path="/address/edit/:id" component={ReceiverAddressEdit}/>

                {/*门店*/}
                <Route path="/shop/detail/:shopId" component={ShopDetail}/>
                <AuthorizedRoute path="/shop/complaint/:shopId" component={ShopComplaint}/>

                {/*商品-门店商品搜索*/}
                <Route path="/product/search/shop" component={ShopProductSearch}/>
                {/*商品-门店商品列表*/}
                <Route path="/product/list/shop" component={ShopProductList}/>

                {/*商品-b2c商品列表*/}
                <Route path="/product/list/b2c" component={B2cProductList}/>
                {/*商品-b2c商品列表搜索*/}
                <Route path="/product/search/b2c" component={B2cProductSearch}/>
                {/*商品-详情*/}
                <Route path="/product/detail/:productId/:platformType/:openId/:shopId" component={ProductDetail}/>
                <Route path="/product/detail/:productId/:platformType/:shopId" component={ProductDetail}/>
                <Route path="/product/detail/:productId/:platformType" component={ProductDetail}/>
                <Route path="/product/detail/:productId" component={ProductDetail}/>
                {/*商品-评论*/}
                <Route path="/product/commentPoint/:productId/:platformType" component={CommentPoint}/>
                {/*商品-商品列表demo*/}
                <Route path="/product/demo" component={ProductDemo}/>
                {/*商品-商品分类*/}
                <Route path="/product/classify" component={B2cProductClassify}/>
                {/*商品-限制商品抵扣优惠券选择门店*/}
                <Route path="/product/SupportSellByShop/:productId" component={SupportSellByShop}/>

                {/*扫码购物-快速购物页*/}
                <Route path="/scan/barCodeScan" component={BarCodeScan}/>
                <Route path="/scan/barCodeManualInput" component={BarCodeManualInput}/>

                {/*购物车*/}
                <Route path="/cart/normalCart" component={NormalCart}/>
                {/*购物车结算页面*/}
                <AuthorizedRoute path="/cart/normalCartSettlement" component={NormalCartSettlement}/>
                {/*优惠券选中使用*/}
                <AuthorizedRoute path="/cart/couponSelector/:id" component={CouponSelector}/>
                {/*忘记密码*/}
                <AuthorizedRoute path="/cart/forgetPayPassword" component={ForgetPayPassword}/>
                {/*发票*/}
                <Route path="/cart/invoice" component={Invoice}/>

                {/*拍单购药-新增*/}
                <AuthorizedRoute path="/prescription/add" component={PrescriptionAdd}/>
                {/*拍单购药-订单列表*/}
                <AuthorizedRoute path="/prescription/list" component={PrescriptionList}/>
                {/*拍单购药-选择地址*/}
                <AuthorizedRoute path="/prescription/addAddr" component={PrescriptionAddAddr}/>
                {/*拍单购药-订单日志*/}
                <AuthorizedRoute path="/prescription/logDetail/:id" component={PrescriptionLogDetail}/>
                {/*拍单购药-订单物流*/}
                <AuthorizedRoute path="/prescription/logistics/:shipperCode/:logisticCode" component={PrescriptionLogistics}/>
                {/*拍单购药-详情*/}
                <AuthorizedRoute path="/prescription/:id" component={PrescriptionDetail}/>

                {/*扫码领取优惠卷*/}
                <Route path="/coupon/sc/:couponId/:callbackUrl" component={ScanReceiveCoupon}/>
                {/*使用线下优惠卷*/}
                <AuthorizedRoute path="/coupon/useCoupon/:couponPermissionId" component={UseCoupon}/>

                {/*处方药登记*/}
                <AuthorizedRoute path="/prescriptionRegister/:platformType/:productId"
                                 component={PrescriptionRegister}/>

                {/*年会领卷*/}
                <Route path="/coupon/yearMeetingReceive/:couponId" component={YearMeetingReceive}/>

                {/*物流信息*/}
                <Route path="/logistics/:logisticsCompanyCode/:logisticsOrderNum" component={LogisticsInfo}/>

                {/*微商城首页*/}
                <Route path="/mall/index" component={MallIndex}/>


                {/*微商城咨讯详情*/}
                <Route path="/msg/info/detail/:infoId" component={InfoDetail}/>
                {/*微商城咨讯中心*/}
                <Route path="/msg/info/:infoCategoryId" component={Info}/>

                {/*会员卡绑定*/}
                <Route path="/card" component={Card}/>

                {/*双十一活动*/}
                <Route path="/activity/doubleEleven" component={DoubleEleven}/>
                {/*双十二活动*/}
                <Route path="/activity/doubleTwelve" component={DoubleTwelve}/>
                {/*新会员专题*/}
                <Route path="/activity/newMemberExclusive" component={NewMemberExclusive}/>
                {/*双旦活动*/}
                <Route path="/activity/doubleDenier" component={DoubleDenier}/>
                {/*新年活动*/}
                <Route path="/activity/newYear" component={NewYear}/>
                {/*元宵活动*/}
                <Route path="/activity/lanternFestival" component={LanternFestival}/>
                {/*妇女节活动*/}
                <Route path="/activity/womensDay" component={WomensDay}/>
                {/*会员推广奖励*/}
                <Route path="/member/promote/:sharerId" component={MemberPromoterAction}/>

                {/*互助砍价*/}
                <Route path="/bargain/mutualBargain/:mutualBargainShareRecordId" component={Bargain}/>
                {/*砍价活动*/}
                <Route path="/bargain/bargainActivity" component={BargainActivity}/>
                {/*砍价活动--结算*/}
                <AuthorizedRoute path="/bargain/bargainSettlement/:mutualBargainShareRecordId/:mutualBargainActivityId"
                                 component={BargainSettlement}/>
                {/*砍价商品详情*/}
                <AuthorizedRoute
                    path="/bargain/againBargainReceive/:mutualBargainActivityId/:mutualBargainShareRecordId"
                    component={AgainBargainReceive}/>

                {/*满立减活动参与商品列表*/}
                <Route path="/activity/commentList/:fullReductionActivityId" component={FullReductionProduct}/>

                {/*优惠券大礼包-大礼包详情*/}
                <AuthorizedRoute path="/couponGiftPack/findDetails/:couponGiftPacksId" component={CouponGiftPackDetails}/>

                {/*领取分享优惠卷*/}
                <Route path="/coupon/receiveShareCoupon/:couponShareCode" component={ReceiveShareCoupon}/>


                {/*优惠券列表（新）*/}
                <AuthorizedRoute path="/coupon/receive/list/:acquireEntrance" component={CouponReceiveList}/>

                {/*金康年中618*/}
                <Route path="/activity/yearMetaphase" component={YearMetaphase}/>

                {/*优惠券适用商品列表（新）*/}
                <AuthorizedRoute path="/product/new/search/shop/:couponId" component={NewShopProductList}/>
                {/*优惠券适用门店列表（新）*/}
                <AuthorizedRoute path="/coupon/apply/shop/list/:couponId" component={CouponApplyShopList}/>

                {/*储值充值demo*/}
                <AuthorizedRoute path="/storeValueDemo" component={StoreValueDemo}/>

                {/*默认页面*/}
                <Route path="*" component={Index}/>
            </Switch>
        </HashRouter>
    );
};

export default MenuRouter
