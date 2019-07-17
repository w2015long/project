import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Link} from "react-router-dom";
import Swiper from "../../common/components/Swiper";
import "../style/ProductDetail.css";
import {
    changeCommentPointSearchPage,
    changeCurrentGrade,
    changeIsShowInstructions,
    commonSetProductState,
    getAllProductComment,
    getProductDetail,
    pageProductCommentByGrade,
    shiftProductDetailTab
} from "../actions/productActions";
import {changeItemQuantity, getCart, modifyItemQuantity} from "../../cart/actions/normalCartAction";
import {initJsSdk} from "../../common/actions/jssdkAction";
import {parabolaFly} from '../../common/actions/parabolaFlyAction'
import baojianpin from '../../../media/images/baojianpin.png';
import ParabolaFly from "../../common/components/ParabolaFly";
import StarItem from "./StarItem";
import dualIcon from '../../../media/images/dual-icon.png';
import gListRx from '../../../media/images/g-list-rx.png';
import one1 from '../../../media/images/one1.png';
import otcJ from '../../../media/images/otc-j.png';
import otcY from '../../../media/images/otc-y.png';
import qita from '../../../media/images/qita.png';
import shiping from '../../../media/images/shiping.png';
import three3 from '../../../media/images/three3.png';
import two2 from '../../../media/images/two2.png';
import xiaozihao from '../../../media/images/xiaozihao.png';
import zhongyaoyinpin from '../../../media/images/zhongyaoyinpin.png';
import zhuangzihao from '../../../media/images/zhuangzihao.png';
import iconDel3 from '../../../media/images/icon-del3.png';
import yiling from '../../../media/images/yiling.png';
import * as types from "../constants/ActionTypes";
import {getShopDetail} from "../../index/actions/indexActions";
import {showConfirm} from "../../common/actions/commonAction";
import Confirm from '../../common/components/Confirm';


//商品详情
class ProductDetail extends Component {
    state = {
        couponModelWidth: "0%",
        couponTransForm: "translateY(100%)",
        couponSwitch: false, // 开关状态
    };

    componentWillMount() {
        document.title = '商品详情';
        //初始化jssdk，查看地图需要
        let self = this;
        const {productId, platformType, shopId} = self.props.match.params;
        if ((platformType == "null" && shopId == "null") || (platformType == undefined && shopId == undefined) || (platformType == null && shopId == null)) {
            initJsSdk(
                () => {
                    self.getLocation(productId);
                },
                () => {
                    self.init(productId, "B2C", "");
                }
            )
        } else {
            self.init(productId, platformType, shopId);
        }


        //初始化页面
        self.props.actions.shiftProductDetailTab("PRODUCT");
        this.productDetailModuleSwitching = this.productDetailModuleSwitching.bind(this);
        window.scrollTo(0, 0);
    }

    init(productId, platformType, shopId) {
        let self = this;
        self.props.actions.getProductDetail(productId, platformType, shopId, (productDetailData) => {
            initJsSdk(() => {
                console.log("初始化成功")
            }, () => {
                console.log("初始化失败")
            }, self.getDataMap(productDetailData));
            self.props.actions.getAllProductComment(productId);//加载商品全部评价
        });
    }

    getLocation(productId) {
        let self = this;
        const getShopDetail = this.props.actions.getShopDetail;//获取门店详情
        window.wx.getLocation({
            success: function (res) {
                let mapLocation = res.longitude + "," + res.latitude;
                getShopDetail(mapLocation, "Y", function (shopId) {
                    if (shopId) {
                        self.props.actions.getProductDetail(productId, "O2O", shopId, (productDetailData) => {
                            // 如附近门店有该商品
                            if (productDetailData && productDetailData.productId) {
                                initJsSdk(() => {
                                    console.log("初始化成功")
                                }, () => {
                                    console.log("初始化失败")
                                }, self.getDataMap(productDetailData));
                                self.props.actions.getAllProductComment(productId);//加载商品全部评价
                            } else {
                                // 否则 跳到B2C
                                self.init(productId, "B2C", "");
                            }
                        }, () => {
                            self.init(productId, "B2C", "")
                        })
                    } else {
                        self.init(productId, "B2C", "");
                    }
                });//获取门店详情列表
                window.localStorage.mapLocation = mapLocation || "";
            },
            cancel: function (res) {
                // 取消授权
                self.init(productId, "B2C", "");
            },
            fail: function () {
                // 授权失败
                self.init(productId, "B2C", "");
            }
        });

    }

