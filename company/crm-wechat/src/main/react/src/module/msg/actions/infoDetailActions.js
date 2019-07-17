/**
 * @author kwy
 * @date 2018/8/15
 * 咨讯中心详情方法
 */
import {INFO_DETAIL_DATE} from "../constants/ActionTypes"

/**/
export function getInfoDetail(infoId) {
    return (dispatch) => {
        let url = "/wap/info/findByInfoId?infoId=" + infoId;
        window.jsonFetch(
            url,
            {
                method: 'get',

            },
            (json) => {
                dispatch({
                    type: INFO_DETAIL_DATE,
                    data: json
                });
            }
        )
    }
}