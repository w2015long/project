/**
 * @author olx
 * @date 2018/3/31
 */

import React from 'react';
import PropTypes from 'prop-types';
//拍单购药规则说明弹窗
const RuleDescription = ({description, callbackFunc}) => {
    return (
        <div className="prescription-add">
            <div className="rule-layer">
                <div className="rule-box">
                    <div className="mc">
                        <h5>规则说明</h5>
                        <div className="mc-cont">
                            <p>{description}</p>
                        </div>
                    </div>
                    <span className="close-btn" onClick={() => callbackFunc()}></span>
                </div>
            </div>
        </div>
    );
};

RuleDescription.propTypes = {
    description: PropTypes.string.isRequired,
    callbackFunc: PropTypes.func.isRequired,
};

export default RuleDescription



