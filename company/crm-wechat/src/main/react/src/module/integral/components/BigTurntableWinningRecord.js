/**
 * @author olx
 * @date 2018/4/2
 */

import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import EmptyPage from "../../common/components/EmptyPage";
//引入私有样式
import "../style/bigTurntableActivity.css";
class BigTurntableWinningRecord extends Component{
    componentWillMount() {
        document.title = '我的奖品';
    }
    render(){
        const {
            userWinningRecord,//用户奖品
        } = this.props.turntableState.initData;
        return(
       <div  className="big-turntable-activity">
           {
               userWinningRecord.length === 0 ? <EmptyPage/> :
               <div className="my-gift">
                   {userWinningRecord.map((winningRecord, index) => {
                       return (
                           <div className="item" key={index}>
                               <div className="pic"><a ><img src={winningRecord.prizePic} alt=""/></a></div>
                               <span
                                   className={winningRecord.winningStatus !== "HAD_COMPLETE" ? "yello-color" : ""}>{winningRecord.winningStatuName}</span>
                               <a className="title">{winningRecord.prizeName} </a>
                           </div>
                       )

                   })}

               </div>
           }
       </div>
        );
    }



};


const mapStateToProps = (store, ownProps) => {
    return {
        turntableState:store.turntableState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({

        }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(BigTurntableWinningRecord);



