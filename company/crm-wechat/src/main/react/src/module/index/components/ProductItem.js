/**
 * @author olx
 * @date 2018/3/19
 */
//基本组件
import React, {PureComponent} from "react";
//引入私有样式
import "../style/Index.css";
import {parabolaFly} from "../../common/actions/parabolaFlyAction";
import ParabolaFly from "../../common/components/ParabolaFly";
import Img from "../../common/components/Img";
import AdOld from "../../../media/images/AdOld.png"; //活动图片,请直接替换这里
import womPic from "../../../media/images/wom-pic_00.jpg";
import {Link} from "react-router-dom";
import AutoLoadMore from "../../common/components/AutoLoadMore";
import pic2019061601 from "../../../media/images/pic2019061601.jpg"; //活动图片,请直接替换这里 第一张
import pic2019061602 from "../../../media/images/pic2019061602.jpg"; //活动图片,请直接替换这里 第二张
//redux


class ProductItem extends PureComponent {

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {
    }


    getCarItemQuantity(shopSkuId) {
        let cartItemList = this.props.normalCart.cartItemList || [];
        for(let carItem of cartItemList){
            if(carItem.shopSkuId === shopSkuId){
                return carItem.quantity;
            }
        }
        return null;
    }

    addToCart(event, shopSkuId, picture) {
        //购物车图标节点
        let cartIconElement = document.getElementById("cartIcon");
        // 抛物线运动
        parabolaFly(event, cartIconElement, picture);
        //购物车商品增加
        this.props.changeItemQuantity(shopSkuId, 'Y', '');
    }

    goToProductDetail(productId) {
        let shopId = this.props.shopId;
        const {toProductDetail} = this.props;
        if (shopId) {
            toProductDetail('/product/detail/' + productId + '/O2O/' + shopId);
        } else {
            toProductDetail('/product/detail/' + productId);
        }
    }

    render(){
        const {toProductDetail} = this.props;
        const productPage = this.props.productPage;
        const products = productPage.data || [];
        const self = this;
        return (
            <div className="mc-rt" >
            <dl>
                <ParabolaFly/>
                <dd>
                    {/* {((this.props.firstSellCategoryId === this.props.sellCategoryId) || ('' === this.props.sellCategoryId)) &&
                     <div className="subject-box"><Link to={'/activity/womensDay'}><img
                        src={womPic}/></Link></div>}*/}
            {((this.props.firstSellCategoryId === this.props.sellCategoryId) || ('' === this.props.sellCategoryId)) &&
            <div className="subject-box"><a onClick={() => {self.goToProductDetail(2630)}} ><img src={pic2019061601}/></a></div>}
                    {((this.props.firstSellCategoryId === this.props.sellCategoryId) || ('' === this.props.sellCategoryId))  && this.props.isLogin &&
                    <div className="subject-box"><a href="javascript:void(0);" title="" onClick={() => {self.goToProductDetail(58490)}}><img src={pic2019061602}/></a></div>}
                    {((this.props.firstSellCategoryId === this.props.sellCategoryId) || ('' === this.props.sellCategoryId))  && !this.props.isLogin &&
                    <div className="subject-box"><Link to={'/member/promote/-1'}><img src={AdOld}/></Link></div>}
                </dd>

                {products.length >= 0 &&
                <dd style={{"marginBottom": "1.7rem"}} id="index-product-list">
                    {
                        products.map((product, index) => {
                            let quantity = self.getCarItemQuantity(product.shopSkuId);
                            return (
                                <div className="item" key={index}id={"productItem"+index}>
                                    <div
                                        onClick={() => toProductDetail('/product/detail/' + product.productId + '/O2O')}>
                                        <div className="pic"><a><Img src={product.picture} alt="商品图"/></a></div>
                                        <a className="title">{product.productNm}</a>
                                        <span
                                            className="elli">规格：{"Y" === product.isDismantle ? product.splitSpec : product.spec || ""}</span>
                                        <span
                                            className="elli">单位：{"Y" === product.isDismantle ? product.splitUnit : product.unit || ""}</span>
                                        <div className="price">
                                            <i>￥</i>{product.memberPriceDouble ? product.memberPriceDouble.toFixed(2) : product.sellPriceDouble.toFixed(2)}<span/>
                                        </div>
                                    </div>
                                    {
                                        product.medicinalTypeCode !== "RX" &&
                                        <div className={quantity !== null ? "quantity open" : "quantity"}>
                                            <a className="minus"
                                               onClick={() => this.props.changeItemQuantity(product.shopSkuId, 'N', '')}/>
                                            <div className="input-wrap"><input className="num" value={quantity || ''}
                                                                               type="tel"
                                                                               onChange={(event) => this.props.modifyItemQuantity(product.shopSkuId, event.target.value)}/>
                                            </div>
                                            <a className="plus"
                                               onClick={(event) => this.addToCart(event, product.shopSkuId, product.picture)}/>
                                        </div>
                                    }
                                </div>
                            )
                        })
                    }
                    <AutoLoadMore container={this.props.container} loadMoreFunc={this.props.loadMoreFunc} isHaveNextPage={this.props.isHaveNextPage}/>
                </dd>}
            </dl>

            </div>
        );
    }
}


export default ProductItem;




