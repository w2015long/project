import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Link} from "react-router-dom";
import "../style/Product.css";
import {changeShopProductSearchParams, listSellCategoryToCount, pageShopProduct} from "../actions/productActions";
import {changeItemQuantity, getCart, modifyItemQuantity} from "../../cart/actions/normalCartAction";
import {parabolaFly} from '../../common/actions/parabolaFlyAction'

import ParabolaFly from "../../common/components/ParabolaFly";
import AutoLoadMore from "../../../module/common/components/AutoLoadMore";
import Img from "../../common/components/Img.js"

//商品列表
class ShopProductList extends Component {
    state = {
        showSearchBox:true,
        showSellCategory: false,
        touchY:0
    };

    componentWillMount() {
        document.title = '商品列表';
        const {shopProductSearchParams} = this.props.productState;
        if(this.props.location.param){
            shopProductSearchParams.keywords = this.props.location.param.keyword;
        }

        //加载商品信息
        this.reloadProduct(shopProductSearchParams);
        //加载销售分类信息
        /*this.props.actions.listSellCategoryToCount(shopProductSearchParams.keywords, 'Y');*/
        //获取购物车
        this.props.actions.getCart();
        //触摸事件
        document.addEventListener("touchmove", this.touchMoveHandle.bind(this), false);
        document.addEventListener("touchstart", this.touchStartHandle.bind(this), false);
    }

    touchMoveHandle(event) {
        let touch = event.touches[0];
        if (touch.pageY - this.state.touchY > 0) {
            this.setState({showSearchBox:true});
        } else {
            this.setState({showSearchBox:false});
        }
    }

    touchStartHandle(event) {
        let touch = event.touches[0];
        this.setState({touchY:touch.pageY});
    }

    componentWillUnmount() {
        document.removeEventListener("touchmove", this.touchMoveHandle, false);
        document.removeEventListener("touchstart", this.touchStartHandle, false);
    }

    componentDidUpdate(){
    }


    //刷新商品列表
    reloadProduct(params) {
        let {shopProductPage} = this.props.productState;
        this.props.actions.pageShopProduct(params, 0, shopProductPage.size, []);
    }

    //加载更多商品
    loadMoreProduct = () => {
        let {shopProductSearchParams, shopProductPage} = this.props.productState;
        this.props.actions.pageShopProduct(shopProductSearchParams, shopProductPage.page + 1, shopProductPage.size, shopProductPage.products);
    };

    //切换排序
    changeOrderBy(orderBy) {
        const {shopProductSearchParams} = this.props.productState;

        if (!orderBy) {
            shopProductSearchParams.sortOrder = "";
            shopProductSearchParams.orderBy = "";
        }else if (orderBy === shopProductSearchParams.orderBy) {
            shopProductSearchParams.sortOrder = shopProductSearchParams.sortOrder === 'asc' ? 'desc':'asc';
        }else {
            shopProductSearchParams.sortOrder = "asc";
            shopProductSearchParams.orderBy = orderBy;
        }
        this.props.actions.changeShopProductSearchParams(shopProductSearchParams);
        this.reloadProduct(shopProductSearchParams);
    }

    changeCategory(val,title) {
        const {shopProductSearchParams} = this.props.productState;
        this.refs.categoryTitle.innerText =  title ? title : "分类";
        shopProductSearchParams.sellCategoryId = val;
        this.props.actions.changeShopProductSearchParams(shopProductSearchParams);
        this.reloadProduct(shopProductSearchParams);
    }

    showOrHideCategory(){
        this.setState({showSellCategory: !this.state.showSellCategory})
    }

    //跳转商品搜索列表
    toProductSearch() {
        this.props.history.goBack();
    }

    rendOrderByClass(params, key){
        if (params.orderBy !== key) {
            return 'comprehensive';
        }
        if (key === ''){
            return 'active comprehensive'
        }
        if (params.sortOrder === 'asc'){
            return 'active up-arrow';
        }else {
            return 'active down-arrow';
        }
    }

    getCarItemQuantity( skuId) {
        let cartItemList = this.props.normalCartState.normalCart.cartItemList || [];
        for(let carItem of cartItemList){
            if(carItem.skuId ===  skuId){
                return carItem.quantity;
            }
        }
        return null;
    }

    getCartTotalProductQuantity(){
        let quantity = 0;
        let items = this.props.normalCartState.normalCart.cartItemList || [];
        for(let item of items){
            quantity += item.quantity;
        }
        return quantity;
    }

    addToCart(event, actions,  skuId, picture){
        //购物车图标节点
        let cartIconElement = document.getElementById("cartIcon");
        // 抛物线运动
        parabolaFly(event, cartIconElement, picture);
        //购物车商品增加
        actions.changeItemQuantity( skuId, 'Y', '');
    }

