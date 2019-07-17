/**
 * 拍单购药-发票页面
 * @author olx
 * @date 2018/3/31
 */

import React, {Component} from "react";
import PropTypes from "prop-types";

class PrescriptionInvoice extends Component {

    componentWillMount() {
        document.title = '订单发票';
    }

    render() {
        const {isNeedInvoice,nvoiceTitle,nvoiceTfn} = this.props;
        return (
            <div className="prescription-addr">
                <div className="invoice-layer">
                    <div className="invoice-box" style={{backgroundColor: " #fff"}}>
                        <div className="mt">发票信息<span className={ isNeedInvoice ? " switchery checked" : "switchery"} onClick={(state) => this.props.setInvoice()} src="isNeedInvoice"><i/></span></div>
                        <div className="mc" style={{display: isNeedInvoice ? "block" : "none"}}>
                            <div className="item">
                                <div className="cell-hd">发票抬头</div>
                                <div className="cell-bd"><input type="text" ref="nvoiceTitle" value={nvoiceTitle} placeholder="请输入发票抬头信息" src="nvoiceTitle" onChange={e => this.nvoiceTitleOnInput(e)} maxLength="40"/></div>
                            </div>
                            <div className="item">
                                <div className="cell-hd">发票税号</div>
                                <div className="cell-bd"><input type="text" ref="nvoiceTfn" placeholder="请输入发票的税号号码" value={nvoiceTfn} src="nvoiceTfn" onChange={e => this.nvoiceTfnOnInput(e)} maxLength="40"/></div>
                            </div>
                        </div>
                        <div className="md"><a onClick={() => this.getInvoice(this)} className="submit-btn  ">确认</a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    getInvoice(object) {
        const isNeedInvoice = object.props.isNeedInvoice;
        const nvoiceTitle = object.refs.nvoiceTitle.value;
        const nvoiceTfn = object.refs.nvoiceTfn.value;
        if (isNeedInvoice&&!(nvoiceTfn && nvoiceTitle && nvoiceTfn.trim() && nvoiceTitle.trim())) {
            window.warningTip("请完善发票号跟发票抬头");
        } else {
            object.props.closeNeedInvoiceLayer()
        }
    }

    nvoiceTitleOnInput(e) {
        let val = e.target.value;
        if(val.length > 32){
            val = val.slice(0, 32)
        }
        this.props.setNvoiceTitle(val);
    }

    nvoiceTfnOnInput(e) {
        let val = e.target.value;
        if(val.length > 32){
            val = val.slice(0, 32)
        }
        this.props.setNvoiceTfn(val);
    }
}

PrescriptionInvoice.propTypes = {
    isNeedInvoice: PropTypes.bool.isRequired,
    getInvoice: PropTypes.func.isRequired,
    setInvoice: PropTypes.func.isRequired,
};

export default PrescriptionInvoice






