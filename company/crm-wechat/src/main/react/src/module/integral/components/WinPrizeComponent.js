/**
 * @author olx
 * @date 2018/4/2
 */
import React from "react";
import {Link} from "react-router-dom";
import PropTypes from 'prop-types';
const WinPrizeComponent = ({prizeName, prizeType,closelayer}) =>{
    return(

        <div className='big-turntable-activity'>
            <div className="lottery-layer" onClick={()=>{closelayer()}}>
                <div className="lottery-box">
                    <div className="mc">
                        {prizeType!=="THKS" && <h5>恭喜你</h5>}
                        {prizeType==="THKS" && <h5>再接再厉</h5>}
                        <p>{prizeName}</p>
                        {prizeType==="PHYSICAL"&& <Link to="/integral/winningRecord" className="mc-btn" >前往中奖记录</Link>}
                        {prizeType==="INTEGRAL"&&<Link to="/member/integral/record" className="mc-btn" >前往查看积分</Link>}
                        {prizeType==="COUPON"&&<Link to="/coupon/list" className="mc-btn" >前往查看优惠券</Link>}
                        {prizeType==="THKS" &&<a className="mc-btn" >谢谢参与</a>}
                    </div>
                    <span className="close-btn"/>
                </div>
            </div>
        </div>
    );
};

WinPrizeComponent.propTypes = {
    prizeName:PropTypes.string.isRequired,
    prizeType:PropTypes.string.isRequired,
    closelayer:PropTypes.func.isRequired
};

export default WinPrizeComponent



