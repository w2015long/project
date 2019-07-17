import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import '../style/DeliveryTimeSelector.css';
import {hideDeliveryTimeSelector, selectDeliveryTime} from '../actions/deliveryTimeSelectorAction';

class DeliveryTimeSelector extends Component {
    componentWillMount() {

    }

    componentDidMount() {

    }

    componentDidUpdate (){

    }

    componentWillUnmount(){

    }

    render() {
        let {showDeliveryTimeSelector, callbackFunc, selectedDayStr, selectedTimeStr} = this.props.normalCartSettlementState.deliveryTimeSelectorInfo;
        const {actions} = this.props;
        let itemList = this.props.normalCartSettlementState.deliveryTimeSelectorInfo.itemList || [];
        let {isSelfExtract} = this.props.normalCartSettlementState.normalCart;
        // 砍价活动用到了该组件 鉴于时间紧迫 临时采取此方式，后期考虑是否抽取成公共组件
        const isNotNormalCartCall = this.props.isNotNormalCartCall;
        if (isNotNormalCartCall) {
            isSelfExtract = 'Y';
            if (itemList.length > 0) {
                itemList[0].timeStrList[0] = '立即取货';
                if (selectedTimeStr === '尽快配送') {
                    selectedTimeStr = '立即取货';
                }
            }
        }
        return(
            showDeliveryTimeSelector==='Y' &&
            <div className='delivery-time-selector'>
                <div className="times-layer" onClick={(e) => {e.target.className==='times-layer' ? actions.hideDeliveryTimeSelector() : {}}}>
                    <div className="select-times">
                        <div className="mt">{isSelfExtract==='Y' ? '取货时间' : '送货时间'}<a className="close" onClick={() => actions.hideDeliveryTimeSelector()}/></div>
                        <div className="mc">
                            {
                                itemList.map(item => {
                                    return(
                                        <dl className={item.dayStr===selectedDayStr ? 'cur' : ''} key={item.dayStr}>
                                            <dt onClick={() => actions.selectDeliveryTime(item.dayStr, '')}><span>{item.dayStr}</span></dt>
                                            <dd>
                                                {
                                                    item.dayStr===selectedDayStr &&
                                                    item.timeStrList.map(timeStr => {
                                                        return(
                                                            <div className={item.dayStr===selectedDayStr && timeStr===selectedTimeStr ? 'item selected' : 'item'} onClick={() => actions.selectDeliveryTime(item.dayStr, timeStr)} key={timeStr}>{timeStr}</div>
                                                        );
                                                    })
                                                }
                                            </dd>
                                        </dl>
                                    );
                                })
                            }
                        </div>
                        <div className="md"><a onClick={() => actions.hideDeliveryTimeSelector(selectedDayStr, selectedTimeStr, () => callbackFunc(selectedDayStr + ' ' + selectedTimeStr))}>确认</a></div>
                    </div>
                </div>
            </div>
        );
    }
}

DeliveryTimeSelector.propTypes = {
    isNotNormalCartCall: PropTypes.bool,
};
const mapStateToProps = (store, ownProps) => {
    return {
        normalCartSettlementState: store.normalCartSettlementState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            selectDeliveryTime,
            hideDeliveryTimeSelector
        }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryTimeSelector);