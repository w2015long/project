/**
 * 个人中心-我的积分
 * Created by caixuan on 2018/3/28.
 */
import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import "../style/my-scores.css";
import AutoLoadMore from "../../common/components/AutoLoadMore";
import {getMemberIntegral, pageIntegralProduct} from "../actions/memberCenterIntegralActions";
import zhuanpan from "../../../media/images/zhuanpan.png";
import lihe from "../../../media/images/lihe.png";
import jifen3 from "../../../media/images/jifen3.png";
import {Link} from "react-router-dom";
class MyIntegral extends Component {

    componentWillMount() {
        document.title = '我的积分';
        this.props.actions.pageIntegralProduct({page:0,size:10,content:[],recordsFiltered:0});
        this.props.actions.getMemberIntegral();
    }

    loadMore(){
        const {pageIntegralProduct, transType} = this.props.memberCenterIntegralState;
        pageIntegralProduct.page += 1;
        this.props.actions.pageIntegralProduct(pageIntegralProduct, transType);
    }


    render() {
        const {pageIntegralProduct,myIntegral} = this.props.memberCenterIntegralState;
        const content = pageIntegralProduct.content;
        const isHaveNextPage = pageIntegralProduct.size * (pageIntegralProduct.page + 1) < pageIntegralProduct.recordsFiltered;

        return (
            <div>
                <div className="member-center-integral">
                    <div className="mt">
                        <p>{myIntegral}</p>
                        <span>积分</span>
                        <Link to="/member/integral/record">积分记录</Link>
                    </div>
                    <div className="mp">
                        <div className="item"><Link to={'/integral/turntable'}>
                            <img src={zhuanpan} alt=""/>
                                <span>抽奖</span>
                        </Link></div>
                        <div className="item"><Link to={'/integral/product/list'}>
                            <img src={lihe} alt=""/>
                                <span>兑换礼品</span>
                        </Link></div>
                        <div className="item"><Link to={'/integral/exchange'}>
                            <img src={jifen3} alt=""/>
                                <span>积分换券</span>
                        </Link></div>
                    </div>
                    <div className="mc" id="recommendIntegralProduct">
                        <h5>推·荐·礼·品</h5>
                        <ul className="mc-cont">
                            {
                                content.map((integralProduct,index)=>{
                                    return (
                                        <li key={index}>
                                            <Link to={'/integral/product/detail/'+integralProduct.integralProductId}>
                                                <div className="pic"><img src={integralProduct.picUrl} alt=""/></div>
                                                <div className="title">{integralProduct.integralProductNm}</div>
                                                <span>{integralProduct.integralPrice}积分</span>
                                            </Link>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        {content.length > 0 && <AutoLoadMore isHaveNextPage={isHaveNextPage} loadMoreFunc={()=>this.loadMore()} container="recommendIntegralProduct"/> }
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        memberCenterIntegralState:store.memberCenterIntegralState
    }
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({getMemberIntegral,pageIntegralProduct}, dispatch)
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(MyIntegral);
