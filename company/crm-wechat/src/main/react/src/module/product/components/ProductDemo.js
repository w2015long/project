/**
 * @author chencheng
 * @date 2018/8/14
 */

// 引入react组件
import React, {Component} from "react";
// 引入css
import '../style/ProductDemo.css';
// 引入方法
import {pageProduct} from "../actions/productDemoActions";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
//引入了购物车的方法
import {changeItemQuantity, getCart, modifyItemQuantity} from "../../cart/actions/normalCartAction";
//引入抛物线动画
import {parabolaFly} from '../../common/actions/parabolaFlyAction'
import ParabolaFly from "../../common/components/ParabolaFly";
//引入link，用来做页面跳转，实际上它会被渲染成a标签
import {Link} from "react-router-dom";
//自动加载下一页
import AutoLoadMore from "../../../module/common/components/AutoLoadMore";

//禁止使用jQuery！！！！

class ProductDemo extends Component{

    //组件作用域内的一个组件状态，react的核心
    state={

    };

    //构造方法，基本没有使用
    constructor(prosp){
        super(prosp);
        document.title='商品列表';
    }

    //在组件首次渲染之前调用，这时候DOM还没有，而且整个生命周期中只会被执行一次，在这里面setState是无效的
    componentWillMount(){

    }

    //在组件首次渲染之后调用，这时候DOM节点已经首次加载完成。整个生命周期只会执行一次
    componentDidMount(){
        this.reloadProduct();//加载商品
        this.props.actions.getCart();//初始化购物车数据
    }

    //每次准备更新渲染之前调用
    componentWillUpdate(){

    }

    //每次准备更新渲染之后调用
    componentDidUpdate(){

    }

    //销毁组件的时候调用
    componentWillUnmount(){

    }

    //加载商品列表
    reloadProduct(){
        let {productPage} = this.props.productDemoSate;
        this.props.actions.pageProduct(0, productPage.size);
    }

    loadMoreFunc(){
        let {productPage} = this.props.productDemoSate;
        this.props.actions.pageProduct(productPage.page + 1, productPage.size, productPage.products);
    }

    onQuantityChange(skuId, quantity){
        this.props.actions.modifyItemQuantity(skuId, quantity);
    }

    //统计购物车商品总数量
    getCartTotalQuantity(cartItems){
        let quantity = 0;
        cartItems.forEach(item=>{
            quantity += item.quantity;
        });
        return quantity;
    }

    //获取某个商品在购物车中的数量
    getCarItemQuantity( cartItemList, skuId) {
        for(let carItem of cartItemList){
            if(carItem.skuId ===  skuId){
                return carItem.quantity;
            }
        }
        return 0;
    }

    addToCart(event, actions,  skuId, picture){
        //购物车图标节点
        let cartIconElement = this.refs.cartIcon;//获取真实的DOM节点
        // 抛物线运动
        parabolaFly(event, cartIconElement, picture);
        //购物车商品增加
        actions.changeItemQuantity( skuId, 'Y', '');
    }

