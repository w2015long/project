/**
 * @author chencheng
 * @date 2018/5/8
 * 物流信息
 */
import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import "../style/LogisticsInfo.css";
import {findLogistics} from "../actions/commonAction";
import EmptyPage from "../../common/components/EmptyPage";

class LogisticsInfo extends Component {
    componentWillMount() {
        document.title = '物流信息';
        let {logisticsCompanyCode, logisticsOrderNum} = this.props.match.params;
        this.props.actions.findLogistics(logisticsCompanyCode, logisticsOrderNum);
    }

    componentDidMount() {

    }

    componentDidUpdate (){

    }

    componentWillUnmount(){

    }

    render(){
        let traces = this.props.commonState.logisticsInfo.Traces;
        traces = traces.reverse();
        return(
            <div className="logistics-info">
                {
                    traces.length === 0 ? <EmptyPage/> :
                    <ul>
                        {
                            traces.map((trace, index) => {
                                return (
                                    <li className={index === 0 ? "first" : ""} key={index}>
                                        <em>{trace.AcceptTime}</em>
                                        <i/>
                                        <p>{trace.AcceptStation}</p>
                                    </li>
                                )
                            })
                        }
                    </ul>
                }
            </div>
        );
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        commonState:store.commonState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            findLogistics
        }, dispatch)
    }
};

LogisticsInfo.propTypes = {
};

export default connect(mapStateToProps, mapDispatchToProps)(LogisticsInfo);
