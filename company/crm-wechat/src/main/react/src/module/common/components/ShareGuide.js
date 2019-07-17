/**
 * @author olx
 * @date 2018/12/29/029
 * 分享指导页面
 */

import React, {PureComponent} from 'react';
import jiantou from "../../../media/images/jiantou.png";
import '../style/ShareGuide.css';
import {setShowShareGuide} from "../actions/commonAction";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
class ShareGuide extends PureComponent{
    render(){
        const {isShowShareGuide} = this.props.commonState;
        const {actions} = this.props;
        return(
            isShowShareGuide&&
            <div className="share_guide pop_ups" onClick={() => actions.setShowShareGuide(false)} >
                <div className="fengxiang_pic">
                    <img src={jiantou}/>
                </div>
                <div className="fengxiang_text">
                    <h5 style={{"color": "#fff"}}>点击&nbsp;&nbsp;<i></i> <i></i> <i></i><span>分享</span></h5>
                    <p>微信/朋友圈</p>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        commonState: store.commonState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            setShowShareGuide
        }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ShareGuide);


