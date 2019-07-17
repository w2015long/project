/**
 * Created by kwy on 2019/5/17
 */
//引入Action类型
import {
    YDY_PATIENT_LIST,
    YDY_PATIENT_DETAIL
} from "../constants/ActionTypes";

/**
 * 获取友德医患者列表列表
 */
export function findByYdyPatientList() {
    return (dispatch) => {
        const url = '/wap/ydyPatient/findByYdyPatientList';
        window.jsonFetch(
            url,
            {},
            json => {
                dispatch({
                    type: YDY_PATIENT_LIST,
                    ydyPatientList: json
                });
            }
        );
    }
}

/**
 * 添加或修改患者
 */
export function saveOrUpdatePatient(patient,callback=()=>{}) {
    return (dispatch) => {
        const url = '/wap/ydyPatient/saveOrUpdateYdyPatient';
        window.jsonFetch(
            url,
            {
                method: 'POST',
                body: JSON.stringify(patient)
            },
            json => {
                window.successTip('保存成功');
                callback();
            }
        );
    }
}

/**
 * 删除患者
 */
export function deletePatient(patientId,callback=()=>{}) {
    return (dispatch) => {
        const url = '/wap/ydyPatient/deleteYdyPatient?patientId='+patientId;
        window.textFetch(
            url,
            {method:'get'},
            json => {
                window.successTip('删除成功');
                callback();
            }
        );
    }
}

/**
 * 当会员无患者列表信息时，第一个患者默认信息为会员信息
 */
export function initialPatient(callback=()=>{}) {
    return (dispatch) => {
        const url = '/wap/ydyPatient/initialPatient';
        window.textFetch(
            url,
            {method:'get'},
            json => {
                callback(json);
            }
        );
    }
}