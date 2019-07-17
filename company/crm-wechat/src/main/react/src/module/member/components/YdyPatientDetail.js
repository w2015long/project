/**
 * @author kwy
 * @date 2019/5/17
 * 友德医患者详情
 */
import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import  "../style/YdyPatientDetail.css";
import {saveOrUpdatePatient,deletePatient,initialPatient} from "../actions/ydyPatientAction.js";
import {REG_MOBILE_PHONE} from "../../../util/common-reg";
import {showConfirm} from "../../common/actions/commonAction";
import Confirm from '../../common/components/Confirm';

class YdyPatientDetail extends Component {

    state = {
        patient:{},
        weui:null,
        type:"add",
    };


    componentWillMount() {
        let patientIndex = this.props.match.params.patientIndex;
        if(patientIndex){
            document.title = '就诊人编辑';
            let patient = this.props.ydyPatientState.ydyPatientList[patientIndex];
            this.setState({patient:patient,type:"edit"});
        }else{
            document.title = '就诊人添加';
            this.setState({type:"add"});

            // 如果是第一次使用则默认会员信息
            this.props.actions.initialPatient((json)=>{
                let patient = json;
                this.setState({patient:patient});
            });
        }
        // this.props.actions.getSendSmsFrequency();
    }

    componentWillUnmount() {
        if(this.state.weui){
            this.state.weui.hide();
        }
    }

    saveOrUpdatePatient(){
        if(REG_MOBILE_PHONE.test(this.state.patient.phone)===false){
            window.warningTip('手机号码格式错误');
            return;
        }
        this.props.actions.saveOrUpdatePatient(this.state.patient,()=>{
            this.toYdyPatientList();
        });
    }
    deletePatient(){
        this.props.actions.showConfirm("是否删除?",
            () => {
                this.props.actions.deletePatient(this.state.patient.patientId,()=>{
                    this.toYdyPatientList();
                });
            }
        );

    }

    // 患者列表
    toYdyPatientList(){
        this.props.history.push("/ydy/patient/list");
    }

    selectDate(birthDate){
        let self = this;
        let birth;
        let  now = new Date();
        if(birthDate){
            birth =  new Date(birthDate);
        }else{
            birth = now;
        }
       let patient = this.state.patient;
       let weui =  window.weui.datePicker({
            defaultValue: [1990, 1, 1],//只有第一次创建时可以默认值
            start: 1900,
            end: now.getFullYear(),
            onChange: function (result) {
                var res = result.join('-');
                self.setState({patient: window.Object.assign({},patient,{birthDate:birth.getTime(),birthDateStr:res,age:birth.getFullYear()-now.getFullYear()})});
            },
            onConfirm: function (result) {
                var res = result.join('-');
                self.setState({patient: window.Object.assign({},patient,{birthDate:birth.getTime(),birthDateStr:res,age:birth.getFullYear()-now.getFullYear()})});
            }
        });

        self.setState({weui:weui});
    }

    onChangeSex(sex){
        this.setState({patient: window.Object.assign({},this.state.patient,{sex:sex})});
    }
    onChangeName(name){
        this.setState({patient: window.Object.assign({},this.state.patient,{name:name})});
    }
    onChangePhone(phone){
        this.setState({patient: window.Object.assign({},this.state.patient,{phone:phone})});
    }

    render() {
        let self = this;
        let patient = this.state.patient||{};
        const actions = this.props.actions;
        const history = this.props.history;
        console.log(patient);
        return (
            <div className={"ydy-patient-detail"}>
                <div className="visiting-main">
                    <div className="fm-module01">
                        <div className="weui_cell">
                            <div className="cell_hd">
                                <span className="label">姓名</span>
                            </div>
                            <div className="cell_bd">
                                <input type="text" className="input-tex" placeholder="请输入姓名" value={patient.name||''}  onChange={(event) => this.onChangeName(event.target.value)}/>
                            </div>
                        </div>
                        <div className="weui_cell">
                            <div className="cell_hd">
                                <span className="label">性别</span>
                            </div>
                            <div className="cell_bd">
                                <div className="radio-custom">
                                    <input id="inputAddr1" name="inputAddr" checked={patient.sex === 'MALE' ?'checked':''} value={'MALE'} type="radio" onChange={(event) => this.onChangeSex(event.target.value)}/>
                                    <label htmlFor="inputAddr1">男</label>
                                </div>
                                <div className="radio-custom">
                                    <input id="inputAddr2" name="inputAddr" checked={patient.sex === 'FEMALE'?'checked':''}  value={'FEMALE'} type="radio" onChange={(event) => this.onChangeSex(event.target.value)}/>
                                    <label htmlFor="inputAddr2">女</label>
                                </div>
                            </div>
                        </div>


                        <div className="weui_cell" onClick={()=>{self.selectDate(patient.birthDate)}}>
                            <div className="cell_hd">
                                <span className="label" >出生日期</span>
                            </div>
                            <div className="cell_bd">
                                <a id="showDatePicker">{patient.birthDateStr ? patient.birthDateStr:'请选择>'}</a>
                            </div>
                        </div>

                        <div className="weui_cell">
                            <div className="cell_hd">
                                <span className="label">手机号码</span>
                            </div>
                            <div className="cell_bd">
                                <input type="number" placeholder="请输入11位手机号码" className="input-tex" value={patient.phone || ''}  onChange={(event) => this.onChangePhone(event.target.value)}/>
                            </div>
                        </div>
                    </div>
                    {
                        "add" === this.state.type ?
                        <div className="visiting-btn clearfix" onClick={()=>{this.saveOrUpdatePatient()}}>
                            确认添加
                        </div>
                        :
                        <div className="visiting-btn clearfix">
                            <div className="delete-btn" onClick={()=>{this.deletePatient()}}>删除</div>
                            <div className="save-btn" onClick={()=>{this.saveOrUpdatePatient()}}>保存</div>
                        </div>
                    }


                </div>
                <Confirm/>
            </div>
        )
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        ydyPatientState: store.ydyPatientState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({saveOrUpdatePatient,deletePatient,initialPatient,showConfirm}, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(YdyPatientDetail);