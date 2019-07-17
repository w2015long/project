/**
 * @author olx
 * @date 2018/3/19
 */
//基本组件
import React, {Component} from "react";
//redux
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
//引入私有样式
import "../style/Index.css";
//引入本页面需要用到方法
import {getNearByShopListSort,findShopHomeByShopId,setNearByShopIndex} from "../actions/indexActions.js";
import AutoLoadMore from "../../common/components/AutoLoadMore";
import empty from "../../../media/images/empty.png";
//引入link，用来做页面跳转，实际上它会被渲染成a标签
import {Link} from "react-router-dom";

/**
 * 没有门店的首页,展示附近门店
 */
class SupportDistributionShopList extends Component {

    componentWillMount() {
        this.props.actions.setNearByShopIndex(0);
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {
    }

    loadMoreShopList() {
        const {nearByShopIndex} = this.props.indexState;
        this.props.actions.setNearByShopIndex(Number(nearByShopIndex) + 1);

    }

    render() {
        const nearByShopIndex = this.props.indexState.nearByShopIndex;
        const shopList = this.props.indexState.nearByShopList || [];
        let {mapLocation} = window.localStorage;
        const showIndex = nearByShopIndex * 10;
        const isHaveNextPage = (Number(nearByShopIndex) + 1) * 10 < shopList.length;

        return (
            <div >

                <div className="rim-box " id={"support-distribution-shop-list"}>
                    <div className="rb-mt">周边门店<span>/</span><span>{shopList.length}</span></div>
                    <div className="rb-mc">
                        {shopList.slice(0, isHaveNextPage ? showIndex + 10 : shopList.length).map((shopDetail, index) => {
                            return (
                                <div className="item" key={index} onClick={() => this.props.actions.findShopHomeByShopId(mapLocation,shopDetail.shopId,()=>{},shopDetail.sellCategoryId)}>
                                    <div className="pic">
                                        <a >
                                            <img src={shopDetail.wechatPhoto}/>
                                            {shopDetail.isNormalOpening === "N"?<span>停业中</span>:""}
                                            {shopDetail.isNormalOpening === "Y" &&shopDetail.isRest ==="Y"?<span style={{color: "#fff"}}>休息中</span>:""}
                                        </a></div>
                                    <div className="title elli"><a href="##">{shopDetail.name}</a></div>
                                    <div className="info">区域：{shopDetail.city} </div>
                                    <div className="info">距离：{shopDetail.distanceStr}</div>
                                    <div className="addr-box">
                                        <span>地址</span>
                                        {shopDetail.address}
                                    </div>
                                </div>
                            )
                        })}

                        {/*加载更多*/}
                        <AutoLoadMore container={'support-distribution-shop-list'} loadMoreFunc={this.loadMoreShopList.bind(this)}
                                      isHaveNextPage={isHaveNextPage }/>
                    </div>
                </div>
            </div>

        )
    }
}

SupportDistributionShopList.propTypes = {};

SupportDistributionShopList.contextTypes = {};


const mapStateToProps = (store, ownProps) => {
    return {
        indexState: store.indexState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            //引入方法
            getNearByShopListSort,
            findShopHomeByShopId,
            setNearByShopIndex
        }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SupportDistributionShopList);




