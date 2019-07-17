import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import EmptyPage from "../../common/components/EmptyPage";
import '../style/CouponSelector.css';
import {changeTab, searchCoupon, selectCoupon} from '../actions/couponSelectorAction';

class CouponSelector extends Component {

    componentWillMount() {
        document.title='使用优惠券';
        const couponPermissionId = this.props.match.params.id;
        this.setState({couponPermissionId:Number(couponPermissionId)});
    }

    componentDidMount() {

    }

    componentDidUpdate (){

    }

    componentWillUnmount(){

    }

    render() {
        const {couponList, callbackFunc, couponActiveStatus, handEffectiveCoupon, handInvalidCoupon} = this.props.normalCartSettlementState.couponSelectorInfo;
        const {actions} = this.props;
        const {couponPermissionId} = this.state;



        return(
            <div className="coupon-selector">
                <div className="coupon-main">
                    <div className="top-nav">
                        <ul>
                            <li className={couponActiveStatus==='first' ? 'active' : ''} onClick={() => actions.changeTab('first')}><span>可用</span></li>
                            <li className={couponActiveStatus==='second' ? 'active' : ''} onClick={() => actions.changeTab('second')}><span>不可用</span></li>
                        </ul>
                    </div>
                    <div className="nav-cont">
                        {
                            couponActiveStatus==='first' &&
                            <div className="box1">
                                {
                                    handEffectiveCoupon==='N' &&
                                    <EmptyPage emptyTipText={'还没有可用的优惠券哦'}/>
                                }
                                {
                                    handEffectiveCoupon==='Y' &&
                                    couponList.map(item => {
                                        return(
                                            item.isEffective==='Y' &&
                                            <div className="item" key={item.couponPermissionId} onClick={item.couponPermissionId===couponPermissionId ? () => actions.selectCoupon(() => callbackFunc(-1)) : () => actions.selectCoupon(() => callbackFunc(item.couponPermissionId))}>
                                                {item.couponType === 'FULL_REDUCE' &&
                                                <div className="mlt">
                                                    <span>{item.couponAmountDouble}</span>
                                                </div>
                                                }
                                                {item.couponType === 'DISCOUNT' &&
                                                <div className="mlt">
                                                    <span className="discount">{item.couponDiscount}</span>
                                                </div>
                                                }
                                                <p>{item.couponDesc}</p>
                                                <span>{item.effectiveBeginTimeStr} - {item.effectiveEndTimeStr}</span>
                                                <i className={item.couponPermissionId===couponPermissionId ? 'select selected' : 'select'}/>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        }
                        {
                            couponActiveStatus==='second' &&
                            <div className="box2">
                                {
                                    handInvalidCoupon==='N' &&
                                    <EmptyPage emptyTipText={'还没有优惠券哦'}/>
                                }
                                {
                                    handInvalidCoupon==='Y' &&
                                    couponList.map(item => {
                                        return(
                                            item.isEffective==='N' &&
                                            <div className="item" key={item.couponPermissionId}>
                                                {item.couponType === 'FULL_REDUCE' &&
                                                <div className="mlt">
                                                    <span>{item.couponAmountDouble}</span>
                                                </div>
                                                }
                                                {item.couponType === 'DISCOUNT' &&
                                                <div className="mlt">
                                                    <span className="discount">{item.couponDiscount}</span>
                                                </div>
                                                }
                                                <p>{item.couponDesc}</p>
                                                <span>{item.effectiveBeginTimeStr} - {item.effectiveEndTimeStr}</span>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>

        );
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        normalCartSettlementState: store.normalCartSettlementState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            searchCoupon,
            selectCoupon,
            changeTab
        }, dispatch)
    }
};

CouponSelector.propTypes = {
    couponPermissionId: PropTypes.number
};

export default connect(mapStateToProps, mapDispatchToProps)(CouponSelector);