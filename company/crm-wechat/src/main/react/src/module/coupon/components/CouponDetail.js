/**
 * @author  olx
 * @date 2019/5/28/028
 * 优惠券详情
 */
import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {getDetail} from "../actions/myCouponListAction.js";
import ShareGuide from "../../common/components/ShareGuide";
import {setShowShareGuide} from "../../common/actions/commonAction";
import {findShopHomeByShopId,setParams,getShopSellClassifyFirstId} from "../../index/actions/indexActions.js";
import {pageCouponApplyProduct,changeTabButtonAction,couponApplyStoreListAction,sendCouponToFriendFun} from "../../coupon/actions/couponDetailActions";
import AutoLoadMore from "../../common/components/AutoLoadMore";
import Img from "../../common/components/Img";
import {Link} from "react-router-dom";
import AffixForList from "../../common/components/AffixForList";
import giving from "../../../media/images/coupon/myCouponList/coupon-giving.png";
import newArrive from "../../../media/images/coupon/myCouponList/coupon-new-arrive.png";
import noEffect from "../../../media/images/coupon/myCouponList/coupon-no-effect.png";
import overdue from "../../../media/images/coupon/myCouponList/coupon-overdue.png";
import giftIcon from "../../../media/images/gift-icon.png";
import "../style/CouponDetail.css";
import {initJsSdk} from "../../common/actions/jssdkAction";
import QRCode from 'qrcode.react'; //二维码生成
import html2canvas from 'html2canvas'; //利用canvas画布生成图片
class CouponDetail extends Component {

    //组件作用域内的一个组件状态，react的核心
    state = {
        couponPermissionId: "",
        qrCode: ""
    };

    //在组件首次渲染之前调用，这时候DOM还没有，而且整个生命周期中只会被执行一次，在这里面setState是无效的
    componentWillMount() {
        document.title = '优惠券详情';
        const couponPermissionId = this.props.match.params.couponPermissionId;
        this.setState({couponPermissionId: couponPermissionId});
        window.scrollTo(0,0);//定位到顶部
        this.props.actions.getDetail(couponPermissionId,(couponDetail)=>this.firstLoadCouponApplyProductPage(couponDetail),(couponDetail)=> this.couponApplyStoreList(couponDetail));
    }

    //在组件首次渲染之后调用，这时候DOM节点已经首次加载完成。整个生命周期只会执行一次
    componentDidMount(){


    }

    //销毁组件的时候调用
    componentWillUnmount(){
        const self= this;
        self.setState({
            qrCode: ""
        });
        self.props.actions.setShowShareGuide(false);
    }

    /**
     * 首次加载优惠券适用商品
     */
    firstLoadCouponApplyProductPage(couponDetail){
        const self= this;

        const {couponApplyProductSearchParam} = self.props.couponDetailState;
        couponApplyProductSearchParam.page = 0;
        couponApplyProductSearchParam.couponPermissionId = couponDetail.couponPermissionId;
        couponApplyProductSearchParam.couponId = couponDetail.couponId;
        //加载适合商品分页
        self.props.actions.pageCouponApplyProduct(couponApplyProductSearchParam);

        console.log('分享url:'+window.location.href.split('#')[0] + "wap/redirect/receiveShareCoupon/" + couponDetail.couponShareCode);
        if(couponDetail.isSupportGift === "Y" && !(couponDetail.couponSource==='FRIEND_GIFT')){
            //设置分享
            initJsSdk(() => {
                var img = couponDetail.advertisementImg;
                window.wx.onMenuShareAppMessage({
                    title: couponDetail.couponName, // 分享标题
                    desc: "您的小伙伴赠送您一张优惠卷,快来领取!!", // 分享描述
                    link: window.location.href.split('#')[0] + "wap/redirect/receiveShareCoupon/" + couponDetail.couponShareCode, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl:img, // 分享图标
                    success: function () {
                        //关闭分享遮罩层
                        self.props.actions.setShowShareGuide(false);
                        //分享时  保存分享记录
                        self.props.actions.sendCouponToFriendFun(couponDetail.couponPermissionId);
                    }
                })
            }, () => {
                console.log("初始化失败")
            }, {  // 组装分享所需参数
                onMenuShareAppMessage: false,  //重写分享好友sdk
            });
        }




        if(couponDetail.isOffline === 'Y'&&!self.state.qrCode){
            //将画布转成图片
            const sharePosterLayer = document.getElementById('qrCode');
            html2canvas(sharePosterLayer).then(function (canvas) {
                // console.log(canvas); //生成canvas画布
                // console.log(canvas.toDataURL()); //将canvas转为base64图片
                self.setState({qrCode: canvas.toDataURL()})
            });
        }

    }