    goToSearch() {
        let {productSearchParams} = this.props.productDemoSate;

        this.props.history.push('/product/search/b2c/'+productSearchParams.keywords)
    }
    render(){
        let {productPage, productSearchParams} = this.props.productDemoSate;
        let {normalCart} = this.props.normalCartState;
        let cartTotalQuantity = this.getCartTotalQuantity(normalCart.cartItemList);
        let products =  productPage.products || [];
        const actions = this.props.actions;
        const isHaveNextPage = productPage.size * (productPage.page + 1) < productPage.recordsFiltered;

        return(
            <div className={'product-dome'}>
                <div className="index-search-main">
                    <div className="mt">
                        <div className="search-box" onClick={()=>this.goToSearch()}>
                            <input type="text" placeholder="请输入疾病、商品名称" value={productSearchParams.keywords} readOnly/>
                            <a href="javascript:;" className="search-btn"/>
                            <a href="javascript:;" className="del-btn"/>
                        </div>
                    </div>
                    <div className="mc">
                        <div className="search-list">
                            <div className="list-mt">
                                {/*active 控制弹出层是否展开*/}
                                <dl className="classify">
                                    <dt><span>全部分类</span></dt>
                                    <dd className="classify-box">
                                        <div className="cb-nav">
                                            <ul>
                                                <li className="cur"><a href="javascript:;">中西药</a></li>
                                                <li><a href="javascript:;">家庭用药</a></li>
                                                <li><a href="javascript:;">滋补保健</a></li>
                                                <li><a href="javascript:;">成人用品</a></li>
                                                <li><a href="javascript:;">专科用药</a></li>
                                                <li><a href="javascript:;">医疗器械</a></li>
                                            </ul>
                                        </div>
                                        <div className="cb-cont">
                                            <div className="cb-item">
                                                <dl>
                                                    <dt><a href="javascript:;">感冒发烧</a></dt>
                                                    <dd>
                                                        <a href="javascript:;">头痛发烧</a>
                                                        <a href="javascript:;">腹泻腹痛</a>
                                                        <a href="javascript:;">口腔溃疡</a>
                                                        <a href="javascript:;">发烧肚痛</a>
                                                        <a href="javascript:;">头晕耳鸣</a>
                                                        <a href="javascript:;">口腔溃疡</a>
                                                        <a href="javascript:;">益生菌</a>
                                                        <a href="javascript:;">头痛头晕呕吐发烧</a>
                                                    </dd>
                                                </dl>
                                            </div>
                                            <div className="cb-item"></div>
                                        </div>
                                    </dd>
                                </dl>
                                <dl className="comprehensive active">
                                    <dt><span>综合</span></dt>
                                </dl>
                                <dl className="price">
                                    <dt><span>价格</span></dt>
                                    <dd>
                                        <div className="dd-item">
                                            <a href="javascript:;">
                                                <span>不限</span>
                                                <i>260</i>
                                            </a>
                                        </div>
                                        <div className="dd-item">
                                            <a href="javascript:;">
                                                <span>今日特惠</span>
                                                <i>86</i>
                                            </a>
                                        </div>
                                        <div className="dd-item">
                                            <a href="javascript:;">
                                                <span>保健食品</span>
                                                <i>43</i>
                                            </a>
                                        </div>
                                        <div className="dd-item">
                                            <a href="javascript:;">
                                                <span>OTC药品</span>
                                                <i>56</i>
                                            </a>
                                        </div>
                                        <div className="dd-item">
                                            <a href="javascript:;">
                                                <span>医疗器械</span>
                                                <i>126</i>
                                            </a>
                                        </div>
                                        <div className="dd-item">
                                            <a href="javascript:;">
                                                <span>计生用品</span>
                                                <i>320</i>
                                            </a>
                                        </div>
                                    </dd>
                                </dl>
                                <dl className="comprehensive">
                                    <dt><span>销量</span></dt>
                                </dl>

                            </div>
                            {/*遮罩层*/}
                            <div className="mask-layer" style={{display:'none'}}></div>

                            <div className="list-mc" id={'productDemoList'}>
                                {
                                    // 只能写表达式
                                    products.map(product=>{
                                        let quantity = this.getCarItemQuantity(normalCart.cartItemList, product.skuId);
                                       return(
                                           <div className="item" key={product.skuId}>
                                               <div className="pic"><a href="javascript:;"><img src={product.picture} alt=""/><span
                                                   className="arrive bg-green">当天达</span></a></div>
                                               <a href="javascript:;" className="title">{product.productNm}</a>
                                               <span>规格：{product.spec}</span>
                                               <div className="price">
                                                   <i>￥</i>{product.memberPriceDouble || product.priceDouble}
                                               </div>
                                               <div className={quantity > 0 ? "quantity open" : "quantity"}>
                                                   <a href="javascript:;" className="minus" onClick={() => actions.changeItemQuantity(product.skuId, 'N')}/>
                                                   <div className="input-wrap"><input className="num" value={quantity} max="200" type="tel" onChange={(e)=>{this.onQuantityChange(product.skuId, e.target.value)}}/>
                                                   </div>
                                                   <a href="javascript:;" className="plus " onClick={(event) => this.addToCart(event, actions, product.skuId, product.picture)}/>
                                               </div>
                                           </div>
                                       )
                                    })
                                }
                            </div>
                            <AutoLoadMore container={'productDemoList'} isHaveNextPage = {isHaveNextPage} loadMoreFunc={this.loadMoreFunc.bind(this)}/>
                        </div>
                    </div>
                    {/*有商品时添加have class控制样式*/}
                    <div className={cartTotalQuantity > 0 ? "sp-cart have" :"sp-cart" }>
                        <div className="cart-box" ref={'cartIcon'}><span id={'cartNum'}>{cartTotalQuantity}</span></div>
                        <div className="sub-total">
                            <span>小计</span><span>￥4000.00</span>
                            <p>另需配送费￥10.00</p>
                        </div>
                    </div>
                </div>

                <ParabolaFly/>
            </div>
        );
    }

}

ProductDemo.propTypes = {};

ProductDemo.contextTypes = {};

const mapStateToProps = (store, ownProps) => {
    return {
        productDemoSate:store.productDemoSate,
        normalCartState:store.normalCartState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({pageProduct, getCart, changeItemQuantity, modifyItemQuantity}, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDemo);