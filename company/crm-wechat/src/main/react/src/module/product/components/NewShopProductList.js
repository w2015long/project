/**
 * @author  lcl
 * @date 2019/5/22
 * 微商城商品搜索 - 优惠券
 */
import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import "../style/NewProduct.css";
import {Link} from "react-router-dom";
import {
    newChangeShopProductSearchParams, newPageShopProduct, wapFindCouponProductEmployDetails,
    changeCouponDistanceEmployMoney, changeCouponEmployAllMoney
} from "../../product/actions/productActions";
import {parabolaFly} from '../../common/actions/parabolaFlyAction'
import ParabolaFly from "../../common/components/ParabolaFly";
import {changeItemQuantity, getCart, modifyItemQuantity,selectAll,setItemSelect} from "../../cart/actions/normalCartAction";

import AutoLoadMore from "../../../module/common/components/AutoLoadMore";

import Img from "../../common/components/Img.js"
import EmptyPage from "../../common/components/EmptyPage";
import rightPhoto from  "../../../media/images/xiangyou.png";
import clearBtn from "../../../media/images/guanbi.png";

class NewShopProductList extends Component {

    //组件作用域内的一个组件状态，react的核心
    state = {
        showSearchBox: true,                 // 显示搜索
        showSellCategory: false,            // 显示销售分类
        touchY: 0
    };

    //在组件首次渲染之前调用，这时候DOM还没有，而且整个生命周期中只会被执行一次，在这里面setState是无效的
    componentWillMount() {
        document.title = '商品列表';
        const {newShopProductSearchParams} = this.props.productState;          // 获得默认搜索信息
        let couponId = this.props.match.params.couponId;
        newShopProductSearchParams.couponId = couponId;
        // 加载商品信息
        this.reloadProduct(newShopProductSearchParams);
        // 查询该优惠券支持门店，满减金额
        this.props.actions.wapFindCouponProductEmployDetails(couponId);
        // 获取购物车
        this.props.actions.getCart();
        setTimeout(() => {
            this.dealCouponMoney();
        }, 500)
        // 触摸事件
        document.addEventListener("touchmove", this.touchMoveHandle.bind(this), false);
        document.addEventListener("touchstart", this.touchStartHandle.bind(this), false);

    }

    //在组件首次渲染之后调用，这时候DOM节点已经首次加载完成。整个生命周期只会执行一次
    componentDidMount() {

    }

    //每次准备更新渲染之前调用
    componentWillUnmount() {
        document.removeEventListener("touchmove", this.touchMoveHandle, false);
        document.removeEventListener("touchstart", this.touchStartHandle, false);

        // 组件由浏览器返回操作导致卸载操作,则设置购物车商品为不选择状态
        if( this.props.history.action ==="POP"){
            this.props.actions.selectAll("N");
        }
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
        let {newShopProductPage} = this.props.productState;
        this.props.actions.newPageShopProduct(params, 0, newShopProductPage.size, []);
    }

    //加载更多商品
    loadMoreProduct = () => {
        let {newShopProductSearchParams, newShopProductPage} = this.props.productState;
        this.props.actions.newPageShopProduct(newShopProductSearchParams, newShopProductPage.page + 1, newShopProductPage.size, newShopProductPage.products);
    };

    // 搜索样式
    rendOrderByClass(params, key) {
        if (params.orderBy !== key) {
            return 'comprehensive';
        }
        if (key === '') {
            return 'active comprehensive'
        }
        if (params.sortOrder === 'asc') {
            return 'active comprehensive up-arrow';
        } else {
            return 'active comprehensive down-arrow';
        }
    }

    //切换排序
    changeOrderBy(orderBy) {
        const {newShopProductSearchParams} = this.props.productState;

        if (!orderBy) {
            newShopProductSearchParams.sortOrder = "";
            newShopProductSearchParams.orderBy = "";
        } else if (orderBy === newShopProductSearchParams.orderBy) {
            newShopProductSearchParams.sortOrder = newShopProductSearchParams.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            newShopProductSearchParams.sortOrder = "asc";
            newShopProductSearchParams.orderBy = orderBy;
        }
        this.props.actions.newChangeShopProductSearchParams(newShopProductSearchParams);
        this.reloadProduct(newShopProductSearchParams);
    }

    // 获取某个商品在购物车中的数量
    getCarItemQuantity(skuId) {
        let cartItemList = this.props.normalCartState.normalCart.cartItemList || [];
        for (let carItem of cartItemList) {
            if (carItem.skuId === skuId) {
                return carItem.quantity;
            }
        }
        return null;
    }

    // 统计购物车商品总数量
    getCartTotalProductQuantity() {
        let quantity = 0;
        let items = this.props.normalCartState.normalCart.cartItemList || [];
        for (let item of items) {
            quantity += item.quantity;
        }
        return quantity;
    }

    // 加入购物车
    addToCart(event, actions, skuId, picture) {
        // 购物车图标节点
        let cartIconElement = document.getElementById("cartIconShopList");
        // 抛物线运动
        parabolaFly(event, cartIconElement, picture);
        //  购物车商品增加 设置为选中之后
        actions.changeItemQuantity(skuId, 'Y', '',() => actions.setItemSelect(skuId))
        setTimeout(() => {
            this.dealCouponMoney();
        }, 500)

    }

    // 处理优惠金额
    dealCouponMoney() {
        const {normalCart} = this.props.normalCartState;
        const {couponProductDetails} = this.props.productState;
        // 购物车金额
        let productTotalAmountDouble = normalCart.productTotalAmountDouble;
        let couponDetails = couponProductDetails;

        if (couponDetails.isLimitedUse === "Y") {
            // 使用条件金额
            let orderFullAmountDouble = couponDetails.orderFullAmountDouble;

            // 满减
            if (couponDetails.couponType === "FULL_REDUCE") {
                // 改变的金额Str
                let changeMoneyStr = "";
                let changeMoney = 0;
                // 商品总金额
                let productMoney = 0;
                if(productTotalAmountDouble !== 0){
                    if (productTotalAmountDouble >= orderFullAmountDouble) {
                        productMoney = productTotalAmountDouble - couponDetails.couponAmountDouble < 0 ? 0.00 : productTotalAmountDouble - couponDetails.couponAmountDouble;
                        changeMoney = productTotalAmountDouble - couponDetails.couponAmountDouble < 0 ? productTotalAmountDouble : couponDetails.couponAmountDouble;
                        changeMoneyStr = "已满足优惠，使用该券可立减￥ " + changeMoney.toFixed(2) + " 元";
                    } else {
                        productMoney = productTotalAmountDouble;
                        changeMoneyStr = "再满" + (orderFullAmountDouble - productTotalAmountDouble).toFixed(2) + " 元可使用";
                    }
                }
                this.props.actions.changeCouponDistanceEmployMoney(changeMoneyStr);
                this.props.actions.changeCouponEmployAllMoney(productMoney);
            }

            // 折扣
            if (couponDetails.couponType === "DISCOUNT") {
                // 折扣封顶金额
                let maxCouponDiscountAmountDouble = couponDetails.maxCouponDiscountAmountDouble;
                let discount = maxCouponDiscountAmountDouble * couponDetails.couponDiscount;
                // 改变的折扣Str
                let changeMoneyStr = "";
                // 商品总金额
                let productMoney = 0;

                if(productTotalAmountDouble !== 0){
                    if (productTotalAmountDouble >= orderFullAmountDouble) {
                        if (discount > maxCouponDiscountAmountDouble) {
                            productMoney = maxCouponDiscountAmountDouble;
                        } else {
                            productMoney = discount;
                        }
                        changeMoneyStr = "已满足优惠，使用该券立打 " + couponDetails.couponDiscount + " 折";
                    } else {
                        productMoney = productTotalAmountDouble;
                        changeMoneyStr = "再满" + (orderFullAmountDouble - productTotalAmountDouble).toFixed(2) + " 元可使用"
                    }
                }
                this.props.actions.changeCouponDistanceEmployMoney(changeMoneyStr);
                this.props.actions.changeCouponEmployAllMoney(productMoney);
            }
        } else {
            let productMoney = 0;
            // 改变的折扣Str
            let changeMoneyStr = "";
            if (couponDetails.couponType === "FULL_REDUCE") {
                productMoney = (productTotalAmountDouble - couponDetails.couponAmountDouble) < 0 ? 0 : (productTotalAmountDouble - couponDetails.couponAmountDouble);
                changeMoneyStr = "使用该无限制优惠券可立减￥  " + ((productTotalAmountDouble - couponDetails.couponAmountDouble) < 0 ? productTotalAmountDouble.toFixed(2) : couponDetails.couponAmountDouble.toFixed(2)) + " 元";
            }
            if (couponDetails.couponType === "DISCOUNT") {
                let disMoney = couponDetails.maxCouponDiscountAmountDouble * couponDetails.couponDiscount;
                let reduceMoney = couponDetails.maxCouponDiscountAmountDouble >= disMoney ? couponDetails.maxCouponDiscountAmountDouble : disMoney;
                productMoney = (productTotalAmountDouble - reduceMoney) < 0 ? 0 : (productTotalAmountDouble - reduceMoney);
                changeMoneyStr = "使用该无限制优惠券立打 " + couponDetails.couponDiscount + " 折";
            }
            this.props.actions.changeCouponDistanceEmployMoney(changeMoneyStr);
            this.props.actions.changeCouponEmployAllMoney(productMoney);

        }

    }

    // 返回优惠券详情
    toCouponDetails(){
        this.props.history.goBack();
    }

    // 更改所搜参数，重新搜索
    toChangeProductSearch(e){
        let {newShopProductSearchParams} = this.props.productState;
        newShopProductSearchParams.keywords = e.target.value.trim();

        this.reloadProduct(newShopProductSearchParams);
    }

    // 清除搜索
    clearSearch(){
        let {newShopProductSearchParams} = this.props.productState;
        newShopProductSearchParams.keywords = "";

        document.getElementById("searchId").value = "";
    }

    render() {
        const {newShopProductPage, newShopProductSearchParams,couponProductDetails, couponReduceMoneyStr, productSumMoney} = this.props.productState;
        const {normalCart} = this.props.normalCartState;
        const {actions} = this.props;
        const history = this.props.history;
        const isHaveNextPage = newShopProductPage.size * (newShopProductPage.page + 1) < newShopProductPage.recordsFiltered;
        const couponId = this.props.match.params.couponId;
        return (
            <div className={"new_shop_product_list"}>
                <ParabolaFly/>
                <div className="applicable-main">
                    <div className="search-for" style={{display: this.state.showSearchBox ? 'block' : 'none'}}>
                        <div className="item">
                            <input type="text" id={"searchId"}  onKeyDown={(e)=>this.toChangeProductSearch(e)} placeholder="结果中搜索" ref={'searchWord'}/>
                            <div className="close">
                                <img src={clearBtn} alt="" onClick={event => this.clearSearch()}/>
                            </div>
                        </div>
                        <div className="cancel" onClick={event => this.toCouponDetails()}>取消</div>
                    </div>

                    <div className="nav-box">
                        <div className={this.rendOrderByClass(newShopProductSearchParams, '')}
                             onClick={() => this.changeOrderBy("")}><span>综合</span>
                        </div>
                        <div className={this.rendOrderByClass(newShopProductSearchParams, 'price')}
                             onClick={() => this.changeOrderBy("price")}><span>价格</span>
                        </div>
                    </div>

                    {
                        newShopProductPage.products.length === 0 ? <EmptyPage/>
                            :
                            <div className="product-list" id={"shopProductList"}>
                                <div className="gd-module">
                                    {
                                        newShopProductPage.products.map((product, index) => {
                                            let quantity = this.getCarItemQuantity(product.skuId);
                                            const sellPriceDouble = product.memberPriceDouble || product.priceDouble;
                                            return (
                                                <div className="item" key={product.productId}>
                                                    <Link to={'/product/detail/' + product.productId + '/O2O'}>
                                                        <div className="pic-box"><Img src={product.picture}
                                                                                      alt={product.productNm}
                                                                                      platformType={"O2O"}/></div>
                                                        <div className="top-cell">
                                                            <div className="product-text">{product.productNm}</div>
                                                            <div className="desc-text">规格：{product.spec}</div>
                                                        </div>
                                                        <div className="price">
                                                            ￥<span>{product.memberPriceDouble ? product.memberPriceDouble.toFixed(2) : sellPriceDouble.toFixed(2)}</span>
                                                        </div>
                                                    </Link>
                                                    {
                                                        product.medicinalTypeCode !== "RX" &&

                                                        <div
                                                            className={quantity !== null ? "quantity open" : "quantity"}>
                                                            <a className="plus"
                                                               onClick={(event) => this.addToCart(event, actions, product.skuId, product.picture)}/>
                                                        </div>
                                                    }

                                                </div>
                                            )
                                        })

                                    }
                                </div>
                                <AutoLoadMore container={'shopProductList'} isHaveNextPage={isHaveNextPage}
                                              loadMoreFunc={this.loadMoreProduct}/>
                            </div>
                    }

                    {couponProductDetails.isEmployShopCoupon === "N" &&
                    <div className="error-tips">
                        <div className="error-tips-l">"{couponProductDetails.shopName}"不支持使用此券</div>
                        <Link className="error-tips-r" to={"/coupon/apply/shop/list/"+ couponId}>切换门店 <span><img src={rightPhoto} alt=""/></span></Link>
                    </div>
                    }

                    <div className="settlement">
                        <div className="settlement-l "id={"cartIconShopList"}>
                            <h5>合计:<span>￥{normalCart.productTotalAmountDouble}</span></h5>
                            <p>{couponReduceMoneyStr}</p>
                        </div>
                        <div className="settlement-r"  onClick={() => history.push('/cart/normalCart')}>去购物车</div>
                    </div>
                </div>
            </div>
        )
    }
}


NewShopProductList.propTypes = {};

NewShopProductList.contextTypes = {};

const mapStateToProps = (store, ownProps) => {
    return {
        productState: store.productState,
        normalCartState: store.normalCartState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            newChangeShopProductSearchParams,
            newPageShopProduct,
            getCart,
            changeItemQuantity,
            modifyItemQuantity,
            wapFindCouponProductEmployDetails,
            changeCouponDistanceEmployMoney,
            changeCouponEmployAllMoney,
            selectAll,
            setItemSelect
        }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(NewShopProductList);