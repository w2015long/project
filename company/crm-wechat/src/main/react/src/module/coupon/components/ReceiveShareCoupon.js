/**
 * 领取分享优惠卷
 */
import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import "../style/receiveShareCoupon.css";
import Img from "../../common/components/Img";
import {Link} from "react-router-dom";
import arrowDown from "../../../media/images/arrow-down.png";
import dengdaiIcon from "../../../media/images/dengdai-icon.png";
import succIcon from "../../../media/images/succ-icon.png";
import errorIcon from "../../../media/images/error-icon.png";
import {receiveCouponFromFriendAction} from "../../coupon/actions/couponDetailActions";


import {queryCouponInfo,receiveCoupons} from "../actions/receiveShareCouponAction";

class ReceiveShareCoupon extends Component {
    //组件作用域内的一个组件状态，react的核心
    state={
        openDetail : false  //打开详情
    };


    //在组件首次渲染之前调用，这时候DOM还没有，而且整个生命周期中只会被执行一次，在这里面setState是无效的
    componentWillMount(){
        document.title = '领取优惠券';
        let couponShareCode = this.props.match.params.couponShareCode;
        this.props.actions.queryCouponInfo(couponShareCode);
    }

    //在组件首次渲染之后调用，这时候DOM节点已经首次加载完成。整个生命周期只会执行一次
    componentDidMount(){

    }

    /*
    * 好友领取优惠卷
    * */
    receiveCoupons(couponShareCode){
        this.props.actions.receiveCoupons(couponShareCode);
    }

    /**
     * 撤销优惠卷
     * */
    revokeCoupon(couponPermissionId){
        var self = this;
        this.props.actions.receiveCouponFromFriendAction(couponPermissionId,function () {
            window.successTip('撤销成功!');
            setTimeout(function () {
                window.location.reload();
            },500);
        })
    }

