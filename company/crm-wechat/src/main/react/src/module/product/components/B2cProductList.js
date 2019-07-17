import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Link} from "react-router-dom";
import "../style/B2CProduct.css"

import {listMgrCategory, pageB2cProduct} from "../actions/productActions";
import {changeItemQuantity, getCart, modifyItemQuantity} from "../../cart/actions/normalCartAction";
import {parabolaFly} from '../../common/actions/parabolaFlyAction'

import ParabolaFly from "../../common/components/ParabolaFly";
import AutoLoadMore from "../../../module/common/components/AutoLoadMore";
import Img from "../../common/components/Img.js"

/**
 * b2c商品列表
 */
class B2cProductList extends Component {
    state = {
        showSearchBox: true,//是否展示搜索框
        showMgrCategory: false,//是否展示管理分类弹层
        selectedFirstMgrCategory:{},//已选择的一级管理分类
        touchY: 0//触摸点对应的y坐标
    };

    componentWillMount() {
        document.title = '商品列表';
        const {b2cProductSearchParams} = this.props.productState;

        if (this.props.location.param) {
            b2cProductSearchParams.keywords = this.props.location.param.keyword;
            b2cProductSearchParams.mgrCategoryCode = this.props.location.param.mgrCategoryCode;
        }

        //加载商品信息
        this.reloadProduct(b2cProductSearchParams);
        //加载管理分类
        this.props.actions.listMgrCategory();
        //获取购物车
        this.props.actions.getCart();
        //触摸事件
        document.addEventListener("touchmove", this.touchMoveHandle.bind(this), false);
        document.addEventListener("touchstart", this.touchStartHandle.bind(this), false);
    }

    componentWillUnmount() {
        document.removeEventListener("touchmove", this.touchMoveHandle, false);
        document.removeEventListener("touchstart", this.touchStartHandle, false);
    }

    touchMoveHandle(event) {
        let touch = event.touches[0];
        if (touch.pageY - this.state.touchY > 0) {
            this.setState({showSearchBox: true});
        } else {
            this.setState({showSearchBox: false});
        }
    }

    touchStartHandle(event) {
        let touch = event.touches[0];
        this.setState({touchY: touch.pageY});
    }

    //刷新商品列表
    reloadProduct(params) {
        let {b2cProductPage} = this.props.productState;
        this.props.actions.pageB2cProduct(params, 0, b2cProductPage.size, []);
    }

    //加载更多商品
    loadMoreProduct = () => {
        let {b2cProductSearchParams, b2cProductPage} = this.props.productState;
        this.props.actions.pageB2cProduct(b2cProductSearchParams, b2cProductPage.page + 1, b2cProductPage.size, b2cProductPage.products);
    }

    //显示或隐藏管理分类
    showOrHideMgrCategory() {
        this.setState({showMgrCategory: !this.state.showMgrCategory})
    }

    rendOrderByClass(b2cProductSearchParams, key){
        if (b2cProductSearchParams.orderBy !== key) {
            return 'comprehensive';
        }
        if (key === ''){
            return 'active comprehensive'
        }
        if (b2cProductSearchParams.sortOrder === 'asc'){
            return 'active up-arrow';
        }else {
            return ' down-arrow';
        }
    }

    //切换排序
    changeOrderBy(orderBy) {
        const {b2cProductSearchParams} = this.props.productState;

        if (!orderBy) {
            b2cProductSearchParams.sortOrder = "";
            b2cProductSearchParams.orderBy = "";
        } else if (orderBy === b2cProductSearchParams.orderBy) {
            b2cProductSearchParams.sortOrder = b2cProductSearchParams.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            b2cProductSearchParams.sortOrder = "asc";
            b2cProductSearchParams.orderBy = orderBy;
        }
        this.reloadProduct(b2cProductSearchParams);
    }

    //选择一级管理分类
    selectFirstMgrCategory(category){
        this.setState({selectedFirstMgrCategory:category})
    }

