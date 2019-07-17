import React, {PureComponent} from 'react';
import yaolignquan from "../../../media/images/yaolignquan.png";
import jifen from "../../../media/images/jifen.png";
import yaozixun from "../../../media/images/yaozixun.png";
import {Link} from "react-router-dom";
/**
 * O2O首页 频道页
 */
class ChannelPage extends PureComponent {

    render(){
        return (
            <div className="entry-nav" >
                <Link to="/index/receive/coupon/supportReceive" className="entry-link">
                    <img src={yaolignquan} alt=""/>
                    <span>领优惠券</span>
                </Link>
                <Link to="/member/integral/sign" className="entry-link">
                    <img src={jifen} alt=""/>
                    <span>领积分</span>
                </Link>
                <Link className="entry-link" to='/index/pharmacist'>
                    <img src={yaozixun} alt=""/>
                    <span>咨询药师</span>
                </Link>
            </div>
        )
    }
}

export default ChannelPage;
