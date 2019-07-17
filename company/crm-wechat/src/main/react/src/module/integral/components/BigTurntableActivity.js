/**
 * @author chencheng
 * @date 2018/3/19
 */
//基本组件
import React, {Component} from "react";
import {Link} from "react-router-dom";
//redux
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
//引入私有样式
import "../style/bigTurntableActivity.css";
//引入本页面需要用到方法
import {
    changeIsShowUserWinningRecordLayer,
    changeSelectPoint,
    changeWinPrize,
    findTurntableInitData,
    prizeDraw
} from "../actions/bigTurntableActivityStateAction";
//引入子组件
import WinPrizeComponent from "./WinPrizeComponent";

import zhuanpanbiaoti from "../../../media/images/zhuanpanbiaoti.png";


class RowItem extends Component{
    render(){
        const {liClassName, prizePicUrl,prizeType,prizeName} = this.props;
        return (
            <li className={liClassName}>
                {prizeType === "PHYSICAL" && <div>{!prizePicUrl?<div className="box coupon-box">{prizeName}</div>:<div className="box pic-box"><img src={prizePicUrl} alt=""/><div className="pic-title"></div></div>}</div>}
                {prizeType === "COUPON"   && <div>{!prizePicUrl?<div className="box coupon-box">{prizeName}</div>:<div className="box pic-box"><img src={prizePicUrl} alt=""/><div className="pic-title"></div></div>}</div>}
                {prizeType === "INTEGRAL"&& <div>{!prizePicUrl?<div className="box integral-box">{prizeName}</div>:<div className="box pic-box"><img src={prizePicUrl} alt=""/><div className="pic-title"></div></div>}</div>}
                {prizeType === "THKS"     && <div>{!prizePicUrl?<div className="box thank"><span>谢谢<br/>惠顾</span></div>:<div className="box pic-box"><img src={prizePicUrl} alt=""/><div className="pic-title"></div></div>}</div>}

            </li>
        );
    }
}

class BigTurntableActivity extends Component {
    constructor() {
        super();
        this.state = {
            // 九宫格内容list
            list: [0, 1, 2, 3, 4, 5, 6, 7],
            // 被选中的格子的ID
            activedId: '',
            // 中奖ID this.props.turntableState.winPrize.bigTurntablePrizeId
            prizeId: null,
            // 获得prizeId之后计算出的动画次数
            times: 0,
            // 当前动画次数
            actTimes: 0,
            // 是否正在抽奖
            isRolling: false
        }
    }
    componentWillMount() {
        document.title = '积分抽奖';
        this.props.actions.findTurntableInitData();
    }
    componentDidMount() {
        const {
            selectPoint,

        } = this.props.turntableState;
        if(!selectPoint){
            return;
        }
        this.timer = setTimeout(
            () => {  this.props.actions.changeSelectPoint(selectPoint>7?1:selectPoint +1); },
            500
        );

    }
    componentDidUpdate (){

    }
    componentWillUnmount(){

    }

    render() {
        const {
            balance,//用户积分
            deductIntegral,// 扣减积分
            winningRecords,//中奖记录
            bigTurntablePrizeProtocols,
        } = this.props.turntableState.initData;
        const {isShowUserWinningRecordLayer,winPrize}= this.props.turntableState;
        const {  activedId } = this.state;
        const getPrizesSuccess = bigTurntablePrizeProtocols && bigTurntablePrizeProtocols.length > 0;
        return (

            <div className="big-turntable-activity">
                {isShowUserWinningRecordLayer && <WinPrizeComponent prizeType={winPrize.prizeType||""} prizeName={winPrize.prizeName||""} closelayer={()=>{this.props.actions.changeIsShowUserWinningRecordLayer()}} />}
                {getPrizesSuccess&& <div className="lottery-main">
                    <div className="mt">
                        <div className="title"><img src={zhuanpanbiaoti} alt=""/></div>
                        <div className="cont">
                            <div className="my-integral">我的积分<span>{balance}</span></div>
                    <ul>
                    <RowItem liClassName={ 0 === activedId?"m1 cur":"m1" } prizeType={bigTurntablePrizeProtocols[0]&&bigTurntablePrizeProtocols[0].prizeType} prizeName={bigTurntablePrizeProtocols[0].prizeName||""} prizePicUrl={(bigTurntablePrizeProtocols[0]&&bigTurntablePrizeProtocols[0].prizePicUrl)||""}/>
                    <RowItem liClassName={ 1 === activedId?"m2 cur":"m2" } prizeType={bigTurntablePrizeProtocols[1]&&bigTurntablePrizeProtocols[1].prizeType} prizeName={bigTurntablePrizeProtocols[1].prizeName||""} prizePicUrl={(bigTurntablePrizeProtocols[1]&&bigTurntablePrizeProtocols[1].prizePicUrl)||""}/>
                    <RowItem liClassName={ 2 === activedId?"m3 cur":"m3" } prizeType={bigTurntablePrizeProtocols[2]&&bigTurntablePrizeProtocols[2].prizeType} prizeName={bigTurntablePrizeProtocols[2].prizeName||""} prizePicUrl={(bigTurntablePrizeProtocols[2]&&bigTurntablePrizeProtocols[2].prizePicUrl)||""}/>
                    <RowItem liClassName={ 3 === activedId?"m5 cur":"m5" } prizeType={bigTurntablePrizeProtocols[3]&&bigTurntablePrizeProtocols[3].prizeType} prizeName={bigTurntablePrizeProtocols[3].prizeName||""} prizePicUrl={(bigTurntablePrizeProtocols[3]&&bigTurntablePrizeProtocols[3].prizePicUrl)||""}/>
                    <RowItem liClassName={ 4 === activedId?"m8 cur":"m8" } prizeType={bigTurntablePrizeProtocols[4]&&bigTurntablePrizeProtocols[4].prizeType} prizeName={bigTurntablePrizeProtocols[4].prizeName||""} prizePicUrl={(bigTurntablePrizeProtocols[4]&&bigTurntablePrizeProtocols[4].prizePicUrl)||""}/>
                    <RowItem liClassName={ 5 === activedId?"m7 cur":"m7" } prizeType={bigTurntablePrizeProtocols[5]&&bigTurntablePrizeProtocols[5].prizeType} prizeName={bigTurntablePrizeProtocols[5].prizeName||""} prizePicUrl={(bigTurntablePrizeProtocols[5]&&bigTurntablePrizeProtocols[5].prizePicUrl)||""}/>
                    <RowItem liClassName={ 6 === activedId?"m6 cur":"m6" } prizeType={bigTurntablePrizeProtocols[6]&&bigTurntablePrizeProtocols[6].prizeType} prizeName={bigTurntablePrizeProtocols[6].prizeName||""} prizePicUrl={(bigTurntablePrizeProtocols[6]&&bigTurntablePrizeProtocols[6].prizePicUrl)||""}/>
                    <RowItem liClassName={ 7 === activedId?"m4 cur":"m4" } prizeType={bigTurntablePrizeProtocols[7]&&bigTurntablePrizeProtocols[7].prizeType} prizeName={bigTurntablePrizeProtocols[7].prizeName||""} prizePicUrl={(bigTurntablePrizeProtocols[7]&&bigTurntablePrizeProtocols[7].prizePicUrl)||""}/>

                    </ul>
                        <a onClick={() => {this.goWin()}} className="go-btn">每次{deductIntegral}积分</a>
                    </div>
                        <Link to="/integral/winningRecord" className="ck-btn">查看我的奖品</Link>
                    </div>
                    <div className="mc">
                        <dl>
                            <dt>获奖用户名单</dt>
                            <dd>
                                {
                                    winningRecords.slice(0, 10).map((winningRecord, index) => {
                                        return (
                                            <div className="item" key={index}>
                                                <span>{winningRecord.memberName.slice(0, 1)}**</span>
                                                <i>抽中了’{winningRecord.prizeName}’</i>
                                            </div>)
                                    })
                                }

                            </dd>
                        </dl>
                    </div>
                </div>}
            </div>
        )
    }

    goWin() {
        const {
            balance,//用户积分
            deductIntegral,// 扣减积分

        } = this.props.turntableState.initData;
        //检测用户积分
       if(Number(balance)<Number(deductIntegral)){
           window.warningTip("积分不足,欢迎签到获取积分");
           return;
       }

        // this.state.isRolling为false的时候才能开始抽，不然会重复抽取，造成无法预知的后果
        if (!this.state.isRolling) {
            this.props.actions.prizeDraw((data)=>{this.handlePlay(data)});
            // 点击抽奖之后，我个人做法是将于九宫格有关的状态都还原默认
            this.setState({
                activedId: '',
                prizeId: null,
                times: 0,
                actTimes: 0,
                isRolling: true
            }, () => {
                // 状态还原之后才能开始真正的抽奖

            })
        }

    }

    handlePlay(bigTurntablePrizeId) {
        const changeIsSho = this.props.actions.changeIsShowUserWinningRecordLayer;
        const findTurntableInitData = this.props.actions.findTurntableInitData;
        const bigTurntablePrizeProtocols = this.props.turntableState.initData.bigTurntablePrizeProtocols||[];

        let prize = "";
        bigTurntablePrizeProtocols.map((pro, index) => {
            if (pro.bigTurntablePrizeId === bigTurntablePrizeId)
                prize = index;
        });

        console.log(prize);
        this.setState({
            prizeId: prize,
            activedId: 0
        });
        // 随机算出一个动画执行的最小次数，这里可以随机变更数值，按自己的需求来
        let times = bigTurntablePrizeProtocols.length * Math.floor(Math.random() * 3 + 4);
        this.setState({
            times: times
        })
        // 抽奖正式开始↓↓
        this.begin = setInterval(() => {
            let num;

            if (this.state.activedId === this.state.prizeId && this.state.actTimes > this.state.times) {
                // 符合上述所有条件时才是中奖的时候，两个ID相同并且动画执行的次数大于(或等于也行)设定的最小次数
                clearInterval(this.begin);
                this.setState({
                    isRolling: false
                })
                changeIsSho();
                findTurntableInitData();
                return
            }

            // 以下是动画执行时对id的判断
            if (this.state.activedId === '') {
                num = 0;
                this.setState({
                    activedId: num
                })
            } else {
                num = this.state.activedId;
                if (num === 7) {
                    num = 0;
                    this.setState({
                        activedId: num
                    })
                } else {
                    num = num + 1;
                    this.setState({
                        activedId: num
                    })
                }
            }

            this.setState({
                actTimes: this.state.actTimes + 1
            })

        }, 100)
    }
}

BigTurntableActivity.propTypes = {
};

BigTurntableActivity.contextTypes = {
};


const mapStateToProps = (store, ownProps) => {
    return {
        turntableState:store.turntableState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            findTurntableInitData,
            changeIsShowUserWinningRecordLayer,
            changeSelectPoint,
            prizeDraw,
            changeWinPrize
        }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(BigTurntableActivity);




