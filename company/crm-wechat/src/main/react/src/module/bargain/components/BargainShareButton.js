/**
 * @author olx
 * @date 2018/12/27/027
 * 助力与分享按钮
 */

import React, {PureComponent} from "react";
import dianniusucc from "../../../media/images/dianniusucc.png";
import CountDown from '../../common/components/CountDown';
import anniuGray from "../../../media/images/anniu-gray.png";



// 第二种，基本写法-带状态组件
class BargainShareButton extends PureComponent {
    refreshCurrentPage(){
        this.props.history.go(0)
    }

    render() {
        const rendering = (
            <p>还剩 <span>@day@</span>日<span>@hour1@@hour2@</span>:<span>@minute1@@minute2@</span>:<span>@second1@@second2@</span> 过期，快来砍价吧~</p>
        );
        const {
             activityEndTime,
             orderId,
             isEnabled,
             memberBargainState,
             bargainAmountDouble,
             bargainAmountRadio,
             bargainAmountDifferenceDouble,
            mutualBargainShareRecordId,
            mutualBargainActivityId,
        } = this.props.bargainActivityInfo||{};
        const now = new Date().getTime();
        const history = this.props.history;
        const activityIsNormal = (activityEndTime > now && isEnabled === "Y");
        const rendered = activityEndTime > now ? "该活动已临时下线,请等待处理" : "该活动已结束,欢迎参加其他活动";
        return (
            <div className="mutual_bargain invitation_content">
                {memberBargainState ==="UNSUCCESSFUL"&&<h5>商品已砍<span>{bargainAmountDouble}元</span>，还剩<span>{bargainAmountDifferenceDouble}元</span></h5>}
                {memberBargainState ==="SUCCESSFUL"&&<h5 onClick={()=>{activityIsNormal?history.push("/bargain/bargainSettlement/"+mutualBargainShareRecordId+"/"+mutualBargainActivityId):{}}}>商品已砍到底价，赶紧下单吧</h5>}
                {memberBargainState ==="ORDERED"&&<h5>恭喜，下单成功</h5>}
                <div className="progress_bar">
                    <div className="bar_item" style={{width: memberBargainState !=="UNSUCCESSFUL"?100+ "%":bargainAmountRadio + "%"}}/>
                </div>
                <div className="help_bargain" >
                    <img src={activityIsNormal?dianniusucc:anniuGray}/>
                    {memberBargainState ==="UNSUCCESSFUL"&&<span onClick={() =>{activityIsNormal?this.props.updateShowShareGuide(true):{}}}>喊好友砍价</span>}
                    {memberBargainState ==="SUCCESSFUL"&&<span onClick={()=>{activityIsNormal?history.push("/bargain/bargainSettlement/"+mutualBargainShareRecordId+"/"+mutualBargainActivityId):{}}}>砍价成功,点击下单</span>}
                    {memberBargainState ==="ORDERED"&&orderId&&<span onClick={()=>history.push("/order/detail/"+orderId)}>查看订单</span>}
                    {memberBargainState ==="ORDERED"&&!orderId&&<span>下单异常,请稍后重试</span>}
                </div>
                {activityIsNormal?<CountDown endDateStr={activityEndTime} callBackFunc={()=>this.refreshCurrentPage()} rendering={ rendering} rendered={rendered} />:rendered}
            </div>
        )
    }
}


export default BargainShareButton;




