/**
 * 储存 - 充值成功
 * @author  lcl
 * @date 2019/6/21
 *
 */
import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import  "../style/RechargeSuccess.css";
import success from "../../../media/images/succ-icon2.png";

class RechargeSuccess extends Component {

    state = {
        second: 5,
        tipsLayer: false,
    };

    constructor(prosp) {
        super(prosp);
        document.title = '充值成功';

    }

    componentWillMount() {

    }

    componentDidMount() {
        let self = this;
        self.setState({"tipsLayer": true}, function () {
            let second = self.state.second;
            let setIntervalFun = setInterval(function () {
                if (second <= 0) {
                    clearInterval(setIntervalFun);
                    self.props.history.push('/member/myStoredValueBalance');
                    self.setState({second: 5});
                } else {
                    self.setState({second: --second});
                }
            }, 1000);
        });
    }

    componentWillUnmount() {

    }


    render() {
        const history = this.props.history;
        const amount = this.props.match.params.amount;
        return (

            <div className={"recharge_success"}>
                <div className="payment-successful-main">
                    <div className="pay-pic">
                        <img src={success} alt=""/>
                    </div>
                    <h5>充值成功</h5>
                    <p>储值总额 ¥{amount}</p>
                    <div className="time-back">{this.state.second}s后自动返回</div>
                    <div className="back-my-value" onClick={()=>history.push("/member/myStoredValueBalance")}>返回我的储值</div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (store, ownProps) => {
    return {storedValueState: store.storedValueState}
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({}, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(RechargeSuccess);