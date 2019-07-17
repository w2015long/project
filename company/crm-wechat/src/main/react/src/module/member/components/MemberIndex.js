/**
 * Created by admin on 2018/3/27.
 * 会员中心首页
 */
import React, {Component} from "react";
import "../style/MemberIndex.css";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
//引入本页面需要用到方法
import {getMemberInfo} from "../actions/memberAction";
import jinpai from "../../../media/images/jinpai.png";
import headPortrait from "../../../media/images/default_head.png";
import Footer from "../../././common/components/Footer";
class MemberIndex extends Component {

    componentWillMount() {
        document.title = '会员中心';
        this.props.actions.getMemberInfo();
    }

    getCartTotalProductQuantity(){
        let quantity = 0;
        let items = this.props.normalCartState.normalCart.cartItemList || [];
        for(let item of items){
            quantity += item.quantity;
        }
        return quantity;
    }

    render() {
        const {memberInfo} = this.props.memberState;
        return (
            <div className="member-index">
                <div className="div-top"/>
                <div className="user-info">
                    <div className="u-name">{memberInfo.name}</div>
                    <p>手机号：{memberInfo.mobile}</p>
                    <div className="rank"><Link to="/member/interest"><img src={jinpai} alt={''}/><span>{memberInfo.levelName}</span></Link></div>
                    <div className="u-pic">
                        <Link to='/member/detail'>
                            <div className="pic-box">
                                <img src={memberInfo.iconFileId || headPortrait} alt=""/>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="acco-info">
                    <div className="mt"><span>我的资产</span></div>
                    <div className="mc">
                        <div className="item coupon"><Link to="/coupon/list">优惠券<span>{memberInfo.couponNum}</span></Link></div>
                        <i style={{"float":"left"}}>|</i>
                        <div className="item integral"><Link to="/member/integral/index">积分<span>{memberInfo.integral}</span></Link></div>
                        <i style={{"float":"left"}}>|</i>
                        <div className="item integral"><Link to="/member/myStoredValueBalance">储值<span>{memberInfo.balance}</span></Link></div>
                    </div>
                </div>
                <div className="my-orders">
                    <div className="mt">
                        <span>我的订单</span>
                        <Link to="/order/list/all">全部订单</Link>

                    </div>
                    <div className="mc">
                        <div className="item m1">
                            <Link to="/order/list/UNPAID">
                                <span>待付款</span>
                                {memberInfo.unpaidNum > 0 && <i>{memberInfo.unpaidNum}</i>}
                            </Link>
                        </div>
                        <div className="item m2">
                            <Link to="/order/list/WAIT_SEND">
                                <span>待发货</span>
                                {memberInfo.waitSendNum > 0 && <i>{memberInfo.waitSendNum}</i>}
                            </Link>
                        </div>
                        <div className="item m3">
                            <Link to="/order/list/SEND">
                                <span>待收货</span>
                                {memberInfo.sendNum > 0 && <i>{memberInfo.sendNum}</i>}
                            </Link>
                        </div>
                        <div className="item m4">
                            <Link to="/order/list/WAIT_COMMENT">
                                <span>待评价</span>
                                {memberInfo.waitCommentNum > 0 && <i>{memberInfo.waitCommentNum}</i>}
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="my-evaluation">
                    <span>我的评价</span>
                    <Link to={'/order/comment'}></Link>
                </div>
                <Footer state={"me"} history={this.props.history}/>
            </div>
        )
    }
}

MemberIndex.propTypes = {};

MemberIndex.contextTypes = {};

/**
 * 这个方法决定了当前组件能够从 store 中读取什么内容，以及组件何时会更新
 * 比如现在这里只读取了 store 中的 exampleState，所以当 exampleState 变化时当前组件会刷新，其他 state 更新时当前组件不刷新
 * @param store 整个store仓库
 * @param ownProps 当前组件的props属性
 */
const mapStateToProps = (store, ownProps) => {
    return {
        memberState: store.memberState,
        normalCartState:store.normalCartState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({getMemberInfo}, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MemberIndex);
