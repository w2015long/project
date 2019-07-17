/**
 * Created by admin on 2018/3/29.
 */
import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import "../style/ReceiverAddressSearch.css";
import {
    clearPoi,
    inputChange,
    isShowSearchAddressComponent,
    setPlaceSearch,
    setPois,
    setSearchAddressDetailInfo,
    cleanMapLocation
} from "../actions/addressAction";

class ReceiverAddressSearch extends Component {

    componentWillMount() {
        document.title = '定位';
    }

    componentDidMount() {
        this.initData();
        this.initMap();
    }

    initData(){
        this.props.actions.inputChange('');
        this.props.actions.clearPoi();
    }

    initMap(){
        const self = this;

        let map = new window.AMap.Map("map", {
            resizeEnable: true,
            zoom: 16,
            scrollWheel: false
        });

        var geocoder, marker;
        map.plugin('AMap.Geocoder', function() {
            geocoder = new window.AMap.Geocoder({
                city: "010", //城市设为北京，默认：“全国”
                radius: 1000 //范围，默认：500
            });
        });

        // 关键字搜索
        window.AMap.service(["AMap.PlaceSearch"], function () {
            let placeSearch = new window.AMap.PlaceSearch({ //构造地点查询类
                pageSize: 5,//拿五条搜索出来的信息
                pageIndex: 1,
                map: map,
                city: "010"//城市
            });
            self.props.actions.setPlaceSearch(placeSearch);
        });

        // 自动提示
        const auto = new window.AMap.Autocomplete({
            input: "place"
        });
        window.AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
        function select(e) {
            self.search(e.poi.name);
        }

        // 定位
        map.plugin('AMap.Geolocation', function() {
            let geolocation = new window.AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 2000,          //超过10秒后停止定位，默认：无穷大
                buttonOffset: new window.AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                buttonPosition:'RB'
            });
            map.addControl(geolocation);
            geolocation.getCurrentPosition();
            window.AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
            window.AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
        });

        // 解析定位结果
        function onComplete(data) {
            self.search(data.formattedAddress);
        }

        // 解析定位错误信息
        function onError(data) {

            if (!marker) {
                marker = new window.AMap.Marker();
                map.add(marker);
            }
            let mapLocation = window.localStorage.mapLocation;
            if(!mapLocation){
                window.errorTip("定位失败！");
                return;
            }
            var mapLocationArray = mapLocation.split(',');
            if(mapLocationArray && mapLocationArray.length === 2){
                marker.setPosition(mapLocationArray);
                geocoder.getAddress(mapLocationArray, function (status, result) {
                    if (status === 'complete' && result.regeocode) {
                        //详细地址
                        var address = result.regeocode.formattedAddress;
                        //利用地址搜索
                        self.search(address);
                    } else {
                        window.errorTip("定位失败！")
                    }
                });
            }else {
                window.errorTip("定位失败！")
            }
        }

        // 拖拽选址
        window.AMapUI.loadUI(['misc/PositionPicker'], function(PositionPicker) {
            let positionPicker = new PositionPicker({
                mode: 'dragMap',
                map: map
            });

            positionPicker.on('success', function(positionResult) {
                if (positionResult.info === 'OK'){
                    self.props.actions.setPois(positionResult.regeocode.pois);
                }
            });
            let onModeChange = function(e) {
                positionPicker.setMode(e.target.value)
            };
            positionPicker.start(map.getBounds().getSouthWest());
            window.AMap.event.addDomListener('dragMap', 'change', onModeChange);
            positionPicker.start();
            map.panBy(0, 1);

            map.addControl(new window.AMap.ToolBar({
                liteStyle: true
            }))
        });
    }

    placeSearch() {
        this.search(this.refs.place.value);
    }

    search(place){
        const props = this.props;
        props.addressState.placeSearch.search(place, function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
                props.actions.setPois(result.poiList.pois);
            } else {
                window.warningTip("您输入的地址有误!请输入正确的地址")
            }
        });
    }

    searchAddress(e){
        if (e.keyCode === 13) {
            this.placeSearch();
        }
    }

    selectedAddress(poi) {
        const props = this.props;
        const {placeSearch} = props.addressState;
        placeSearch.getDetails(poi.id, function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
                if (typeof props.addressData === "function") {
                    props.addressData(result.poiList.pois[0]);
                    props.actions.isShowSearchAddressComponent(false);
                }
            }
        });

        //选中后把最开始定位设未空值
        props.actions.cleanMapLocation();
    }

    clearInput(){
        this.refs.place.value = '';
        this.props.actions.inputChange('');
    }

    render() {
        const self = this;
        const {pois, keyword} = self.props.addressState;
        const {actions} = self.props;
        return (
            <div className="address-search-main">
                <div className="div-top"></div>
                <div className="mt">
                    <div className="mt-map" id="map"></div>
                    <div className="search-box">
                        <input placeholder="请输入搜索地址" type="text" ref={'place'} id="place" onChange={(event)=>actions.inputChange(event.target.value)} onKeyDown={(event) => this.searchAddress(event)}  />
                        <span className="search-btn" onClick={() => this.placeSearch()}/>
                        {keyword && <span className="del-btn" onClick={() => this.clearInput()}/>}
                    </div>
                </div>
                {pois.length !== 0 &&
                <div className="mc">
                    {pois.map((poi, index) => {
                        return (
                            <div className="item" onClick={() => this.selectedAddress(poi)} key={index}>
                                <p>{poi.name}</p>
                                <span>{poi.address}</span>
                            </div>
                        );
                    })}
                </div>
                }
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
        actions: bindActionCreators({setPois, setSearchAddressDetailInfo, setPlaceSearch, isShowSearchAddressComponent, inputChange, clearPoi,
            cleanMapLocation
        }, dispatch)
    }
};

ReceiverAddressSearch.propTypes = {
    addressData: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReceiverAddressSearch);