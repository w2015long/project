/**
 * 砍价活动
 * Created by liezihao on 2018/12/27
 */
// 引入react组件
import React, {Component} from 'react';
// 引入方法
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import '../style/bargainActivity.css';
import {
    bargainActivityPage,
    mutualBargainShareRecordPage,
    saveMutualBargainShareRecord,
    updateShowTab
} from '../../bargain/actions/bargainActivityAction.js';
import banne_bg from "../../../media/images/banne-bg.png";
import overdue from "../../../media/images/huodonguoqi.png";
import Img from "../../common/components/Img";
//自动加载下一页
import AutoLoadMore from "../../../module/common/components/AutoLoadMore";
import { Affix } from 'antd';



class BargainActivityList extends Component {



    //在组件首次渲染之前调用，这时候DOM节点已经首次加载完成。整个生命周期只会执行一次
    componentWillMount() {
        let self = this;
        document.title = '砍价活动';
        let {activityPage,mutualBargainShareRecordPage} = this.props.bargainActivityPageState;
        self.props.actions.bargainActivityPage(0,activityPage.size);
        self.props.actions.mutualBargainShareRecordPage(0,mutualBargainShareRecordPage.size);
    }
    // 加载下一页
    loadMoreFunc(){
        let {activityPage} = this.props.bargainActivityPageState;
        this.props.actions.bargainActivityPage(activityPage.page+1,activityPage.size,activityPage.activity);
    }
    // 加载下一页
    loadMoreFuncTwo(){
        let {mutualBargainShareRecordPage} = this.props.bargainActivityPageState;
        this.props.actions.mutualBargainShareRecordPage(mutualBargainShareRecordPage.page+1,mutualBargainShareRecordPage.size,mutualBargainShareRecordPage.mutualBargainShareRecord);
    }

    /**
     * 更改显示tab
     *  true 显示砍价商品 false显示我的砍价
     */
    updateShowTab (showThatTab){
        this.props.actions.updateShowTab(showThatTab);
    }

    //保存分享者记录
    saveMutualBargainShareRecord(mutualBargainActivityId , activityProductId,e){
        this.props.actions.saveMutualBargainShareRecord(mutualBargainActivityId,activityProductId ,(mutualBargainShareRecordId)=>{this.toBarCodeScan(mutualBargainShareRecordId)},()=>{this.toMemberLoginIn()});
        e.stopPropagation();
    }

    toBarCodeScan(mutualBargainShareRecordId) {
        this.props.history.push('/bargain/mutualBargain/'+ mutualBargainShareRecordId);
    }
    toMemberLoginIn() {
        this.props.history.push('/member/memberLoginIn');
    }

    render() {
        let _this = this;

        const {showThatTab,activityPage,mutualBargainShareRecordPage} = this.props.bargainActivityPageState;
        let activityList = activityPage.activity || [];
        let mutualBargainShareRecordList = mutualBargainShareRecordPage.mutualBargainShareRecord || [];
        const isHaveNextPage = activityPage.size * (activityPage.page + 1) < activityPage.recordsFiltered;
        const isHaveNextPageTwo = mutualBargainShareRecordPage.size * (mutualBargainShareRecordPage.page + 1) < mutualBargainShareRecordPage.recordsFiltered;
        return (
            <div className="bargainActivityClass">
                <div className="bargaining-main">
                    <div className="banner">
                        <img src={banne_bg} alt={"图片"}/>
                    </div>

                    <div className="product">
                        <Affix offsetTop={0} >
                            <div className="product_title productTitleDiv">
                                <div className={showThatTab ? "title_l cur" : "title_l"} onClick={ () =>{_this.updateShowTab(true)}}>砍价商品</div>
                                <div className={!showThatTab ? "title_l cur" : "title_l"} onClick={() =>{_this.updateShowTab(false)}}>我的砍价</div>
                            </div>
                        </Affix>


                        <div className={showThatTab ? "product_list_box  cur" : "product_list_box"} id={'activityList'}>
                            {
                                activityList.map(activity=>{
                                    return(
                                        <div className="product_list" key={activity.mutualBargainProductId} onClick={(e)=>_this.saveMutualBargainShareRecord(activity.mutualBargainActivityId , activity.activityProductId,e)}>
                                            <div className="list_pic">
                                                {  activity.productMainPicUrl != null &&
                                                <Img src={activity.productMainPicUrl}/>
                                                }
                                            </div>
                                            <div className="list_information border_b">
                                                <h5>{activity.productNm}</h5>
                                                <h6>价值{activity.productPriceDouble}元</h6>
                                                <p>{activity.receiveNum}人已{activity.activityPriceDouble}元拿</p>
                                                  <div  className="take_free_btn" >立即砍价</div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <AutoLoadMore container={'activityList'} isHaveNextPage = {isHaveNextPage} loadMoreFunc={this.loadMoreFunc.bind(this)}/>
                        </div>



                        <div className={!showThatTab ? "product_list_box  cur" : "product_list_box"} id={'mutualBargainShareRecordList'} >

                            {
                                mutualBargainShareRecordList.map(mutualBargainShareRecord=>{
                                    return(

                                        <div key={mutualBargainShareRecord.mutualBargainShareRecordId}>
                                            {
                                                //未过期
                                                !mutualBargainShareRecord.expired &&
                                                <div className="product_list" onClick={()=>{this.props.history.push('/bargain/mutualBargain/'+mutualBargainShareRecord.mutualBargainShareRecordId)}}>
                                                    <div className="list_pic">
                                                        {  mutualBargainShareRecord.productMainPicUrl != null &&
                                                        <Img src={mutualBargainShareRecord.productMainPicUrl}/>
                                                        }
                                                    </div>
                                                    <div className="list_information border_b">
                                                        <h5>{mutualBargainShareRecord.productNm}</h5>
                                                        <h6>价值{mutualBargainShareRecord.productPriceDouble}元</h6>
                                                        <p>{mutualBargainShareRecord.receiveNum}人已{mutualBargainShareRecord.activityPriceDouble}元拿</p>
                                                        <div className="progress_bar">
                                                            <div className="bar_l">
                                                                <div className="bar_l_item"
                                                                     style={{width: mutualBargainShareRecord.bargainAmountPercentage + "%"}}/>
                                                            </div>

                                                            {
                                                                mutualBargainShareRecord.bargainAmountDifferenceDouble > 0 &&
                                                                <div
                                                                    className="bar_r">还剩<span>{mutualBargainShareRecord.bargainAmountDifferenceDouble}元</span>
                                                                </div>
                                                            }
                                                            {
                                                                mutualBargainShareRecord.bargainAmountDifferenceDouble <=  0 &&
                                                                <div
                                                                    className="bar_r"><span>恭喜您砍价成功</span>
                                                                </div>
                                                            }
                                                        </div>
                                                        <a  className="take_free_btn">查看详情</a>
                                                    </div>
                                                </div>
                                            }

                                            {
                                                //已过期
                                                mutualBargainShareRecord.expired &&
                                                <div className="product_list" onClick={()=>{this.props.history.push('/bargain/mutualBargain/'+mutualBargainShareRecord.mutualBargainShareRecordId)}}>
                                                    <div className="list_pic">
                                                        {  mutualBargainShareRecord.productMainPicUrl != null &&
                                                        <Img src={mutualBargainShareRecord.productMainPicUrl}/>
                                                        }
                                                        <div className="list_pic_tips">
                                                            <img src={overdue} alt={"过期"}/>
                                                        </div>
                                                    </div>
                                                    <div className="list_information border_b">
                                                        <h5>{mutualBargainShareRecord.productNm}</h5>
                                                        <h6>价值{mutualBargainShareRecord.productPriceDouble}元</h6>
                                                        <p>{mutualBargainShareRecord.receiveNum}人已{mutualBargainShareRecord.activityPriceDouble}元拿</p>
                                                        <div className="progress_bar">
                                                            <div className="bar_l">
                                                                <div className="bar_l_item"
                                                                     style={{width: mutualBargainShareRecord.bargainAmountPercentage + "%"}}/>
                                                            </div>
                                                            {
                                                                mutualBargainShareRecord.bargainAmountDifferenceDouble > 0 &&
                                                                <div
                                                                    className="bar_r">还剩<span>{mutualBargainShareRecord.bargainAmountDifferenceDouble}元</span>
                                                                </div>
                                                            }
                                                            {
                                                                mutualBargainShareRecord.bargainAmountDifferenceDouble <=  0 &&
                                                                <div
                                                                    className="bar_r"><span>恭喜您砍价成功</span>
                                                                </div>
                                                            }
                                                        </div>
                                                        <a className="take_free_btn">查看详情</a>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    )
                                })
                            }
                            <AutoLoadMore container={'mutualBargainShareRecordList'} isHaveNextPage = {isHaveNextPageTwo} loadMoreFunc={this.loadMoreFuncTwo.bind(this)}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        bargainActivityPageState :store.bargainActivityPageState,
        bargainState: store.bargainState
    }
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            bargainActivityPage,
            mutualBargainShareRecordPage,
            saveMutualBargainShareRecord,
            updateShowTab
        }, dispatch)
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(BargainActivityList);
