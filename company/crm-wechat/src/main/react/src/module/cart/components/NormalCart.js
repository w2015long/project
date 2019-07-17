import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import EmptyPage from "../../common/components/EmptyPage";
import Confirm from '../../common/components/Confirm';
import Img from '../../common/components/Img';
import '../style/NormalCart.css';
import {
    changeItemQuantity,
    getCart,
    modifyItemQuantity,
    removeInvalidItem,
    removeSelected,
    selectAll,
    updateItemSelectStatus
} from '../actions/normalCartAction';
import {showConfirm} from "../../common/actions/commonAction";

class NormalCart extends Component {
    state = {
        invalidNum: 0,      //失效商品数量
        productNum: 0,      //有效商品数量
        isEmpty: 'Y',       //购物车是否为空
        isSelectAll: 'Y',   //是否全选购物车项
        hadEffectItem: 'N', //是否有可结算的购物车项
    };

    componentWillMount() {
        document.title='购物车';
        this.props.actions.getCart(() => this.resetPageState());
    }

    componentDidMount() {

    }

    componentDidUpdate (){

    }

    componentWillUnmount(){

    }

    //重置页面状态
    resetPageState(){
        let {normalCart} = this.props.normalCartState;
        let cartItemList = normalCart.cartItemList || [];

        let invalidNum = 0;
        let productNum = 0;
        let isEmpty = 'Y';
        let isSelectAll = 'Y';
        let hadEffectItem = 'N';
        cartItemList.map(cartItem => {
            //判断购物车是否为空
            if(cartItem.platformType==='B2C'
                || (cartItem.platformType==='O2O')){
                isEmpty = 'N';
            }

            //判断是否有可结算的购物车项
            if(cartItem.isInvalid==='N' && cartItem.isSelected==='Y'){
                hadEffectItem = 'Y';
            }

            //判断是否全选
            if(cartItem.isInvalid==='N' && cartItem.isSelected==='N'){
                isSelectAll ='N';
            }

            //统计购物车商品数量
            if(cartItem.isInvalid==='N' && cartItem.isSelected==='Y'){
                productNum = productNum + cartItem.quantity;
            }

            //过滤失效购物车项
            if((cartItem.platformType==='B2C' && cartItem.isInvalid==='Y')
                || (cartItem.platformType==='O2O' && cartItem.isInvalid==='Y')){
                invalidNum = invalidNum + 1;
            }
        });

        this.setState({
            invalidNum: invalidNum,
            productNum: productNum,
            isEmpty: isEmpty,
            isSelectAll: isSelectAll,
            hadEffectItem: hadEffectItem
        });
    }

    render(){
        const {normalCart} = this.props.normalCartState;
        const {actions} = this.props;
        const cartItemList = normalCart.cartItemList || [];
        const hitItemList = normalCart.hitItemList || [];

        return(
            <div className="normal-cart">
                <div className="cart-main">
                    <div className="mt">
                        <a className="back" onClick={() => this.props.history.goBack()}/>
                        <span>购物车</span>
                        {
                            this.state.hadEffectItem==='Y' &&
                            <a className="del-btn" onClick={() => this.props.actions.showConfirm('删除选中商品？', () => this.props.actions.removeSelected(cartItemList, () => this.resetPageState()))}>删除</a>
                        }
                    </div>
                    <div className="hold-div-top"/>
                    {
                        this.state.isEmpty==='Y' &&
                        <EmptyPage emptyTipText={'购物车还没有商品哦'}/>
                    }
                    {
                        this.state.isEmpty==='N' &&
                        <div>
                            <div className="mc">
                                <div className="mc-bot">
                                    {
                                        cartItemList.map(cartItem => {
                                            return(
                                                cartItem.isInvalid==='N' && cartItem.isHitActivity==='N' &&
                                                <div className="item" key={cartItem.skuId}>
                                                    <div className="pic">
                                                        <Link to={'/product/detail/' + cartItem.productId + '/' + cartItem.platformType}>
                                                            <Img src={cartItem.picture} alt=""/>
                                                            {
                                                                cartItem.platformType==='O2O' &&
                                                                <span className="arrive bg-green">当天达</span>
                                                            }
                                                            {
                                                                cartItem.platformType==='B2C' &&
                                                                <span className="arrive bg-blue">5天内达</span>
                                                            }
                                                        </Link>
                                                    </div>
                                                    <Link to={'/product/detail/' + cartItem.productId + '/' + cartItem.platformType} className="title">{cartItem.productNm}</Link>
                                                    <span>规格：{cartItem.spec}</span>
                                                    <div className="price">
                                                        <i>￥</i>{cartItem.unitPriceDouble.toFixed(2)}
                                                    </div>
                                                    <div className="quantity open">
                                                        <a className="minus" onClick={() => cartItem.quantity > 0 ? actions.changeItemQuantity(cartItem.skuId, 'N', '', () => this.resetPageState()) : {}}/>
                                                        <div className="input-wrap">
                                                            <input className="num" value={cartItem.quantity} type="number" min="1" onChange={(event) => actions.modifyItemQuantity(cartItem.skuId, event.target.value.trim(), () => this.resetPageState())}/>
                                                        </div>
                                                        <a className="plus" onClick={() => actions.changeItemQuantity(cartItem.skuId, 'Y', '', () => this.resetPageState())}/>
                                                    </div>
                                                    <span className={'select' + (cartItem.isSelected==='Y' ? ' selected' : '')} onClick={() => actions.updateItemSelectStatus(cartItem.skuId, () => this.resetPageState())}/>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                {
                                    hitItemList.map(hitItem => {
                                        return(
                                            <div className="discounts">
                                                <div className="mc_title">
                                                    <a>
                                                        <div className="mct_tips">{hitItem.fullReductionDiscountType==='FULL_ITEM_DISCOUNT' ? '满折' : '满减'}</div>
                                                        <div className="mct_text">{hitItem.nextRuleDesc}</div>
                                                        <div className="mct_single" onClick={() => {this.props.history.push('/activity/commentList/' + hitItem.fullReductionActivityId)}}>去凑单</div>
                                                    </a>
                                                </div>
                                                <div className="mc-bot">
                                                    {
                                                        hitItem.cartItemList.map(cartItem => {
                                                          return(
                                                              <div className="item">
                                                                  <div className="pic">
                                                                      <Link to={'/product/detail/' + cartItem.productId + '/' + cartItem.platformType}>
                                                                          <Img src={cartItem.picture} alt=""/>
                                                                          {
                                                                              cartItem.platformType==='O2O' &&
                                                                              <span className="arrive bg-green">当天达</span>
                                                                          }
                                                                          {
                                                                              cartItem.platformType==='B2C' &&
                                                                              <span className="arrive bg-blue">5天内达</span>
                                                                          }
                                                                      </Link>
                                                                  </div>
                                                                  <Link to={'/product/detail/' + cartItem.productId + '/' + cartItem.platformType} className="title">{cartItem.productNm}</Link>
                                                                  <span>规格：{cartItem.spec}</span>
                                                                  <div className="price">
                                                                      <i>￥</i>{cartItem.unitPriceDouble.toFixed(2)}
                                                                  </div>
                                                                  <div className="quantity open">
                                                                      <a className="minus" onClick={() => cartItem.quantity > 0 ? actions.changeItemQuantity(cartItem.skuId, 'N', '', () => this.resetPageState()) : {}}/>
                                                                      <div className="input-wrap">
                                                                          <input className="num" value={cartItem.quantity} type="number" min="1" onChange={(event) => actions.modifyItemQuantity(cartItem.skuId, event.target.value.trim(), () => this.resetPageState())}/>
                                                                      </div>
                                                                      <a className="plus" onClick={() => actions.changeItemQuantity(cartItem.skuId, 'Y', '', () => this.resetPageState())}/>
                                                                  </div>
                                                                  <span className={'select' + (cartItem.isSelected==='Y' ? ' selected' : '')} onClick={() => actions.updateItemSelectStatus(cartItem.skuId, () => this.resetPageState())}/>
                                                              </div>
                                                          )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                                {
                                    this.state.invalidNum > 0 &&
                                    <div className="lose-box">
                                        <div className="lose-hd">
                                            <span>失效宝贝({this.state.invalidNum})</span>
                                            <em onClick={() => this.props.actions.showConfirm('清空失效宝贝？', () => this.props.actions.removeInvalidItem(() => this.resetPageState()))}>清空失效宝贝</em>
                                        </div>
                                        <div className="lose-bd">
                                            {
                                                cartItemList.map(cartItem => {
                                                    return(
                                                        ((cartItem.platformType==='B2C' && cartItem.isInvalid==='Y')
                                                        || (cartItem.platformType==='O2O' && cartItem.isInvalid==='Y')) &&
                                                        <div  key={cartItem.skuId} className="item lose-item">
                                                            <div className="pic">
                                                                <Link to={'/product/detail/' + cartItem.productId + '/' + cartItem.platformType}>
                                                                    <Img src={cartItem.picture} alt="" />
                                                                    {
                                                                        cartItem.platformType==='O2O' &&
                                                                        <span className="arrive bg-green">当天达</span>
                                                                    }
                                                                    {
                                                                        cartItem.platformType==='B2C' &&
                                                                        <span className="arrive bg-blue">5天内达</span>
                                                                    }
                                                                </Link>
                                                            </div>
                                                            <Link to={'/product/detail/' + cartItem.productId + '/' + cartItem.platformType} className="title">{cartItem.productNm}</Link>
                                                            <span className="lose-tex">{cartItem.msg}</span>
                                                            <div className="price">
                                                                <i>￥</i>{cartItem.unitPriceDouble.toFixed(2)}
                                                            </div>
                                                            <div className="quantity">
                                                                <a className="plus "/>
                                                            </div>
                                                            <span className="lose-icon">失效</span>
                                                        </div>
                                                    );
                                                })
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="cart-footer">
                                <a className={'select-all' + (this.state.isSelectAll==='Y' && this.state.hadEffectItem==='Y' ? ' selected' : '')} onClick={() => actions.selectAll(this.state.isSelectAll==='Y' ? 'N' : 'Y', () => this.resetPageState())}>全选</a>
                                <p>合计:￥{normalCart.payableAmountDouble}</p>
                                {normalCart.discountTotalAmountDouble>0&&<span>已优惠￥{normalCart.discountTotalAmountDouble}</span>}
                                <a className={this.state.hadEffectItem==='Y' ? "clearing-btn" : "clearing-btn disable"} onClick={ this.state.hadEffectItem==='Y' ? () => {this.props.history.push('/cart/normalCartSettlement')} : () => {}}>去结算({this.state.productNum})</a>
                            </div>
                        </div>
                    }
                </div>
                <Confirm />
            </div>
        );
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        normalCartState: store.normalCartState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            getCart,
            selectAll,
            updateItemSelectStatus,
            changeItemQuantity,
            removeSelected,
            modifyItemQuantity,
            showConfirm,
            removeInvalidItem,
        }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(NormalCart);