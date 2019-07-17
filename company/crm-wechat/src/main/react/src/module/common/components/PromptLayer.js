/**
 * @author olx
 * @date 2019/1/8/008
 * 离开确认(离开页面触发)
 */

import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Prompt} from 'react-router-dom';
import {hideConfirm, setPrompt, showConfirm} from "../actions/commonAction";
import PropTypes from "prop-types";
import {withRouter} from 'react-router'
import Confirm from './Confirm'

class PromptLayer extends Component {

    state = {
        location: "/",
    };

    componentWillMount() {
        this.props.actions.setPrompt(true);
    }

    messageFunc(location) {
        const {msg} = this.props;
        const {isPrompt} = this.props.commonState;
        const self = this;
        self.setState({location: location.pathname});
        self.props.actions.setPrompt(false);//解除拦截
        this.props.actions.showConfirm(msg ? msg : "是否离开",
            () => self.sureFunc(),
            () => self.cancel()
        );

        return !isPrompt;
    }

    componentWillUnmount() {
        this.props.actions.hideConfirm();
        this.props.actions.setPrompt(true);
    }

    sureFunc() {
        const {successFunc} = this.props;
        typeof successFunc === "function" ? successFunc() : this.props.history.push(this.state.location ? this.state.location : "/")


    }

    cancel = () => {
        const {cancelFunc} = this.props;
        typeof cancelFunc === "function" ? cancelFunc() : this.props.history.push(this.state.location ? this.state.location : "/");
        this.props.actions.setPrompt(true);
    };


    render() {
        const {isPrompt} = this.props.commonState;
        return (
            <div>
                <Prompt message={(location) => this.messageFunc(location)} when={isPrompt}/>
                <Confirm/>
            </div>

        );
    }
}

PromptLayer.propTypes = {
    msg: PropTypes.string,
    successFunc: PropTypes.func,
    cancelFunc: PropTypes.func
};

const mapStateToProps = (store, ownProps) => {
    return {
        commonState: store.commonState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            setPrompt,
            showConfirm,
            hideConfirm
        }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PromptLayer));