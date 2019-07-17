/**
 * @author kwy
 * @date 2018/8/15
 * 咨讯中心详情
 */
// 引入react组件
import React, {Component} from "react";
// 引入css
import "../../../module/common/style/swiper.min.css";
import '../style/info-detail.css';
import '../style/info.css';
// 引入方法
import {getInfoDetail} from "../actions/infoDetailActions";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {changeOrderState, changeShowTitleState, getInfoCategory} from "../actions/msgActions";


class InfoDetail extends Component {
    //构造方法，基本没有使用
    constructor(prosp) {
        super(prosp);
        document.title = '资讯详情';
    }

    //在组件首次渲染之前调用，这时候DOM还没有，而且整个生命周期中只会被执行一次，在这里面setState是无效的
    componentWillMount() {
        let infoId = this.props.match.params.infoId;

        this.props.actions.getInfoDetail(infoId);
        /*资讯分类*/
        this.props.actions.getInfoCategory(null, null);
    }


    /**
     * 点击切换咨询分类
     * @param infoCategoryId 咨询id
     */
    clickChangeOrder(infoCategoryId) {
        this.props.history.push('/msg/info/' + infoCategoryId);
    }

    render() {
        const {infoDetail} = this.props.infoDetailState;
        const {infoCategory, isShowTitle} = this.props.msgInfoSate;
        const category = infoCategory || [];
        const categoryId = infoDetail.infoCategoryId;
        return (
            <div className={'info-detail'}>
                {/*顶部*/}
                <div className={'msg-info'}>
                    <div className="information">
                        <div className="hold-div-top"></div>
                        <div className="tab-tit swiper-container">
                            <ul className="tab-nav swiper-wrapper clearfix">
                                {
                                    category.map(categorys => {
                                        return (
                                            <li className={categoryId === categorys.infoCategoryId ? "swiper-slide cur" : "swiper-slide"}
                                                key={categorys.infoCategoryId}>
                                                <a onClick={() => this.clickChangeOrder(categorys.infoCategoryId)}>{categorys.title}</a>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                            <div className="more active">
                                <i onClick={() => this.props.actions.changeShowTitleState(!isShowTitle)}></i>
                            </div>
                        </div>
                        <div className="mask-layer" style={{display: (isShowTitle ? "" : "none")}}>
                            <div className="more-classify">
                                <div className="mt">
                                    <span>资讯分类</span>
                                    <i className="close"
                                       onClick={() => this.props.actions.changeShowTitleState(!isShowTitle)}></i>
                                </div>
                                <div className="mc">
                                    {
                                        category.map(categorys => {
                                            return (
                                                <span key={categorys.infoCategoryId}
                                                      className={categoryId === categorys.infoCategoryId ? "cur" : ""}
                                                      onClick={() => this.clickChangeOrder(categorys.infoCategoryId)}>{categorys.title}</span>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/*详情*/}
                <div className="information-detail">
                    <h5>{infoDetail.title}</h5>
                    <span>作者: {infoDetail.author}</span>
                    <span>发布时间: {infoDetail.createTimeStr}</span>
                    <div className="line"></div>
                    <div className="mc" dangerouslySetInnerHTML={{__html: infoDetail.contentStr}}>
                    </div>
                </div>

            </div>
        )
    };
}

const mapStateToProps = (store, ownProps) => {
    return {
        infoDetailState: store.infoDetailState,
        msgInfoSate: store.msgInfoSate
    }
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({getInfoDetail, getInfoCategory, changeOrderState, changeShowTitleState}, dispatch),

    }
};
export default connect(mapStateToProps, mapDispatchToProps)(InfoDetail);