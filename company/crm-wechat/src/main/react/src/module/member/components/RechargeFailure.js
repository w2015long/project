/**
 * @author  lcl
 * @date 2019/6/21
 *
 */
import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import "../style/RechargeFailure.css";
import failure from "../../../media/images/dahao.png";

class RechargeFailure extends Component {

    state = {};

    constructor(prosp) {
        super(prosp);
        document.title = '充值失败';
    }

    componentWillMount() {
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }


    render() {
        const history = this.props.history;
        const errorMsg = this.props.match.params.errorMsg;
        return (

            <div className={"recharge_failure"}>
                <div className="payment-successful-main">
                    <div className="pay-pic">
                        <img src={failure} alt=""/>
                    </div>
                    <h5>支付失败</h5>
                    <p className="insufficient">{errorMsg}</p>
                    <div className="recharge" onClick={()=>history.push("/storedValue/recharge")}>去充值</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(RechargeFailure);