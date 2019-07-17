import React, { Component } from 'react';
import {Link} from "react-router-dom";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import '../style/PayByBalance.css';
import {showPayByBalance} from "../actions/payByBalanceAction";

class PayByBalance extends Component {
    state = {
        payPassword: ''
    };

    componentWillMount() {
        this.changeState({
            payPassword: ''
        });
    }

    componentDidMount() {

    }

    componentDidUpdate (){

    }

    componentWillUnmount(){

    }

    /**
     * 修改 state
     * @param state
     */
    changeState(state = {}){
        const pageContext = this;
        pageContext.setState(Object.assign({}, pageContext.state, state));
    }

    /**
     * 校验密码
     */
    checkPayPassWord(){
        const pageContext = this;
        const {actions} = this.props;
        const {payPassword} = this.state;
        const {payByBalanceInfo} = this.props.normalCartSettlementState;
        const md5 = require('md5-node');
        const url = '/wap/member/checkPayPassWord';
        window.textFetch(
            url,
            {
                method: 'POST',
                body: JSON.stringify({encryptedPassword: md5(payPassword)})
            },
            text => {
                pageContext.changeState({
                    payPassword: ''
                });

                actions.showPayByBalance('N');
                payByBalanceInfo.callbackFunc('Y');
            }
        );
    }

    render() {
        const {actions} = this.props;
        const {payByBalanceInfo} = this.props.normalCartSettlementState;
        
        return(
            payByBalanceInfo.showPayByBalance==='Y' &&
            <div className='pay-by-balance'>
                <div className="pw-layer" onClick={(e) => {e.target.className==='pw-layer' ? actions.showPayByBalance('N') : {}}}>
                    <div className="payment-pw">
                        <div className="mt">
                            <a className="cancel" onClick={() => actions.showPayByBalance('N')}>取消</a>
                            支付密码
                            <a className="confirm" onClick={this.state.payPassword ? () => this.checkPayPassWord() : () => {}}>确认</a>
                        </div>
                        <div className="mc">
                            <div className="input-box">
                                <input type="password" placeholder="请输入支付密码" value={this.state.payPassword} onChange={(e) => this.changeState({payPassword: e.target.value.trim()})}/>
                            </div>
                            <p>为了保障您的支付安全，请进行安全验证。</p>
                            <Link className="forget" to='/cart/forgetPayPassword' onClick={() => {actions.showPayByBalance('N')}}>忘记密码</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        normalCartSettlementState: store.normalCartSettlementState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            showPayByBalance
        }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PayByBalance);