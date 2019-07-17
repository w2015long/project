import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
//引入私有样式
import "../style/Index.css";
import SellCatItem from "./SellCatItem";
import {getProductList, setParams, setTip} from "../actions/indexActions";

import ProductItem from "./ProductItem";
import {changeItemQuantity, modifyItemQuantity} from "../../cart/actions/normalCartAction";

/**
 * 有门店的首页,展示门店详情,商品列表
 */
class IndexShopProduct extends Component {

    componentWillMount() {
        window.scrollTo(0,0);//定位到顶部
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {
    }

    setSearchCategoryId(id) {
        const {productPage} = this.props.indexState;
        // const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        // if (scrollTop > 176) {
        //     document.body.scrollTop = 176;
        // }

        this.props.actions.setParams({sellCategoryId: id});//获取商品列表
        this.props.actions.getProductList({sellCategoryId: id}, 0, productPage.size);//获取商品列表
    }

    loadMoreData = () => {
        const {params, productPage} = this.props.indexState;
        this.props.actions.setParams({page: productPage.page + 1});//获取商品列表
        this.props.actions.getProductList(params, productPage.page + 1, productPage.size, productPage.data);

    };
    toProductDetail = (url) => {
        const history = this.props.history;
        history.push(url);
    };

    render() {
        const indexState = this.props.indexState;
        const {normalCart} = this.props.normalCartState;
        const {shopDetail, productPage, params,isStickyCatItem,loginInfo} = indexState;
        const wapPrdSellCatProtocols = shopDetail.wapPrdSellCatProtocols || [];
        const lastPage = productPage.size * (productPage.page + 1) < productPage.recordsFiltered;
        const actions = this.props.actions;
        return (


                    <div className="shop" style={{height: "100%"}} >
                        <SellCatItem isStickyCatItem={isStickyCatItem} sellCategoryId={params.sellCategoryId} weChatSellCatProtocols={wapPrdSellCatProtocols} onclickFunc={(sellCategoryId) => {this.setSearchCategoryId(sellCategoryId)}}/>
                        {
                            wapPrdSellCatProtocols.length > 0 && <ProductItem isLogin={!!loginInfo.memberId} container={'index-product-list'}
                                                                              firstSellCategoryId={wapPrdSellCatProtocols.length > 0 ? wapPrdSellCatProtocols[0].sellCategoryId : ''}
                                                                              sellCategoryId={params.sellCategoryId} loadMoreFunc={this.loadMoreData}
                                                                              isHaveNextPage={shopDetail.shopId ? lastPage : false}
                                                                              toProductDetail={url => this.toProductDetail(url)} productPage={productPage}
                                                                              normalCart={normalCart} changeItemQuantity={this.props.actions.changeItemQuantity}
                                                                              modifyItemQuantity={this.props.actions.modifyItemQuantity}
                                                                              getProductList={actions.getProductList}
                                                                              shopId={shopDetail.shopId}
                                                                              params={params}/>
                        }

                    </div>


        )
    }
}


const mapStateToProps = (store, ownProps) => {
    return {
        indexState: store.indexState,
        normalCartState: store.normalCartState,
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            //引入方法
            setTip,
            setParams,
            getProductList,
            changeItemQuantity,
            modifyItemQuantity
        }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(IndexShopProduct);
