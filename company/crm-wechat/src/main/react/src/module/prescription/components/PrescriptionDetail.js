import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import "../style/PrescriptionDetail.css";
import {
    changeOrderState,
    findPrescriptionDetail,
    prescriptionPay,
    setShowInvoice
} from "../actions/prescriptionActions";
import {initJsSdk, wxPay} from "../../common/actions/jssdkAction";
import {Link} from "react-router-dom";
import CountDown from "../../common/components/CountDown";

//订单详情
class PrescriptionDetail extends Component {

    componentWillMount() {
        document.title = '订单详情';
        this.isPaying = false;
        let prescriptionId = this.props.match.params.id;
        this.props.actions.findPrescriptionDetail(prescriptionId);
    }

    componentDidMount() {
        //初始化JsSdk
        initJsSdk();
    }

    //格式化输出订单状态
    formatOrderStat(orderStat) {
        switch (orderStat) {
            case "VALUATION":
            case "AUDIT":
                return "待审核";
            case "UNPAID":
                return "待付款";
            case "DISTRIBUTION":
            case "ALLOCATE":
            case "DECOCTION":
            case "PACKING":
            case "WAIT_SEND":
                return "待发货";
            case "SEND":
                return "待收货";
            case "FINISH":
                return "已完成";
            case "CANCEL":
                return "已关闭";
            default:
                return "";
        }
    }

    //确认收货
    confirmPrescriptionDelivery(prescriptionOrderId) {
        window.showConfirm(
            "确认收货吗？",
            () => {
                this.props.actions.changeOrderState(prescriptionOrderId, "FINISH", success => {
                    if (success) {
                        this.props.history.push('/prescription/list');
                    }
                });
            });
    }

    cancelOrder(prescriptionOrderId) {

        window.showConfirm(
            "确认取消处方订单吗？",
            () => {
                this.props.actions.changeOrderState(prescriptionOrderId, "CANCEL", success => {
                    if (success) {
                        this.props.history.push('/prescription/list');
                    }
                });
            });
    }

    payNow(orderId){
        let self = this;
        if(self.isPaying){
            return;
        }
        self.isPaying = true;
        wxPay(
            'PRESCRIPTION',
            orderId,
            function () {
                self.props.history.push('/prescription/list');
                self.isPaying = false;
            },
            function () {
                window.warningTip('支付失败');
                self.isPaying = false;
            },
            function () {
                window.warningTip('您已取消支付');
                self.isPaying = false;
            }
        );
    }

    render() {
        const {prescriptionDetailData,showInvoice} = this.props.prescriptionState;
        //价格格式化输出
        let firstPrice = "0", secondPrice = "0", priceDouble = "",price = "";
        let orderTotalAmountDouble = prescriptionDetailData.orderTotalAmountDouble;
        if (orderTotalAmountDouble && (orderTotalAmountDouble + "").length > 0) {
            price = (orderTotalAmountDouble + "");
            if (price.indexOf(".") === -1) {
                price = price + ".00";
            }
            priceDouble = price.split(".");
            firstPrice = priceDouble[0];
            secondPrice = priceDouble[1];
        }

        const rendering = (
            <span style={{color: "#fff"}}>请在<span>@hour@</span>小时<span>@minute@</span>分<span>@second@</span>秒内完成支付，超时订单自动取消</span>
        );

        const rendered = (
            <span style={{color: "#fff"}}>已结束</span>
        );

        return (
            <div className="prescription-detail">
                <div className="order-detail">
                    <div className="current-status">
                        <p>{this.formatOrderStat(prescriptionDetailData.orderStat)}</p>
                        {(prescriptionDetailData.orderStat === "VALUATION" || prescriptionDetailData.orderStat === "AUDIT") &&
                        <span  style={{color:"#fff"}}>订单已提交成功，请尽快付款！</span>}
                        {prescriptionDetailData.orderStat === "UNPAID" && <CountDown endDateStr={prescriptionDetailData.cancelOrderTimeMills}rendering={rendering} rendered={rendered}/>}
                        {(prescriptionDetailData.orderStat === "DISTRIBUTION" || prescriptionDetailData.orderStat === "ALLOCATE" || prescriptionDetailData.orderStat === "DECOCTION" || prescriptionDetailData.orderStat === "PACKING" || prescriptionDetailData.orderStat === "WAIT_SEND") &&
                        <span  style={{color:"#fff"}}>等待门店进行发货，请等待</span>}
                        {prescriptionDetailData.orderStat === "SEND" && <span  style={{color:"#fff"}}>订单已发货,请耐心等待</span>}
                        {prescriptionDetailData.orderStat === "FINISH" && <span  style={{color:"#fff"}}>已签收，订单完成</span>}
                        {prescriptionDetailData.orderStat === "CANCEL" && <span  style={{color:"#fff"}}>订单已关闭</span>}
                        <Link to={'/prescription/logDetail/' + prescriptionDetailData.prescriptionOrderId}>
                            <span className="logs">订单日志</span>
                        </Link>
                    </div>
                    <div className="consignee-addr">
                        <span>{"收货人: " + (prescriptionDetailData.receiverName || "")}</span>
                        <span>{prescriptionDetailData.receiverMobile || ""}</span>
                        <p>{prescriptionDetailData.receiverAddr || ""}</p>
                    </div>
                    <div className="gd-cont">
                        <div className="item"><img src={prescriptionDetailData.prescriptionPic1Url || ""} alt=""/></div>
                        {prescriptionDetailData.prescriptionPic2Url && <div className="item"><img src={prescriptionDetailData.prescriptionPic2Url} alt=""/></div>}
                        {prescriptionDetailData.prescriptionPic3Url && <div className="item"><img src={prescriptionDetailData.prescriptionPic3Url} alt=""/></div>}
                    </div>
                    <div className="model-box">
                        <div className="info-item">
                            <span>代煎</span>
                            <i>{(prescriptionDetailData.buyNum || "") + "剂"}</i>
                        </div>
                        <div className="info-item">
                            <span>孕妇</span>
                            <i>{prescriptionDetailData.isGravida === "Y" ? "是" : "否"}</i>
                        </div>
                        <div className="info-item">
                            <span>外用</span>
                            <i>{prescriptionDetailData.isExternalUse === "Y" ? "是" : "否"}</i>
                        </div>

                        {(prescriptionDetailData.orderStat !== "AUDIT" && prescriptionDetailData.orderStat !== "VALUATION" && prescriptionDetailData.orderStat !== "CANCEL") &&
                        <div className="info-item payment">
                            <span>{prescriptionDetailData.orderStat === "UNPAID" ? "应付金额" : "实付金额"}</span>
                            <i>{"¥" + firstPrice + "." + secondPrice}</i>
                        </div>
                        }
                    </div>
                    <div className="invoice-box">
                        <div className="cell-hd">发票</div>
                        <div className="cell-bd"><a
                            onClick={() => this.props.actions.setShowInvoice(true)}><i>{prescriptionDetailData.nvoiceTitle || ""}</i></a>
                        </div>
                        <div className="cell-ft"></div>
                    </div>
                    <div className="info-box">
                        <div className="info-item">
                            <span>订单编号</span>
                            <i>{prescriptionDetailData.orderNum || ""}</i>
                        </div>
                        <div className="info-item">
                            <span>下单时间</span>
                            <i>{prescriptionDetailData.createTimeString || ""}</i>
                        </div>
                        {
                            prescriptionDetailData.orderStat !== "CANCEL" &&
                            <div className="info-item">
                                <span>配送方式 </span>
                                <i>快递配送</i>
                            </div>
                        }
                    </div>

                    {
                        prescriptionDetailData.orderStat === "AUDIT" &&
                        <div>
                            <div className="dt-footer">
                                <a className="md-btn2" onClick={()=>this.cancelOrder(prescriptionDetailData.prescriptionOrderId)}>取消订单</a>
                            </div>
                            <div className="hold-div-bottom"/>
                        </div>
                    }

                    {prescriptionDetailData.orderStat === "UNPAID" &&
                    <div>
                        <div className="dt-footer">
                            <a className="md-btn2" onClick={()=>this.payNow(prescriptionDetailData.prescriptionOrderId)}>立即支付</a>
                        </div>
                        <div className="hold-div-bottom"/>
                    </div>
                    }

                    {prescriptionDetailData.orderStat === "SEND" &&
                    <div>
                        <div className="dt-footer">
                            <Link to={'/prescription/logistics/' + prescriptionDetailData.logisticsCompanyCode + "/" + prescriptionDetailData.logisticsOrderNum}>
                                <span className="md-btn1">查看物流</span>
                            </Link>
                            <a className="md-btn2"
                               onClick={() => this.confirmPrescriptionDelivery(prescriptionDetailData.prescriptionOrderId)}>确认收货</a>
                        </div>
                        <div className="hold-div-bottom"/>
                    </div>
                    }

                    {prescriptionDetailData.orderStat === "FINISH" &&
                    <div>
                        <div className="dt-footer">
                            <Link to={'/prescription/logistics/' + prescriptionDetailData.logisticsCompanyCode + "/" + prescriptionDetailData.logisticsOrderNum}>
                                <span className="md-btn1">查看物流</span>
                            </Link>
                        </div>
                        <div className="hold-div-bottom"></div>
                    </div>
                    }
                </div>
                {showInvoice && <div className="invoice-layer">
                    <div className="invoice-info">
                        <div className="mt">发票信息</div>
                        <div className="mc">
                            <div className="item">
                                <div className="cell-hd">发票抬头</div>
                                <div className="cell-bd"><span>{prescriptionDetailData.nvoiceTitle || ""}</span></div>
                            </div>
                            <div className="item">
                                <div className="cell-hd">发票税号</div>
                                <div className="cell-bd"><span>{prescriptionDetailData.nvoiceTfn || ""}</span></div>
                            </div>
                            <div><span className="submit-btn default-btn" onClick={() => this.props.actions.setShowInvoice(false)}>确定</span></div>
                        </div>
                    </div>
                </div>}
            </div>
        )
    }
}

PrescriptionDetail.propTypes = {};

PrescriptionDetail.contextTypes = {};

const mapStateToProps = (store, ownProps) => {
    return {
        prescriptionState: store.prescriptionState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({findPrescriptionDetail, setShowInvoice, changeOrderState,prescriptionPay}, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PrescriptionDetail);