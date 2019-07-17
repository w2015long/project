/**
 * @author olx
 * @date 2018/3/28
 */

import React, {Component} from 'react';
import '../style/NearByShop.css'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import EmptyPage from "../../common/components/EmptyPage";
import {findShopHomeByShopId, getNearByShopListSort, setNearByShopIndex,setParams,getShopSellClassifyFirstId} from "../actions/indexActions.js";

/**
 * 首页有门店时才展示附近门店
 */
class NearByShop extends Component {
    componentWillMount() {
        document.title = '附近门店';
        let {mapLocation} = window.localStorage;
        if (mapLocation) {
            this.props.actions.getNearByShopListSort(mapLocation);//获取附近门店列表
        }
        this.props.actions.setNearByShopIndex(0);
    }



    render() {



        const shopList = this.props.indexState.nearByShopList || [];
        return (
            <div>
            { shopList.length === 0 && <EmptyPage emptyTipText={'暂无附近门店,请返回首页重新选择地址'}/>}
            { shopList.length !== 0 && <div style={{fontSize: " 12px"}}>
                    {shopList.filter(shop => shop.inShopRange).map((shopDetail,index)=>{
                        return (<div className="nearby-shop-main" key={index}>
                            <div className="item">
                            <a onClick={() => shopDetail.isNormalOpening?this.changeLocation( shopDetail.shopId):"" }>
                                <div className="pic"><img  src={shopDetail.wechatPhoto}  alt=""/>
                                    {shopDetail.isNormalOpening === "N"?<span>停业中</span>:""}
                                    {shopDetail.isNormalOpening === "Y" &&shopDetail.isRest ==="Y"?<span>休息中</span>:""}
                                </div>
                                <p className="name">{shopDetail.name}</p>
                                <span>区域：{shopDetail.city}  </span>
                                <span>距离：{shopDetail.distanceStr}</span>
                                <div className="addr">
                                    <i>地址：</i>
                                    {shopDetail.address}
                                </div>
                            </a>
                        </div></div>)
                    })}

                {shopList.filter(shop => !shop.inShopRange).length  !== 0 && <div className={shopList.filter(shop => shop.inShopRange).length  !== 0 ?"nearby-shop-main not-in":"nearby-shop-main "}>
                   <h5>不在配送范围商家</h5>
                    {shopList.filter(shop => !shop.inShopRange).map((shopDetail,index)=>{
                        return(<div className="item" key={index}>
                            <a onClick={() => this.changeLocation( shopDetail.shopId) }>
                                <div className="pic"><img  src={shopDetail.wechatPhoto}  alt=""/>
                                    {shopDetail.isNormalOpening === "N"?<span>停业中</span>:""}
                                    {shopDetail.isNormalOpening === "Y" &&shopDetail.isRest ==="Y"?<span>休息中</span>:""}
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
}

const mapStateToProps = (store, ownProps) => {
    return {
        indexState: store.indexState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            findShopHomeByShopId,
            setNearByShopIndex,
            getNearByShopListSort,
            setParams,
            getShopSellClassifyFirstId
        }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(NearByShop);




