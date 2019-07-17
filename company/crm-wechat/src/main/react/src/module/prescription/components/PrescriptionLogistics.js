import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import "../style/PrescriptionOrder.css";
import {findLogisticsDetail} from "../actions/prescriptionActions";
import EmptyPage from "../../common/components/EmptyPage";

//订单物流详情
class PrescriptionLogistics extends Component {

    componentWillMount() {
        document.title = '物流详情';
        let shipperCode = this.props.match.params.shipperCode;
        let logisticCode = this.props.match.params.logisticCode;
        this.props.actions.findLogisticsDetail(shipperCode,logisticCode);
    }

    componentDidMount() {

    }

    render() {
        const {logisticsDetail} = this.props.prescriptionState;
        const logisticsArr = logisticsDetail.Traces || [];
        let logisticsDetailArr = [];
        for (let i = logisticsArr.length; i > 0; i--) {
            logisticsDetailArr.push(logisticsArr[i - 1]);
        }

        return (
            <div className="logistics-infor">
                {logisticsDetailArr.length === 0 ? <EmptyPage/> :
                    <ul>
                        {
                            logisticsDetailArr.length > 0 ? logisticsDetailArr.map((logistics, index) => {
                                let acceptTime = logistics.AcceptTime.split(" ");
                                let firstTime = acceptTime[0];
                                let secondTime = acceptTime[1];
                                return (
                                    <li className={index === 0 ? "first" : ""} key={index}>
                                        <em>{firstTime}<br/>{secondTime}</em>
                                        <i></i>
                                        <p>{logistics.AcceptStation}</p>
                                    </li>
                                )
                            }) : "暂无订单物流信息!"
                        }
                    </ul>
                }
            </div>
        )
    }
}

PrescriptionLogistics.propTypes = {};

PrescriptionLogistics.contextTypes = {};

const mapStateToProps = (store, ownProps) => {
    return {
        prescriptionState: store.prescriptionState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({findLogisticsDetail}, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PrescriptionLogistics);