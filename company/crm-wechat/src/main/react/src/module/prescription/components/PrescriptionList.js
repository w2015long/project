import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Link} from "react-router-dom";
import "../style/PrescriptionList.css";
import "../../../module/common/style/swiper.min.css";
import {
    changeOrderState,
    getOrderStateNum,
    pagePrescriptionList,
    prescriptionPay,
    setParams
} from "../actions/prescriptionActions";
import AutoLoadMore from "../../common/components/AutoLoadMore";
import EmptyPage from "../../common/components/EmptyPage";
import {initJsSdk, wxPay} from "../../common/actions/jssdkAction";
//拍单购药列表
class PrescriptionList extends Component {

    constructor(props){
        super(props);
    }

    componentWillMount() {
        document.title = '订单列表';
        const {prescriptionPage,params} = this.props.prescriptionState;
        this.props.actions.getOrderStateNum();
        this.props.actions.pagePrescriptionList(params, prescriptionPage.page, prescriptionPage.size);
    }

    componentDidMount() {
        new window.Swiper('.tab-tit',{
            freeMode : true,
            slidesPerView : 'auto'
        });

        //初始化JsSdk
        initJsSdk();
    }

    payNow(orderId){
        let self = this;
        wxPay(
            'PRESCRIPTION',
            orderId,
            function () {
                self.refresh();
            },
            function () {
                window.warningTip('支付失败');
            },
            function () {
                window.warningTip('您已取消支付');
            }
        );
    }

    componentWillUnmount() {

    }

    componentDidUpdate(){

    }

    loadMoreData() {
        let {params,prescriptionPage} = this.props.prescriptionState;
        this.props.actions.pagePrescriptionList(params, prescriptionPage.page + 1, prescriptionPage.size,prescriptionPage.prescriptions);
    }

    //订单状态展开与收缩
    changeMoreOrderStateBox(){
        let clazz = this.refs.moreOrderStateBox.className;
        if(clazz === "more") {
            this.refs.moreOrderStateBox.className = "more active";
        } else {
            this.refs.moreOrderStateBox.className = "more";
        }
    }

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

    //订单状态下拉框事件
    selectOrderStat(e,orderStat){
        e.preventDefault();
        let {params,prescriptionPage} = this.props.prescriptionState;
        params = Object.assign({},params ,{orderStat:orderStat});
        this.props.actions.setParams(params);
        this.props.actions.pagePrescriptionList(params,0,prescriptionPage.size);
        this.refs.moreOrderStateBox.className = "more";
    }

    //订单状态导航栏事件
    changeOrderState(e,orderStat){
        e.preventDefault();
        let {params,prescriptionPage} = this.props.prescriptionState;
        params = Object.assign({},params ,{orderStat:orderStat});
        this.props.actions.setParams(params);
        this.props.actions.pagePrescriptionList(params,0,prescriptionPage.size);
    }

    //计算待发货订单数
    countWaitSendNum(myMap) {
        let waitSendNum = 0;
        if (myMap.get("ALLOCATE") ) {
            waitSendNum = myMap.get("ALLOCATE");
        }
        if (myMap.get("DISTRIBUTION") ) {
            waitSendNum += myMap.get("DISTRIBUTION");
        }
        if (myMap.get("DECOCTION") ) {
            waitSendNum += myMap.get("DECOCTION");
        }
        if (myMap.get("PACKING") ) {
            waitSendNum += myMap.get("PACKING");
        }
        if (myMap.get("WAIT_SEND") ) {
            waitSendNum += myMap.get("WAIT_SEND");
        }
        return waitSendNum;
    }

    //计算待审核订单数
    countAuditNum(myMap){
        let auditNum = 0;
        if (myMap.get("AUDIT") ) {
            auditNum = myMap.get("AUDIT");
        }
        if (myMap.get("VALUATION")) {
            auditNum += myMap.get("VALUATION");
        }
        return auditNum;
    }

    //确认收货
    confirmPrescriptionDelivery(prescriptionOrderId) {
        let self = this;
        window.showConfirm(
            "确认收货吗？",
            () => {
                this.props.actions.changeOrderState(prescriptionOrderId, "FINISH", success => {
                    if (success) {
                        self.refresh();
                    }
                });
            });
    }

    cancelOrder(prescriptionOrderId) {
        let self = this;
        window.showConfirm(
            "确认取消处方订单吗？",
            () => {
                this.props.actions.changeOrderState(prescriptionOrderId, "CANCEL", success => {
                    if (success) {
                        self.refresh();
                    }
                });
            });
    }

    refresh(){
        let self = this;
        const {prescriptionPage, params} = self.props.prescriptionState;
        self.props.actions.getOrderStateNum();
        self.props.actions.pagePrescriptionList(params, prescriptionPage.page, prescriptionPage.size);
    }

    render() {
        const {prescriptionPage,params,orderNumInfo} = this.props.prescriptionState;
        let myMap = new Map();
        for (let i = 0; i < orderNumInfo.length; i++) {
            myMap.set(orderNumInfo[i].orderStat, orderNumInfo[i].stateNum);
        }
        let auditNum = this.countAuditNum(myMap);
        let waitSendNum = this.countWaitSendNum(myMap);

        const isHaveNextPage = prescriptionPage.size * (prescriptionPage.page + 1) < prescriptionPage.recordsFiltered;
        return (
            <div className="prescription-list">
                <div className="order-list">
                    <div className="hold-div-top"></div>
                    <div className="tab-tit ">
                        <ul className="tab-nav swiper-wrapper clearfix">
                            <li className={params.orderStat === "" ? 'swiper-slide cur' : 'swiper-slide'} onClick={(e) => this.changeOrderState(e,"")}>
                                <a>全部</a>
                            </li>
                            <li className={params.orderStat === "AUDIT" ? 'swiper-slide cur' : 'swiper-slide'} onClick={(e) => this.changeOrderState(e,"AUDIT")}>
                                <a>待审核{(myMap.get("AUDIT")  || myMap.get("VALUATION")) && <span>{auditNum}</span>}</a>
                            </li>
                            <li className={params.orderStat === "UNPAID" ? 'swiper-slide cur' : 'swiper-slide'} onClick={(e) => this.changeOrderState(e,"UNPAID")}>
                                <a>待付款{myMap.get("UNPAID")  && <span>{myMap.get("UNPAID")}</span>}</a>
                            </li>
                            <li className={params.orderStat === "WAIT_SEND" ? 'swiper-slide cur' : 'swiper-slide'} onClick={(e) => this.changeOrderState(e,"WAIT_SEND")}>
                                <a>待发货{(myMap.get("WAIT_SEND")  || myMap.get("ALLOCATE")  || myMap.get("DISTRIBUTION")  || myMap.get("DECOCTION")  || myMap.get("PACKING") ) && <span>{waitSendNum}</span>}</a>
                            </li>
                            <li className={params.orderStat === "SEND" ? 'swiper-slide cur' : 'swiper-slide'} onClick={(e) => this.changeOrderState(e,"SEND")}>
                                <a>待收货{myMap.get("SEND")  && <span>{myMap.get("SEND")}</span>}</a>
                            </li>
                            <li className={params.orderStat === "FINISH" ? 'swiper-slide cur' : 'swiper-slide'} onClick={(e) => this.changeOrderState(e,"FINISH")}>
                                <a>已完成</a>
                            </li>
                            <li className={params.orderStat === "CANCEL" ? 'swiper-slide cur' : 'swiper-slide'} onClick={(e) => this.changeOrderState(e,"CANCEL")}>
                                <a>已关闭</a>
                            </li>
                        </ul>
                        <div className="more" ref={'moreOrderStateBox'}>
                            <i onClick={() => this.changeMoreOrderStateBox()}></i>
                            <div className="more-box">
                                <span className={params.orderStat === "" ? 'selected' : ''} onClick={(e) => this.selectOrderStat(e,"")}>全部</span>
                                <span className={params.orderStat === "AUDIT" ? 'selected' : ''} onClick={(e) => this.selectOrderStat(e,"AUDIT")}>待审核</span>
                                <span className={params.orderStat === "UNPAID" ? 'selected' : ''} onClick={(e) => this.selectOrderStat(e,"UNPAID")}>待付款</span>
                                <span className={params.orderStat === "WAIT_SEND" ? 'selected' : ''} onClick={(e) => this.selectOrderStat(e,"WAIT_SEND")}>待发货</span>
                                <span className={params.orderStat === "SEND" ? 'selected' : ''} onClick={(e) => this.selectOrderStat(e,"SEND")}>待收货</span>
                                <span className={params.orderStat === "FINISH" ? 'selected' : ''} onClick={(e) => this.selectOrderStat(e,"FINISH")}>已完成</span>
                                <span className={params.orderStat === "CANCEL" ? 'selected' : ''} onClick={(e) => this.selectOrderStat(e,"CANCEL")}>已关闭</span>
                            </div>
                        </div>
                    </div>
                    {
                        prescriptionPage.prescriptions.length === 0 ? <EmptyPage/> :
                            <div className="gd-cont" id="prescriptionList">
                                {
                                    prescriptionPage.prescriptions.map(prescription => {
                                        //价格格式化输出
                                        let firstTotalAmount = "0", secondTotalAmount = "0", amount = "",
                                            totalAmount = "";
                                        let orderTotalAmount = prescription.orderTotalAmount;

                                        if (orderTotalAmount && (orderTotalAmount + "").length > 0) {
                                            totalAmount = (orderTotalAmount + "");
                                            if (totalAmount.indexOf(".") === -1) {
                                                totalAmount = totalAmount + ".00";
                                            }
                                            amount = totalAmount.split(".");
                                            firstTotalAmount = amount[0];
                                            secondTotalAmount = amount[1];
                                        }

                                        return (
                                            <div className="gd-box" key={prescription.prescriptionOrderId}>
                                                <Link to={'/prescription/' + prescription.prescriptionOrderId}>
                                                    <div className="mt">
                                                        <div
                                                            className="order-number">{"订单号：" + prescription.orderNum}</div>
                                                        <span
                                                            className={(prescription.orderStat !== "CANCEL" && prescription.orderStat !== "FINISH") ? "yello-color" : ""}>{this.formatOrderStat(prescription.orderStat)}</span>
                                                    </div>
                                                    <div className="mc">
                                                        <div className="item"><img src={prescription.prescriptionPic1}
                                                                                   alt=""/></div>
                                                        {(prescription.prescriptionPic2 !== null && prescription.prescriptionPic2 !== "" ) &&
                                                        <div className="item"><img
                                                            src={prescription.prescriptionPic2 || ""} alt=""/></div>}
                                                        {(prescription.prescriptionPic3 !== null && prescription.prescriptionPic3 !== "" ) &&
                                                        <div className="item"><img
                                                            src={prescription.prescriptionPic3 || ""} alt=""/></div>}
                                                    </div>
                                                </Link>
                                                <div className="md">
                                                    {
                                                        prescription.orderStat === "AUDIT" && <a className="md-btn2" onClick={() => this.cancelOrder(prescription.prescriptionOrderId)}>取消订单</a>
                                                    }
                                                    {(prescription.orderStat !== "AUDIT" && prescription.orderStat !== "CANCEL") &&
                                                    <p>共&nbsp;<span>{prescription.productTotalAmount}</span>&nbsp;
                                                        种药品&nbsp;{prescription.buyNum}&nbsp;剂代煎&nbsp;
                                                        实付款:<span>￥</span><i>{firstTotalAmount}</i><span>{"." + secondTotalAmount}</span>
                                                    </p>}
                                                    {(prescription.orderStat === "SEND" || prescription.orderStat === "FINISH") &&
                                                    <Link
                                                        to={'/prescription/logistics/' + prescription.logisticsCompanyCode + "/" + prescription.logisticsOrderNum}>
                                                        <span className="md-btn1">查看物流</span>
                                                    </Link>
                                                    }
                                                    {prescription.orderStat === "SEND" && <a className="md-btn2"
                                                                                             onClick={() => this.confirmPrescriptionDelivery(prescription.prescriptionOrderId)}>确认收货</a>}
                                                    {prescription.orderStat === "UNPAID" && <a className="md-btn2"
                                                                                               onClick={() => this.payNow(prescription.prescriptionOrderId)}>立即支付</a>}
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                    }
                    <AutoLoadMore loadMoreFunc={this.loadMoreData.bind(this)} isHaveNextPage={isHaveNextPage} container={'prescriptionList'}/>
                </div>
            </div>
        )
    }
}

PrescriptionList.propTypes = {};

PrescriptionList.contextTypes = {

};

const mapStateToProps = (store, ownProps) => {
    return {
        prescriptionState: store.prescriptionState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({pagePrescriptionList,getOrderStateNum,setParams,prescriptionPay,changeOrderState}, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PrescriptionList);