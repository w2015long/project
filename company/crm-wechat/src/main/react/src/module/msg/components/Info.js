/**
 * 咨询列表
 * Created by zhongzheng on 2018/8/16.
 */
// 引入react组件
import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
// 引入css
import "../../../module/common/style/swiper.min.css";
import EmptyPage from "../../common/components/EmptyPage";
import '../style/info.css';
//自动加载下一页
import AutoLoadMore from "../../common/components/AutoLoadMore";
import {Link} from "react-router-dom";
// 引入方法
import {changeOrderState, changeShowTitleState, getInfoCategory, pageInfo,} from "../actions/msgActions";

class Info extends  Component{
    //构造方法，基本没有使用
    constructor(prosp){
        super(prosp);
        document.title='咨询公告';
    }
    //在组件首次渲染之前调用，这时候DOM还没有，而且整个生命周期中只会被执行一次，在这里面setState是无效的
    componentWillMount(){
        let infoCategoryId = this.props.match.params.infoCategoryId;
        if (!infoCategoryId) {
            this.reloadInfo(infoCategoryId);
        } else {
            //加载咨询分类，资讯分类里再加载咨询
            let {infoPage} = this.props.msgInfoSate;
            this.props.actions.getInfoCategory(0, infoPage.size);
        }
    }
    //在组件首次渲染之后调用，这时候DOM节点已经首次加载完成。整个生命周期只会执行一次
    componentDidMount() {
        new window.Swiper('.tab-tit', {
            freeMode : true,
            slidesPerView : 'auto'
        });
    }

    //加载资讯列表
    reloadInfo(infoCategoryId){
        let {infoPage} = this.props.msgInfoSate;
        this.props.actions.pageInfo(infoCategoryId?infoCategoryId:infoPage.infoCategoryId,0, infoPage.size);
    }

    loadMoreFunc(){
        let {infoPage} = this.props.msgInfoSate;
        this.props.actions.pageInfo(infoPage.infoCategoryId,infoPage.page + 1, infoPage.size, infoPage.infoS);
    }
    /**
     * 点击切换咨询分类
     * @param infoCategoryId 咨询id
     */
    clickChangeOrder(infoCategoryId){
        this.reloadInfo(infoCategoryId);
        this.props.actions.changeOrderState(infoCategoryId);
        this.props.actions.changeShowTitleState(false);
    }

    render(){

        let {infoPage,infoCategory,categoryId,isShowTitle} = this.props.msgInfoSate;
        let infoS =  infoPage.infoS || [];
        let category =  infoCategory || [];
        const isHaveNextPage = infoPage.size * (infoPage.page + 1) < infoPage.recordsFiltered;
        return(
            <div className={'msg-info'} >
            <div className="information">
                <div className="hold-div-top"></div>
                <div className="tab-tit swiper-container">
                    <ul className="tab-nav swiper-wrapper clearfix">
                        {
                            category.map(categorys => {
                                return(
                                    <li className={categoryId === categorys.infoCategoryId?"swiper-slide cur":"swiper-slide"} key={categorys.infoCategoryId} >
                                        <a onClick={()=>this.clickChangeOrder(categorys.infoCategoryId)}>{categorys.title}</a>
                                    </li>
                                )
                            })
                        }
                    </ul>
                    <div className="more active">
                        <i onClick={()=>this.props.actions.changeShowTitleState(!isShowTitle)}></i>
                    </div>
                </div>

                {infoS.length === 0 ? <EmptyPage/>:
                    <div className="information-cont" id={'infoList'}>

                    {
                        infoS.map(info => {
                            return(
                                <Link to={"/msg/info/detail/"+info.infoId} key={info.infoId}>
                                <div className="item" >
                                    <span>{info.createTimeStr}</span>
                                    <div className="title elli">{info.title}</div>
                                    <p dangerouslySetInnerHTML={{__html: info.contentStr}}></p>
                                </div>
                                </Link>
                            )
                        })
                    }
                        {infoS.length > 0 && <AutoLoadMore container={'infoList'} isHaveNextPage = {isHaveNextPage} loadMoreFunc={this.loadMoreFunc.bind(this)}/> }

                </div>}
            </div>

            <div className="mask-layer" style={{display:(isShowTitle ? "":"none")}}>
                <div className="more-classify">
                        <div className="mt">
                        <span>资讯分类</span>
                        <i className="close" onClick={()=>this.props.actions.changeShowTitleState(!isShowTitle)}></i>
                    </div>
                    <div className="mc">
                        {
                            category.map(categorys => {
                                return(
                                    <span key={categorys.infoCategoryId} className={categoryId === categorys.infoCategoryId?"cur":""} onClick={()=>this.clickChangeOrder(categorys.infoCategoryId)}>{categorys.title}</span>
                                )
                            })
                        }
                    </div>
                    </div>
                </div>
            </div>
        );

    
}
}



const mapStateToProps = (store, ownProps) => {
    return {
        msgInfoSate:store.msgInfoSate
    }
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({pageInfo,getInfoCategory,changeShowTitleState,changeOrderState}, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Info);