    //根据管理分类查询商品
    searchProductByCategory(category) {
        const {b2cProductSearchParams} = this.props.productState;
        this.refs.categoryTitle.innerText = category.title || "全部分类";
        b2cProductSearchParams.mgrCategoryCode = category.categoryCode || '';
        this.reloadProduct(b2cProductSearchParams);
        this.setState({showMgrCategory:false})
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

    getCartTotalProductQuantity() {
        let quantity = 0;
        let items = this.props.normalCartState.normalCart.cartItemList || [];
        for (let item of items) {
            quantity += item.quantity;
        }
        return quantity;
    }

    addToCart(event, actions, skuId, picture) {
        //购物车图标节点
        let cartIconElement = document.getElementById("cartIcon");
        // 抛物线运动
        parabolaFly(event, cartIconElement, picture);
        //购物车商品增加
        actions.changeItemQuantity(skuId, 'Y', '');
    }

    render() {
        const {b2cProductSearchParams, b2cProductPage, mgrCategories} = this.props.productState;
        let normalCart = this.props.normalCartState.normalCart;
        const {actions} = this.props;
        const products = b2cProductPage.products || [];
        const isHaveNextPage = b2cProductPage.size * (b2cProductPage.page + 1) < b2cProductPage.recordsFiltered;
        let cartTotalProductQuantity = this.getCartTotalProductQuantity();
        let selectedFirstMgrCategory = this.state.selectedFirstMgrCategory;//选中的一级分类
        let secondMgrCategories = selectedFirstMgrCategory.children || mgrCategories;//一级分类对应的二级分类
        return (
            <div className={'b2c-product'}>
                <div className="index-search-main">
                    <div className="mt" style={{display:this.state.showSearchBox ? 'block':'none'}}>
                        <div className="search-box">
                            <Link to={'/product/search/b2c'}>
                                <input type="text" value={b2cProductSearchParams.keywords} readOnly
                                       placeholder="请输入疾病、商品名称" ref={'searchWord'}/>
                            </Link>
                            <a className="search-btn"/>
                        </div>
                    </div>
                    <div className="mc">
                        <div className="search-list">
                            <div className="list-mt" style={{top:this.state.showSearchBox ? "1.28rem":"0"}}>
                                {/*active 控制弹出层是否展开*/}
                                <dl className={this.state.showMgrCategory ? "classify active" : "classify"}>
                                    <dt onClick={() => this.showOrHideMgrCategory()}><span ref={'categoryTitle'}>全部分类</span></dt>
                                    <dd className="classify-box">
                                        <div className="cb-nav">
                                            <ul>
                                                <li><a onClick={()=>this.searchProductByCategory({})}>全部分类</a></li>
                                                {
                                                    mgrCategories.map(category=>{
                                                        return (
                                                            <li className={selectedFirstMgrCategory.categoryCode === category.categoryCode ? 'cur':''} key={category.categoryCode}><a onClick={()=>this.selectFirstMgrCategory(category)}>{category.title}</a></li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        </div>
                                        <div className="cb-cont">
                                            <div className="cb-item">
                                                <dl><dd><a onClick={()=>this.searchProductByCategory(selectedFirstMgrCategory)}>所有{selectedFirstMgrCategory.title || '分类'}</a></dd></dl>
                                                {
                                                    secondMgrCategories.map(category=>{
                                                        let children = category.children || [];
                                                        return(
                                                            <dl key={category.categoryCode}>
                                                                <dt><a onClick={()=>this.searchProductByCategory(category)}>{category.title}</a></dt>
                                                                <dd>
                                                                    {
                                                                        children.map(child=>{
                                                                            return <a onClick={()=>this.searchProductByCategory(child)} key={child.categoryCode}>{child.title}</a>
                                                                        })
                                                                    }
                                                                </dd>
                                                            </dl>
                                                        )
                                                    })
                                                }

                                            </div>
                                        </div>
                                    </dd>
                                </dl>
                                <dl className={this.rendOrderByClass(b2cProductSearchParams, '')} onClick={()=>this.changeOrderBy('')}>
                                    <dt><span>综合</span></dt>
                                </dl>
                                <dl className={this.rendOrderByClass(b2cProductSearchParams, 'price')} onClick={()=>this.changeOrderBy('price')}>
                                    <dt><span>价格</span></dt>
                                </dl>
                                <dl className={this.rendOrderByClass(b2cProductSearchParams, 'sell_quantity')} onClick={()=>this.changeOrderBy('sell_quantity')}>
                                    <dt><span>销量</span></dt>
                                </dl>
                            </div>

                            {/*遮罩层*/}
                            <div className="mask-layer"
                                 style={{display: this.state.showMgrCategory ? 'block' : 'none'}}/>

                            {
                                products.length === 0 ?
                                    <div className="result-empty">
                                        <span>非常抱歉，没有查到到相关商品</span>
                                    </div>
                                    :
                                    <div className="list-mc" id="b2cProductList">
                                        {
                                            products.map(product => {
                                                let quantity = this.getCarItemQuantity(product.skuId);
                                                const sellPriceDouble = product.memberPriceDouble || product.priceDouble;
                                                const sellPriceDoubles = sellPriceDouble.toFixed(2).split(".");
                                                const firstSellPrice = sellPriceDoubles[0];
                                                const secondSellPrice = sellPriceDoubles[1];
                                                return (
                                                    <div className="item" key={product.productId}>
                                                        <Link to={'/product/detail/' + product.productId + '/' + product.platformType}>
                                                            <div className="pic">
                                                                <span>
                                                                    <Img src={product.picture} alt={product.productNm} platformType={product.platformType}/>
                                                                </span>
                                                            </div>
                                                            <span className="title">{product.productNm}</span>
                                                            <span>规格：{product.spec ? product.spec : '--'}</span>
                                                            <div className="price">
                                                                <i>￥</i>{firstSellPrice}
                                                                <span>{"." + secondSellPrice}</span>
                                                            </div>
                                                        </Link>
                                                        {
                                                            product.medicinalTypeCode !== "RX" ?
                                                            <div
                                                                className={quantity !== null ? "quantity open" : "quantity"}>
                                                                <a className="minus"
                                                                   onClick={() => actions.changeItemQuantity(product.skuId, 'N')}/>
                                                                <div className="input-wrap">
                                                                    <input className="num"
                                                                           value={quantity || ''}
                                                                           type="tel"
                                                                           onChange={(event) => actions.modifyItemQuantity(product.skuId, event.target.value)}/>
                                                                </div>
                                                                <a className="plus"
                                                                   onClick={(event) => this.addToCart(event, actions, product.skuId, product.picture)}/>
                                                            </div>
                                                                :
                                                           <Link to={'/prescriptionRegister/'+product.platformType+"/"+product.productId} className="check-btn">处方登记</Link>
                                                        }

                                                    </div>
                                                )
                                            })
                                        }
                                        <AutoLoadMore container={'b2cProductList'} isHaveNextPage={isHaveNextPage}
                                                      loadMoreFunc={this.loadMoreProduct}/>
                                    </div>
                            }
                        </div>
                    </div>

                    {/*存在商品时添加have class*/}
                    <Link to={'/cart/normalCart'}>
                        <div className={cartTotalProductQuantity > 0 ? "sp-cart have" : "sp-cart"}>
                            <div className="cart-box" id='cartIcon'><span>{cartTotalProductQuantity}</span></div>
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

B2cProductList.propTypes = {};
B2cProductList.contextTypes = {};

const mapStateToProps = (store, ownProps) => {
    return {
        productState: store.productState,
        normalCartState: store.normalCartState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            pageB2cProduct,
            listMgrCategory,
            getCart,
            changeItemQuantity,
            modifyItemQuantity
        }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(B2cProductList);