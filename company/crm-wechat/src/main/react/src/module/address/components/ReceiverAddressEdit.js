/**
 * Created by admin on 2018/3/29.
 */
import React, {Component} from "react";
import "../style/ReceiverAddressAdd.css";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {
    clearCurrentDetailAddress,
    clearPoi,
    deleteReceiverAddress,
    getReceiverAddressById,
    isSelectDefaultAddress,
    isShowSearchAddressComponent,
    saveReceiverAddress,
    setSearchAddressDetailInfo
} from "../actions/addressAction";
import ReceiverAddressSearch from "../components/ReceiverAddressSearch";

class ReceiverAddressEdit extends Component {

    componentWillMount() {
        document.title='编辑地址';
        this.props.actions.isShowSearchAddressComponent(false);
        this.props.actions.clearCurrentDetailAddress();
    }

    componentDidMount() {
        this.props.actions.getReceiverAddressById(this.props.match.params.id, () => {
            const {addressDetail} = this.props.addressState;
            this.setFormValue(addressDetail);
            this.refs.deliveryAddress.innerHTML = addressDetail.deliveryAddr
        });
    }

    setFormValue(addressDetail) {
        this.refs.receiverName.value = addressDetail.receiverName;
        this.refs.receiverMobile.value = addressDetail.contactTel;
        this.refs.detailAddress.value = addressDetail.detailAddr;
    }

    editReceiverAddress() {
        var self = this;
        if (!this.validateInput()) {
            return;
        }

        const {addressDetail, address} = this.props.addressState;
        let data = {
            receiverAddrId: this.props.addressState.addressDetail.receiverAddrId,
            receiverName: self.trim(this.refs.receiverName.value),
            contactTel: self.trim(this.refs.receiverMobile.value),
            deliveryAddr: self.trim(this.refs.deliveryAddress.innerHTML),
            detailAddr: self.trim(this.refs.detailAddress.value),
            addrLat: address.location.lat === undefined ? addressDetail.addrLat : address.location.lat,
            addrLng: address.location.lng === undefined ? addressDetail.addrLng : address.location.lng,
            cityName: address.cityname === undefined ? addressDetail.cityName : address.cityname,
            isDefaultAddr: this.props.addressState.isDefaultAddress ? "Y" : "N"
        };

        this.props.actions.saveReceiverAddress(data, success => {
            if (success) {
                this.props.history.push('/address/list');
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

    showReceiverAddressSearch(isShow) {
        this.props.actions.clearPoi();
        this.props.actions.isShowSearchAddressComponent(isShow);
    }

    deleteAddress() {
        const addressDetail = this.props.addressState.addressDetail;
        window.showConfirm("确认删除吗？",
            () => {
                this.props.actions.deleteReceiverAddress(addressDetail.receiverAddrId, success => {
                    if (success) {
                        this.props.history.push('/address/list');
                    }
                });
            }
        )
    }

    searchAddressDetailInfo(data) {
        this.props.actions.setSearchAddressDetailInfo(data);
        this.setFormValue(this.props.addressState.addressDetail);
    }

    back() {
        window.showConfirm("确定放弃此次编辑？",
            () => {
                this.props.history.push('/address/list');
            }
        )
    }

    render() {
        const {addressDetail, isDefaultAddress, address, isShowSearchAddressComponent} = this.props.addressState;
        return (
            <div className="receiver-address-add">
                {   isShowSearchAddressComponent &&
                    <ReceiverAddressSearch addressData={(data) => this.searchAddressDetailInfo(data)}/>
                }
                <div className="addr-main" style={{display: isShowSearchAddressComponent ? "none" : "block"}}>
                    <div className="mt">
                        <span className="back" onClick={() => this.back()}/>
                        <span>编辑收货地址</span>
                        <span className="del-btn" onClick={() => this.deleteAddress()}>删除</span>
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
                                <input type="number" placeholder="填写11位手机号码" ref={'receiverMobile'}
                                       onInput={e => this.onInput(e, 11)}/>
                            </div>
                        </div>
                        <div className="item"
                             onClick={() => this.showReceiverAddressSearch(true)}>
                            <div className="cell-hd">收货地址</div>
                            <div className="cell-bd"><span
                                ref={'deliveryAddress'}>{address.name === undefined ? addressDetail.deliveryAddr :  address.pname + address.cityname + address.adname + address.address + address.name}</span>
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
                            <div className="cell-bd text-right"><span
                                className={isDefaultAddress ? "switchery checked" : "switchery"}
                                onClick={() => this.props.actions.isSelectDefaultAddress(!isDefaultAddress)}><i></i></span>
                            </div>
                        </div>
                        <span className="save-btn" onClick={() => this.editReceiverAddress()}>保存</span>
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
            getReceiverAddressById,
            clearPoi,
            saveReceiverAddress,
            deleteReceiverAddress,
            isSelectDefaultAddress,
            isShowSearchAddressComponent,
            setSearchAddressDetailInfo,
            clearCurrentDetailAddress
        }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ReceiverAddressEdit);