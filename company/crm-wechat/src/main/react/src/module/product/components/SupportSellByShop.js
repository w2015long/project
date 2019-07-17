/**
 * @author kwy
 * @date 2018/11/28
 */
import React, {Component} from 'react';
import '../style/SupportSellByShop.css'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import EmptyPage from "../../common/components/EmptyPage";
import {findShopHomeByShopId, getNearByShopListSort, setNearByShopIndex} from "../../index/actions/indexActions.js";
import {findSupportShopIdsByProductId,} from "../actions/productActions";
import {initJsSdk} from '../../common/actions/jssdkAction'
/**
 * 首页有门店时才展示附近门店
 */
class NearByShop extends Component {
    componentWillMount() {
        document.title = '支持门店';
        let receiverListLocation = "";
        const {receiverList} = this.props.indexState;
        let {mapLocation} = window.localStorage;

        const productId = this.props.match.params.productId;
        this.props.actions.findSupportShopIdsByProductId(productId);
        if (receiverList.length > 0) {
            receiverListLocation = receiverList[0].addrLng + receiverList[0].addrLat
        }
        const locationPoint = mapLocation || receiverListLocation;
        if (locationPoint) {
            this.props.actions.getNearByShopListSort(locationPoint);//获取附近门店列表
            this.props.actions.setNearByShopIndex(0);
            return;
        }
        this.wxGetLocation(locationPoint);
    }
    //todo:kwy 抽离定位 弄成组件
    wxGetLocation(locationPoint) {
        const self = this;
        initJsSdk(
            () => {
                window.wx.getLocation({
                    type: 'gcj02',
                    success: function (res) {
                        let mapLocation = res.longitude + "," + res.latitude;
                        window.localStorage.mapLocation = mapLocation || "";
                        self.props.actions.getNearByShopListSort(mapLocation);//获取附近门店列表
                        self.props.actions.setNearByShopIndex(0);
                    },
                    cancel: function (res) {
                    },
                    fail: function () {
                    }
                });

            },
            () => {
            }
        )
    }

    /*
     * 筛选出支持该优惠券的门店
     */
    getSupportShopList() {
        let shopList = this.props.indexState.nearByShopList;
        if (shopList && shopList.length === 0) {
            return [];
        }

        // 找到支持该商品的门店id
        let shopIds = this.props.productState.supportShopIds;
        let supportShopList = [];
        for (let i = 0; i < shopList.length; i++) {
            let shop = shopList[i];
            for (let j = 0; j < shopIds.length; j++) {
                if (shop.shopId === shopIds[j]) {
                    supportShopList.push(shop);
                }
            }
        }
        return supportShopList;
    }

    render() {

        let {mapLocation} = window.localStorage;
        const shopList = this.getSupportShopList();
        return (
            <div>
                {shopList.length === 0 && <EmptyPage emptyTipText={'未找到可用此优惠券的附近门店，请返回首页重新选择地址'}/>}
                {shopList.length !== 0 && <div style={{fontSize: " 12px"}}>
                    {shopList.filter(shop => shop.inShopRange).map((shopDetail, index) => {
                        return (<div className="nearby-shop-main">
                            <div className="item" key={index}>
                                <a onClick={() => shopDetail.isNormalOpening ? this.changeLocation(mapLocation, shopDetail.shopId) : ""}>
                                    <div className="pic"><img src={shopDetail.wechatPhoto} alt=""/>
                                        {shopDetail.isNormalOpening === "N" ? <span>停业中</span> : ""}
                                        {shopDetail.isNormalOpening === "Y" && shopDetail.isRest === "Y" ?
                                            <span>休息中</span> : ""}
                                    </div>
                                    <p className="name">{shopDetail.name}</p>
                                    <span>区域：{shopDetail.city}  </span>
                                    <span>距离：{shopDetail.distanceStr}</span>
                                    <div className="addr">
                                        <i>地址：</i>
                                        {shopDetail.address}
                                    </div>
                                </a>
                            </div>
                        </div>)
                    })}

                    {shopList.filter(shop => !shop.inShopRange).length !== 0 && <div
                        className={shopList.filter(shop => shop.inShopRange).length !== 0 ? "nearby-shop-main not-in" : "nearby-shop-main "}>
                        <h5>不在配送范围商家</h5>
                        {shopList.filter(shop => !shop.inShopRange).map((shopDetail, index) => {
                            return (<div className="item" key={index}>
                                <a onClick={() => this.changeLocation(mapLocation, shopDetail.shopId)}>
                                    <div className="pic"><img src={shopDetail.wechatPhoto} alt=""/>
                                        {shopDetail.isNormalOpening === "N" ? <span>停业中</span> : ""}
                                        {shopDetail.isNormalOpening === "Y" && shopDetail.isRest === "Y" ?
                                            <span>休息中</span> : ""}
                                    </div>
                                    <p className="name">{shopDetail.name}</p>
                                    <span>区域：{shopDetail.city}  </span>
                                    <span>距离：{shopDetail.distanceStr}</span>
                                    <div className="addr">
                                        <i>地址：</i>
                                        {shopDetail.address}
                                    </div>
                                </a>
                            </div>)
                        })}
                    </div>}

                </div>}

            </div>

        )
    }

    changeLocation(location, shopId) {
        const productId = this.props.match.params.productId;
        this.props.actions.findShopHomeByShopId(location, shopId,()=>{this.props.history.push('/product/detail/' + productId + '/O2O/' + shopId)});
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        indexState: store.indexState,
        productState: store.productState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            findShopHomeByShopId,
            setNearByShopIndex,
            getNearByShopListSort,
            findSupportShopIdsByProductId
        }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(NearByShop);




