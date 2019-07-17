// 引入react组件
import React, {Component} from "react";
import PropTypes from 'prop-types';

class Star extends Component {

    state = {
        value: 5,
        canClick: false
    };

    componentWillMount() {
        let canClick = this.props.canClick;
        if (canClick === true) {
            this.state.canClick = true;
        }
    }

    getStarInfo() {
        let value = this.state.value;
        if (value === 1) {
            return "非常不满意";
        } else if (value === 2) {
            return "不满意";
        } else if (value === 3) {
            return "一般";
        } else if (value === 4) {
            return "满意";
        } else if (value === 5) {
            return "非常满意";
        } else {
            return "";
        }
    }

    changeValue(value) {
        if (this.props.canClick === false) {
            return;
        }
        this.setState({value: value});
        let callbackFunc = this.props.callbackFunc;
        if (typeof  callbackFunc === 'function') {
            callbackFunc(value);
        }
    }

    render() {
        let value = this.state.value;
        return (
            <div className="commstar">
                <span className={value > 0 ? "star star1 active" : "star star1"} onClick={() => this.changeValue(1)}/>
                <span className={value > 1 ? "star star2 active" : "star star2"} onClick={() => this.changeValue(2)}/>
                <span className={value > 2 ? "star star3 active" : "star star3"} onClick={() => this.changeValue(3)}/>
                <span className={value > 3 ? "star star4 active" : "star star4"} onClick={() => this.changeValue(4)}/>
                <span className={value > 4 ? "star star5 active" : "star star5"} onClick={() => this.changeValue(5)}/>
                <span className="star-info highlight"> {this.getStarInfo()} </span>
            </div>
        )
    }
}

/*定义星星组件属性类型*/
Star.propTypes = {
    /*方法类型*/
    callbackFunc: PropTypes.func,
    /*数值*/
    /*    defaultValue:  PropTypes.number,*/
    /*是否可点击*/
    canClick: PropTypes.bool
};

export default Star