    // 组装分享所需参数
    getDataMap(productDetailData) {
        let dataMap = {
            onMenuShareAppMessage: true,
            onMenuShareTimeline: true,
            title: productDetailData.productNm,
            desc: "您的小伙伴向您推荐了一个好东西,快看!!",
            link: window.location.href.split('#')[0] + "/wap/redirect/product/" + productDetailData.productId + "/" + productDetailData.platformType + "/" + productDetailData.openId + "/" + productDetailData.shopId,
            imgUrl: productDetailData.picture.split(",")[0],
        };
        return dataMap;
    }

    getCarItemQuantity(skuId) {
        let cartItemList = this.props.normalCartState.normalCart.cartItemList || [];
        for (let carItem of cartItemList) {
            if (carItem.skuId === skuId) {
                return carItem.quantity;
            }
        }
        return null;
    }

    openShopMap() {
        const {productDetailData} = this.props.productState;
        let mapLocation = productDetailData.mapLocation || '0,0';
        window.wx.openLocation({
            latitude: parseFloat(mapLocation.split(',')[1]), // 纬度，浮点数，范围为90 ~ -90
            longitude: parseFloat(mapLocation.split(',')[0]), // 经度，浮点数，范围为180 ~ -180。
            name: productDetailData.shopName, // 位置名
            address: productDetailData.shopAddress, // 地址详情说明
            scale: 28, // 地图缩放级别,整形值,范围从1~28。默认为最大
            infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
        });
    }

    getCartTotalProductQuantity() {
        let quantity = 0;
        let items = this.props.normalCartState.normalCart.cartItemList || [];
        for (let item of items) {
            quantity += item.quantity;
        }
        return quantity;
    }

    addToCart(event, actions, skuId, picture) {
        const {openId} = this.props.match.params;
        //购物车图标节点
        let cartIconElement = document.getElementById("cartIcon");
        // 抛物线运动
        parabolaFly(event, cartIconElement, picture);
        //购物车商品增加
        actions.changeItemQuantity(skuId, 'Y', openId);
    }

    shiftTab(currentTab) {
        let anchorName = "";
        if (currentTab === "PRODUCT") {
            anchorName = "productPoint"
        }
        if (currentTab === "DETAIL") {
            anchorName = "detailPoint"
        }
        if (currentTab === "COMMENT") {
            anchorName = "commentPoint"
        }
        // 找到锚点
        let anchorElement = document.getElementById(anchorName);
        // 如果对应id的锚点存在，就跳转到锚点
        if (anchorElement) {
            anchorElement.scrollIntoView({block: 'start', behavior: 'smooth'});
        }

    }

    changeCurrentGrade(gradeLevelType) {
        const {productDetailData, commentPointSearchPage} = this.props.productState;
        this.props.actions.pageProductCommentByGrade(commentPointSearchPage, commentPointSearchPage.page + 1, commentPointSearchPage.size);//通过评价等级查找商品全部评价
        this.props.actions.changeCurrentGrade(gradeLevelType);
    }

    getImg(medicinalTypeCode) {
        switch (medicinalTypeCode) {
            case 'RX':
                return gListRx;
            case 'OTC_A':
                return otcJ;

            case 'OTC_B':
                return otcY;

            case 'DUAL':
                return dualIcon;
            case 'ZYYP':
                return zhongyaoyinpin;

            case 'BJSP':
                return baojianpin;

            case 'SP':
                return shiping;

            case 'ZZH':
                return zhuangzihao;

            case 'Y_YLQX':
                return one1;

            case 'E_YLQX':
                return two2;
            case 'S_YLQX':
                return three3;

            case 'XZH':
                return xiaozihao;

            case 'OTHER':
                return qita;

            default:
                break;
        }
    }

    /**
     * 控制优惠券页面显示
     */
    showCouponModel() {
        let self = this;
        // 直接跳到优惠券列表
        this.props.history.push("/index/receive/coupon/supportReceive");

        /* 暂时屏蔽掉
            // 已登陆
           let couponSwitch = !self.state.couponSwitch;
           if(couponSwitch){
               self.setState({
                   couponModelWidth: "100%",
                   couponTransForm: "translateY(0%)",
                   couponSwitch: couponSwitch, // 开关状态
               });
           }else{
               self.setState({
                   couponTransForm: "translateY(100%)",
                   couponSwitch: couponSwitch, // 开关状态
               });
               setTimeout(function () {
                   self.setState({ couponModelWidth: "0%"})
               },300)
           }*/
    }

