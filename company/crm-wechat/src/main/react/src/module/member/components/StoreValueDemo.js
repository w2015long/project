/**
 * @author liezihao
 * @date 2019/6/20
 * 储值demo
 */
import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import  "../style/storeValueDemo.css";
import {wxStoreValuePay} from "../../common/actions/jssdkAction";


class StoreValueDemo extends Component {

    state = {
        money:0
    };


    componentWillMount() {
        this.setState({money: 0.01});
    }

    componentWillUnmount() {

    }

    onChangeMoney(money){
        this.setState({money: money});
    }


    rechargeDemo(){
        wxStoreValuePay(this.state.money,
            ()=>{
                //支付成功回调
                window.successTip('充值成功');
            }, ()=>{
                //支付失败回调
                window.errorTip('支付失败回调');
            }, ()=>{
                //取消支付回调
                window.warningTip('支付取消回调');
            }
       )
    }





    render() {
        let self = this;
        let money = this.state.money||{};
        return (
            <div className={"ydy-patient-detail"}>
                <div className="visiting-main">
                    <div className="fm-module01">
                        <div className="weui_cell">
                            <div className="cell_bd">
                                <div className="radio-custom">
                                    <input id="inputAddr1" name="inputAddr" checked={money === 0.01 ? 'checked' : ''}
                                           value={0.01} type="radio" onChange={() => this.onChangeMoney(0.01)}/>
                                    <label htmlFor="inputAddr1">0.01</label>
                                </div>
                            </div>
                            <div className="cell_bd">
                                <div className="radio-custom">
                                    <input id="inputAddr2" name="inputAddr" checked={money === 0.52 ? 'checked' : ''}
                                           value={0.52} type="radio" onChange={() => this.onChangeMoney(0.52)}/>
                                    <label htmlFor="inputAddr2">0.52</label>
                                </div>
                            </div>
                            <div className="cell_bd">
                                <div className="radio-custom">
                                    <input id="inputAddr3" name="inputAddr" checked={money === 100 ? 'checked' : ''}
                                           value={100} type="radio" onChange={() => this.onChangeMoney(100)}/>
                                    <label htmlFor="inputAddr3">100</label>
                                </div>
                            </div>
                            <div className="cell_bd">
                                <div className="radio-custom">
                                    <input id="inputAddr4" name="inputAddr" checked={money === 666 ? 'checked' : ''}
                                           value={666} type="radio" onChange={() => this.onChangeMoney(666)}/>
                                    <label htmlFor="inputAddr4">666</label>
                                </div>
                            </div>
                            <div className="cell_bd">
                                <div className="radio-custom">
                                    <input id="inputAddr5" name="inputAddr" checked={money === 1000 ? 'checked' : ''}
                                           value={1000} type="radio" onChange={() => this.onChangeMoney(1000)}/>
                                    <label htmlFor="inputAddr5">1000</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="visiting-btn clearfix" onClick={()=>{this.rechargeDemo()}}>
                        充值
                    </div>

                </div>
            </div>
        )
    }
}

const mapStateToProps = (store, ownProps) => {
    return {

    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({}, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(StoreValueDemo);