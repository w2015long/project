/**
 * @author chencheng
 * @date 2018/4/2
 * 积分商品兑换确认页
 */
import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Address from "../../common/components/Address";

import "../style/IntegralProductExchange.css";
import {updateSelectedIntegralProducts} from "../actions/integralProductActions";
import EmptyPage from "../../common/components/EmptyPage";

class IntegralProductExchange extends Component{
    state={
        receiverName:null,
        receiverMobile:null,
        receiverAddr:null,
        showAddressSelect:false
    };

    componentWillMount(){
        document.title = "兑换礼品";
    }

    //统计已选择的积分商品的总积分
    countTotalIntegralBySelected(selectedIntegralProducts) {
        let totalIntegral = 0;
        for (let item of selectedIntegralProducts) {
            if (isNaN(item.quantity)){
                continue;
            }
            totalIntegral += item.quantity * item.integralPrice;
        }
        return totalIntegral;
    }

    /**
     * 显示收货地址列表
     */
    showAddressSelect(){
        this.setState({
            showAddressSelect:true
        })
    }

    /**
     * 选择收货地址
     * @param address
     */
    selectedReceiverAddress(address){
        this.setState({
            receiverName:address.receiverName,
            receiverMobile:address.contactTel,
            receiverAddr:address.deliveryAddr+address.detailAddr,
            showAddressSelect:false
        });
    }

    doExchange(totalIntegral){
        let self = this;
        if (!this.state.receiverName || !this.state.receiverMobile || !this.state.receiverAddr){
            window.warningTip('请选择收货地址');
            return ;
        }
        window.showConfirm(
            '你确定要消耗'+totalIntegral+"积分兑换礼品吗？",
            ()=>{
                const data = this.getOrderPostData();
                if (!data){
                    return;
                }
                const url = '/wap/integral/exchangeIntegralProduct';
                window.textFetch(
                    url,
                    {
                        method:'post',
                        body:JSON.stringify(data)
                    },
                    (text)=>{
                        window.successTip('订单提交成功');
                        self.props.history.push('/integral/order/list');
                        self.props.actions.updateSelectedIntegralProducts([]);//清空结算商品
                    }
                )
            }
        )
    }

    getOrderPostData(){
        const {selectedIntegralProducts} = this.props.integralProductState;
        let orderItems = [];
        for (let product of selectedIntegralProducts){
            orderItems.push({
                integralProductId:product.integralProductId,
                quantity:product.quantity
            })
        }
        if (orderItems.length < 1){
            window.warningTip('请选择礼品');
            return null;
        }
        if (!this.state.receiverName || !this.state.receiverMobile || !this.state.receiverAddr){
            window.warningTip('请选择收货地址');
            return null;
        }
        return {
            orderItems: orderItems,
            receiverName: this.state.receiverName,
            receiverMobile: this.state.receiverMobile,
            receiverAddr: this.state.receiverAddr,
        };
    }


    render(){
        const {selectedIntegralProducts} = this.props.integralProductState;
        if (!selectedIntegralProducts || selectedIntegralProducts.length < 1){
            this.props.history.goBack();
        }
        if (this.state.showAddressSelect){
            return (
                <Address callbackFunc={(address) => this.selectedReceiverAddress(address)} needJudgeDistributionRange='N'/>
            )
        }

        const totalIntegral = this.countTotalIntegralBySelected(selectedIntegralProducts);
        return (
            <div className="integral-product-exchange">
                <div className="rb-bg"/>
                {
                    this.state.receiverAddr ?
                        (
                            <div className="consignee-addr" onClick={()=> this.showAddressSelect()}>
                                <a>
                                    <span>{this.state.receiverName}</span>
                                    <span>{this.state.receiverMobile}</span>
                                    <p>{this.state.receiverAddr}</p>
                                </a>
                            </div>
                        )
                        :
                        (
                            <div className="consignee-addr" onClick={()=> this.showAddressSelect()}>
                                <a>
                                    <span>选择收货地址</span>
                                </a>
                            </div>
                        )
                }

                <div className="gd-box">
                    <div className="mt"><span>礼品清单</span></div>
                    {selectedIntegralProducts.length === 0 ? <EmptyPage/> :
                        <div className="mc">
                            {
                                selectedIntegralProducts.map(product => {
                                    return (
                                        <div className="item" key={product.integralProductId}>
                                            <div className="pic"><span><img src={product.picUrl} alt=""/></span></div>
                                            <div className="title"><span>{product.integralProductNm}</span></div>
                                            <div className="m-bot">
                                                <span>{product.integralPrice}积分</span>
                                                <i>x{product.quantity}</i>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    }
                </div>

                <div className="hold-div-bottom"/>
                <div className="floatbar">
                    <p><span>积分总计&nbsp;</span>{totalIntegral}</p>
                    <a className="pay-btn" onClick={()=>this.doExchange(totalIntegral)}>立即兑换</a>
                </div>
            </div>
        );
    }
}


IntegralProductExchange.propTypes = {};

IntegralProductExchange.contextTypes = {};

const mapStateToProps = (store, ownProps) => {
    return {
        integralProductState: store.integralProductState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({updateSelectedIntegralProducts}, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(IntegralProductExchange);
