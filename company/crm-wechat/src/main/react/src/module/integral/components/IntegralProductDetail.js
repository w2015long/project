/**
 * @author chencheng
 * @date 2018/5/9
 * 积分商品详情
 */
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import '../style/IntegralProductDetail.css'
import {
    getIntegralProductDetail,
    getMemberIntegral,
    updateSelectedIntegralProducts
} from '../actions/integralProductActions'

class IntegralProductDetail extends Component {
    state = {
        quantity: 1,
        isGray: false,

    };

    componentWillMount(){
        document.title = "礼品详情";
        this.props.actions.getIntegralProductDetail(this.props.match.params.id);
        this.props.actions.getMemberIntegral();
        this.isGray();
    }

    quantityChange(quantity){
        this.setState({quantity: quantity})
    }

    checkQuantity(quantity){
        if (isNaN(quantity)){
            window.warningTip('请输入正整数');
            this.setState({quantity: 1});
            return false;
        }

        const {integralProductDetail, myIntegral} = this.props.integralProductState;
        quantity = parseInt(quantity, 10);
        if (quantity > integralProductDetail.num){
            window.warningTip('库存不足');
            this.setState({quantity: integralProductDetail.num});
            return false;
        }

        if (myIntegral < this.getTotalIntegral(quantity)){
            window.warningTip('积分不足');
            this.setState({quantity: 1});
            return false;
        }
        this.setState({quantity: quantity});
        return true;
    }

    quantitySubtract(){
        let quantity = this.refs.quantityInput.value;
        if (!quantity || isNaN(quantity)){
            quantity = 2;
        }
        quantity--;
        if (quantity < 1){
            quantity = 1;
        }
        this.checkQuantity(quantity);
    }
    quantityAdd(){
        let quantity = this.refs.quantityInput.value;
        if (!quantity || isNaN(quantity)){
            quantity = 0;
        }
        quantity++;
        this.checkQuantity(quantity);
    }

    getTotalIntegral(quantity){
        const integralPrice = this.props.integralProductState.integralProductDetail.integralPrice;
        if (!integralPrice || isNaN(integralPrice) || !quantity || isNaN(quantity)){
            return 0
        }

        quantity = parseInt(quantity, 10);
        return integralPrice * quantity;
    }

    exchange(integralProductDetail){
        if (false === this.checkQuantity(this.state.quantity)){
            return;
        }

        let products = [];
        products.push(Object.assign({},integralProductDetail, {quantity:this.state.quantity}));
        this.props.actions.updateSelectedIntegralProducts(products);
        this.props.history.push('/integral/product/exchange');
    }

    isGray() {
        const {myIntegral} = this.props.integralProductState;
        if (myIntegral < this.getTotalIntegral(this.state.quantity)) {
            return true;
        } else {
            return false;
        }
    }
    render() {
        const {integralProductDetail} = this.props.integralProductState;
        return (
            <div className="integral-product-detail">
                <div className="dt-top">
                    <a className="back-btn" onClick={()=>this.props.history.goBack()}/>
                    {/*<a className="share-btn"/>*/}
                </div>
                <div className="swiper-container product-tab">
                    <div className="swiper-wrapper">
                        <div className="swiper-slide">
                            <a href=""><img src={integralProductDetail.picUrl} alt=""/></a>
                        </div>
                    </div>
                    {/*<div className="swiper-pagination"/>*/}
                    {/*<div className="blocking"/>*/}
                </div>
                <div className="dt-cont">
                    <div className="cont-top">
                        <div className="title">{integralProductDetail.integralProductNm}</div>
                        <div className="price">
                            <span>{integralProductDetail.integralPrice}</span><i> 积分</i>
                            <div className="quantity open">
                                <a className="minus" onClick={()=>this.quantitySubtract()}/>
                                <div className="input-wrap"><input ref={'quantityInput'} className="num" value={this.state.quantity} onChange={(event)=>this.quantityChange(event.target.value)} onBlur={(event)=>this.checkQuantity(event.target.value)} max="200" type="text"/></div>
                                <a className="plus " onClick={()=>this.quantityAdd()}/>
                            </div>
                        </div>
                    </div>
                    <div className="instructions">
                        <div className="mt">商品描述</div>
                        <div className="mc" dangerouslySetInnerHTML={{__html:integralProductDetail.descrStr}}/>
                    </div>
                </div>
                <div className="dt-footer">
                    <div className="subtotal">
                        <p>积分小计</p>
                        <span>{this.getTotalIntegral(this.state.quantity)}</span>
                    </div>
                    <a className={this.isGray() ? 'exchange2' : 'exchange'} disabled={this.isGray()}
                       onClick={() => this.exchange(integralProductDetail)}>立即兑换</a>
                </div>
            </div>
        );
    }
}

IntegralProductDetail.propTypes = {};

IntegralProductDetail.contextTypes = {};

const mapStateToProps = (store, ownProps) => {
    return {
        integralProductState:store.integralProductState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({getIntegralProductDetail, getMemberIntegral, updateSelectedIntegralProducts}, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(IntegralProductDetail);

