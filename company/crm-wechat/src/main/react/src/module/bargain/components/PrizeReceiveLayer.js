/**
 * @author olx
 * @date 2018/12/27/027
 * 礼品领取弹窗
 */

import React from 'react';
import PropTypes from 'prop-types';
import anniu1 from "../../../media/images/anniu1.png";
import kanjiatujb from "../../../media/images/kanjiatujb .png";
import kanjiatusc from "../../../media/images/kanjiatusc.png";
// 第一种，简介写法-无状态函数式组件

const PrizeReceiveLayer = ({isShowPrizeReceiveLayer=false,firstBargainAmount=0,boostPrizeNm="",boostPrizePic="",toBargainReceiveAddress=()=>{},closeLayer=()=>{}}) => {
    return (
        <div className="mutual_bargain elastic_layer" style={{display:isShowPrizeReceiveLayer?"block":"none"}} >
            <div className="layer_item">
                <div className="layer_close"  style={{cursor:"pointer"}} onClick={()=>{closeLayer(false)}}>
                    <img src={kanjiatusc} alt={"图片"}/>
                </div>
                <div className="bargain_icon">
                    <img src={kanjiatujb} alt={"图片"}/>
                </div>
                <div className="bg_top" >
                    <h5>砍掉<span>{firstBargainAmount}</span>元</h5>
                    <p>领完礼品, 可再砍一次</p>
                </div>
                <div className="get_gift">恭喜你！获得1份礼品</div>
                <div className="get_gift_description">
                    <div className="gift_pic">
                        <img src={boostPrizePic} alt={"图片"}/>
                    </div>
                    <span className="gift_text">{boostPrizeNm}</span>
                </div>
                <div className="receiving_gifts" onClick={()=>{toBargainReceiveAddress()}}>
                    <img src={anniu1} alt={"图片"}/>
                        <span>领礼品, 再砍一次</span>
                </div>
            </div>
        </div>

    );
};


PrizeReceiveLayer.propTypes = {
    isShowPrizeReceiveLayer: PropTypes.bool,
    firstBargainAmount: PropTypes.number,
    boostPrizeNm: PropTypes.string,
    boostPrizePic: PropTypes.string,
    callBackFunc: PropTypes.func,

};

export default PrizeReceiveLayer;




