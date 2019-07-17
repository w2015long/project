/**
 * 个人中心-积分兑换记录
 * Created by caixuan on 2018/3/28.
 */
import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import "../style/points-record.css";
import AutoLoadMore from "../../common/components/AutoLoadMore";
import EmptyPage from "../../common/components/EmptyPage";
import AffixForList from "../../common/components/AffixForList";
import {changeRecordTypeIsShow, changeTransType, pageIntegralRecord} from "../actions/memberCenterIntegralActions";

class MemberCenterIntegralRecord extends Component {

    componentWillMount() {
        document.title = '积分记录';
        this.props.actions.pageIntegralRecord({page:0,size:10,content:[],recordsFiltered:0},"");
    }

    changeTransType(transType){
        this.props.actions.pageIntegralRecord({page:0,size:10,content:[],recordsFiltered:0},transType);
        this.props.actions.changeTransType(transType);
    }

    loadMore(){
        const {pageIntegralRecord, transType} = this.props.memberCenterIntegralState;
        pageIntegralRecord.page += 1;
        this.props.actions.pageIntegralRecord(pageIntegralRecord, transType);
    }

    static buildTransType(transType){
        switch (transType){
            case "RECHARGE":
                return "获取";
            case "DEDUCT_MONEY":
                return "使用";
            default:
                return "全部";
        }
    }

    render() {
        const {pageIntegralRecord,showTransType,transType} = this.props.memberCenterIntegralState;
        const content = pageIntegralRecord.content;
        const isHaveNextPage = pageIntegralRecord.size * (pageIntegralRecord.page + 1) < pageIntegralRecord.recordsFiltered;
        return (
            <div>
                <div className="points-main">
                    <div className="div-top"/>
                    <div className="mt">
                        <span className="mt-lt">积分记录</span>
                        <dl className={showTransType?"mt-rt active":"mt-rt"} onClick={()=>this.props.actions.changeRecordTypeIsShow()}>
                            <dt><span>{MemberCenterIntegralRecord.buildTransType(transType)}</span></dt>
                            <dd>
                                <div className="item" onClick={()=>this.changeTransType("")}><span>全部</span></div>
                                <div className="item" onClick={()=>this.changeTransType("RECHARGE")}><span>获取</span></div>
                                <div className="item" onClick={()=>this.changeTransType("DEDUCT_MONEY")}><span>使用</span></div>
                            </dd>
                        </dl>
                    </div>
                    {
                        content.length === 0 ? <EmptyPage/> :
                        <div className="mc" id="integralRecord">
                            {
                                content.map((integralRecord, index) => {
                                    return (
                                        <div key={index}>
                                            {index === 0 &&
                                            <AffixForList offsetTop={60} index={index}><h5>本月</h5></AffixForList>}
                                            {index > 0 && integralRecord.titleTime !== content[index - 1].titleTime &&
                                            <AffixForList offsetTop={60} index={index}>
                                                <h5>{integralRecord.titleTime}</h5></AffixForList>}
                                            <div className="item">
                                                <div className="cell-hd">
                                                    <p>{integralRecord.description}</p>
                                                    <span>{integralRecord.transTimeString}</span>
                                                </div>
                                                <div className="cell-bd">
                                                    <span>{integralRecord.transType === "RECHARGE" ? "+" : ""}{integralRecord.amount}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            {content.length > 0 &&
                            <AutoLoadMore isHaveNextPage={isHaveNextPage} loadMoreFunc={() => this.loadMore()}
                                          container="integralRecord"/> }
                        </div>
                    }
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
        actions: bindActionCreators({pageIntegralRecord,changeRecordTypeIsShow,changeTransType}, dispatch)
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(MemberCenterIntegralRecord);
