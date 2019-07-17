/**
 * @author olx
 * @date 2018/12/27/027
 * 规则弹窗
 */

import React from 'react';
import PropTypes from 'prop-types';
import kanjiatusc from "../../../media/images/kanjiatusc.png";
// 第一种，简介写法-无状态函数式组件

const RuleInstructionLayer = ({ruleDescription,isShowRuleInstructionLayer,callBackFunc=()=>{}}) => {
    return (
        <div className="mutual_bargain elastic_layer2" style={{display:isShowRuleInstructionLayer?"block":"none"}}>
            <div className="layer2_item" onClick={()=>{callBackFunc(false)}} >
                <h5>活动规则</h5>
                <div className="layer2_list">
                    {ruleDescription}
                </div>
                <div className="layer2_close"   >
                    <img src={kanjiatusc}alt={"图片"}/>
                </div>
            </div>
        </div>
    );
};



RuleInstructionLayer.propTypes = {
    ruleDescription: PropTypes.string,
    isShowRuleInstructionLayer: PropTypes.bool,
    callBackFunc: PropTypes.func,

};

export default RuleInstructionLayer;




