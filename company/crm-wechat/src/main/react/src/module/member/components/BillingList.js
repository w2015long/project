/**
 * 扫码领优惠券
 * Created by liezihao on 2018/10.16
 */
// 引入react组件
import React, { Component } from 'react';
// 引入方法
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import '../style/billingList.css';
import {
    accountTransLogListAction,
    getSystemTimeAction
} from "../actions/billingListAction.js";
import kongbaiye from "../../../media/images/kongbaiye.png";
import DatePicker from 'react-mobile-datepicker';


class BillingList extends Component {
    state = {
        systemTime:'',
        selectDate:'',
        isOpen: false
    };




    //在组件首次渲染之前调用，这时候DOM节点已经首次加载完成。整个生命周期只会执行一次
    componentWillMount() {
        document.title = '账单列表';
        const self = this;
        self.props.actions.getSystemTimeAction((time)=>{
            self.props.actions.accountTransLogListAction(time,(json)=>self.setState(
                {selectDate:json.selectDate,systemTime:json.toDate}
                ));
        })
    }


    //在组件首次渲染之后调用，这时候DOM节点已经首次加载完成。整个生命周期只会执行一次
    componentDidMount(){
    }


    //销毁组件的时候调用
    componentWillUnmount(){

    }


    toAccountTransLogDetails(transLogId){
        const self = this;
        self.props.history.push("/member/billingDetails/"+transLogId);
    }

    handleClick = () => {
        this.setState({ isOpen: true });
    };

    handleCancel = () => {
        this.setState({ isOpen: false });
    };

    handleSelect = (time) => {
        const self = this;
        this.setState({
            systemTime:time,
            isOpen: false
        });


        var timestamp = new Date().setTime(time);
        var d = new Date(timestamp);    //根据时间戳生成的时间对象
        var date = (d.getFullYear()) + "-" +
            (d.getMonth() + 1) + "-" +
            (d.getDate()) + " " +
            (d.getHours()) + ":" +
            (d.getMinutes()) + ":" +
            (d.getSeconds());
        self.props.actions.accountTransLogListAction(date,(json)=>self.setState(
            {selectDate:json.selectDate}
        ));
    };





    render() {
        const {accountTransLogList,systemTime} = this.props.accountTransLogState;
        const self = this;

        var disburseAmountDouble = 0.00; //支出 负数
        var inComeAmountDouble = 0.00;  //收入 正数
        if(accountTransLogList.disburseAmountDouble <=0 && accountTransLogList.inComeAmountDouble >=0){
            disburseAmountDouble = Math.abs(accountTransLogList.disburseAmountDouble).toFixed(2);
            inComeAmountDouble = accountTransLogList.inComeAmountDouble.toFixed(2)
        }
        const list = accountTransLogList.accountTransLogExpandItemProtocol || [];
        return (
           <div className="billingListDiv">
               {this.state.systemTime && <DatePicker value={new Date(this.state.systemTime)} isOpen={this.state.isOpen} theme="ios" onSelect={this.handleSelect} onCancel={this.handleCancel} dateFormat={['YYYY年', 'M']} />}
               <div className="billing-details-main">
                   <div className="b-title">
                       <div className="data-time" onClick={this.handleClick}>{this.state.selectDate}</div>
                       <div className="title-content"><span>支出¥{disburseAmountDouble}</span><span>收入¥{inComeAmountDouble}</span></div>
                   </div>

                   {list.length >0 && <div className="list-of-details">
                       {
                           list.map((item,index)=>{
                               return(
                                   <div className="details-item" key={index} onClick={()=>this.toAccountTransLogDetails(item.transLogId)}>
                                       <div className="dati-l">
                                           <div className="dati-l-title">{item.tradeType}</div>
                                           <div className="dati-l-textcontent">{item.description}</div>
                                       </div>
                                       <div className="dati-r">
                                           <h5>{item.amountDouble>0?'+'+item.amountDouble.toFixed(2):item.amountDouble.toFixed(2)}</h5>
                                           <p>{item.transTimeString}</p>
                                       </div>
                                   </div>
                               )
                           })
                       }
                   </div>}

                   {list.length <= 0 &&
                   <div className="air-content-box">
                       <div className="pic">
                           <img src={kongbaiye} />
                       </div>
                       <div className="air-text">当月暂无消费账单</div>
                   </div>
                  }


               </div>
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
            accountTransLogListAction,
            getSystemTimeAction
            }, dispatch)
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(BillingList);
