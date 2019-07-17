/**
 * @author olx
 * @date 2018/3/31
 */
//基本组件
import React, {Component} from "react";
import {Link} from "react-router-dom";

import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import "../style/prescriptionAdd.css";
import {
    getAddrDetail,
    getDecoctionRuleDescription,
    setBuyNum,
    setFiles,
    setIsDecoction,
    setIsExternalUse,
    setIsGravida,
    setIsNeedInvoice,
    setIsShowNeedInvoiceLayer,
    setIsShowRuleDescriptionLayer,
    setUserRemark,
    setuserSex
} from "../actions/prescriptionActions";
import RuleDescription from "./RuleDescription";
import PrescriptionAddAddr from "./PrescriptionAddAddr";
import PicturesWall from "../../common/components/PicturesWall";
import {REG_INT} from "../../../util/common-reg";
class PrescriptionAdd extends Component {

    componentWillMount() {
        document.title = '添加处方单';
        this.props.actions.getDecoctionRuleDescription();
        this.props.actions.getAddrDetail();
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {
    }

    buyNumOnInput(e) {
        let val = e.target.value;
        if (val.length > 2) {
            val = val.slice(0, 2)
        }

        if (!REG_INT.test(val)) {
            val = "";
        }

        this.props.actions.setBuyNum(val);
    }

    buyUserRemark(e) {
        let val = e.target.value;
        if (val.length > 128) {
            val = val.slice(0, 128)
        }
        this.props.actions.setUserRemark(val);
    }

    onFileUploadSuccess(file) {
        let files = this.props.prescriptionState.files;
        files.push(file);
        this.props.actions.setFiles(files);
    }

    handleFileDelete(file) {
        let files = this.props.prescriptionState.files;
        const object = this;

        for (let index = 0, len = files.length; index < len; index++) {
            if (files[index].fileId === file.fileId) {
                files.splice(index, 1);
                object.props.actions.setFiles(files);
                break;
            }
        }
    }

    render() {
        const {
            isShowRuleDescriptionLayer,
            isShowNeedInvoiceLayer,
            isDecoction, //是否代煎
            isGravida, //是否孕妇
            isExternalUse,//是否 外用
            files,
            buyNum,
            decoctionRuleDescription,
            userRemark
        } = this.props.prescriptionState;
        const uploadParams = {
            onSuccess:this.onFileUploadSuccess.bind(this),
            onRemove:this.handleFileDelete.bind(this),
            numberOfLimit:3,
            numberOfSize:10
        };

        return (<div className="prescription-add">
                {isShowRuleDescriptionLayer && <RuleDescription description={decoctionRuleDescription}
                                                                callbackFunc={() => this.props.actions.setIsShowRuleDescriptionLayer(false)}/>}
                {isShowNeedInvoiceLayer && <PrescriptionAddAddr />}

                <div className="prescription-main">
                    <div className="mt">
                        <a className="back"/>
                        <span>处方信息</span>
                        <a className="rule-btn" onClick={() => this.props.actions.setIsShowRuleDescriptionLayer(true)}>规则说明</a>
                    </div>
                    <div className="hold-div-top"/>
                    <div className="mc">
                        <div className="up-pic">
                            <p>上传处方单</p>
                            <div className="pic-box">
                                <PicturesWall {...uploadParams}/>
                            </div>
                        </div>
                        <div className="cont">
                            <div className="item">
                                <div className="cell-hd">付数</div>
                                <div className="cell-bd"><input placeholder="请输入付数" ref="buyNum" type="number" pattern="[0-9]*"
                                    value={buyNum} onChange={e => this.buyNumOnInput(e)}/><span
                                    className="unit">剂</span></div>
                            </div>
                            <div className="item">
                                <div className="cell-hd">代煎</div>
                                <div className="cell-bd text-right"><span
                                    className={ isDecoction ? " switchery checked" : "switchery"}
                                    onClick={() => this.props.actions.setIsDecoction()} ref="isDecoction"><i/></span>
                                </div>
                            </div>
                        </div>
                        <div className="cont">
                            <div className="item">
                                <div className="cell-hd">孕妇</div>
                                <div className="cell-bd text-right"><span
                                    className={ isGravida ? "switchery checked" : "switchery"}
                                    onClick={() => this.props.actions.setIsGravida()} ref="isGravida"><i/></span></div>
                            </div>
                            <div className="item">
                                <div className="cell-hd">外用</div>
                                <div className="cell-bd text-right"><span
                                    className={isExternalUse ? "switchery checked" : "switchery"}
                                    onClick={() => this.props.actions.setIsExternalUse()}
                                    ref="isExternalUse"><i/></span></div>
                            </div>
                            <div className="item">
                                <div className="cell-hd">备注</div>
                                <div className="cell-bd"><textarea name="" rows="3" placeholder="请输入备注内容"
                                                                   value={userRemark} ref="userRemark"
                                                                   onChange={e => this.buyUserRemark(e)}
                                                                   maxLength="128"/></div>
                            </div>
                        </div>
                        <Link className={buyNum && files.length > 0 ? "next-btn " : "next-btn disabled default-btn" }
                              to={buyNum && files.length > 0 ? '/prescription/addAddr' : "##" }>下一步</Link>

                    </div>
                </div>
            </div>
        )
    }
}

PrescriptionAdd.propTypes = {};

PrescriptionAdd.contextTypes = {};

const mapStateToProps = (store, ownProps) => {
    return {
        prescriptionState: store.prescriptionState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            setIsShowRuleDescriptionLayer,
            setIsDecoction,
            setIsGravida,
            setBuyNum,
            setFiles,
            setIsExternalUse,
            setUserRemark,
            setIsNeedInvoice,
            getDecoctionRuleDescription,
            getAddrDetail,
            setuserSex,
            setIsShowNeedInvoiceLayer
        }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PrescriptionAdd);




