/**
 * 有货门店
 * @author lcl
 */
// 引入react组件
import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
// 引入css
import "../style/YdyInShopList.css";

import {findYdyPrescriptionShopList} from "../actions/interrogationRecordAction.js";
import {findShopHomeByShopId, setParams, getShopSellClassifyFirstId} from "../../index/actions/indexActions.js";

class YdyInShopList extends Component {

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
        let prescriptionId = this.props.match.params.prescriptionId;
        if (mapLocation) {
            this.props.actions.findYdyPrescriptionShopList(mapLocation, prescriptionId);//获取附近门店列表
        }
    }

    changeLocation(shopId) {
        let {mapLocation} = window.localStorage;
        let params = {sellCategoryId: ''};
        window.localStorage.mapLocation = mapLocation || "";
        this.props.actions.setParams(params);

        //先查询该门店的销售分类 再回调 查询商品
        this.props.actions.getShopSellClassifyFirstId(shopId, (sellCategoryId) => {
            this.props.actions.findShopHomeByShopId(mapLocation, shopId, () => {
                this.props.history.push('/index');
            }, sellCategoryId);
        });

    }


    render() {
        const {ydyInShopList} = this.props.interrogationRecordState;
        let shopList = ydyInShopList || [];

        return (
            <div className={"ydyInShop"}>
                <div className="details-coupon">
                    {shopList.length !== 0 &&
                    <div className="store-list">
                        <div className="store-box">
                            {
                                shopList.filter(shop => shop.isHaveProduct === 'Y',).map((shopDetail, index) => {
                                    return (
                                        <div className="commodity-item" key={index}>
                                            <div className="commodity-name">
                                                <div className="commodity-name-item">{shopDetail.name}</div>
                                                {shopDetail.isNormalOpening === "N" ? <div className="tips">已打样</div> : ""}
                                                {shopDetail.isNormalOpening === "Y" && shopDetail.isRest === "Y" ? <div className="tips">休息中</div> : ""}
                                                {!shopDetail.inShopRange ? <div className="tips">超出配送范围</div> : ""}
                                            </div>
                                            <div className="commodity-content">{shopDetail.address}</div>
                                            <div className="commodity-addressicon">{shopDetail.distanceStr}</div>
                                            <div className="commodity-enter"
                                                 onClick={() => this.changeLocation(shopDetail.shopId)}>进入门店
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            {/*commodity-itemoff不能营业的店的样式*/}
                            {
                                shopList.filter(shop => shop.isHaveProduct === 'N',).map((shopDetail, index) => {
                                    return (
                                        <div className="commodity-item commodity-itemoff" key={index}>

                                            <div className="commodity-name">
                                                <div className="commodity-name-item">{shopDetail.name}</div>
                                                {shopDetail.isNormalOpening === "N" ? <div className="tips">休息中</div> : ""}
                                                {shopDetail.isNormalOpening === "Y" && shopDetail.isRest === "Y" ? <div className="tips">休息中</div> : ""}
                                                {!shopDetail.inShopRange ? <div className="tips">超出配送范围</div> : ""}
                                            </div>
                                            <div className="commodity-content">{shopDetail.address}</div>
                                            <div className="commodity-addressicon">{shopDetail.distanceStr}</div>
                                            <div className="commodity-enter">进入门店</div>
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

YdyInShopList.propTypes = {};

YdyInShopList.contextTypes = {};

// 获取数据
const mapStateToProps = (store, ownProps) => {
    return {interrogationRecordState: store.interrogationRecordState}
};

// 调用 actions 方法
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            findYdyPrescriptionShopList,
            findShopHomeByShopId,
            getShopSellClassifyFirstId,
            setParams
        }, dispatch)
    }
};

// 把仓库数据放在本页面使用
export default connect(mapStateToProps, mapDispatchToProps)(YdyInShopList);