/**
 * Created by admin on 2018/3/27.
 * 会员信息详情
 */
import React, {Component} from "react";
import "../style/MemberDetail.css";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {getMemberInfo} from "../actions/memberAction";
import headPortrait from "../../../media/images/default_head.png";

class MemberDetail extends Component {

    componentWillMount(){
        document.title = '会员详情';
        this.props.actions.getMemberInfo();
    }

    render() {
        const {memberInfo} = this.props.memberState;
        return (
            <div className="member-detail">
                <div className="mc">
                    <div className="item show-img">
                        <div className="cell-hd">我的头像</div>
                        <div className="cell-bd">
                            <Link to="##">
                                <div className="pic-box">
                                    <img src={memberInfo.iconFileId || headPortrait} alt=""/>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="item">
                        <div className="cell-hd">手机号码</div>
                        <div className="cell-bd"><Link to="/member/mobile/validate"><span>{memberInfo.mobile}</span></Link></div>
                        <span className="cell-ft"/>
                    </div>
                    <div className="item">
                        <div className="cell-hd">收货地址</div>
                        <div className="cell-bd elli"><Link to='/address/list'>{memberInfo.receiverAddress}</Link></div>
                        <span className="cell-ft"/>
                    </div>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (store, ownProps) => {
    return {
        memberState:store.memberState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({getMemberInfo}, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MemberDetail);
