/**
 * 有货门店
 * @author lcl
 */
// 引入react组件
import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
// 引入css
import "../style/couponApplyShopList.css";
import {findShopHomeByShopId, setParams, getShopSellClassifyFirstId} from "../../index/actions/indexActions.js";
import {findCouponApplyShopList} from "../actions/couponApplyShopAction.js";
import EmptyPage from "../../common/components/EmptyPage";

class CouponApplyShopList extends Component {

    //组件作用域内的一个组件状态，react的核心
    state = {};

    //构造方法，基本没有使用 作用页面标题
    constructor(prosp) {
        super(prosp);
        document.title = '选择门店';
    }

    //在组件首次渲染之前调用，这时候DOM还没有，而且整个生命周期中只会被执行一次，在这里面setState是无效的
    componentWillMount() {
        let {mapLocation} = window.localStorage;
        let couponId = this.props.match.params.couponId;
        if (mapLocation) {
            this.props.actions.findCouponApplyShopList(couponId, mapLocation);//获取附近门店列表
        }
    }

    // 切换门店
    changeLocation(shopId) {
        let {mapLocation} = window.localStorage;
        let params = {sellCategoryId: ''};
        window.localStorage.mapLocation = mapLocation || "";
        this.props.actions.setParams(params);

        // 先查询该门店的销售分类 再回调 查询商品
        this.props.actions.getShopSellClassifyFirstId(shopId, (sellCategoryId) => {
            this.props.actions.findShopHomeByShopId(mapLocation, shopId, () => {
                this.props.history.goBack();
            }, sellCategoryId);
        });

    }


    render() {
        const {applyShopList} = this.props.couponApplyShopState;
        let shopList = applyShopList || [];

        return (

            <div className="coupon_apply_shop_list">
                <div className="details-coupon">
                    {shopList.length === 0 ? <EmptyPage/> :
                        <div className="store-list">
                            <div className="store-box">
                                {
                                    shopList.map((shopDetail, index) => {
                                        let shopShow = true;
                                        if (shopDetail.isNormalOpening === "N" || (shopDetail.isNormalOpening === "Y" && shopDetail.isRest === "Y")) {
                                            shopShow = false;
                                        }
                                        return (
                                            <div className={shopShow?"commodity-item":"commodity-item commodity-itemoff"} key={index}>
                                                <div className="commodity-name">
                                                    <div className="commodity-name-item">{shopDetail.name}</div>
                                                    {shopDetail.isNormalOpening === "N" ?
                                                        <div className="tips">已打样</div> : ""}
                                                    {shopDetail.isNormalOpening === "Y" && shopDetail.isRest === "Y" ?
                                                        <div className="tips">休息中</div> : ""}
                                                    {!shopDetail.inShopRange ? <div className="tips">超出配送范围</div> : ""}
                                                </div>
                                                <div className="commodity-content">{shopDetail.address}</div>
                                                <div className="commodity-addressicon">{shopDetail.distanceStr}</div>
                                                {
                                                    shopShow?
                                                        <div className="commodity-enter"
                                                                   onClick={() => this.changeLocation(shopDetail.shopId)}>进入门店
                                                        </div>
                                                        :
                                                        <div className="commodity-enter">进入门店</div>
                                                }

                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>

                    }
                </div>
            </div>

        );
    }
}

CouponApplyShopList.propTypes = {};

CouponApplyShopList.contextTypes = {};

// 获取数据
const mapStateToProps = (store, ownProps) => {
    return {couponApplyShopState: store.couponReceiveListState}
};

// 调用 actions 方法
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            findCouponApplyShopList,
            findShopHomeByShopId,
            getShopSellClassifyFirstId,
            setParams
        }, dispatch)
    }
};

// 把仓库数据放在本页面使用
export default connect(mapStateToProps, mapDispatchToProps)(CouponApplyShopList);