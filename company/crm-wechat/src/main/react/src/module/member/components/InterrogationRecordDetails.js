import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import "../style/InterrogationRecordDetails.css";
import {findYdyPrescriptionDetails} from "../../member/actions/interrogationRecordAction";
import {Link} from "react-router-dom";
import Img from "../../common/components/Img";
import Zmage from 'react-zmage';

class InterrogationRecordDetails extends Component {
    componentWillMount() {
        document.title = "问诊记录-详情";
    }

    componentDidMount() {
        let inquiryId = this.props.match.params.inquiryId;
        this.props.actions.findYdyPrescriptionDetails(inquiryId);
    }

    /**
     * 预订处方药
     * @param prescriptionId  处方Id
     */
    bookingPrescription(prescriptionId) {
        // todo:预订等后续处方流程完成
    }

    render() {
        const {prescriptionDetails, prescriptionDrugsState} = this.props.interrogationRecordState;
        let prescriptionDetail = prescriptionDetails || [];
        let list = prescriptionDetail.ydyPrescriptionItemList || [];
        let state = prescriptionDrugsState;
        return (

            <div className="interrogation_record_details" style={{paddingBottom: "100px"}}>
                <div className="diagnostic-main">
                    <div className="diagnostic-picture">
                        <div className="title">
                            <span>{prescriptionDetail.diagnosticContent}</span>
                        </div>

                        <div className="item">
                            <div className="pic">
                                <Zmage controller={{close: true, rotate: true, zoom: true}}
                                       src={prescriptionDetail.prescriptionUrl}/>
                            </div>
                            <div className="tips">点击查看大图</div>
                        </div>

                    </div>

                    <div className="prescription">
                        <div className="title">处方药</div>
                        <div className="product-information">
                            {list.length === 0 ? <div className="zanwu">暂无处方药</div> :
                                list.map(product => {
                                    return (
                                        <div className="item" key={product.prescriptionItemId}>
                                            <Link to={"/product/detail/" + product.productId + '/O2O'}>
                                                <div className="pic-box"><Img src={product.pictureFile} alt=""/></div>
                                                <div className="product-text">{product.drugName}</div>
                                                <div className="spec-text">规格:{product.specification}</div>
                                                <div className="bot-cell">
                                                    <div className="price">
                                                        ￥<span>{product.unitPriceDouble ? product.unitPriceDouble.toFixed(2) : 0.00}</span><em>/{product.unit}</em>
                                                    </div>
                                                </div>
                                                <div className="number-of-products">x{product.quantity}</div>
                                            </Link>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>


                    <div className="patient-information">
                        <div className="title">就诊人信息</div>
                        <div className="content">
                            <div className="content-text">
                                <span className="spa1">姓名：</span>
                                <span className="spa2">{prescriptionDetail.name}</span>
                            </div>
                            <div className="content-text">
                                <span className="spa1">性别：</span>
                                <span className="spa2">{prescriptionDetail.sex}</span>
                            </div>
                            <div className="content-text">
                                <span className="spa1">年龄：</span>
                                <span className="spa2">{prescriptionDetail.age}</span>
                            </div>
                        </div>
                    </div>


                    <div className="doctor-information">
                        <div className="title">医生信息</div>
                        <div className="content">
                            <div className="pic">
                                <img src={prescriptionDetail.doctorHead} alt=""/>
                            </div>
                            <div className="text-content">
                                <div className="text-name">{prescriptionDetail.doctorName}</div>
                                <div className="text-features">{prescriptionDetail.departments}</div>
                                <div className="text-addr">{prescriptionDetail.hospital}</div>
                            </div>
                        </div>
                    </div>


                    <div className="footer-box">
                        {state !== "BOOKING" &&  <div className="switch-shop">查看有货门店 <Link to={"/ydy/inShop/list/"+prescriptionDetail.prescriptionId}>切换门店</Link></div>}
                        <div className="settlement">
                            <div className="settlement-l">
                                <span>合计:</span>￥{prescriptionDetail.prescriptionDrugsPrice ? prescriptionDetail.prescriptionDrugsPrice.toFixed(2) : 0.00}
                            </div>
                            {state === "BOOKING" && <div className="settlement-r settlement-select" onClick={this.bookingPrescription(prescriptionDetail.prescriptionId)}>立即预定处方药</div>}
                            {state === "OUT_STOCK" && <div className="settlement-r">门店缺货</div>}
                            {state === "NO_PRESCRIPTION" && <div className="settlement-r">暂无处方药</div>}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (store, ownProps) => {
    return {interrogationRecordState: store.interrogationRecordState}
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({findYdyPrescriptionDetails}, dispatch)
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(InterrogationRecordDetails);