/**
 * 问诊记录 - 分页
 */
import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import "../style/InterrogationRecordList.css";
import {pageYdyPrescription} from "../../member/actions/interrogationRecordAction";
//自动加载下一页
import AutoLoadMore from "../../../module/common/components/AutoLoadMore";
import {Link} from 'react-router-dom'
import EmptyPage from "../../common/components/EmptyPage";
class InterrogationRecordList extends Component {
    componentWillMount() {
        document.title = "问诊记录";
    }

    componentDidMount() {
        this.reloadPrescription();//加载商品
    }

    reloadPrescription() {
        let {pageYdyPrescription} = this.props.interrogationRecordState;
        this.props.actions.pageYdyPrescription(0, pageYdyPrescription.size);
    }

    loadMoreFunc() {
        let {pageYdyPrescription} = this.props.interrogationRecordState;
        this.props.actions.pageYdyPrescription(pageYdyPrescription.page + 1, pageYdyPrescription.size, pageYdyPrescription.prescriptionData);
    }

    render() {

        let pageYdyPrescription = this.props.interrogationRecordState.pageYdyPrescription;
        let prescriptionData = pageYdyPrescription.prescriptionData || [];
        const isHaveNextPage = pageYdyPrescription.size * (pageYdyPrescription.page + 1) < pageYdyPrescription.recordsFiltered;

        return (
            <div className="interrogation_record">
                {prescriptionData.length === 0 ?<EmptyPage/> :
                    <div className="questionnaire-main" id={"interrogationRecordList"}>
                        {
                            prescriptionData.map(prescription => {
                                return (
                                    <div className="inquiry" key={prescription.prescriptionId} >
                                        <div className="title">图文问诊 <a href="##">{prescription.createTimeStr}</a></div>
                                        <div className="content-box">
                                            <div className="pic">
                                                <img src={prescription.doctorHead} alt=""/>
                                            </div>
                                            <div className="text-content">
                                                <h5>{prescription.doctorName}</h5>
                                                <div className="text-box">
                                                    <p>
                                                        <span>{prescription.departments}</span>
                                                        <span>{prescription.hospital}</span>
                                                    </p>
                                                    <p>
                                                        诊断内容：{prescription.diagnosticContent}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="btn-box">
                                            <Link to={'/ydy/interrogationRecord/details/'+prescription.inquiryId}>诊断详情</Link>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        <AutoLoadMore container={'interrogationRecordList'} isHaveNextPage={isHaveNextPage}
                                      loadMoreFunc={this.loadMoreFunc.bind(this)}/>
                    </div>
                }}
            </div>
        )
    }

}

const mapStateToProps = (store, ownProps) => {
    return {interrogationRecordState: store.interrogationRecordState}
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({pageYdyPrescription}, dispatch)
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(InterrogationRecordList);