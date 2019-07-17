/**
 * @author kwy
 * @date 2019/5/17
 * 友德医问诊患者信息列表
 */

import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import "../style/YdyPatientList.css";
import {findByYdyPatientList} from "../actions/ydyPatientAction";
import {getYdyDoctorPageUrl} from "../actions/ydyInquiryAction";
import edit from "../../../media/images/icon_iedt.png"
// 第二种，基本写法-带状态组件
class YdyPatientList extends Component {

    state={
        selectIndex : 0,
        patientId:null,
    };

    componentWillMount() {
        document.title = '就诊人信息';
        this.props.actions.findByYdyPatientList();
    }

    toDoctorPage(){
        let patient = this.props.ydyPatientState.ydyPatientList[this.state.selectIndex];
        if(patient && patient.patientId){
            this.props.actions.getYdyDoctorPageUrl(patient.patientId,(url)=>{
                window.location.href=url;
            })
        }
    }

    // 选中患者信息
    selectItem(index){
        let patient = this.props.ydyPatientState.ydyPatientList[index];
        this.setState({
            selectIndex : index,
            patientId:patient.patientId,
        });
    }

    render() {
        const ydyPatientList = this.props.ydyPatientState.ydyPatientList || [];
        let self = this;
        return (
            <div className={'ydy-patient-list'}>
                <div className="visiting-main">
                    <div className="fm-module01">

                        <div className="fm-title">就诊人信息<Link to={"/ydy/patient/detail"}>添加</Link></div>

                        {
                            ydyPatientList.map(function (patient,index) {
                                return(
                                    <div  className={self.state.selectIndex === index? "cell_access cell_select" :"cell_access" } onClick={()=>{self.selectItem(index)}} key={index}>
                                        <div className="cell_hd">
                                            <span className="icon"/>
                                        </div>
                                        <div className="cell_bd">
                                            <span className="label_tex">{patient.name}<i>({patient.sex==='MALE'?'男':'女'}丶{patient.age}岁)</i></span>
                                        </div>
                                        <Link className="cell_ft" to={"/ydy/patient/detail/"+index}>
                                            <img src={edit} alt=""/>
                                        </Link>
                                    </div>
                                );
                            })
                        }


                    </div>

                    <div className="visiting-btn clearfix">
                        <Link className="delete-btn" to={"/ydy/interrogationRecord/list"}>问诊记录</Link>
                        <div className="save-btn" onClick={()=>{self.toDoctorPage()}}> 下一步</div>
                    </div>

                </div>
            </div>
        )
    }
}


const mapStateToProps = (store, ownProps) => {
    return {
        ydyPatientState:store.ydyPatientState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({findByYdyPatientList,getYdyDoctorPageUrl}, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(YdyPatientList);