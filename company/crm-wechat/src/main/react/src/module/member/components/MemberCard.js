import React, {Component} from "react";
import memberCard from "../../../media/images/mc-card.png";
import "../style/MemberCard.css";

class MemberCard extends Component {

    componentWillMount() {
        document.title = '会员注册';
    }

    componentDidMount() {

    }

    componentDidUpdate (){

    }

    componentWillUnmount(){

    }

    render(){
        return(
            <div className="member-card">
                <div className="receive-coupon">
                    <div className="cont">
                        <div className="mt">
                            <h5>很抱歉，您还不是会员</h5>
                            <div className="mc-card"><img src={memberCard} /></div>
                            <p>长按领取会员卡</p>
                            <div className="line"/>
                        </div>
                        <div className="mc">
                            <p>送您一张新人优惠券</p>
                            <p>立减10元</p>
                            <div className="coupon-box">
                                <div className="mc-hd"><span>新用户</span></div>
                                <div className="mc-bd">
                                    <div>
                                        <span>￥10</span>
                                        <p>满20减10元</p>
                                    </div>
                                </div>
                            </div>
                            <h5>注册会员后领取</h5>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MemberCard;