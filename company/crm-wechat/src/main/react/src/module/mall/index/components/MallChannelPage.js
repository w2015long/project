import React, {Component} from "react";
//引入link，用来做页面跳转，实际上它会被渲染成a标签
import {Link} from "react-router-dom";

import yaolignquan2 from "../../../../media/images/yaolignquan2.png";
import qian from "../../../../media/images/qian.png";
import yaozixun2 from "../../../../media/images/yaozixun2.png";
import classify from "../../../../media/images/classify.png";
/**
 * 微商城首页 频道页
 */
class MallChannelPage extends Component{

    render(){
        return (
            <div className="entry-nav">
                <div className="item" >
                    <Link to="/index/receive/coupon/supportReceive" className="entry-link">
                        <div className="pic"><img src={yaolignquan2} alt=""/></div>
                        <span>药领券</span>
                    </Link>
                </div>
                <div className="item">
                    <Link to="/member/integral/sign" className="entry-link">
                        <div className="pic"><img src={qian} alt=""/></div>
                        <span>签到</span>
                    </Link>
                </div>
                <div className="item">
                    <Link className="entry-link" to='/index/pharmacist'>
                        <div className="pic"><img src={yaozixun2} alt=""/></div>
                        <span>咨询药师</span>
                    </Link>
                </div>
                <div className="item">
                    <Link to={'/product/classify'}>
                        <div className="pic"><img src={classify} alt=""/></div>
                        <span>全部分类</span>
                    </Link>
                </div>
            </div>
        )
    }
}
export default MallChannelPage;