    getCategoryTotal(sellCategories){
        let total = 0;
        for (let category of sellCategories) {
            total += category.total;
        }
        return total;
    }
    render() {
        const {shopProductPage,sellCategories,shopProductSearchParams} = this.props.productState;
        const {normalCart} = this.props.normalCartState;
        const {actions} = this.props;
        const isHaveNextPage = shopProductPage.size * (shopProductPage.page + 1) < shopProductPage.recordsFiltered;
        return (
            <div className="shop-product">
                <div className="index-search-main">
                    <div className="mt" style={{display:this.state.showSearchBox ? 'block':'none'}}>
                        <div className="search-box search-result">
                            <span className="search-btn"/>
                            <input type="text" value={shopProductSearchParams.keywords} readOnly onClick={()=>this.toProductSearch()} placeholder="商品名|通用名|厂家|品牌|69码|商品编码" ref={'searchWord'}/>
                            <a  className="search-tex">搜索</a>
                        </div>
                    </div>
                    <div className="mc">
                        <div className="search-list">
                            <div className="list-mt" style={{top:this.state.showSearchBox ? "1.28rem":"0"}}>
                                <dl className={this.rendOrderByClass(shopProductSearchParams, '')} onClick={()=>this.changeOrderBy("")}>
                                    <dt><span>综合</span></dt>
                                </dl>
                                <dl className={this.rendOrderByClass(shopProductSearchParams, 'price')} onClick={()=>this.changeOrderBy("price")}>
                                    <dt><span>价格</span></dt>
                                </dl>
                                {/* <dl ref={'category'}
                                    className={this.state.showSellCategory ? "up-arrow active price" : "down-arrow"}
                                    onClick={(e) => this.showOrHideCategory(e)}>
                                    <dt><span ref={'categoryTitle'}>分类</span></dt>
                                    <dd ref={'categoryDiv'}>
                                        <div className={shopProductSearchParams.sellCategoryId === "" ? 'dd-item cur' : 'dd-item'}>
                                            <a onClick={() => this.changeCategory("","")}>
                                                <span>不限</span>
                                                <i>{this.getCategoryTotal(sellCategories)}</i>
                                            </a>
                                        </div>
                                        {
                                            sellCategories.map(category => {
                                                return (
                                                    <div key={category.sellCategoryId} className={shopProductSearchParams.sellCategoryId === category.sellCategoryId ? 'dd-item cur' : 'dd-item'}>
                                                        <a onClick={() => this.changeCategory(category.sellCategoryId,category.title)}>
                                                            <span>{category.title}</span>
                                                            <i>{category.total}</i>
                                                        </a>
                                                    </div>
                                                )
                                            })
                                        }
                                    </dd>
                                </dl>*/}
                            </div>

                            {/*遮罩层*/}
                            <div className="mask-layer"
                                 style={{display: this.state.showSellCategory ? 'block' : 'none'}}/>

                            {
                                shopProductPage.products.length === 0 ?
                                    <div className="result-empty">
                                        <span>非常抱歉，没有查到到相关商品</span>
                                    </div>
                                    :
                                    <div className="main" id="shopProductList">
                                        {
                                            shopProductPage.products.map((product,index) => {
                                                let quantity = this.getCarItemQuantity(product. skuId);
                                                const sellPriceDouble = product.memberPriceDouble || product.priceDouble;
                                                const sellPriceDoubles = sellPriceDouble.toFixed(2).split(".");
                                                const firstSellPrice = sellPriceDoubles[0];
                                                const secondSellPrice = sellPriceDoubles[1];

                                                return (
                                                    <div className="list-item item" key={product.productId}>
                                                        <Link to={'/product/detail/' + product.productId + '/O2O'}>
                                                            <div className="pic">
                                                                <span>
                                                                    <Img src={product.picture} alt={product.productNm} platformType={"O2O"}/>
                                                                </span>
                                                            </div>
                                                            <a href="javascript:void(0)"
                                                               className="title">{product.productNm}</a>
                                                            <span
                                                                className="elli">规格/单位: {product.spec ? product.spec : '--'}/{product.unit ? product.unit : '--'}</span>
                                                            <span
                                                                className="elli">厂家: {product.manufacturer != null ? product.manufacturer : ''}</span>
                                                            <div className="price">
                                                                <i>￥</i>{product.memberPriceDouble ? product.memberPriceDouble.toFixed(1) : sellPriceDouble.toFixed(1)}
                                                            </div>
                                                        </Link>
                                                        {/*<div className="volume">月销量<span>{product.sellQuantity}</span></div>*/}
                                                        {
                                                            product.medicinalTypeCode !== "RX" &&
                                                            <div
                                                                className={quantity !== null ? "quantity open" : "quantity"}>
                                                                <a className="minus"
                                                                   onClick={() => actions.changeItemQuantity(product.skuId, 'N', '')}/>
                                                                <div className="input-wrap"><input className="num"
                                                                                                   value={quantity || ''}
                                                                                                   type="tel"
                                                                                                   onChange={(event) => actions.modifyItemQuantity(product.skuId, event.target.value)}/>
                                                                </div>
                                                                <a className="plus"
                                                                   onClick={(event) => this.addToCart(event, actions, product.skuId, product.picture)}/>
                                                            </div>
                                                        }
                                                    </div>

                                                )
                                            })
                                        }
                                        <AutoLoadMore container={'shopProductList'} isHaveNextPage={isHaveNextPage}
                                                      loadMoreFunc={this.loadMoreProduct}/>
                                    </div>
                            }
                        </div>
                    </div>
                    <Link to={'/cart/normalCart'}>
                        <div className={this.getCartTotalProductQuantity() > 0 ? "sp-cart have" : "sp-cart"}>
                            <div className="cart-box" id='cartIcon'><span>{this.getCartTotalProductQuantity()}</span></div>
                            <div className="sub-total">
                                <span>小计</span><span>￥{normalCart.productTotalAmountDouble}</span>
                            </div>
                        </div>
                    </Link>
                </div>

                <ParabolaFly/>
            </div>
        )
    }
}

ShopProductList.propTypes = {};

ShopProductList.contextTypes = {};

const mapStateToProps = (store, ownProps) => {
    return {
        productState: store.productState,
        normalCartState:store.normalCartState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            getCart,
            pageShopProduct,
            listSellCategoryToCount,
            changeShopProductSearchParams,
            changeItemQuantity,
            modifyItemQuantity
        }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopProductList);