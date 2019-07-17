import React, {Component} from "react";
import {Link} from "react-router-dom";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import "../style/Index.css";
import {initJsSdk} from '../../common/actions/jssdkAction'
import {
    commonSetIndexState,
    findReceiverListByUserId,
    getLoginInfo,
    getProductList,
    getShopDetail,
    setLocation,
    setNearByShop,
    setParams,
    setTip,
    openOrCloseCouponPopup
} from "../actions/indexActions";
import {modifyItemQuantity} from '../../cart/actions/normalCartAction'
import * as types from "../constants/ActionTypes";
import SupportDistributionShopList from "./SupportDistributionShopList";
import IndexProductSearch from "./IndexProductSearch";
import IndexShopProduct from "./IndexShopProduct";
import IndexHead from "./IndexHead";
import ActivityLayer from "./ActivityLayer";
import IndexActivityInlet from "./IndexActivityInlet.js";
import IndexCouponPopup from "./IndexCouponPopup.js";
import Footer from "../../././common/components/Footer";
class Index extends Component {

    componentWillMount() {
        document.title = '首页';
        const self = this;
        this.handleProductSearchInputScroll = this.handleProductSearchInputScroll.bind(this);
        const {shopDetail,loginInfo} = this.props.indexState;
        let {mapLocation, isForce} = window.localStorage;
        const getShopDetail = this.props.actions.getShopDetail;
        //默认每次进门店都定位,但是不改变定位门店
        if(!loginInfo||!loginInfo.shopId){
            this.props.actions.getLoginInfo()
        }

        if (isForce === "Y") {
            window.localStorage.isForce = "N";
            return;
        }

        if(shopDetail && shopDetail.shopId !=null){
            return;
        }

        initJsSdk(
            () => {
                self.getLocation();
            },
            () => {
                self.setLocationToDefaultReciverAddress();
            }
        )

    }

    getLocation() {
        let self = this;
        const getShopDetail = this.props.actions.getShopDetail;//获取门店详情

        window.wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                let newMapLocation = res.longitude + "," + res.latitude;
                getShopDetail(newMapLocation);//获取门店详情列表
                window.localStorage.mapLocation = newMapLocation||"";
            },
            cancel: function (res) {
                self.setLocationToDefaultReciverAddress()
            },
            fail: function () {
                self.setLocationToDefaultReciverAddress()
            }
        });

    }

    setLocationToDefaultReciverAddress() {
        //微信定位失败，使用默认地址作为首页定位地址
        const {receiverList, shopDetail} = this.props.indexState;
        const self = this;
        if (receiverList.length <= 0) {
            this.props.actions.findReceiverListByUserId(()=>{   self.getLocationByDefaultAddress()});//用户地址收货地址列表
        }



    }
    getLocationByDefaultAddress() {

        const {receiverList} = this.props.indexState;
        const getShopDetail = this.props.actions.getShopDetail;//获取门店详情
        let mapLocation = "";
        for (let address of receiverList) {
            if (address.isDefaultAddr === 'Y') {
                mapLocation = address.addrLng + "," + address.addrLat;
                break;
            }
        }
        //有可能地址中没有默认地址,默认取第一个
        if(!mapLocation&&receiverList.length > 0){
            mapLocation = receiverList[0].addrLng + ","+ receiverList[0].addrLat;
        }
        if(!mapLocation){
            window.warningTip("定位失败!请允许网页获取您的定位");
            return;
        }
        window.localStorage.mapLocation = mapLocation||"";
        getShopDetail(mapLocation);

    }

    toBarCodeScan() {
        // 跳转扫码购页面
        this.props.history.push('/scan/barCodeScan');// 转到快速买单
    }

    // 打开优惠券弹窗
    toOpenCouponPopup(){
        this.props.actions.openOrCloseCouponPopup(true);
    }

    // 关闭优惠券弹窗
    toCloseCouponPopup(){
        this.props.actions.openOrCloseCouponPopup(false);
    }

    componentDidMount() {
        const self = this;
        const shopDetail  = this.props.indexState.shopDetail;
        if(!shopDetail){
            document.title = '首页';
        }
        window.addEventListener('scroll', self.handleProductSearchInputScroll);


    }

    componentDidUpdate() {
  }

    componentWillUnmount() {
        const self = this;
        window.removeEventListener('scroll', self.handleProductSearchInputScroll);

    }

    funcCloseTip = (e) => {
        this.props.actions.setTip(false)
    };
    closeActivityLayer = () => {
        window.localStorage.isShowActivityLayer = "N";
        this.props.actions.commonSetIndexState(types.INDEX_SET_DEFAULT_ACTIVITY_STATE, "N")
    };
    render() {
        const indexState = this.props.indexState;
        const {shopDetail, locationName,isStickySearchInput,isShowTip,activityLayerDefaultState,couponPopup} = indexState;
        let {isShowActivityLayer} = window.localStorage;
        const activityLayer = isShowActivityLayer ? isShowActivityLayer : activityLayerDefaultState;
        const history = this.props.history;
        const url = '/product/search/shop';
        const self = this;
        const isShowNearByShop = true;
        const isShowCode = true;
        return (

            <div className="wap-index">
                <div className="index-main" style={{height: "100%"}}>
                    <IndexHead locationName={locationName} history={history} shopDetail={shopDetail}
                               indexShopIsExit={!!shopDetail.shopId} callbackFunc={() => {
                        self.toBarCodeScan()
                    }} isShowNearByShop={isShowNearByShop} isShowCode={isShowCode}/>
                    <IndexProductSearch history={history} searchProductUrl={url}
                                        isStickySearchInput={isStickySearchInput}/>
                    {shopDetail && shopDetail.shopId ? <IndexActivityInlet history={history} callbackOpenCoupon={()=>self.toOpenCouponPopup()} /> :
                        <div style={{"marginTop": "1.59375rem"}}></div>}
                    {/*这个div用来增加样式 如果IndexActivityInlet组件不使用就把这个div去掉*/}
                    {/*<div className="temporary-div" >*/}
                    {/*<IndexShopHead history={history}   shopDetail={shopDetail} isShowTip={isShowTip} funcCloseTip={this.funcCloseTip}/>*/}
                    {/*</div>*/}
                    {shopDetail && shopDetail.shopId ? <IndexShopProduct history={this.props.history}/> :
                        <SupportDistributionShopList history={this.props.history}/>}
                    <Footer state={"index"} history={history}/>
                    {shopDetail && shopDetail.shopId && activityLayer !== "N" &&
                    <ActivityLayer closeActivityLayer={this.closeActivityLayer}/>}
                </div>
                <IndexCouponPopup history={history} couponPopup={couponPopup} callbackCloseCoupon={()=>self.toCloseCouponPopup()} />
            </div>
        )
    }

    handleProductSearchInputScroll() {
        const self = this;
        const indexState = this.props.indexState;
        const {shopDetail,isStickySearchInput,isStickyCatItem} = indexState;
        const high =  document.body.scrollTop||document.documentElement.scrollTop ;
        const shopIsExit = shopDetail && shopDetail.shopId !=null;
        let subtractHigh = 0;
        if(shopIsExit){
            const indexHeadDivBlock = document.getElementsByClassName("indexHeadDivBlock")[0].offsetHeight;
            const indexActivityInletDivBlock = document.getElementsByClassName("indexActivityInletDivBlock")[0].offsetHeight;
           //const indexShopHeadDivBlock = document.getElementsByClassName("indexShopHeadDivBlock")[0].offsetHeight;
            subtractHigh = indexHeadDivBlock+indexActivityInletDivBlock -26;
        }
        if (high > 44 && isStickySearchInput==="N") {
            self.props.actions.commonSetIndexState(types.INDEX_SET_IS_STICKY_SEARCH_INPUT, "Y")
        }
        if (high <= 47 && isStickySearchInput==="Y") {
            self.props.actions.commonSetIndexState(types.INDEX_SET_IS_STICKY_SEARCH_INPUT, "N")
        }
        if (high > subtractHigh && isStickyCatItem==="N") {
            self.props.actions.commonSetIndexState(types.INDEX_SET_IS_STICKY_CAT_ITEM, "Y")
        }
        if (high <= subtractHigh && isStickyCatItem==="Y") {
            self.props.actions.commonSetIndexState(types.INDEX_SET_IS_STICKY_CAT_ITEM, "N")
        }
    }


}

Index.propTypes = {};

Index.contextTypes = {};

const mapStateToProps = (store, ownProps) => {
    return {
        indexState: store.indexState,
        normalCartState: store.normalCartState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            getShopDetail,
            setParams,
            setTip,
            setNearByShop,
            findReceiverListByUserId,
            setLocation,
            commonSetIndexState,
            getLoginInfo,
            getProductList,
            modifyItemQuantity,
            openOrCloseCouponPopup
        }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);




