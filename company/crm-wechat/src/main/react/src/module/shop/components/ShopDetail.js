/**
 * @author chencheng
 * @date 2018/3/27
 * 门店详情
 */
import React, {Component} from "react";
import {Link} from "react-router-dom";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import "../style/ShopDetail.css";
import {initJsSdk} from "../../common/actions/jssdkAction";
import {getShopDetail} from "../actions/shopDetailAction";

class ShopDetail extends Component {

    componentDidMount() {
        let self = this;
        document.title = '门店详情';
        initJsSdk();//初始化jssdk，查看地图需要
        this.props.actions.getShopDetail(self.props.match.params.shopId);//获取门店详情
    }
    openShopMap(){
        let shopDetail = this.props.shopDetailState.shopDetail;
        let mapLocation = shopDetail.mapLocation || '0,0';
        window.wx.openLocation({
            latitude: parseFloat(mapLocation.split(',')[1]), // 纬度，浮点数，范围为90 ~ -90
            longitude: parseFloat(mapLocation.split(',')[0]), // 经度，浮点数，范围为180 ~ -180。
            name: shopDetail.name, // 位置名
            address: shopDetail.address, // 地址详情说明
            scale: 28, // 地图缩放级别,整形值,范围从1~28。默认为最大
            infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
        });
    }

    render() {
        const {shopDetail} = this.props.shopDetailState ||{};
        const photos = shopDetail.shopPhotos ? shopDetail.shopPhotos.split(',') : [];
        const shopId = this.props.match.params.shopId;
        return (
            <div className="shop-detail">
                <div className="mc">
                    <div className="store-pic">
                        <img src={shopDetail.wechatPhoto} alt=""/>
                        {shopDetail.isNormalOpening === "N"?<span>停业中</span>:""}
                        {shopDetail.isNormalOpening === "Y" &&shopDetail.isRest ==="Y"?<span>休息中</span>:""}
                    </div>
                    <div className="name"><span className="elli">{shopDetail.name}</span></div>
                    <div className="store-info">
                        {/*<h5>配送</h5>*/}
                        <div className="info-box">
                            <div className="item"><span className="elli">配送费：{shopDetail.distributionAmountDescribe}</span></div>
                            <div className="item"><span className="elli">经营时间：{shopDetail.openingTimeStart}-{shopDetail.openingTimeEnd}</span></div>
                            <div className="item"><a href={'tel:'+shopDetail.managerTel}><span className="elli" >联系电话：{shopDetail.managerTel}</span></a></div>
                            <div className="item" onClick={this.openShopMap.bind(this)}><a><span className="elli">门店位置：{shopDetail.address}</span></a></div>
                        </div>
                    </div>
                    <div className="announcement">
                        <h5>公告</h5>
                        <p>{shopDetail.notice}</p>
                    </div>
                    <div className="mc-pic">
                        {
                            photos.map(function (photo, index) {
                                if (!photo){
                                    return null;
                                }
                                return <div className="item" key={index}>
                                    <img src={photo} alt=""/>
                                </div>
                            })
                        }
                    </div>
                </div>
                <Link to={"/shop/complaint/" + shopId} className="complain">投诉</Link>
            </div>
        )
    }
}

ShopDetail.propTypes = {
};

ShopDetail.contextTypes = {
};

const mapStateToProps = (store, ownProps) => {
    return {
        shopDetailState:store.shopDetailState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({getShopDetail}, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopDetail);




