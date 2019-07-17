import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {getSystemTime} from '../actions/commonAction'

/**
 * @author chencheng
 * @date 2018/4/2
 * 倒计时组件（使用参考CountDownExample）
 * 参数列表：
 *      endDateStr，必须，倒计时结束时间字符串 或 数字，如：2018/04/02 10:11:12 或2018/04/02 10:11:12 或 1523510100000(结束时间的毫秒)
 *      rendering，必须，倒计时进行中的输出格式
 *      rendered，必须，倒计时结束后的输出格式
 *      countType，可选， 倒计时类型，second：秒级别倒计时，默认；milliSecond:毫秒级别倒计时，慎用，耗性能
 *      callBackFunc，可选，倒计时结束会主动调用该方法
 * 表达式说明：
 *      @day@：剩余天数，如：剩余12天，则@day@=12
 *      @day1@：剩余天数的十位数，如：剩余12天，则@day1@=1
 *      @day2@：剩余天数的个位数，如：剩余12天，则@day2@=2
 *
 *      @hour@：小时
 *      @hour1@
 *      @hour2@
 *
 *      @minute@：分
 *      @minute1@
 *      @minute2@
 *
 *      @second@：秒
 *      @second1@
 *      @second2@
 *
 *      @msecond@：毫秒
 *      @msecond1@
 *      @msecond2@
 * */
class CountDown extends Component {

    constructor(props) {
        super(props);
        this.state = {
            countType: this.props.countType || 'second',
            endDateStr: this.props.endDateStr,
            callBackFunc: this.props.callBackFunc,
            leftMSeconds: 0,
            timeout: false,
            now:null
        }
    }

    componentWillMount() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        const self = this;
        const endDate = this.generateEndDate();
        getSystemTime((now) => {
            const leftM = endDate.getTime() - now.getTime();
            const leftMSeconds = parseInt(leftM, 10);
            self.setState({
                now:now,
                leftMSeconds:leftMSeconds
            });
        });
    }

    componentDidMount() {
        this.startCount();
    }

    componentWillUnmount() {
        if (this.timer) {
            clearInterval(this.timer);
            this.setState({timeout:true});
        }
    }

    shouldComponentUpdate() {
        return !this.state.timeout;
    }

    componentDidUpdate() {
        if (this.state.leftMSeconds <= 0) {
            if (this.state.timeout === false && typeof this.state.callBackFunc === "function") {
                this.state.callBackFunc();
            }
            if (this.timer) {
                clearInterval(this.timer);
                this.setState({timeout:true});
            }
        } else {
            if (!this.timer) {
                this.startCount();
            }
        }
    }

    generateEndDate() {
        let endDate;
        const endDateStr = this.state.endDateStr;
        try {
            if (/^(0|[1-9]\d*)$/.test(endDateStr)) {
                endDate = new Date(parseInt(endDateStr, 10));
            } else {
                endDate = new Date(endDateStr.replace(/-/g, "/"));
            }
        } catch (err) {
            const msg = "CountDown>>>endDateStr is invalid";
            window.errorTip(msg);
            throw (msg);
        }
        return endDate;
    }

    //开启倒计时
    startCount() {

        //毫秒级别倒计时
        if (this.state.countType === "milliSecond") {
            this.timer = setInterval(
                () => {
                    this.setState({
                        leftMSeconds: this.state.leftMSeconds <= 0 ? 0 : this.state.leftMSeconds - 10,
                        timeout:false
                    })
                },
                10
            );
            return;
        }

        //默认：每秒倒计时
        this.timer = setInterval(
            () => {
                this.setState({
                    leftMSeconds: this.state.leftMSeconds <= 0 ? 0 : this.state.leftMSeconds - 1000,
                    timeout:false
                })
            },
            1000
        );
    }


    //渲染子节点
    renderChildren(children, i = 0) {
        if (!Array.isArray(children)) {
            if (children.props && children.props.children) {
                return React.cloneElement(children, {children: this.renderChildren(children.props.children), key: i});
            } else {
                return this.renderReplace(children);
            }
        } else {
            let render = [];
            for (let i = 0; i < children.length; i++) {
                render[i] = this.renderChildren(children[i], i)
            }
        return render;
    }
}

    //替换表达式
    renderReplace(render) {
        let leftMSeconds = this.state.leftMSeconds;
        let day = Math.floor(leftMSeconds / 1000 / (60 * 60 * 24));
        let hour = Math.floor((leftMSeconds / 1000 / 3600) % 24);
        let minute = Math.floor((leftMSeconds / 1000 / 60) % 60);
        let second = Math.floor(leftMSeconds / 1000 % 60);
        let msecond = Math.floor(leftMSeconds % 1000);

        let day1 = day >= 10 ? parseInt(day / 10, 10) : 0;
        let day2 = day >= 10 ? day % 10 : day;
        let hour1 = hour >= 10 ? parseInt(hour / 10, 10) : 0;
        let hour2 = hour >= 10 ? hour % 10 : hour;
        let minute1 = minute >= 10 ? parseInt(minute / 10, 10) : 0;
        let minute2 = minute >= 10 ? minute % 10 : minute;
        let second1 = second >= 10 ? parseInt(second / 10, 10) : 0;
        let second2 = second >= 10 ? second % 10 : second;
        let msecond1 = msecond >= 100 ? parseInt(msecond / 100, 10) : 0;
        let msecond2 = msecond >= 10 ? parseInt(msecond / 10 % 10, 10) : 0;

        render = render.replace(/@day@/g, day);
        render = render.replace(/@day1@/g, day1);
        render = render.replace(/@day2@/g, day2);

        render = render.replace(/@hour@/g, hour);
        render = render.replace(/@hour1@/g, hour1);
        render = render.replace(/@hour2@/g, hour2);

        render = render.replace(/@minute@/g, minute);
        render = render.replace(/@minute1@/g, minute1);
        render = render.replace(/@minute2@/g, minute2);

        render = render.replace(/@second@/g, second);
        render = render.replace(/@second1@/g, second1);
        render = render.replace(/@second2@/g, second2);

        render = render.replace(/@msecond@/g, msecond);
        render = render.replace(/@msecond1@/g, msecond1);
        render = render.replace(/@msecond2@/g, msecond2);
        return render;
    }

    render() {
        if (!this.state.now){//获取服务器时间还没回来
            return null;
        }
        if (this.state.leftMSeconds <= 0) {
            return this.renderChildren(this.props.rendered);
        } else {
            return this.renderChildren(this.props.rendering);
        }
    }
}

CountDown.propTypes = {
    endDateStr: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rendering: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    rendered: PropTypes.string,
    countType: PropTypes.string,
    callBackFunc: PropTypes.func
};


export default (CountDown);