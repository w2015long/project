import React, {Component} from "react";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import icon24x24 from "../../../media/images/icon24x24.png";
import dinwei from "../../../media/images/dinwei.png";
import "../style/BargainAddress.css";
import {getBargainAddressList} from "../../bargain/actions/bargainAddressAction";

class BargainAddress extends Component {
    componentWillMount() {
        document.title = '砍价提货地址';
        this.props.actions.getBargainAddressList(this.props.mutualBargainActivityId, this.props.mutualBargainShareRecordId);
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }

    /**
     * 选择地址
     */
    selectAddress(addressItem) {
        let callbackFunc = this.props.callbackFunc;
        callbackFunc(addressItem);
    }

    render() {
        let self = this;
        const {addressList} = this.props.bargainAddressState;
        return (
            <div className="bargain-address-select">
                <div className="index-main">
                    {addressList &&
                    <div className="nearby-shop">
                        <div className="mt">
                            周边门店<i>/</i><span>{addressList.length}</span>
                        </div>
                        {
                            addressList.map(function (addressItem, index) {
                                return (
                                    <div className=" consignee-addr2" key={index} onClick={() => {
                                        if (addressItem.isHasInventory === "Y") {
                                            self.selectAddress(addressItem)
                                        } else {
                                            window.warningTip('该门店缺货，请选择其他门店！');
                                        }
                                    }}>
                                        <a href="javascript:void(0);">
                                            <span className="zt">【1】</span>
                                            <span
                                                className="zt zt2">{addressItem.shopName}{addressItem.isHasInventory === "Y" ? "" : "(缺货)"}</span>
                                            <p>{addressItem.shopAddress}</p>
                                            <h5><img src={icon24x24}/></h5>
                                        </a>
                                        <a href="javascript:void(0);">
                                            <span className="zt">【2】</span>
                                            <span className="zt zt2">{addressItem.activityArea}</span>
                                            <p>{addressItem.activitySite}</p>
                                            <h5><img src={dinwei}/></h5>
                                        </a>
                                    </div>
                                )
                            })
                        }
                    </div>
                    }

                </div>
            </div>
        );
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        bargainAddressState: store.bargainAddressState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            getBargainAddressList,
        }, dispatch)
    }
};

BargainAddress.propTypes = {
    callbackFunc: PropTypes.func.isRequired,
    mutualBargainActivityId: PropTypes.number.isRequired,
    mutualBargainShareRecordId: PropTypes.number.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(BargainAddress);