    /**
     * 商品加载更多
     */
    productLoadMore(){
        const {couponDetail} = this.props.couponState;
        const {couponApplyProductSearchParam,couponApplyProductPage} = this.props.couponDetailState;
        couponApplyProductSearchParam.page += 1;
        couponApplyProductSearchParam.couponPermissionId = couponDetail.couponPermissionId;
        couponApplyProductSearchParam.couponId = couponDetail.couponId;
        this.props.actions.pageCouponApplyProduct(couponApplyProductSearchParam,couponApplyProductPage.content);
    }

    /**
     * 适用门店列表
     */
    couponApplyStoreList(couponDetail){
        var self = this;

        //取当前经纬度
        let {mapLocation} = window.localStorage; //会员手机的本地缓存经纬度
        let {addressStateLocation} = this.props.addressState;  //仓库写死的经纬度
        let location = '';
        if(mapLocation){
            location = mapLocation;
            console.log('使用会员手机的本地缓存经纬度：' + location);
            self.props.actions.couponApplyStoreListAction(couponDetail.couponId,location);
            return;
        }else {
            location = addressStateLocation || [0,0];
            location = addressStateLocation[0] +','+addressStateLocation[1];
        }

        initJsSdk(
            () => {
                window.wx.getLocation({
                    type: 'gcj02',
                    success: function (res) {
                        let vMapLocation = res.longitude + "," + res.latitude;
                        window.localStorage.mapLocation = vMapLocation||"";
                        console.log('定位成功：' + vMapLocation);
                        self.props.actions.couponApplyStoreListAction(couponDetail.couponId,vMapLocation);
                    },
                    cancel: function (res) {
                        console.log("定位失败cancel");
                        self.props.actions.couponApplyStoreListAction(couponDetail.couponId,location);
                    },
                    fail: function () {
                        console.log("定位失败fail");
                        self.props.actions.couponApplyStoreListAction(couponDetail.couponId,location);
                    }
                });
            },
            () => {
                console.log("定位失败errCallback");
                self.props.actions.couponApplyStoreListAction(couponDetail.couponId,location);
            }
        )
    }


    /**
     * 改变tab按钮
     * @param type
     */
    changeTabButton(type){
        const {tabButton} = this.props.couponDetailState;
        if(type == tabButton){
            return;
        }
        this.props.actions.changeTabButtonAction(type);
    }





    changeLocation( shopId) {
        let {mapLocation} = window.localStorage;
        let params = {sellCategoryId:''};
        window.localStorage.mapLocation=mapLocation||"";
        this.props.actions.setParams(params);

        //先查询该门店的销售分类 再回调 查询商品
        this.props.actions.getShopSellClassifyFirstId(shopId,(sellCategoryId)=>{
            this.props.actions.findShopHomeByShopId(mapLocation, shopId,()=>{ this.props.history.push('/index');},sellCategoryId);
        });

    }

    render() {
        const actions = this.props.actions;
        const history = this.props.history;
        const {couponDetail} = this.props.couponState;
        const  isNotEffect=true;
        const item =couponDetail||{};


        const {couponApplyProductPage,tabButton,couponApplyStore} = this.props.couponDetailState;
        const productPage =couponApplyProductPage.content|| [];
        //商品分页是否有下一页
        const isHaveNextPage = couponApplyProductPage.size * (couponApplyProductPage.page + 1) < couponApplyProductPage.recordsFiltered;

        const stors =couponApplyStore || [];
        const self= this;


        return (


            <div className="couponDetailClass">
                <ShareGuide/>
                <div className="details-coupon">
                    <li className={isNotEffect ? "list-item disabled" : " list-item"}>
                        <div className="cell-hd">
                            {/* 满减 */}
                            {item.couponType === 'FULL_REDUCE' &&
                            <div className="cont">
                                <span>{item.couponAmountDouble}</span><em>元</em>
                                {item.isLimitedUse === 'N' ?
                                    <p>无限制门槛</p> : <p>订单满{item.orderFullAmountDouble}元减{item.couponAmountDouble}元</p>}
                            </div>}


                            {/*  打折 */}
                            {item.couponType === 'DISCOUNT' && <div className="cont">
                                <span>{item.couponDiscount}</span><em>折</em>
                                {item.isLimitedUse === 'N' ?
                                    <p>无限制门槛</p> : <p>订单满{item.orderFullAmountDouble}元打{item.couponDiscount}折</p>}
                            </div>}
                        </div>
                        <div className="cell-bd">
                            <div className="bd-top">
                                <div className="title">
                                    {item.applyProductType === "ALL_PRODUCTS" && <span className="tag">全品类</span>}
                                    {item.couponName}
                                </div>
                                {item.effectiveBeginTimeString && item.effectiveEndTimeString && <div className="validity">{item.effectiveBeginTimeString+ "至" + item.effectiveEndTimeString }</div>}
                                {!item.effectiveBeginTimeString && !item.effectiveEndTimeString && <div className="validity">-- 至 --</div>}

                            </div>
                            <div className="bd-bot">
                                {item.applyProductType === "ALL_PRODUCTS" &&
                                <div className="bot-lt">全场商品通用{item.isSupportGift === "Y" && !(item.couponSource==='FRIEND_GIFT') && <span>￨可赠送</span>}{item.isSupportGift === "N" && item.couponSource==='FRIEND_GIFT' && <span>￨不可赠送</span>}</div>}
                                {item.applyProductType === "SPECIFIED_PRODUCTS" &&
                                <div className="bot-lt">指定商品{item.isSupportGift === "Y" && !(item.couponSource==='FRIEND_GIFT') && <span>￨可赠送</span>}{item.isSupportGift === "N" && item.couponSource==='FRIEND_GIFT' && <span>￨不可赠送</span>}</div>}
                                {item.applyProductType === "EXCLUDE_PRODUCTS" &&
                                <div className="bot-lt">排除商品{item.isSupportGift === "Y" && !(item.couponSource==='FRIEND_GIFT') && <span>￨可赠送</span>}{item.isSupportGift === "N" && item.couponSource==='FRIEND_GIFT' && <span>￨不可赠送</span>}</div>}
                            </div>
                        </div>
                        <div className="state-box">
                            {item.remindState === "新到" && <img src={newArrive} alt=""/>}
                            {item.remindState === "未生效" && <img src={noEffect} alt=""/>}
                            {item.remindState === "快过期" && <img src={overdue} alt=""/>}
                            {item.remindState === "赠送中" && <img src={giving} alt=""/>}

                        </div>
                    </li>
                    { item.isOffline === 'Y' &&  <div className="qr-code">
                        <div className="qrcode-top">
                            <div className="top-pic">
                                {self.state.qrCode&&<img src={self.state.qrCode} alt="优惠券二维码"/>}
                                {!self.state.qrCode&&<QRCode id={"qrCode"}
                                    value={item.couponCode}  //value参数为生成二维码的链接
                                    size={190} //二维码的宽高尺寸
                                    fgColor="#000000"  //二维码的颜色
                                />}
                            </div>
                            <div className="top-tips">使用时向服务员出示此二维码</div>

                        </div>
                        {item.isSupportGift === "Y" && !(couponDetail.couponSource==='FRIEND_GIFT')  && <div className="qrcode-bottom"><a onClick={()=> this.props.actions.setShowShareGuide(true)}> <span> <img src={giftIcon} alt=""/></span> 赠送给好友</a></div>}
                    </div> }



                    <div className="coupon">
                        {item.isSupportGift === "Y" && item.isOnline === 'Y' && item.isOffline === 'N' && !(couponDetail.couponSource==='FRIEND_GIFT') &&  <div className="give-a-friend"><a onClick={()=> this.props.actions.setShowShareGuide(true)}> <span> <img src={giftIcon} alt=""/></span> 赠送给好友</a></div>}
                        <div className="c-title">{item.couponName}</div>
                        <div className="rule-of-activity">
                            <div className="r-title">活动规则</div>
                            <div className="r-content">
                                {item.ruleExplain ? <pre style={{overflow: "hidden"}}>{item.ruleExplain}</pre> : <div>
                                    <p>1.优惠券仅限在有效期内使用，过期则无法使用；</p>
                                    <p>2.少量特殊商品不能使用优惠券；</p>
                                    <p>3.一张订单只能使用一张优惠券，优惠券不可合并；</p>
                                    <p>4.每张优惠券只能使用一次，抵价金额未用完下次也不能继续使用；</p>
                                </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="store-list">
                        <div className="s-box">
                            <div className="s-title">适用范围</div>
                            <AffixForList offsetTop={0.0001} index={1}>
                                <div className="s-nav">
                                    <div className={tabButton === 'product' ?  "item cur" :  "item"}  onClick={() => this.changeTabButton('product')}>适用商品({couponApplyProductPage.recordsFiltered>10000?parseInt(couponApplyProductPage.recordsFiltered/10000)+"w":couponApplyProductPage.recordsFiltered})</div>
                                    <div className={tabButton === 'store' ?  "item cur" :  "item"} onClick={() => this.changeTabButton('store')}>适用门店({couponApplyStore.length})</div>
                                </div>
                            </AffixForList>

                        </div>
                        <div className="store-box cur" id="productPageId" style={{display:tabButton === 'product' ? 'block' : 'none'}}>
                            {
                                productPage.map((product, index) => {
                                    return (
                                        <div className="store-item" key={index}>
                                            <Link to={"/product/detail/"+product.productId +"/O2O"}>
                                            <div className="store-pic">
                                                <Img src={product.picture} alt=""/>
                                            </div>
                                            <div className="store-content">
                                                <div className="title">{product.productNm}</div>
                                                <div className="tips">{product.approvalNumber}</div>
                                                <div className="factory">{product.manufacturer}</div>
                                                <div className="product-information">
                                                    <div className="quantity">{product.spec}</div>
                                                    <div className="price">
                                                        <i>￥</i>{product.marketReferencePriceDouble.toFixed(2)}<span>/{product.unit}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            </Link>
                                        </div>
                                    )
                                })
                            }
                            {productPage.length > 0 && <AutoLoadMore isHaveNextPage={isHaveNextPage} loadMoreFunc={() => this.productLoadMore()} container="productPageId"/>}
                        </div>

                         <div className="store-box" style={{display:tabButton === 'store' ? 'block' : 'none'}}>
                            {
                                stors.map((stor, index) => {
                                    return (
                                        <div className="commodity-item"  key={index}>
                                            <div className="commodity-name">
                                                <div className="commodity-name-item">{stor.name}</div>
                                                {/* true代表在配送范围   false超出配送范围 */}
                                                {!stor.inShopRange && <div className="tips">超出配送范围</div>}
                                            </div>
                                            <div className="commodity-content">{stor.address}</div>
                                            <div className="commodity-addressicon">{stor.distanceStr}</div>
                                            <Link to="/MyCouponList/list"><div className="commodity-enter" onClick={() => this.changeLocation( stor.shopId)}>进入门店></div></Link>
                                        </div>
                                    )
                                })
                            }



                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        couponState: store.couponState,
        couponDetailState:store.couponDetailState,
        addressState: store.addressState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            getDetail,
            setShowShareGuide,
            pageCouponApplyProduct,
            changeTabButtonAction,
            couponApplyStoreListAction,
            findShopHomeByShopId,
            setParams,
            getShopSellClassifyFirstId,
            sendCouponToFriendFun
        }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CouponDetail);