    render() {
        const {receiveShareCouponInfo,receive_coupons_result,errorInfo} = this.props.receiveShareCouponState;
        var divButtom;
        if(receiveShareCouponInfo.isEffective === 'Y' || receiveShareCouponInfo.isSupportGift === 'N'){
            divButtom =  (<Link to="/coupon/receive/list/ONLINE"><div className="back-coupon">去领券中心</div></Link> )
        }else if((receiveShareCouponInfo.isSelfRegister === 'N' && receiveShareCouponInfo.isSelfReceive === 'N' && receiveShareCouponInfo.couponGiftType === 'WAIT_RECEIVE' && receive_coupons_result ==='wait' && receiveShareCouponInfo.isDisabled === 'N' && receiveShareCouponInfo.isArriveReceiveLimit === 'N') || receive_coupons_result ==='success'){
            divButtom =  (<Link to="/coupon/list"><div className="back-coupon">返回我的优惠券></div></Link> )
        }else {
            divButtom =  (<Link to="/coupon/receive/list/ONLINE"><div className="back-coupon">去领券中心</div></Link> )
        }
        return (
          <div className="receiveShareCouponCss">

              {/************************************************** 会员未登录  开始**********************************************/}
              {receiveShareCouponInfo.isMemberRegister === 'N' &&  <div className="collect-coupon-main">

                  <div>
                      <div className="small-icon">
                          <Img src={receiveShareCouponInfo.iconFileId}/>
                      </div>
                      <div className="tips">{receiveShareCouponInfo.name}</div>
                  </div>
                  <div className="coupon">
                      {/* 满减 */}
                      {receiveShareCouponInfo.couponType === 'FULL_REDUCE' &&
                      <div className="coupon-top">
                          <h5>{receiveShareCouponInfo.couponAmountDouble}<span>元</span></h5>
                          {receiveShareCouponInfo.isLimitedUse === 'Y' ?
                              <p>满{receiveShareCouponInfo.orderFullAmountDouble}元减{receiveShareCouponInfo.couponAmountDouble}元</p> :
                              <p>无限制门槛</p>}
                          <div className="data-time">{receiveShareCouponInfo.effectiveBeginTimeString}至{receiveShareCouponInfo.effectiveEndTimeString}</div>
                      </div>
                      }
                      {/*  打折 */}
                      {receiveShareCouponInfo.couponType === 'DISCOUNT' &&
                      <div className="coupon-top">
                          <h5>{receiveShareCouponInfo.couponDiscount}<span>折</span></h5>
                          {receiveShareCouponInfo.isLimitedUse === 'Y' ?
                              <p>满{receiveShareCouponInfo.orderFullAmountDouble}元打{receiveShareCouponInfo.couponDiscount}折</p> :
                              <p>无限制门槛</p>}
                          <div className="data-time">{receiveShareCouponInfo.effectiveBeginTimeString}至{receiveShareCouponInfo.effectiveEndTimeString}</div>
                      </div>
                      }
                      <div className="coupon-bottom" onClick={() => this.setState({openDetail: !this.state.openDetail})}>
                          <span>优惠券详情</span> <div className={this.state.openDetail ? 'imgVid' : 'imgVid retract'} ><Img src={arrowDown}/></div>
                          {this.state.openDetail &&
                          <div className="activity-rule-content">
                              {receiveShareCouponInfo.ruleExplain ? <pre>{receiveShareCouponInfo.ruleExplain}</pre> : <div>
                                  <p>1.优惠券仅限在有效期内使用，过期则无法使用；</p>
                                  <p>2.少量特殊商品不能使用优惠券；</p>
                                  <p>3.一张订单只能使用一张优惠券，优惠券不可合并；</p>
                                  <p>4.每张优惠券只能使用一次，抵价金额未用完下次也不能继续使用；</p>
                              </div>
                              }
                          </div>}
                      </div>
                  </div>
                  <Link to={"/member/memberLoginIn?redirect=/coupon/receiveShareCoupon/"+ this.props.match.params.couponShareCode}> <div className="right-now-btn" >登录领取</div></Link>
              </div>}
              {/************************************************** 会员未登录  结束**********************************************/}


              {/************************************************** 会员已登录  开始**********************************************/}
              {receiveShareCouponInfo.isMemberRegister === 'Y' &&  <div className="collect-coupon-main">

                  {/*分享人的页面 待领取*/}{/* 本人登录 ，优惠卷状态待领取 , 优惠券没有被停用  ，优惠卷未过期 ， 优惠券支持转赠*/}
                  { receiveShareCouponInfo.isSelfRegister === 'Y' && receiveShareCouponInfo.couponGiftType === 'WAIT_RECEIVE' && receiveShareCouponInfo.isDisabled === 'N' &&  receiveShareCouponInfo.isEffective === 'N' &&  receiveShareCouponInfo.isSupportGift === 'Y' &&
                  <div>
                      <div className="small-icon">
                          <Img src={dengdaiIcon}/>
                      </div>
                      <div className="tips">等待对方领取</div>
                  </div>
                  }
                  {/*分享人的页面 已领取*/} {/* 本人登录 ，优惠卷状态已领取 , 优惠券没有被停用 */}
                  {receiveShareCouponInfo.isSelfRegister === 'Y' && receiveShareCouponInfo.couponGiftType === 'FINISH_RECEIVE' && receiveShareCouponInfo.isDisabled === 'N' &&
                  <div>
                      <div className="small-icon">
                          <Img src={succIcon}/>
                      </div>
                      <div className="tips">好友领取成功</div>
                      <div className="send-you-a-coupon">优惠券已放入好友账户</div>
                  </div>
                  }
                  {/*分享人的页面 已撤回*/}  {/* 本人登录 ，优惠卷状态已撤回 , 优惠券没有被停用 */}
                  {receiveShareCouponInfo.isSelfRegister === 'Y' && receiveShareCouponInfo.couponGiftType === 'WITHDRAW' && receiveShareCouponInfo.isDisabled === 'N' &&
                  <div>
                      <div className="small-icon">
                          <Img src={errorIcon}/>
                      </div>
                      <div className="tips">您的优惠券已撤回</div>
                  </div>
                  }


                  {/*分享人的页面 已过期*/}{/* 本人登录 ，优惠卷状态待领取 , 优惠券没有被停用 ， 优惠卷已过期 */}
                  { receiveShareCouponInfo.isSelfRegister === 'Y' && receiveShareCouponInfo.couponGiftType === 'WAIT_RECEIVE' && receiveShareCouponInfo.isDisabled === 'N' && receiveShareCouponInfo.isEffective === 'Y' &&
                  <div>
                      <div className="small-icon">
                          <Img src={errorIcon}/>
                      </div>
                      <div className="tips">您的优惠券已过期</div>
                  </div>
                  }

                  {/*分享人的页面 分享出去的券被管理员改成了不能转赠*/}{/* 本人登录 ，优惠卷状态待领取 , 优惠券没有被停用  ，优惠卷未过期 ， 优惠券不支持转赠*/}
                  { receiveShareCouponInfo.isSelfRegister === 'Y' && receiveShareCouponInfo.couponGiftType === 'WAIT_RECEIVE' && receiveShareCouponInfo.isDisabled === 'N' &&  receiveShareCouponInfo.isEffective === 'N' &&  receiveShareCouponInfo.isSupportGift === 'N' &&
                  <div>
                      <div className="small-icon">
                          <Img src={errorIcon}/>
                      </div>
                      <div className="tips">优惠券已不能赠送</div>
                      <div className="send-you-a-coupon">请撤销优惠卷</div>
                  </div>
                  }


                  {/***************************************************************************************** 分享人界面显示上面  分割线  领取人界面显示下面 **********************************************************************************************************/}

                  {/*好友领取的页面 待领取*/}  {/* 不是本人登录 ， 领取人为N ，优惠卷状态待领取 ，receive_coupons_result == wait , 优惠券没有被停用 ，领取没有到达上线  ，优惠卷未过期 ， 优惠券支持转赠 */}
                  {receiveShareCouponInfo.isSelfRegister === 'N' && receiveShareCouponInfo.isSelfReceive === 'N' && receiveShareCouponInfo.couponGiftType === 'WAIT_RECEIVE' && receive_coupons_result ==='wait' && receiveShareCouponInfo.isDisabled === 'N' && receiveShareCouponInfo.isArriveReceiveLimit === 'N' &&  receiveShareCouponInfo.isEffective === 'N' && receiveShareCouponInfo.isSupportGift === 'Y' &&
                  <div>
                      <div className="small-icon">
                          <Img src={receiveShareCouponInfo.iconFileId}/>
                      </div>
                      <div className="tips">{receiveShareCouponInfo.name}</div>
                  </div>
                  }
                  {/*好友领取的页面 已被领取*/}  {/* 不是本人登录 ，领取人为N ， 优惠卷状态已领取 ，receive_coupons_result == wait , 优惠券没有被停用 */}
                  {receiveShareCouponInfo.isSelfRegister === 'N' && receiveShareCouponInfo.isSelfReceive === 'N' && receiveShareCouponInfo.couponGiftType === 'FINISH_RECEIVE' && receive_coupons_result ==='wait' && receiveShareCouponInfo.isDisabled === 'N' &&
                  <div>
                      <div className="small-icon">
                          <Img src={errorIcon}/>
                      </div>
                      <div className="tips">你来晚了</div>
                      <div className="send-you-a-coupon">很抱歉券已被抢走了~领券中心看看吧</div>
                  </div>
                  }
                  {/*好友领取的页面 已撤回*/} {/* 不是本人登录 ， 优惠卷状态已撤回 ，receive_coupons_result == wait , 优惠券没有被停用 */}
                  {receiveShareCouponInfo.isSelfRegister === 'N'  && receiveShareCouponInfo.couponGiftType === 'WITHDRAW' && receive_coupons_result ==='wait' && receiveShareCouponInfo.isDisabled === 'N' &&
                  <div>
                      <div className="small-icon">
                          <Img src={errorIcon}/>
                      </div>
                      <div className="tips">你来晚了</div>
                      <div className="send-you-a-coupon">优惠券已撤回</div>
                  </div>
                  }

                  {/*好友领取的页面 领取成功*/} {/* receive_coupons_result == success 好友领取优惠券成功 */}
                  {receive_coupons_result ==='success' &&
                  <div>
                      <div className="small-icon">
                          <Img src={succIcon}/>
                      </div>
                      <div className="tips">领取成功</div>
                      <div className="send-you-a-coupon">优惠券已放入优惠券中心</div>
                  </div>
                  }
                  {/*好友领取的页面 领取异常*/}  {/* receive_coupons_result == exception 好友领取优惠券出现异常 */}
                  {receive_coupons_result ==='exception' &&
                  <div>
                      <div className="small-icon">
                          <Img src={errorIcon}/>
                      </div>
                      <div className="tips">领取失败</div>
                      <div className="send-you-a-coupon">{errorInfo}</div>
                  </div>
                  }

                  {/*好友领取的页面 领取人领取成功再次提示领券成功*/}  {/*   领取人为Y ，优惠卷状态已领取 receive_coupons_result ==='wait' , 优惠券没有被停用 */}
                  {receiveShareCouponInfo.isSelfReceive === 'Y' && receiveShareCouponInfo.couponGiftType === 'FINISH_RECEIVE'&&  receive_coupons_result ==='wait'  && receiveShareCouponInfo.isDisabled === 'N' &&
                  <div>
                      <div className="small-icon">
                          <Img src={succIcon}/>
                      </div>
                      <div className="tips">您已领取成功</div>
                      <div className="send-you-a-coupon">优惠券已放入优惠券中心</div>
                  </div>
                  }

                  {/*优惠券被停用 显示*/}
                  { receiveShareCouponInfo.isDisabled === 'Y' &&
                  <div>
                      <div className="small-icon">
                          <Img src={errorIcon}/>
                      </div>
                      <div className="tips">优惠券已停用</div>
                  </div>
                  }

                  {/*好友领取时发现 领取到达上线*/} {/* 不是本人登录 ， 优惠券待领取  ， 好友领取到达上线 */}
                  {receiveShareCouponInfo.isSelfRegister === 'N' && receiveShareCouponInfo.couponGiftType === 'WAIT_RECEIVE' && receiveShareCouponInfo.isArriveReceiveLimit === 'Y' &&
                  <div>
                      <div className="small-icon">
                          <Img src={errorIcon}/>
                      </div>
                      <div className="tips">优惠券领取达到上线</div>
                  </div>
                  }


                  {/*好友领取的页面 已过期*/}  {/* 不是本人登录 ， 领取人为N ，优惠卷状态待领取 ，receive_coupons_result == wait , 优惠券没有被停用 ，领取没有到达上线 ，优惠卷已过期 */}
                  {receiveShareCouponInfo.isSelfRegister === 'N' && receiveShareCouponInfo.isSelfReceive === 'N' && receiveShareCouponInfo.couponGiftType === 'WAIT_RECEIVE' && receive_coupons_result ==='wait' && receiveShareCouponInfo.isDisabled === 'N' && receiveShareCouponInfo.isArriveReceiveLimit === 'N' && receiveShareCouponInfo.isEffective === 'Y' &&
                  <div>
                      <div className="small-icon">
                          <Img src={errorIcon}/>
                      </div>
                      <div className="tips">优惠券已过期</div>
                  </div>
                  }

                  {/*好友领取的页面 分享出去的券被管理员改成了不能转赠*/}  {/* 不是本人登录 ， 领取人为N ，优惠卷状态待领取 ，receive_coupons_result == wait , 优惠券没有被停用 ，领取没有到达上线  ，优惠卷未过期 ， 优惠券不支持转赠 */}
                  {receiveShareCouponInfo.isSelfRegister === 'N' && receiveShareCouponInfo.isSelfReceive === 'N' && receiveShareCouponInfo.couponGiftType === 'WAIT_RECEIVE' && receive_coupons_result ==='wait' && receiveShareCouponInfo.isDisabled === 'N' && receiveShareCouponInfo.isArriveReceiveLimit === 'N' &&  receiveShareCouponInfo.isEffective === 'N' && receiveShareCouponInfo.isSupportGift === 'N' &&
                  <div>
                      <div className="small-icon">
                          <Img src={errorIcon}/>
                      </div>
                      <div className="tips">你来晚了</div>
                      <div className="send-you-a-coupon">好友的优惠券已不能转赠</div>
                  </div>
                  }


                  <div className="coupon">
                      {/* 满减 */}
                      {receiveShareCouponInfo.couponType === 'FULL_REDUCE' &&
                      <div className="coupon-top">
                          <h5>{receiveShareCouponInfo.couponAmountDouble}<span>元</span></h5>
                          {receiveShareCouponInfo.isLimitedUse === 'Y' ?
                              <p>满{receiveShareCouponInfo.orderFullAmountDouble}元减{receiveShareCouponInfo.couponAmountDouble}元</p> :
                              <p>无限制门槛</p>}
                          <div className="data-time">{receiveShareCouponInfo.effectiveBeginTimeString}至{receiveShareCouponInfo.effectiveEndTimeString}</div>
                      </div>
                      }

                      {/*  打折 */}
                      {receiveShareCouponInfo.couponType === 'DISCOUNT' &&
                      <div className="coupon-top">
                          <h5>{receiveShareCouponInfo.couponDiscount}<span>折</span></h5>
                          {receiveShareCouponInfo.isLimitedUse === 'Y' ?
                              <p>满{receiveShareCouponInfo.orderFullAmountDouble}元打{receiveShareCouponInfo.couponDiscount}折</p> :
                              <p>无限制门槛</p>}
                          <div className="data-time">{receiveShareCouponInfo.effectiveBeginTimeString}至{receiveShareCouponInfo.effectiveEndTimeString}</div>
                      </div>
                      }



                      <div className="coupon-bottom" onClick={() => this.setState({openDetail: !this.state.openDetail})}>
                          <span>优惠券详情</span> <div className={this.state.openDetail ? 'imgVid' : 'imgVid retract'} ><Img src={arrowDown}/></div>
                          {this.state.openDetail &&
                          <div className="activity-rule-content">
                              {receiveShareCouponInfo.ruleExplain ? <pre>{receiveShareCouponInfo.ruleExplain}</pre> : <div>
                                  <p>1.优惠券仅限在有效期内使用，过期则无法使用；</p>
                                  <p>2.少量特殊商品不能使用优惠券；</p>
                                  <p>3.一张订单只能使用一张优惠券，优惠券不可合并；</p>
                                  <p>4.每张优惠券只能使用一次，抵价金额未用完下次也不能继续使用；</p>
                              </div>
                              }

                          </div>}
                      </div>
                  </div>

                  {divButtom}


                  {/* 好友领取页面的按钮 立即领取 */}{/* 不是本人登录 ，领取人为N ， 优惠卷状态待领取 ，receive_coupons_result ==='wait' , 优惠券没有被停用 ，领取没有到达上线 ，优惠券未过期 ， 优惠券支持转赠*/}
                  {receiveShareCouponInfo.isSelfRegister === 'N' && receiveShareCouponInfo.isSelfReceive === 'N' && receiveShareCouponInfo.couponGiftType === 'WAIT_RECEIVE' && receive_coupons_result ==='wait' && receiveShareCouponInfo.isDisabled === 'N' &&  receiveShareCouponInfo.isArriveReceiveLimit === 'N' &&  receiveShareCouponInfo.isEffective === 'N' && receiveShareCouponInfo.isSupportGift === 'Y' &&  <div className="right-now-btn" onClick={ () =>{this.receiveCoupons(this.props.match.params.couponShareCode)}}>立即领取</div>}

                  {/*线上券*/} {/*  优惠卷状态待领取 ，receive_coupons_result ==='success' 或者 领取人为Y ，优惠卷状态已领取 , 优惠券没有被停用 是线上券 */}
                  { (receive_coupons_result ==='success' || (receiveShareCouponInfo.isSelfReceive === 'Y' && receiveShareCouponInfo.couponGiftType === 'FINISH_RECEIVE'  &&  receiveShareCouponInfo.isDisabled === 'N' )) && receiveShareCouponInfo.isOnline === 'Y' && <Link to={"/product/new/search/shop/"+receiveShareCouponInfo.couponId}> <div className="right-now-btn" >去使用</div></Link>}

                  {/*线下券*/} {/*  优惠卷状态待领取 ，receive_coupons_result ==='success' 或者 领取人为Y ，优惠卷状态已领取 , 优惠券没有被停用 ，是线下券 */}
                  { (receive_coupons_result ==='success' || (receiveShareCouponInfo.isSelfReceive === 'Y' && receiveShareCouponInfo.couponGiftType === 'FINISH_RECEIVE'  &&  receiveShareCouponInfo.isDisabled === 'N')) && receiveShareCouponInfo.isOffline === 'Y' && <Link to={"/myCoupon/detail/"+receiveShareCouponInfo.couponPermissionId}> <div className="right-now-btn" >去使用</div></Link>}

                  {/* 分享人的撤销按钮 */} {/* 本人登录 ，优惠卷状态待领取 , 优惠券没有被停用  ，优惠卷未过期 ， 优惠券不支持转赠*/}
                  { receiveShareCouponInfo.isSelfRegister === 'Y' && receiveShareCouponInfo.couponGiftType === 'WAIT_RECEIVE' && receiveShareCouponInfo.isDisabled === 'N' &&  receiveShareCouponInfo.isEffective === 'N' &&  receiveShareCouponInfo.isSupportGift === 'N' &&  <div className="right-now-btn" onClick={ () =>{this.revokeCoupon(receiveShareCouponInfo.couponPermissionId)}}>撤销优惠券</div>}
              </div>}
              {/************************************************** 会员已登录  结束**********************************************/}

          </div>
        )

    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        receiveShareCouponState: store.receiveShareCouponState
    }
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
                queryCouponInfo,
                receiveCoupons,
                receiveCouponFromFriendAction
            }
            , dispatch)
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(ReceiveShareCoupon);