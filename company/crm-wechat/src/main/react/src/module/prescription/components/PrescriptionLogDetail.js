import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import "../style/PrescriptionOrder.css";
import {findPrescriptionLogDetail} from "../actions/prescriptionActions";
import EmptyPage from "../../common/components/EmptyPage";

//订单日志详情
class PrescriptionLogDetail extends Component {

    componentWillMount() {
        document.title = '订单日志详情';
        let prescriptionId = this.props.match.params.id;
        this.props.actions.findPrescriptionLogDetail(prescriptionId);
    }

    componentDidMount() {

    }

    render() {
        const {prescriptionLogDetail} = this.props.prescriptionState;
        const prescriptionLogDetailArr = prescriptionLogDetail || [];

        return (
            <div className="logistics-infor">
                {
                    prescriptionLogDetailArr.length === 0 ? <EmptyPage/> :
                    <ul>
                        {
                            prescriptionLogDetailArr.length > 0 ? prescriptionLogDetailArr.map((log, index) => {
                                let logTime = log.logTimeString.split(" ");
                                let firstTime = logTime[0];
                                let secondTime = logTime[1];
                                return (
                                    <li className={index === 0 ? "first" : ""} key={index}>
                                        <em>{firstTime}<br/>{secondTime}</em>
                                        <i></i>
                                        <p>{log.content}</p>
                                    </li>
                                )
                            }) : "暂无订单日志信息!"
                        }
                    </ul>
                }
            </div>
        )
    }
}

PrescriptionLogDetail.propTypes = {};

PrescriptionLogDetail.contextTypes = {};

const mapStateToProps = (store, ownProps) => {
    return {
        prescriptionState: store.prescriptionState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({findPrescriptionLogDetail}, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PrescriptionLogDetail);