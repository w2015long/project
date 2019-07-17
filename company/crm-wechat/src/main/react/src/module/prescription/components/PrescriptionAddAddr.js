/**
 * @author olx
 * @date 2018/3/31
 */
//拍单购药地址组件
import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import "../style/prescriptionAddAddr.css";
import PrescriptionInvoice from "./PrescriptionInvoice";
import Address from "../../common/components/Address";
import {
    addressSelectCallback,
    savePrescriptionOrder,
    setAge,
    setFiles,
    setInvoice,
    setIsDecoction,
    setIsExternalUse,
    setIsGravida,
    setIsNeedInvoice,
    setIsShowNeedInvoiceLayer,
    setIsShowRuleDescriptionLayer,
    setIsShowSelectAddressLayer,
    setNvoiceTfn,
    setNvoiceTitle,
    setuserSex
} from "../actions/prescriptionActions";
import {REG_INT} from "../../../util/common-reg";
class PrescriptionAdd extends Component {

    componentWillMount() {

    }
    componentDidMount() {

    }
    componentDidUpdate (){

    }
    componentWillUnmount(){
    }


    render() {
        const {
            files,
            isShowNeedInvoiceLayer,
            isShowaddSelectAddressLayer,
            address,//初始地址
            isNeedInvoice,//是否 开具 发票
            nvoiceTitle,//发票抬头
            nvoiceTfn,//发票的税号
            userSex,//性别类型
            age//性别类型
        } = this.props.prescriptionState;

        if (!files || files.length < 1){
            this.props.history.goBack();
        }
        return (
            <div className="prescription-addr" >
                {isShowNeedInvoiceLayer && <PrescriptionInvoice setNvoiceTfn={this.props.actions.setNvoiceTfn} setNvoiceTitle={this.props.actions.setNvoiceTitle} nvoiceTitle={nvoiceTitle} isNeedInvoice={isNeedInvoice} nvoiceTfn={nvoiceTfn} setInvoice={()=> this.props.actions.setIsNeedInvoice()} getInvoice={(state,nvoiceTitle,nvoiceTfn)=>this.getInvoice(state,nvoiceTitle,nvoiceTfn)} closeNeedInvoiceLayer={()=>{this.props.actions.setIsShowNeedInvoiceLayer(false)}}/>}
                {isShowaddSelectAddressLayer && <Address callbackFunc={(data) => this.returnAddr(data)} needJudgeDistributionRange='N'/>}
                {!isShowaddSelectAddressLayer && !isShowNeedInvoiceLayer && <div className="get-prescription-info">
                    <div className="rb-bg"/>
                    <div className="consignee-addr" style={{display:address.name?"none":"block"}}>
                        <a onClick={()=> this.props.actions.setIsShowSelectAddressLayer()}>
                            <span>新增地址</span>
                            <p>暂无收货人信息，请完善</p>
                        </a>
                    </div>
                    <div className="consignee-addr" style={{display:address.name?"block":"none"}}>
                        <a onClick={()=> this.props.actions.setIsShowSelectAddressLayer()} >
                            <span>{address.name} </span>
                            <span>{address.mobile}</span>
                            <p>{address.addressDetail}</p>
                        </a>
                    </div>
                    <div className="cont">
                        <div className="item">
                            <div className="cell-hd">性别</div>
                            <div className="cell-bd">
                                <div className="mow">
                                    <label className={ userSex === "MALE"?" checked":""} onClick={()=>{this.props.actions.setuserSex("MALE")}}>男</label>
                                    <label className={ userSex === "FEMALE"?" checked":""} onClick={()=>{this.props.actions.setuserSex("FEMALE")}}>女</label>
                                    <label className={ userSex === "SECRET"||!userSex?"checked":""} onClick={()=>{this.props.actions.setuserSex("SECRET")}}>保密</label>
                                </div>
                            </div>
                        </div>
                        <div className="item">
                            <div className="cell-hd">年龄</div>
                            <div className="cell-bd"><input   ref="age" value ={age} onChange={e => this.ageOnInput(e)} type="number" pattern="[0-9]*" /></div>
                        </div>

                    </div>
                    <div className="cont">
                        <div className="item" onClick={()=>{this.props.actions.setIsShowNeedInvoiceLayer(true)}}>
                            <div className="cell-hd">发票</div>
                            <div className="cell-bd"><a>{nvoiceTitle}</a></div>
                            <div className="cell-ft"/>
                        </div>
                    </div>
                    <a    className={address.name ? "submit-btn":"disabled-btn"} onClick={() => this.submitOrderFunc()}>提交订单</a>

                </div>}
            </div>
        )
    }
    ageOnInput(e){
        let val = e.target.value;
        if(val.length > 2){
            val = val.slice(0, 2)
        }
        if(!REG_INT.test(val)){
            val = "";
        }
        this.props.actions.setAge(val);
    }
    submitOrderFunc() {
        const self = this;
        const {
            nvoiceTfn,
            userSex,
            nvoiceTitle,
            age,
            isDecoction, //是否代煎
            isGravida, //是否孕妇
            isExternalUse,//是否 外用
            isNeedInvoice,//是否 开具 发票
            files,// 文件
            buyNum,// 数量
            address,
            userRemark//备注
        } = this.props.prescriptionState;
        const data = {
            prescriptionPic1:files[0]&&files[0].fileId,
            prescriptionPic2:files[1] && files[1].fileId,
            prescriptionPic3:files[2] && files[2].fileId,
            isDecoction:isDecoction?"Y":"N",
            isGravida:isGravida?"Y":"N",
            isExternalUse:isExternalUse?"Y":"N",
            buyNum:buyNum,
            userRemark:userRemark,
            isNeedInvoice:isNeedInvoice?"Y":"N",
            nvoiceTitle:nvoiceTitle,
            nvoiceTfn:nvoiceTfn,
            userSex:userSex,
            userAge:age,
            receiverName:address.name,
            receiverMobile:address.mobile,
            receiverAddr:address.addressDetail,
        };
        if(!data.prescriptionPic1){
            window.errorTip("请上传处方单");
            return;
        }
        if(!data.prescriptionPic1){
            window.errorTip("请上传处方单");
            return;
        }
        if(!data.buyNum){
            window.errorTip("请完善付数");
            return;
        }

        if(!address.name){
            window.errorTip("选择地址或新建地址");
            return;
        }

        return this.props.actions.savePrescriptionOrder(data,function () {
            self.props.history.push('/prescription/list');
            window.successTip("订单提交完成");
            self.props.actions.setFiles([]);
        });
    }

    getInvoice(nvoiceTitle,nvoiceTfn) {
        this.props.actions.setInvoice(nvoiceTitle, nvoiceTfn);
        this.props.actions.setIsShowNeedInvoiceLayer(false);
    }


    returnAddr(data) {
        this.props.actions.addressSelectCallback(data);
        this.props.actions.setIsShowSelectAddressLayer()
    }
}

PrescriptionAdd.propTypes = {
};

PrescriptionAdd.contextTypes = {
};

const mapStateToProps = (store, ownProps) => {
    return {
        prescriptionState:store.prescriptionState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            setIsShowRuleDescriptionLayer,
            setIsDecoction,
            setIsGravida,
            setIsExternalUse,
            savePrescriptionOrder,
            setIsNeedInvoice,
            setNvoiceTfn,
            setAge,
            setNvoiceTitle,
            setInvoice,
            addressSelectCallback,
            setIsShowSelectAddressLayer,
            setuserSex,
            setIsShowNeedInvoiceLayer,
            setFiles
        }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PrescriptionAdd);


