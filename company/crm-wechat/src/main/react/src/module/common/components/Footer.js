import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import "../style/Footer.css";

/**
 * 页面底部 含{ 首页,商城,扫码购，购物车，我的 }   四个tag
 */
class Footer extends Component {

    getCartTotalProductQuantity(){
        let quantity = 0;
        let items = this.props.normalCartState.normalCart.cartItemList || [];
        for(let item of items){
            quantity += item.quantity;
        }
        return quantity;
    }

    render(){
        const history = this.props.history;
        const state = this.props.state;
        // let quantity = this.getCartTotalProductQuantity().quantity;
        return (
            <div className={'common-footer'}>
                <div className="footer">
                    <div className={state === "index" ? " item homeindex cur " : " item homeindex"}
                         onClick={() => history.push('/index')}>
                        <span>首页</span>
                    </div>

                    <div className={state === "mall" ? "item straight cur" : "item straight normal"} onClick={() => history.push('/mall/index')}>
                        <span>商城</span>
                    </div>

                   {/* <div className={state === "mall" ? "item straight cur" : "item straight normal"} onClick={() => history.push('/activity/yearMetaphase')}>
                        <span>618大促</span>
                    </div>*/}

                    <div className={state === " code" ? " item home-page cur" : "item home-page"}
                         onClick={() =>history.push('/scan/barCodeScan' )}>
                        <span>扫码购</span>
                    </div>

                    <div className="item sp-cart my-info" id="cartIcon" onClick={() => history.push('/cart/normalCart')}>
                        <span>
                            <i>{this.getCartTotalProductQuantity()}</i>
                            购物车
                        </span>
                    </div>

                    <div className={state === "me" ? " item wode cur" : "wode item"}
                         onClick={() => history.push('/member/index')}>
                        <span>我的</span>
                    </div>
                </div>
            </div>
        );
    }
}
Footer.propTypes = {
    state:  PropTypes.string.isRequired,
};
const mapStateToProps = (store, ownProps) => {
    return {
        normalCartState: store.normalCartState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({}, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
