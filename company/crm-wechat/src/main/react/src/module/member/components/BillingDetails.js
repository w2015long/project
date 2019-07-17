/**
 * 扫码领优惠券
 * Created by liezihao on 2018/10.16
 */
// 引入react组件
import React, { Component } from 'react';
// 引入方法
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import '../style/billingDetails.css';
import {
    accountTransLogDetailsAction
} from "../actions/billingListAction.js";




class BillingDetails extends Component {
    state = {

    };


    //在组件首次渲染之前调用，这时候DOM节点已经首次加载完成。整个生命周期只会执行一次
    componentWillMount() {
        document.title = '账单详情';
        const self = this;
        let transLogId = this.props.match.params.transLogId;
        self.props.actions.accountTransLogDetailsAction(transLogId)
    }


    //在组件首次渲染之后调用，这时候DOM节点已经首次加载完成。整个生命周期只会执行一次
    componentDidMount(){
    }


    //销毁组件的时候调用
    componentWillUnmount(){

    }







    render() {
        const {accountTransLogDetails} = this.props.accountTransLogState;
        const self = this;
        var item =  accountTransLogDetails || {};
        return (
           <div className="billingDetailsDiv">
               {item.amountDouble &&
               <div className="stored-value-consumption-main">
                   <div className="stroed-top">
                       <p>{item.tradeType}</p>
                       <h5>{item.amountDouble>0?'+'+item.amountDouble.toFixed(2):item.amountDouble.toFixed(2)}</h5>
                   </div>

                   <div className="tipstext-box">


                       <div className="item">
                           <div className="item-l">交易前金额</div>
                           <div className="item-r">￥{item.beforeAmountDouble.toFixed(2)}</div>
                       </div>

                       <div className="item">
                           <div className="item-l">交易后金额</div>
                           <div className="item-r">￥{item.afterAmountDouble.toFixed(2)}</div>
                       </div>

                       <div className="item">
                           <div className="item-l">交易时间</div>
                           <div className="item-r">{item.transTimeString}</div>
                       </div>

                       {item.billNumber &&
                         <div className="item">
                            <div className="item-l">账单编号</div>
                            <div className="item-r"> {item.billNumber}</div>
                         </div>
                       }


                       {item.orderNum && <div className="item">
                           <div className="item-l">订单号</div>
                           <div className="item-r"> {item.orderNum}</div>
                       </div> }


                       <div className="item">
                           <div className="item-l">交易原因</div>
                           <div className="item-r">{item.description}</div>
                       </div>

                   </div>


               </div>}

           </div>
        )
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        accountTransLogState:store.accountTransLogState
    }
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            accountTransLogDetailsAction
            }, dispatch)
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(BillingDetails);
