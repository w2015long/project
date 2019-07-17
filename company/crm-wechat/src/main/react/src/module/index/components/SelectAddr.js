/**
 * @author olx
 * @date 2018/3/28
 */

import React, {Component} from "react";

import "../style/SelectAddr.css";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import {
    findReceiverListByUserId,
    getShopDetail,
    setIsShowAddAddressComponent,
    setLocation
} from "../actions/indexActions.js";
import ReceiverAddressAdd from "../../address/components/ReceiverAddressAdd";
import {initJsSdk} from '../../common/actions/jssdkAction'

class SelectAddr extends Component {
//仅处理从首页进来而非直接跳入
    componentWillMount() {
        this.props.actions.findReceiverListByUserId();//刷新收货地址
        document.title = '选择收货地址';

    }

    render(){
        const receiverList = this.props.indexState.receiverList||[];
        const locationName = this.props.indexState.locationName;
        const isShowAddAddressComponent = this.props.indexState.isShowAddAddressComponent;
        return(
            <div >
                {
                    isShowAddAddressComponent &&
                    <ReceiverAddressAdd success={()=>this.updateAddrass()} back={()=>this.updateAddrass()}/>
                }
                {!isShowAddAddressComponent && <div className="address-main"><div className="mt">
                    <div className="box" >
                        <span>当前定位地址</span>
                        <p>{locationName}</p>
                        <a onClick={()=>{this.getNewLocation()}} className="re-ben">重新定位</a>
                    </div>
                </div>
                    <div className="mc">
                        <h5>您的收货地址</h5>
                        {receiverList.map((addr,index)=>{
                            return(
                                <div className="item" onClick={() => {this.changeAddr(addr.addrLng + "," + addr.addrLat)}} key={index}>
                                    <a>
                                        <p>{addr.deliveryAddr}{addr.detailAddr}</p>
                                        <span>{addr.receiverName}</span>
                                        <span>{addr.contactTel}</span>
                                    </a>
                                </div>
                            )
                        })}
                    </div>
                    <a  className="plus-btn"  onClick={()=>{this.props.actions.setIsShowAddAddressComponent(true)}} >+ 新增地址</a></div>   }
            </div>
        );
    }

    getNewLocation() {
        const self = this;
        const getShopDetail = this.props.actions.getShopDetail;//
        initJsSdk(
            () => {
                window.wx.getLocation({
                    type: 'gcj02',
                    success: function (res) {
                        let mapLocation = res.longitude + "," + res.latitude;
                        window.localStorage.mapLocation = mapLocation||"";
                        getShopDetail(mapLocation,"Y",()=>{self.props.history.push('/index')});
            },
                    cancel: function (res) {
                        window.warningTip("定位失败,请选择或者新建地址");
                    },
                    fail: function () {
                        window.warningTip("定位失败,请选择或者新建地址");
                    }
                });
            },
            () => {
                window.warningTip("定位失败,请选择或者新建地址");
            }
        )

    }

    changeAddr(mapLocation) {
        const getShopDetail = this.props.actions.getShopDetail;//获取门店详情列表
        window.localStorage.mapLocation = mapLocation||"";
        window.localStorage.isForce = "Y";
        getShopDetail(mapLocation,"Y",()=>{this.props.history.push('/index')});

    }

    updateAddrass() {
        this.props.actions.setIsShowAddAddressComponent(false);
        this.props.actions.findReceiverListByUserId();
    }


}

const mapStateToProps = (store, ownProps) => {
    return {
        indexState: store.indexState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            findReceiverListByUserId,
            setIsShowAddAddressComponent,
            getShopDetail,
            setLocation
        }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectAddr);




