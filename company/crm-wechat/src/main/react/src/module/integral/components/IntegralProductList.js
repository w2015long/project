/**
 * @author chencheng
 * @date 2018/4/2
 * 积分商品列表
 */
import React, {Component} from "react";
import {Link} from "react-router-dom";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import AutoLoadMore from "../../common/components/AutoLoadMore";
import EmptyPage from "../../common/components/EmptyPage";

import "../style/IntegralProductList.css";
import {
    getMemberIntegral,
    pageIntegralProduct,
    updateSelectedIntegralProducts
} from "../actions/integralProductActions";

class IntegralProductList extends Component {

    componentWillMount(){
        document.title = "兑换礼品";
    }

    componentDidMount() {
        this.props.actions.getMemberIntegral();
        this.pageIntegralProduct();
    }

    pageIntegralProduct() {
        const {page, size, content} = this.props.integralProductState.integralProductPage;
        this.props.actions.pageIntegralProduct(page + 1, size, content);
    }

    //统计已选择的积分商品的总积分
    countTotalIntegralBySelected(selectedIntegralProducts) {
        let totalIntegral = 0;
        for (let item of selectedIntegralProducts) {
            if (isNaN(item.quantity)){
                continue;
            }
            totalIntegral += item.quantity * item.integralPrice;
        }
        return totalIntegral;
    }

    //获取某个积分商品的已选择数量
    getSelectedQuantity(integralProductId) {
        const selectedIntegralProducts = this.props.integralProductState.selectedIntegralProducts || [];
        for (let item of selectedIntegralProducts) {
            if (item.integralProductId === integralProductId) {
                return item.quantity;
            }
        }
        return null;
    }


    //商品数量添加
    productQuantityAdd(product) {
        let selectedIntegralProducts = this.props.integralProductState.selectedIntegralProducts || [];
        selectedIntegralProducts = window.objDeepCopy(selectedIntegralProducts);//创建一个新的对象进行操作
        let selectedProduct = null;
        for (let item of selectedIntegralProducts) {
            if (item.integralProductId === product.integralProductId) {
                selectedProduct = item;
                break;
            }
        }
        if (null == selectedProduct) {
            selectedProduct = Object.assign({}, product, {quantity: 0});
            selectedIntegralProducts.push(selectedProduct);
        }
        //数量加1
        if (isNaN(selectedProduct.quantity)){
            selectedProduct.quantity = 1;
        }else {
            selectedProduct.quantity++;
        }
        //检查积分是否足够
        let totalIntegral = this.countTotalIntegralBySelected(selectedIntegralProducts);
        let myIntegral = this.props.integralProductState.myIntegral;
        if (totalIntegral > myIntegral) {
            window.warningTip('积分不足');
            return;
        }
        //检查库存是否足够
        if (selectedProduct.quantity > product.num){
            window.warningTip('库存不足');
            return;
        }
        this.props.actions.updateSelectedIntegralProducts(selectedIntegralProducts);
    }

    //商品数量减少
    productQuantitySub(product) {
        let selectedIntegralProducts = this.props.integralProductState.selectedIntegralProducts || [];
        selectedIntegralProducts = window.objDeepCopy(selectedIntegralProducts);//创建一个新的对象进行操作

        for (let index = 0, len = selectedIntegralProducts.length; index < len; index++) {
            let item = selectedIntegralProducts[index];
            if (item.integralProductId === product.integralProductId) {
                if (isNaN(item.quantity)){//数量错误直接移除
                    selectedIntegralProducts.splice(index, 1);
                }else {
                    item.quantity--;
                    if (item.quantity < 1) {//少于1件直接移除
                        selectedIntegralProducts.splice(index, 1);
                    }
                }

                this.props.actions.updateSelectedIntegralProducts(selectedIntegralProducts);
                break;
            }
        }
    }

    //商品数量手动改变
    productQuantityChange(product, event) {
        let quantity = event.target.value;

        let selectedIntegralProducts = this.props.integralProductState.selectedIntegralProducts || [];
        selectedIntegralProducts = window.objDeepCopy(selectedIntegralProducts);//创建一个新的对象进行操作

        let selectedProduct = null;
        for (let item of selectedIntegralProducts) {
            if (item.integralProductId === product.integralProductId) {
                selectedProduct = item;
                break;
            }
        }
        if (null == selectedProduct) {
            return;
        }

        selectedProduct.quantity = quantity;
        this.props.actions.updateSelectedIntegralProducts(selectedIntegralProducts);
    }

    //todo chencheng：后续优化一下逻辑，判断有点多
    //商品数量失去焦点
    productQuantityBlur(product, event) {
        //查找对应商品
        let selectedIntegralProducts = this.props.integralProductState.selectedIntegralProducts || [];
        selectedIntegralProducts = window.objDeepCopy(selectedIntegralProducts);//创建一个新的对象进行操作

        let selectedProduct = null;
        for (let item of selectedIntegralProducts) {
            if (item.integralProductId === product.integralProductId) {
                selectedProduct = item;
                break;
            }
        }
        if (null == selectedProduct) {
            return;
        }

        //判断格式、数量
        let quantity = event.target.value;
        if (isNaN(quantity)){
            window.warningTip('请输入正确的数量');
            selectedProduct.quantity = 1;
            this.props.actions.updateSelectedIntegralProducts(selectedIntegralProducts);
            return;
        }else {
            quantity = parseInt(quantity, 10);
            if (quantity < 1){
                window.warningTip('请输入正确的数量');
                selectedProduct.quantity = 1;
                this.props.actions.updateSelectedIntegralProducts(selectedIntegralProducts);
                return;
            }
        }

        //检查积分是否足够
        selectedProduct.quantity = quantity;
        let totalIntegral = this.countTotalIntegralBySelected(selectedIntegralProducts);
        let myIntegral = this.props.integralProductState.myIntegral;
        if (totalIntegral > myIntegral) {
            window.warningTip('积分不足');
            selectedProduct.quantity = 1;
            this.props.actions.updateSelectedIntegralProducts(selectedIntegralProducts);
            return;
        }

        //检查库存是否足够
        if (quantity > product.num){
            window.warningTip('库存不足');
            selectedProduct.quantity = product.num;
            this.props.actions.updateSelectedIntegralProducts(selectedIntegralProducts);
            return;
        }

        selectedProduct.quantity = quantity;
        this.props.actions.updateSelectedIntegralProducts(selectedIntegralProducts);
    }

    render() {
        const {myIntegral, integralProductPage, selectedIntegralProducts} = this.props.integralProductState;
        const products = integralProductPage.content || [];
        const isHaveNextPage = (integralProductPage.page + 1) * (integralProductPage.size) < integralProductPage.total;
        const totalIntegral = this.countTotalIntegralBySelected(selectedIntegralProducts);
        return (
            <div className="integral-product-list">
                <div className="hold-div-top"/>
                <div className="mt">
                    <span>我的积分</span>
                    <p>{myIntegral}</p>
                    <Link to="/integral/order/list" >我的礼品</Link>
                </div>
                {
                    products.length === 0 ? <EmptyPage/> :
                    <ul className="cont" id="integralProductList">
                        {
                            products.map(product => {
                                let quantity = this.getSelectedQuantity(product.integralProductId);
                                return (
                                    <li key={product.integralProductId}>
                                        <Link to={'/integral/product/detail/' + product.integralProductId}>
                                            <div className="pic"><img src={product.picUrl} alt=""/></div>
                                        </Link>
                                        <Link to={'/integral/product/detail/' + product.integralProductId}
                                              className="title">{product.integralProductNm} </Link>
                                        <div className="integral">{product.integralPrice}积分</div>
                                        <div className={quantity !== null ? "quantity open" : "quantity"}>
                                            <span className="minus" onClick={() => this.productQuantitySub(product)}/>
                                            <div className="input-wrap">
                                                <input className="num" type="tel" value={ quantity || ''}
                                                       onChange={(event) => {
                                                           this.productQuantityChange(product, event)
                                                       }} onBlur={(event) => {
                                                    this.productQuantityBlur(product, event)
                                                }}/>
                                            </div>
                                            <span className="plus " onClick={() => this.productQuantityAdd(product)}/>
                                        </div>
                                    </li>
                                )
                            })
                        }
                        <AutoLoadMore container={'integralProductList'} isHaveNextPage={isHaveNextPage}
                                      loadMoreFunc={() => this.pageIntegralProduct()}/>
                    </ul>
                }

                <div className="hold-div-bottom"/>
                {
                    totalIntegral > 0
                    &&
                    (
                        <div className="footer">
                            <div className="subtotal">
                                <p>积分小计</p>
                                <span>{totalIntegral}</span>
                            </div>
                            <Link to="/integral/product/exchange" className="exchange">立即兑换</Link>
                        </div>
                    )
                }

            </div>
        );
    }
}

IntegralProductList.propTypes = {};

IntegralProductList.contextTypes = {};

const mapStateToProps = (store, ownProps) => {
    return {
        integralProductState: store.integralProductState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({getMemberIntegral, pageIntegralProduct, updateSelectedIntegralProducts}, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(IntegralProductList);