    componentDidMount() {
        window.addEventListener('scroll', this.productDetailModuleSwitching);
    }

    componentWillUnmount() {
        //组件卸载时移除下拉监听
        window.removeEventListener('scroll', this.productDetailModuleSwitching);
        //组件卸载时移除商品对象
        this.props.actions.commonSetProductState(types.PRODUCT_DETAIL_DATA, {});
    }

    componentDidUpdate() {

    }

    //下拉监听事件
    productDetailModuleSwitching() {
        if(!document.getElementById("detailPoint")){
            return;
        }
        const self = this;
        let {currentTab} = self.props.productState;

        const scrollTopHigh = document.body.scrollTop || document.documentElement.scrollTop;//屏幕顶部距离文档顶端的偏移值(距离)理解为滑动距离
        const screenHigh = document.body.clientHeight;//屏幕高度
        const detailDivTop = document.getElementById("detailPoint").offsetTop;//详情块元素距离文档顶端的偏移值(距离)
        const shoppingCartDivHigh = document.getElementsByClassName("dt-footer")[0].offsetHeight;//购物车块的高度
        const scrollBottomHigh = scrollTopHigh + screenHigh - shoppingCartDivHigh;//屏幕底部距离页面的高度(理解为某元素的高度需小于该高度,元素才会被用户看到) = 屏幕顶部距离页面高度+ 屏幕长度 -底部购物车这个块


        if (scrollBottomHigh >= detailDivTop) {
            //划进详情块时
            if (currentTab !== 'DETAIL') {
                currentTab = 'DETAIL';
                self.props.actions.shiftProductDetailTab(currentTab);
            }
            return;
        }
        if (scrollBottomHigh < detailDivTop && currentTab !== 'PRODUCT') {
            //划进商品块时
            currentTab = 'PRODUCT';
            self.props.actions.shiftProductDetailTab(currentTab);
        }


    }

    showTip(information) {
        let informationArray = information.split(';');
        let newInformation = '全场商品参与满减活动：\n';
        /* let t = 1;
         for(let i = 0; i < informationArray.length; i++ ){
             newInformation += t+"、"+ informationArray[i] + '\n ';
             ++t;
         }*/
        //   window.successTip(newInformation);
        this.props.actions.showConfirm('全场活动:' + information);
    }

    render() {
        const {openId} = this.props.match.params;
        const {productDetailData, isShowInstructions, currentTab, productComments, gradeLevelType} = this.props.productState;
        const platformType = productDetailData.platformType;
        const productId = productDetailData.productId;
        const productDetailCouponInfoProtocolList = productDetailData.productDetailCouponInfoProtocolList || [];
        const {actions} = this.props;
        let productPicture = productDetailData.picture || "";
        let pictureArr = [];
        if (productPicture.length > 0) {
            pictureArr = productPicture.split(",");
        }

        //价格格式化输出
        let firstSellPrice, secondSellPrice;
        let sellPriceDouble = productDetailData.memberPriceDouble || productDetailData.priceDouble;
        if (sellPriceDouble) {
            const sellPriceDoubles = sellPriceDouble.toFixed(2).split(".");
            firstSellPrice = sellPriceDoubles[0];
            secondSellPrice = sellPriceDoubles[1];
        }

        let quantity = this.getCarItemQuantity(productDetailData.skuId);
        let commentSize = productComments.length;
        return (
            <div className="product-detail" id={"productPoint"}>
                {<div>
                <div className="detail-main">
                    <div className="hold-div-top"/>
                    <div className="dt-nav">
                        <ul>
                            <li><a onClick={() => this.shiftTab("PRODUCT")}
                                   className={currentTab === "PRODUCT" ? "cur" : ""}>商品</a></li>
                            <li><a onClick={() => this.shiftTab("DETAIL")}
                                   className={currentTab === "DETAIL" ? "cur" : ""}>详情</a></li>
                            {productDetailData.medicinalTypeCode !== "RX" &&
                            <li><Link to={'/product/commentPoint/' + productId + '/' + platformType}>评价</Link></li>
                            }
                            <Link to={'/index'} className="index-link">首页</Link>
                        </ul>
                    </div>
                    <div className="dt-box">
                        <Swiper images={pictureArr} videoSource={productDetailData.videoSource}
                                videoFileId={productDetailData.videoFileId}
                                videoFileImg={productDetailData.videoFileImg} videoCode={productDetailData.videoCode}/>

                        <div className="dt-cont">
                            <div className="title">{productDetailData.productNm || ""}</div>
                            <div className="dt-info dt-infoColor">
                                <p>{productDetailData.sellingPoint || ""}</p>
                            </div>
                            <div className="dt-info">
                                <span>规格：{"Y" === productDetailData.isDismantle ? productDetailData.splitSpec : productDetailData.spec || ""}</span>
                                <span>单位：{"Y" === productDetailData.isDismantle ? productDetailData.splitUnit : productDetailData.unit || ""}</span>
                                <p>厂家：{productDetailData.manufacturer || ""}</p>
                            </div>
                            <div className="price">
                                <i>￥</i>{firstSellPrice}<em>.{secondSellPrice || ""}</em>
                                {<img className="rx1" style={{
                                    display: "inline-block",
                                    padding: "0 0.3125rem",
                                    marginLeft: "0.234375rem"
                                }} src={this.getImg(productDetailData.medicinalTypeCode)}/>}
                                {platformType === "O2O" && <span className="the-day">当天达</span>}

                            </div>

                            {/*商品有参加但不是全场参与  可以跳链接*/}
                            {productDetailData.isPartake === "Y" && productDetailData.isAllProductJoin === "N" &&
                            <Link to={'/activity/commentList/' + productDetailData.fullReductionActivityId}>
                                <div className="promotion">{productDetailData.activity}</div>
                            </Link>
                            }
                            {/*商品有参加 并且 全场参与  点击提示窗口*/}
                            {productDetailData.isPartake === "Y" && productDetailData.isAllProductJoin === "Y" &&

                            <div className="promotion" onClick={() => {
                                this.showTip(productDetailData.activity)
                            }}>
                                {productDetailData.activity}</div>
                            }


                            {productDetailCouponInfoProtocolList.length !== 0 &&
                            <div className="dt-box ">
                                <div className="dt-item coupon-item" onClick={() => this.showCouponModel()}>
                                    <a href="javascript:void(0)">
                                        {
                                            productDetailCouponInfoProtocolList.map((couponInfo, index) => {
                                                return (
                                                    <p className="p1" key={index}>
                                                        <span className="sp1"></span>
                                                        {couponInfo.isLimitedUse === "Y" ? "满" + couponInfo.orderFullAmountDouble + "减" + couponInfo.couponAmountDouble : "立减" + couponInfo.couponAmountDouble + "元"}
                                                        <span className="sp2"></span>
                                                    </p>
                                                )
                                            })
                                        }
                                    </a>
                                </div>
                            </div>
                            }


                            <div className="dt-box dt-box-bordertop">

                                <div className="dt-item shop-item">
                                    {platformType === "O2O" &&
                                    <Link to={'/shop/detail/' + productDetailData.shopId}><span
                                        className="elli">{productDetailData.shopName}</span></Link>}
                                    {platformType === "B2C" && <a href="javascript:void(0)"><span
                                        className="elli">{productDetailData.chainName}</span></a>}
                                </div>
                                {platformType === "O2O" &&
                                <div className="dt-item phone-item">
                                    <a href={`tel:` + productDetailData.managerTel}><span
                                        className="elli">{productDetailData.managerTel || ""}</span></a>
                                </div>}
                                {platformType === "O2O" &&
                                <div className="dt-item addr-item">
                                    <a href="javascript:void(0)" onClick={this.openShopMap.bind(this)}><span
                                        className="elli">{productDetailData.shopAddress || ""}</span></a>
                                </div>}
                            </div>
                        </div>
                        {productDetailData.medicinalTypeCode !== "RX" &&
                        <div className="evaluate" onClick={() => this.shiftTab("COMMENT")}>
                            <div className="eva-mt">
                                <div className="eva-hd">用户评价{commentSize > 0 ? "(" + commentSize + ")" : ""}</div>
                                <div className="eva-bd">
                                    <Link to={'/product/commentPoint/' + productId + '/' + platformType}>全部评价</Link>
                                </div>
                            </div>
                            <div className="eva-mc">
                                <ul>
                                    {
                                        productComments.map((comment, index) => {
                                            return (<li key={index}>
                                                <div className="li-mt">
                                                    <div className="pic"><img src={productDetailData.picture || ""}
                                                                              alt=""/></div>
                                                    <StarItem comment={comment}/>
                                                </div>
                                                <div className="li-mc">{comment.content}</div>
                                            </li>)
                                        })
                                    }
                                    {productComments.length === 0 &&
                                    <li className="li-empty">
                                        暂无，购买后来发表评价吧! </li>
                                    }
                                </ul>
                            </div>
                        </div>
                        }
                        <div id="detailPoint">
                            <div className="instructions ">
                                <div className="mt">说明书</div>
                            </div>
                            <div className="part-box">
                                <div className="part-box-item">
                                    <div className="specification">
                                        {productDetailData.instructionsStr ?
                                            <div className="mc"
                                                 dangerouslySetInnerHTML={{__html: productDetailData.instructionsStr}}/>
                                            :
                                            <div className="mc-kong">暂无信息内容~</div>
                                        }

                                    </div>
                                </div>
                            </div>
                            <div className="instructions">
                                <div className="mt">图文详情</div>
                            </div>
                            <div className="part-box">
                                <div className="part-box-item">
                                    <div className="instructions">
                                        {productDetailData.descrStr ?
                                            <div className="mc"
                                                 dangerouslySetInnerHTML={{__html: productDetailData.descrStr}}/>
                                            :
                                            <div className="mc-kong">暂无信息内容~</div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="dt-footer">
                        {productDetailData.medicinalTypeCode !== "RX" && <div>
                            <Link to={'/cart/normalCart'}>
                                <div className={this.getCartTotalProductQuantity() ? "sp-cart have" : "sp-cart"}
                                     id='cartIcon'>
                                    <span>{this.getCartTotalProductQuantity() > 0 &&
                                    <i>{this.getCartTotalProductQuantity()}</i>}</span>
                                </div>
                            </Link>
                            {
                                quantity ?
                                    <div className={quantity ? "quantity open" : "quantity"}>
                                        <a className="minus"
                                           onClick={() => actions.changeItemQuantity(productDetailData.skuId, 'N', openId)}/>
                                        <div className="input-wrap"><input className="num" value={quantity || ''}
                                                                           type="tel"
                                                                           onChange={(event) => actions.modifyItemQuantity(productDetailData.skuId, event.target.value)}/>
                                        </div>
                                        <a className="plus"
                                           onClick={(event) => this.addToCart(event, actions, productDetailData.skuId, productDetailData.picture)}/>
                                    </div>
                                    :
                                    <a className="add-cart"
                                       onClick={(event) => this.addToCart(event, actions, productDetailData.skuId, productDetailData.picture)}>加入购物车</a>
                            }
                        </div>}
                        {productDetailData.medicinalTypeCode === "RX" &&
                        <Link to={'/prescriptionRegister/' + platformType + "/" + productId}
                              className="check-btn">处方登记</Link>}
                    </div>
                    <ParabolaFly/>
                    <div className="hold-div-bottom"/>
                </div>
                {this.state.couponSwitch &&
                <div className="popups" style={{width: this.state.couponModelWidth}}>
                    <div className="popups_mask" onClick={() => this.showCouponModel()}></div>
                    <div className="popups_items" style={{transform: this.state.couponTransForm}}>
                        <div className="coupon_text">优惠劵 <div className="close_pic">
                            <img src={iconDel3} onClick={() => this.showCouponModel()}/>
                        </div>
                        </div>
                        <div className="coupon">
                            <div className="coupon_title">可领取优惠券</div>
                            <div className="nav-cont">
                                {
                                    productDetailCouponInfoProtocolList.map((couponInfo, index) => {
                                        return (
                                            <div className="item item-selected" key={index}>
                                                <div className="mlt"><span>{couponInfo.couponAmountDouble}</span></div>
                                                <p>{couponInfo.couponName}</p>
                                                <span>{couponInfo.effectiveBeginTime} - {couponInfo.effectiveEndTime}</span>
                                                {
                                                    couponInfo.isCanGain === "N" ?
                                                        <div className="soon">
                                                            <img src={yiling}/>
                                                        </div>
                                                        :
                                                        <i className="receive_btn">领取</i>
                                                }
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="carry_out"><a href="javacript:void(0)"
                                                          onClick={() => this.showCouponModel()}>完成</a></div>
                        </div>
                    </div>
                </div>
                }
                <Confirm/>
                </div>}
            </div>
        )
    }
}

ProductDetail.propTypes = {};

ProductDetail.contextTypes = {};

const mapStateToProps = (store, ownProps) => {
    return {
        productState: store.productState,
        normalCartState: store.normalCartState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            getShopDetail,
            getCart,
            getProductDetail,
            commonSetProductState,
            changeItemQuantity,
            modifyItemQuantity,
            changeIsShowInstructions,
            shiftProductDetailTab,
            getAllProductComment,
            pageProductCommentByGrade,
            changeCurrentGrade,
            changeCommentPointSearchPage,
            showConfirm,
        }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);