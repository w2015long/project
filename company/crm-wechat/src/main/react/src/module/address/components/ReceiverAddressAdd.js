/**
 * Created by admin on 2018/3/28.
 */
import React, {Component} from "react";
import "../style/ReceiverAddressAdd.css";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {
    clearCurrentDetailAddress,
    isSelectDefaultAddress,
    isShowAddAddressComponent,
    isShowSearchAddressComponent,
    saveReceiverAddress,
    setSearchAddressDetailInfo,
    findDetailedAddress
} from "../actions/addressAction";
import ReceiverAddressSearch from "../components/ReceiverAddressSearch";
import {setIsShowAddAddressComponent} from "../../index/actions/indexActions";

class ReceiverAddressAdd extends Component {

    componentWillMount() {
        document.title='新增地址';
        this.props.actions.isShowSearchAddressComponent(false);
        this.props.actions.clearCurrentDetailAddress();
       let mapLocation = window.localStorage.mapLocation;
       if(mapLocation){
           this.props.actions.findDetailedAddress(mapLocation);
       }

    }
    componentWillUnmount() {
        this.props.actions.setIsShowAddAddressComponent(false)
    };

    addReceiverAddress() {
        var self = this;
        if (!this.validateInput()) {
            return;
        }
        const address = this.props.addressState.address;
        let data = {
            receiverName: self.trim(this.refs.receiverName.value),
            contactTel: self.trim(this.refs.receiverMobile.value),
            deliveryAddr: self.trim(this.refs.deliveryAddress.innerHTML),
            detailAddr: self.trim(this.refs.detailAddress.value),
            addrLat: address.location.lat,
            addrLng: address.location.lng,
            cityName: address.cityname,
            isDefaultAddr: this.props.addressState.isDefaultAddress ? "Y" : "N",
            districtName:address.adname
        };

        this.props.actions.saveReceiverAddress(data, success => {
            if (success) {
                window.successTip("添加成功");
                if (typeof this.props.success === "function") {
                    this.props.success();
                }
            }
        });
    }

    onInput(e, len) {
        let val = e.target.value;
        if (val.length > len) {
            e.target.value = val.slice(0, len)
        }
    }

    trim(text) {
        const rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
        return text === null ? "" : (text + "").replace(rtrim, "");
    }

    validateInput() {
        let receiverName = this.refs.receiverName.value;
        let receiverMobile = this.refs.receiverMobile.value;
        let deliveryAddress = this.refs.deliveryAddress.innerHTML;
        let detailAddress = this.refs.detailAddress.value;

        if (!receiverName) {
            window.warningTip("收货人姓名不能为空！");
            return false;
        }

        if (!receiverMobile) {
            window.warningTip("收货人号码不能为空！");
            return false;
        }

        let reg = new RegExp(/^1[23456789]\d{9}$/);
        if (!reg.test(receiverMobile)) {
            window.warningTip("手机号码格式错误！");
            return false;
        }

        if (!deliveryAddress) {
            window.warningTip("收货地址不能为空！");
            return false;
        }

        if (!detailAddress) {
            window.warningTip("详细地址不能为空！");
            return false;
        }
        return true;
    }

    back() {
        if (typeof this.props.back === "function") {
            this.props.back();
        }
    }

    render() {
        const {address, isDefaultAddress, isShowSearchAddressComponent,detailedAddress} = this.props.addressState;
        const {actions} = this.props;
        return (
            <div className="receiver-address-add">
                {   isShowSearchAddressComponent &&
                    <ReceiverAddressSearch addressData={(data) => actions.setSearchAddressDetailInfo(data)}/>
                }

                <div className="addr-main" style={{display: isShowSearchAddressComponent ? "none" : "block"}}>
                    <div className="mt">
                        <span onClick={() => this.back()} className="back"/>
                        <span>新增地址</span>
                        <a className="save-btn" onClick={() => this.addReceiverAddress()}>保存</a>
                    </div>
                    <div className="hold-div-top"></div>
                    <div className="mc">
                        <div className="item">
                            <div className="cell-hd">收货人</div>
                            <div className="cell-bd">
                                <input type="text" placeholder="填写收货人" ref={'receiverName'}/>
                            </div>
                        </div>
                        <div className="item">
                            <div className="cell-hd">手机号</div>
                            <div className="cell-bd">
                                <input type="number" placeholder="请输入11位手机号码" onInput={e => this.onInput(e, 11)} ref={'receiverMobile'}/>
                            </div>
                        </div>
                        <div className="item" onClick={() => actions.isShowSearchAddressComponent(true)}>
                            <div className="cell-hd">收货地址</div>
                            <div className="cell-bd">
                                { detailedAddress && <i ref={'deliveryAddress'}>{detailedAddress}</i> }
                                { !detailedAddress && <i ref={'deliveryAddress'}>{address.pname}{address.cityname}{address.adname}{address.address}{address.name}</i> }
                            </div>
                            <div className="cell-ft"></div>
                        </div>
                        <div className="item">
                            <div className="cell-hd">楼号门牌</div>
                            <div className="cell-bd">
                                <input type="text" placeholder="楼号/单元/门牌号" ref={'detailAddress'}/>
                            </div>
                        </div>
                        <div className="item">
                            <div className="cell-hd">设置默认地址</div>
                            <div className="cell-bd text-right">
                                <span className={isDefaultAddress ? "switchery checked" : "switchery"} onClick={() => this.props.actions.isSelectDefaultAddress(!isDefaultAddress)}><i/></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        addressState: store.addressState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            saveReceiverAddress,
            isSelectDefaultAddress,
            isShowSearchAddressComponent,
            setSearchAddressDetailInfo,
            isShowAddAddressComponent,
            setIsShowAddAddressComponent,
            clearCurrentDetailAddress,
            findDetailedAddress
        }, dispatch)
    }
};

ReceiverAddressAdd.propTypes = {
    success: PropTypes.func.isRequired,
    back: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReceiverAddressAdd);
