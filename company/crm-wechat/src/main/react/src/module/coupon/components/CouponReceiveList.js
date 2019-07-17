/**
 * 优惠券中心
 * @author  lcl
 * @date 2019/6/4
 *
 */
import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import "../style/coupon-receive-list.css";
import tacitlyCouponPic from "../../../media/images/wsptp.png";
import couponReceivePic from "../../../media/images/ylq.png";
import couponCouponGonePic from "../../../media/images/yqg.png"
import {changeCouponType, couponCategoryList, pageReceiveCoupons,updateReceiveCoupons} from "../../coupon/actions/couponReceiveAction";
import AutoLoadMore from "../../../module/common/components/AutoLoadMore";
import EmptyPage from "../../common/components/EmptyPage";
// import CountDown from "../../common/components/CountDown";
import {NEW_COUPON_LIST_GET_PAGE} from "../constants/ActionTypes";
class CouponReceiveList extends Component {

    state = {
        selectCouponCategory: null,
    };

    componentWillMount() {
        document.title = '优惠券中心';
        let acquireEntrance = this.props.match.params.acquireEntrance;
        this.props.actions.couponCategoryList();

        const {couponSearch} = this.props.newCouponState;
        couponSearch.acquireEntrance = acquireEntrance;
        this.reloadCouponList(couponSearch);

    }

    componentDidMount() {

    }

    componentWillUnmount() {
        this.changeCouponTab(null);
    }

    // 刷新优惠券列表
    reloadCouponList(params) {
        let {couponPage} = this.props.newCouponState;
        this.props.actions.pageReceiveCoupons(params, 0, couponPage.size, []);
    }

    // 切换顶部优惠券分类
    changeCouponTab(category) {

        let {couponSearch} = this.props.newCouponState;
        let couponCategoryId = null;
        if (null !== category) {
            couponCategoryId = category.couponCategoryId;
        }
        couponSearch.couponCategoryId = couponCategoryId;
        this.setState({
            selectCouponCategory :couponCategoryId
        });
        this.props.actions.changeCouponType(couponCategoryId);

        this.reloadCouponList(couponSearch);
    }

    // 领取优惠券
    receiveCoupon(coupon,index,callBack) {
        this.props.actions.updateReceiveCoupons(coupon,index,callBack);

    }

    // 查看优惠券详情
    findCouponDetails(couponPermissionId) {
        this.props.history.push('/myCoupon/detail/'+couponPermissionId)
    };

    // 加载更多优惠券
    loadMoreCoupon = () => {
        let {couponSearch, couponPage} = this.props.newCouponState;
        this.props.actions.pageReceiveCoupons(couponSearch, couponPage.page + 1, couponPage.size, couponPage.coupons);
    };

    callBackCouponList(){
        let {couponSearch} = this.props.newCouponState;
        let selectCouponCategory = this.state.selectCouponCategory;
        couponSearch.couponCategoryId = selectCouponCategory;
        this.reloadCouponList(couponSearch);
    }

    couponFunc(data,index,dispatch) {
        let {couponPage} = this.props.newCouponState;
        let coupons = couponPage.coupons || [];
        if("ALREADY_RECEIVE" ===data.CODE){
            coupons[index].receiveCouponStatus = "ALREADY_RECEIVE";
            coupons[index].couponPermissionId = data.COUPON_PERMISSION_ID;
        }
        if("AGAIN_RECEIVE" ===data.CODE){
            coupons[index].receiveCouponStatus = "AGAIN_RECEIVE";
        }
        const action = {
            type: NEW_COUPON_LIST_GET_PAGE,
            data: couponPage,
        };
        dispatch(action);
    }

