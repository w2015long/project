/**
 * Created by admin on 2018/3/28.
 * 收货地址列表
 */
import React, {Component} from "react";
import "../style/ReceiverAddressList.css";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {
    clearCurrentDetailAddress,
    getMemberReceiverAddressList,
    isShowAddAddressComponent
} from "../actions/addressAction";
import ReceiverAddressAdd from "../components/ReceiverAddressAdd";
import EmptyPage from "../../common/components/EmptyPage";

class ReceiverAddressList extends Component {

    componentWillMount() {
        document.title='收货地址';
        this.props.actions.getMemberReceiverAddressList();
        this.props.actions.isShowAddAddressComponent(false);
    }

    success(){
        this.props.actions.getMemberReceiverAddressList();
        this.props.actions.isShowAddAddressComponent(false);
    }

    toEditAddress(addressId){
        this.props.history.push("/address/edit/" + addressId);
        this.props.actions.clearCurrentDetailAddress();
    }

    render() {
        const {addressData, isShowAddAddressComponent} = this.props.addressState;
        const {actions} = this.props;
        return (
        <div className="receiver-address-list">
            {
                isShowAddAddressComponent &&
                <ReceiverAddressAdd success={()=>this.success()} back={()=>actions.isShowAddAddressComponent(false)}/>
            }
            {
                !isShowAddAddressComponent &&
                <div className="address-main">
                    <div className="rb-bg"/>
                    {addressData.length === 0 ? <EmptyPage/>:<div className="mc">
                        {addressData.map((addr,index) => {
                            return (
                                <div className="item" key={index}>
                                    <a onClick={()=>this.toEditAddress(addr.receiverAddrId)}>
                                        <p>{addr.isDefaultAddr === 'Y' && <span>[默认]</span>}{addr.deliveryAddr}{addr.detailAddr}</p>
                                        <span>{addr.receiverName}</span>
                                        <span>{addr.contactTel}</span>
                                    </a>
                                </div>
                            );
                        })}
                    </div>}
                    <span className="plus-btn" onClick={() => actions.isShowAddAddressComponent(true)}>+ 新增地址</span>
                </div>
            }
        </div>
        );
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        addressState: store.addressState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({getMemberReceiverAddressList, clearCurrentDetailAddress, isShowAddAddressComponent}, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ReceiverAddressList);