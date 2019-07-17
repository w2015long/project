/**
 * 确认框组件
 */
import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {hideConfirm} from "../actions/commonAction";
import "../style/Confirm.css";

class Confirm extends Component{

    confirm(confirmFunc = () => {}){
        this.props.actions.hideConfirm();
        confirmFunc();
    }
    cancel(cancelFunc = () => {}){
        this.props.actions.hideConfirm();
        cancelFunc();
    }

    render(){
        const {confirmInfo} = this.props.commonState;
        return(
            confirmInfo.showConfirm==='Y' &&
            <div className='confirm'>
                <div className="prompt-layer">
                    <div className="prompt-box">
                        <div className="mc"><span>{confirmInfo.tips}</span></div>
                        <div className="md">
                            <a className="cancel" onClick={() => this.cancel(() => confirmInfo.cancelFunc())} >取消</a>
                            <a className="confirm" onClick={() => this.confirm(() => confirmInfo.confirmFunc())}>确定</a>
                        </div>
                    </div>
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
            hideConfirm
        }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Confirm);