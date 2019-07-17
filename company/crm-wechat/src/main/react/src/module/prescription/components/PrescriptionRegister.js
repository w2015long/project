import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import "../style/PrescriptionRegister.css";
import {
    getMemberDefaultAddr,
    getProductDetail,
    submitPrescriptionRegister,
} from "../actions/prescriptionRegisterActions";
import PrescriptionRegisterProductDetail from "./PrescriptionRegisterProductDetail";
import {REG_INT} from "../../../util/common-reg";
import Address from "../../common/components/Address";
// 离开页面时调用
import PromptLayer from "../../common/components/PromptLayer";
//上传图片
import PicturesWall from "../../common/components/PicturesWall";

class PrescriptionRegister extends Component {

    componentWillMount() {
        document.title = '处方登记';
        let {platformType, productId} = this.props.match.params;
        this.props.actions.getProductDetail(platformType, productId);
        this.props.actions.getMemberDefaultAddr();
    }


    constructor(props){
        super(props);

        let submitData = {
            registerNum: "",
            registerRemark: "",
            prescription: "" // 处方笺图片
        };

        this.state = {
            second: 5,
            tipsLayer: false,
            showAddress: 'N', // 是否显示选择地址组件
            submitData: submitData,
        };
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    /**
     * 修改 state
     */
    changeState(state) {
        this.setState(state);
    }

    /**
     * 设置地址收货地址
     */
    setReceiverAddr(receiverAddr) {
        console.log(receiverAddr);
        const {prescriptionRegisterAddress} = this.props.prescriptionRegisterState;
        prescriptionRegisterAddress.receiverAddrId = receiverAddr.receiverAddrId;
        prescriptionRegisterAddress.receiverName = receiverAddr.receiverName;
        prescriptionRegisterAddress.receiverMobile = receiverAddr.contactTel;
        prescriptionRegisterAddress.receiverAddr = receiverAddr.deliveryAddr + receiverAddr.detailAddr;
    }

    handleInputChange(event) {
        let self = this;
        let {submitData} = self.state;
        const target = event.target;
        const value = target.value.trim();
        const name = target.name;
        if ("registerNum" === name) {
            self.setState({"submitData": Object.assign({}, self.state.submitData, {"registerNum": value})}, () => {
                console.log(self.state.submitData);
            });
        } else if ("registerRemark" === name) {
            self.setState({"submitData": Object.assign({}, self.state.submitData, {"registerRemark": value})}, () => {
                console.log(self.state.submitData);
            });
        }
    }

    handleInputChangeAndTip() {
        let self = this;
        let submitData = self.state.submitData;
        let currentProductId = self.props.prescriptionRegisterState.productDetail.productId;
        let {platformType, productId} = self.props.match.params;
        if (!currentProductId) {
            window.warningTip('商品异常');
            return;
        }
        if (!submitData["registerNum"].trim()) {
            window.warningTip('请输入您的预订数量');
            return;
        }

        if (!REG_INT.test(submitData["registerNum"])) {
            window.warningTip('数量格式错误');
            return;
        }
        const {prescriptionRegisterAddress} = this.props.prescriptionRegisterState;
        let data = {
            receiverAddrId: prescriptionRegisterAddress.receiverAddrId,
            platformType: platformType,
            productId: productId,
            registerNum: submitData.registerNum,
            registerRemark: submitData.registerRemark,
            prescription: submitData.prescription // 处方笺图片

        };
        self.props.actions.submitPrescriptionRegister(data, this.props.history, function (data) {
            self.setState({"tipsLayer": true}, function () {
                let second = self.state.second;
                let setIntervalFun = setInterval(function () {
                    if (second <= 0) {
                        clearInterval(setIntervalFun);
                        self.props.history.push('/product/detail/' + data.productId + '/' + data.platformType);
                        self.setState({second: 5});
                    } else {
                        self.setState({second: --second});
                    }
                }, 1000);
            });

        });

    }

    //添加图片时 拼接图片路径
    onFileUploadSuccess(fileData) {
        let self = this;
        console.log(fileData);
        self.setState({"submitData": Object.assign({}, self.state.submitData, {"prescription": fileData.fileId})}, () => {
            console.log(self.state.submitData);
        });
    }

    //删除图片时 更改图片路径
    handleFileDelete(fileData) {
        let self = this;
        console.log(fileData);
        self.setState({"submitData": Object.assign({}, self.state.submitData, {"prescription": ""})}, () => {
            console.log(self.state.submitData);
        });
    }

    render() {
        let self = this;
        const {memberInfo, productDetail, prescriptionRegisterAddress} = this.props.prescriptionRegisterState;
        let {platformType, productId} = this.props.match.params;
        const {actions} = this.props;
        return (
            <div className="prescription-register-main">
                {
                    this.state.showAddress === 'Y' &&
                    <Address callbackFunc={(receiverAddr) => {
                        self.changeState({showAddress: 'N'});
                        self.setReceiverAddr(receiverAddr);
                    }
                    } needJudgeDistributionRange='N'/>
                }
                {
                    this.state.showAddress === 'N' &&
                    <div className="prescription_register">
                        <div className="prescription-register">
                            <PrescriptionRegisterProductDetail history={this.props.history}
                                                               platformType={platformType || ""}
                                                               productId={productId || 0}
                                                               picture={productDetail.picture || ""}
                                                               productNm={productDetail.productNm || "商品异常..."}
                                                               priceDouble={productDetail.priceDouble}/>
                            <div className="address"><a href="javascript:void(0);"
                                                        onClick={() => self.changeState({showAddress: 'Y'})}>
                                <div className="addr-hd">
                                    <span>{prescriptionRegisterAddress.receiverName ? prescriptionRegisterAddress.receiverName : '新增地址'}</span>
                                    <span>{prescriptionRegisterAddress.receiverMobile ? prescriptionRegisterAddress.receiverMobile : ''}</span>
                                </div>
                                <div className="addr-bd">
                                    <span>{prescriptionRegisterAddress.receiverAddr ? prescriptionRegisterAddress.receiverAddr : '没有收货地址'}</span>
                                </div>
                            </a></div>
                            <div className="order-quantity">
                                <span className="lable"><i>*</i>预订数量</span>
                                <input type="text" name="registerNum" placeholder="请输入您想预订的数量"
                                       onChange={this.handleInputChange}/>
                            </div>
                            <div className="remark">
                                <span className="lable">备注信息</span>
                                <input type="text" name="registerRemark" placeholder="如有特殊需求，请在此处说明"
                                       onChange={this.handleInputChange}/>
                            </div>
                            <div className="pre-pic">
                                <PicturesWall
                                    onSuccess={this.onFileUploadSuccess.bind(this)}
                                    onRemove={this.handleFileDelete.bind(this)}
                                    numberOfLimit={1}
                                    numberOfSize={10}
                                />
                            </div>
                            <div className="tip-tex">如紧急，请联系药师咨询</div>
                            <div className="bot-box">
                                <a href="javascript:void(0);"
                                   onClick={() => this.props.history.push('/index/pharmacist')} className="consult-btn"><i
                                    className="consult-icon"></i>药师咨询</a>
                                <a href="javascript:void(0);" onClick={() => {
                                    this.handleInputChangeAndTip()
                                }} className="sub-btn active"><i className="sub-icon"/>提交登记</a>
                            </div>
                        </div>
                        {!self.state.tipsLayer && <PromptLayer msg={"确认放弃此次编辑？"} cancelFunc={() => {
                        }}/>}
                        {self.state.tipsLayer &&
                        <div className="tips-layer" style={{"display": "disable"}}>
                            <div className="cont">
                                <h5>提交成功</h5>
                                <p>我们的药师会与您电话联系，谢谢！</p>
                                <span>{this.state.second}秒后自动返回商品详情</span>
                                <i className="close"
                                   onClick={() => this.props.history.push('/product/detail/' + productId + '/' + platformType)}/>
                            </div>
                        </div>}
                    </div>
                }
            </div>
        )
    }
}

PrescriptionRegister.propTypes = {};

PrescriptionRegister.contextTypes = {};

const mapStateToProps = (store, ownProps) => {
    return {
        prescriptionRegisterState: store.prescriptionRegisterState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            getProductDetail,
            submitPrescriptionRegister,
            getMemberDefaultAddr,
        }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PrescriptionRegister);




