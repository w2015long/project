import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import '../style/Invoice.css';
import {updateInvoiceInfo} from '../actions/invoiceAction';

class Invoice extends Component {
    state = {
        isNeedInvoice: 'Y',
        invoiceType: 'company',
        invoiceTitle: '',
        taxNum: '',
        isCanSave: 'N'
    };

    componentWillMount() {
        const {normalCart} = this.props.normalCartSettlementState;
        const isNeedInvoice = normalCart.isNeedInvoice ? normalCart.isNeedInvoice : 'Y';
        const invoiceTitle = normalCart.invoiceTitle ? normalCart.invoiceTitle : '';
        const taxNum = normalCart.taxNum ? normalCart.taxNum : '';
        const invoiceType = (!invoiceTitle && !taxNum) || taxNum ? 'company' : 'personal';

        this.changeState({
            isNeedInvoice: isNeedInvoice,
            invoiceType: invoiceType,
            invoiceTitle: invoiceTitle,
            taxNum: taxNum
        });
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }

    /**
     * 修改 state
     * @param state
     */
    changeState(state = {}){
        const pageContext = this;
        pageContext.setState(Object.assign({}, pageContext.state, state), function () {
            pageContext.checkInvoiceInfo();
        });
    }

    /**
     * 检查发票信息
     */
    checkInvoiceInfo(){
        const {isNeedInvoice, invoiceType, invoiceTitle, taxNum} = this.state;
        const isCanSave = isNeedInvoice==='N' || (isNeedInvoice==='Y' && invoiceTitle && (invoiceType==='personal' || (invoiceType==='company' && taxNum))) ? 'Y' : 'N';
        this.setState({
            isCanSave: isCanSave
        });
    }

    /**
     * 更新账户余额使用信息
     */
    updateInvoiceInfo(){
        const {actions, history} = this.props;
        let {isNeedInvoice, invoiceType, invoiceTitle, taxNum} = this.state;
        invoiceTitle = isNeedInvoice==='N' ? '' : invoiceTitle;
        taxNum = isNeedInvoice==='N' ? '' : invoiceType==='personal' ? '' : taxNum;
        actions.updateInvoiceInfo(isNeedInvoice, invoiceTitle, taxNum);
        history.goBack();
    }

    render() {
        return(
            <div className='normal-cart-settlement-invoice'>
                <div className="invoice-main">
                    <div className="mt">
                        <a className="back" onClick={() => this.props.history.goBack()}/>
                        <span>发票</span>
                        <span className={this.state.isNeedInvoice==='Y' ? 'switchery checked' : 'switchery'} onClick={() => this.changeState({isNeedInvoice: this.state.isNeedInvoice==='Y' ? 'N' : 'Y'})}><i/></span>
                    </div>
                    <div className="hold-div-top"/>
                    <div className="mc">
                        <div className="control-box">
                            <label className={this.state.isNeedInvoice==='Y' && this.state.invoiceType==='company' ? 'checked' : ''} onClick={this.state.isNeedInvoice==='Y' ? () => this.changeState({invoiceType: 'company'}) : () => {}}>公司</label>
                            <label className={this.state.isNeedInvoice==='Y' && this.state.invoiceType==='personal' ? 'checked' : ''} onClick={this.state.isNeedInvoice==='Y' ? () => this.changeState({invoiceType: 'personal'}) : () => {}}>个人</label>
                        </div>
                        <div className="item">
                            <span>发票抬头</span>
                            <input type="text" placeholder="请输入发票抬头" value={this.state.invoiceTitle} disabled={this.state.isNeedInvoice==='Y' ? '' : 'disabled'} onChange={(e) => this.changeState({invoiceTitle: e.target.value.trim()})}/>
                        </div>
                        {
                            this.state.invoiceType==='company' &&
                            <div className="item">
                                <span>发票税号</span>
                                <input type="text" placeholder="请输入发票税号" value={this.state.taxNum} disabled={this.state.isNeedInvoice==='Y' ? '' : 'disabled'} onChange={(e) => this.changeState({taxNum: e.target.value.trim()})}/>
                            </div>
                        }
                    </div>
                    <div className="md">
                        <a className={this.state.isCanSave==='Y' ? '' : 'disabled'} onClick={this.state.isCanSave==='Y' ? () => this.updateInvoiceInfo() : () => {}}>确认</a>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        normalCartSettlementState: store.normalCartSettlementState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            updateInvoiceInfo
        }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Invoice);