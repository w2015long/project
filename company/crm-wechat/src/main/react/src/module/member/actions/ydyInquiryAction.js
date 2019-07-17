/**
 * Created by kwy on 2019/5/20
 */


/**
 * 获取友德医患者列表列表
 */
export function getYdyDoctorPageUrl(patientId,callBack=()=>{}) {
    return (dispatch) => {
        const url = '/wap/ydyInquiry/getYdyDoctorPageUrl?patientId='+patientId;
        window.textFetch(
            url,
            {
                method:'GET',
            },
            json => {
                callBack(json);
            }
        );
    }
}
