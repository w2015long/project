import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
// 引入方法
import {getCategory,} from "../actions/mallIndexActions";

import {Link} from "react-router-dom";
import Img from "../../../common/components/Img";

/**
 * 微商城首页 图片轮播
 */
class MallRotationPicture extends Component{
    //在组件首次渲染之后调用，这时候DOM节点已经首次加载完成。整个生命周期只会执行一次
    componentDidMount(){
        //加载 公告
        this.props.actions.getCategory("wap_index_category_adv",()=> MallRotationPicture.initRotationPicture());//查询轮播广告
    }
    static initRotationPicture() {
        new window.Swiper('.product-tab', {
            pagination : '.swiper-pagination',
            paginationType : 'fraction',
            autoplay: 1000,//可选选项，自动滑动
        });
    }
    render(){
        let {category} = this.props.mallIndexState;
        let categoryList =  category || [];
        return (
            <div className="slideshow">
                <div className="cont">
                    <div className="swiper-container product-tab">
                        <div className="swiper-wrapper">
                            {
                                categoryList.map((category,index) => {
                                    return (
                                        <div className="swiper-slide" key={index}>
                                            <a href="javascript:void(0)"><Img src={category.imgFileId} alt={category.title} onClick={()=>this.props.history.push(category.targetLink)}/></a>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="swiper-pagination"/>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        mallIndexState: store.mallIndexState
    }
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({getCategory}, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MallRotationPicture);