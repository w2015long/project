import React, {Component} from "react";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import "../style/AddressSelect.css";
import {getAddressList, showAddressAddView} from "../actions/addressAction";
import ReceiverAddressAdd from "../../address/components/ReceiverAddressAdd";
import EmptyPage from "../../common/components/EmptyPage";

class AddressSelect extends Component {
    componentWillMount() {
        document.title='选择收货地址';
        this.props.actions.getAddressList(this.props.needJudgeDistributionRange);
    }

    componentDidMount() {

    }

    componentDidUpdate (){

    }

    componentWillUnmount(){

    }

    render(){
        const {actions, callbackFunc, needJudgeDistributionRange} = this.props;
        const {addressList, showAddressAdd} = this.props.commonState;

        return(
            <div className="address-select">
                {
                    showAddressAdd &&
                    <ReceiverAddressAdd success={() => actions.getAddressList(needJudgeDistributionRange)} back={()=>actions.showAddressAddView(false)}/>
                }
                {
                    showAddressAdd===false &&
                    <div>
                        <div className="address-main">
                            <div className="rb-bg"/>

                            {
                                addressList.length === 0 ? <EmptyPage/> :
                                <div className="mc">
                                    {
                                        addressList.map((item) => {
                                            return (
                                                <div className={item.isInDistributionRange === 'N' ? "item disable" : "item"} key={item.receiverAddrId}>
                                                    <a onClick={item.isInDistributionRange === 'Y' ? () => callbackFunc(item) : () => {}}>
                                                        <p>{item.isDefaultAddr === 'Y' && <span>[默认]</span>}{item.deliveryAddr + " " + item.detailAddr}</p>
                                                        <span>{item.receiverName}</span>
                                                        <span>{item.contactTel}</span>
                                                        {
                                                            item.isInDistributionRange === 'N' &&
                                                            <em>不在配送范围内</em>
                                                        }
                                                    </a>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            }
                            <a className="plus-btn" onClick={() => actions.showAddressAddView(true)}>+ 新增地址</a>
                        </div>
                    </div>
                }
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
            getAddressList,
            showAddressAddView
        }, dispatch)
    }
};

AddressSelect.propTypes = {
    callbackFunc: PropTypes.func.isRequired,
    needJudgeDistributionRange: PropTypes.string.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(AddressSelect);