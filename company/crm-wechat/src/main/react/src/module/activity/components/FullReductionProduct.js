import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import '../style/fullReductionProduct.css';
// 引入自定义方法：分页，倒计时，跳转页面
import {commentList} from '../../activity/actions/FullReductionProductAction';
import {Link} from "react-router-dom";
//引入图片
import Img from "../../common/components/Img";
import CountDown from '../../common/components/CountDown';

class OrderProductComment extends Component {
    //组件作用域内的一个组件状态，react的核心
    state = {
        timer:null
    };

    //构造方法，基本没有使用
    constructor(prosp) {
        super(prosp);

    }

    // 生命状态之一：在组件首次渲染之后调用，这时候DOM节点已经首次加载完成。整个生命周期只会执行一次
    componentWillMount() {
        document.title = '满减活动商品列表';
        this.reloadComment();
    }

    // 加载商品数据
    reloadComment() {
        let fullReductionActivityId = this.props.match.params.fullReductionActivityId;
        this.props.actions.commentList(fullReductionActivityId);
    }

    /**
     * 查看规则
     */
    viewRules(){
        var showDiv = document.getElementsByClassName("showDiv")[0];
        showDiv.style.cssText="display: block";
    }
    noneRules(){
        var showDiv = document.getElementsByClassName("showDiv")[0];
        showDiv.style.cssText="display: none";
    }

    render(){
        // 从仓库得到值 赋值 给当前变量
        let {fullReductionProduct,fullRules} = this.props.fullReductionProductState;
        const rendering = (
            <div><span>@day@</span><i>天</i><span>@hour@</span><em>小时</em><span>@minute@</span><em>分</em><span>@second@</span>秒</div>
        );
        const rendered = (
            <span style={{color: "#fff"}}>已结束</span>
        );
        return(
            /*防止样式污染，加入顶层div*/
            <div className={'full-reduction-product'}>
                <div className="full-goods">
                    <div className="inner">
                        <div className="mt">
                            <div className="tex">限时促销</div>
                                <div className="count-down3">
                                    {fullRules.activityEndTime && <CountDown endDateStr={fullRules.activityEndTime} rendering={rendering} rendered={rendered}/>}
                                </div>
                            <div className="rule">
                                <span>{fullRules.discountContentStr}</span>
                                <a  onClick={()=>this.viewRules()}>活动规则</a>
                            </div>
                        </div>
                        <div className="mc">
                            {
                                fullReductionProduct.map((fullProduct,index) =>{
                                    return(
                                        <div className="item" key={index}>
                                            <div className="m-cell"><Link to={'/product/detail/' + fullProduct.productId +"/"+ fullProduct.platformType}>
                                                <div className="pic"><Img src={fullProduct.picture}/></div>
                                                    {
                                                        fullProduct.isHaveProduct === "Y" && <div className="arrival-time">当天达</div>
                                                    }
                                                    {
                                                        fullProduct.isHaveProduct === "N" && <div className="arrival-time">3-5天达</div>
                                                    }
                                                <div className="title elli">{fullProduct.productNm}</div>
                                                <div className="price elli">￥{fullProduct.priceDouble ? fullProduct.priceDouble.toFixed(1) : fullProduct.marketReferencePriceDouble.toFixed(1) }</div>
                                            </Link></div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>

                <div className="rule-layer showDiv" style={{display: "none"}}>
                    <div className="cont">
                        <h4>活动规则</h4>
                        <h5>规则说明</h5>
                        <p>{fullRules.discountContentStr}</p>
                        <h5>活动时间</h5>
                        <p>
                            <span>{fullRules.activityStartTimeStr}</span>
                            <span>&nbsp;至&nbsp;</span>
                            <span>{fullRules.activityEndTimeStr}</span>
                        </p>
                        <i className="close" onClick={()=>this.noneRules()}></i>
                    </div>
                </div>

            </div>
        );
    }

}

// 将方法交给redux中央仓库管理
const mapStateToProps = (store, ownProps) => {
    return {
        fullReductionProductState:store.fullReductionProductState
    }
};

// 页面提交方法 -> 交给redux
const  mapDispatchToProps = (dispatch,ownProps) => {
    return{
        actions:bindActionCreators({
            commentList},dispatch)
    }
};
/**
 * 把FullReductionProduct 转换为组件转换为容器组件
 * 第一个括号有两个参数：
 *      第一个参数是一个函数，返回一个对象，对象的键是该组件的prop属性，值是该prop的值；
 *      第二个参数也是一个函数，返回一个对象，对象的键同样是prop的属性名，值是一个redux的dispatch，
 *      当这个prop属性被用于触发时，dispatch会改变redux中state的值
 *  第二个括号是要添加prop的react组件
 */
export default connect(mapStateToProps, mapDispatchToProps)(OrderProductComment);