    render() {
        const {couponPage, couponCateGoryList, couponCategoryId} = this.props.newCouponState;
        const coupons = couponPage.coupons || [];
        const isHaveNextPage = couponPage.size * (couponPage.page + 1) < couponPage.recordsFiltered;
        let selectCouponCategory = this.state.selectCouponCategory;

        // 倒计时
        // const rendering = ( <div className="open-time-box"><span>@hour1@@hour2@</span><i>:</i><span>@minute1@@minute2@</span><i>:</i><span>@second1@@second2@</span></div> );
        // const rendered = (<i> </i>);
        //
        // let date = new Date();

        return (

            <div className="coupon_receive_list">
                <div className="coupon-main">
                    <div className="wx-mask" style={{display: 'none'}}/>

                    <div className="filter-wrap">
                        { couponCateGoryList.length === 0 ? <div className="filter-items">
                                <a className={selectCouponCategory === null ? 'item cur' : 'item'}
                                   onClick={() => this.changeCouponTab(null)}>全部</a>
                                </div>
                        :
                            <div className="filter-items">
                                <a className={selectCouponCategory === null ? 'item cur' : 'item'}
                                   onClick={() => this.changeCouponTab(null)}>全部</a>
                                {
                                    couponCateGoryList.map(couponCateGory => {
                                        return (
                                            <a className={couponCategoryId === couponCateGory.couponCategoryId ? 'item cur' : 'item'}
                                               key={couponCateGory.couponCategoryId}
                                               onClick={() => this.changeCouponTab(couponCateGory)}>{couponCateGory.title}</a>
                                        )
                                    })
                                }
                            </div>
                        }
                    </div>

                    <div className="coupon-box">
                        <div className="inner">

                            { coupons.length === 0 && <EmptyPage/>}
                            { coupons.length !== 0 &&
                            <ul className="cp-ul cur" id="couponList">
                                {coupons.map((coupon,index) => {

                                    const couponImg = coupon.advertisementImg || tacitlyCouponPic;
                                    let couponGitImg = "";
                                    let couponClass = "";
                                    if(coupon.receiveCouponStatus === 'NOT_RECEIVE' ){
                                        couponClass = "list-item";
                                    }
                                    if(coupon.receiveCouponStatus === 'ALREADY_RECEIVE'){
                                        couponClass = "list-item list-item-ylq"
                                        couponGitImg = couponReceivePic;
                                    }

                                    if(coupon.receiveCouponStatus === 'AGAIN_RECEIVE'){
                                        couponClass = "list-item "
                                        couponGitImg = couponReceivePic;
                                    }
                                    if(coupon.receiveCouponStatus === 'FINISH_RECEIVE'){
                                        couponClass = " list-item list-item-yqg";
                                        couponGitImg = couponCouponGonePic;
                                    }

                                    return (
                                        <li className={couponClass} key={coupon.couponId}>
                                            <div className="cell-hd">
                                                <div className="cont">
                                                    <img src={couponImg} alt=""/>
                                                </div>
                                            </div>
                                            <div className="cell-bd">
                                                <div className="bd-top">
                                                    <div className="title">
                                                        {coupon.applyProductType === 'ALL_PRODUCTS' &&
                                                        <span className="tag"> 全品类</span>}
                                                        {coupon.couponName}
                                                    </div>
                                                    <div className="validity">
                                                        {coupon.couponType === 'FULL_REDUCE' && <i>￥</i>}
                                                        {coupon.couponType === 'FULL_REDUCE' ? coupon.couponAmountDouble : coupon.couponDiscount}
                                                        {coupon.couponType === 'DISCOUNT' && <i>折</i>}

                                                        {coupon.isLimitedUse === 'Y' ?
                                                            <span>满{coupon.orderFullAmountDouble}可用</span> :
                                                            <span>无限制</span>}
                                                    </div>

                                                </div>

                                                    {/*{coupon.receiveCouponStatus === 'NOT_RECEIVE' && coupon.effectiveBeginTime > date &&*/}
                                                    {/*<div className="bd-left">*/}
                                                        {/*<div className="open-time">*/}
                                                            {/*<h5>即将开抢</h5>*/}
                                                            {/*<CountDown callBackFunc={()=>this.callBackCouponList()} endDateStr={coupon.effectiveBeginTime} rendering={rendering} rendered={rendered} />*/}
                                                        {/*</div>*/}
                                                    {/*</div>*/}
                                                    {/*}*/}
                                                    {coupon.receiveCouponStatus === 'NOT_RECEIVE' &&
                                                        <div className="bd-left">
                                                            <div className="state-box">
                                                                <img src={couponGitImg} alt=""/></div>
                                                            <div className="bd-left-text"
                                                                 onClick={() => this.receiveCoupon(coupon, index,(data,index,dispatch)=>this.couponFunc(data,index,dispatch))}>
                                                                <p>点击</p><p>领取</p>
                                                            </div>
                                                        </div>
                                                    }

                                                {
                                                    coupon.receiveCouponStatus === "ALREADY_RECEIVE" &&
                                                    <div className="bd-left">
                                                        <div className="state-box"><img src={couponGitImg} alt=""/></div>
                                                        <div className="bd-left-text"
                                                             onClick={() => this.findCouponDetails(coupon.couponPermissionId)}>
                                                            <p>查看</p><p>详情</p>
                                                        </div>
                                                    </div>
                                                }

                                                {
                                                    coupon.receiveCouponStatus === "AGAIN_RECEIVE" &&
                                                    <div className="bd-left">
                                                        <div className="state-box"><img src={couponGitImg} alt=""/></div>
                                                        <div className="bd-left-text"
                                                             onClick={() => this.receiveCoupon(coupon,index,(data,index,dispatch)=>this.couponFunc(data,index,dispatch))}>
                                                            <p>再次</p><p>领取</p>
                                                        </div>
                                                    </div>
                                                }
                                                {
                                                    coupon.receiveCouponStatus === "FINISH_RECEIVE" &&
                                                    <div className="bd-left">
                                                        <div className="state-box"><img src={couponGitImg} alt=""/></div>
                                                        <div className="bd-left-text">
                                                            <p>已抢光</p>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                            }
                            {coupons&&coupons.length>0&&<AutoLoadMore container={'couponList'} isHaveNextPage={isHaveNextPage}
                                                                      loadMoreFunc={this.loadMoreCoupon}/>}
                        </div>
                    </div>

                </div>

            </div>
        )
    }
}


CouponReceiveList.propTypes = {};

CouponReceiveList.contextTypes = {};

const mapStateToProps = (store, ownProps) => {
    return {
        newCouponState: store.couponReceiveListState,
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({pageReceiveCoupons, couponCategoryList, changeCouponType,updateReceiveCoupons}, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CouponReceiveList);