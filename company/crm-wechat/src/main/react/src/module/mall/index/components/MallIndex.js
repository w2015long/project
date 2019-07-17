import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
// 引入css
import "../../../../module/common/style/swiper.min.css";
import "../style/mall.css";
import IndexHead from "./../../../index/components/IndexHead";
import MallRotationPicture from "./MallRotationPicture";
import MallChannelPage from "./MallChannelPage";
import MallNotice from "./MallNotice";
import MallProductCategory from "./MallProductCategory";
import Footer from "../../../common/components/Footer";
import IndexProductSearch from "../../../index/components/IndexProductSearch";

/**
 * 微商城首页
 */
class MallIndex extends Component{

    componentWillMount() {
        document.title = "微商城";
    }

    render(){
        const indexState = this.props.indexState;
        const {shopDetail, locationName} = indexState;
        const history = this.props.history;
        const url = "/product/search/b2c";
        const isStickySearchInput = "N";//下拉悬浮搜索框
        return (
            <div className="mall-main">
                <div className="mall-top">
                    <div className="top-cont" >
                        {/*头部定位*/}
                       {/* <IndexHead locationName={locationName}  history={history} indexShopIsExit={!!shopDetail.shopId}/>*/}
                        <IndexProductSearch history={history} searchProductUrl={url} isStickySearchInput={isStickySearchInput}  />
                    </div>
                    {/*图片轮播*/}
                    <MallRotationPicture history={this.props.history}/>
                </div>
                {/*频道页*/}
                <MallChannelPage/>
                {/*公告*/}
                <MallNotice/>
                {/*商品分类*/}
                <MallProductCategory/>
                {/*公共底部*/}
                <Footer state={"mall"} history={history}/>
            </div>
        )
    }


}

const mapStateToProps = (store, ownProps) => {
    return {
        indexState: store.indexState,
    }
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({}, dispatch)
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(MallIndex);

