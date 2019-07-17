/**
 * Created by olx on 2018/9/27.
 */
import * as types from "../constants/ActionTypes";


export function getMemberRegisterInfo(activateTicket,getUserInfoAfterActivateCard=()=>{}) {
    return (dispatch) => {
        const url = '/wxapi/getWapMemberRegisterInfo';
        window.textFetch(
            url,
            {
                method: 'POST',
                body: JSON.stringify({activateTicket: activateTicket})
            },
            json => {
                let info = json.info || {};
                let common_field_list = info.common_field_list || [];
                let custom_field_list = info.custom_field_list || [];
                let total = common_field_list.concat(custom_field_list);

                let map = {};
                for (let commonFieldListKey in total) {
                    map[total[commonFieldListKey].name] = total[commonFieldListKey].value;
                }
                map["memberIsExit"] = json.memberIsExit;
                dispatch({
                    type: types.MEMBER_REGISTER_INFO,
                    data: map
                });
                getUserInfoAfterActivateCard();
            }
        );
    }
}

export function activateMemberCard(cardId, encryptCode, openId, outer_str, activateTicket,successCallBack=()=>{}) {
    let data = {
        cardId: cardId,
        encryptCode: encryptCode,
        openId: openId,
        outerStr: outer_str,
        activateTicket: activateTicket
    };
    return (dispatch) => {
        const url = '/wxapi/activateMemberCard';
        window.textFetch(
            url,
            {
                method: 'POST',
                body: JSON.stringify(data)
            },
            json => {
                successCallBack();
                let data = {
                    submitState: "success",
                    isNewMember: json.isNewMember,
                    cardNumber: json.cardNumber
                };
                dispatch({
                    type: types.MEMBER_SUBMIT_STATE,
                    data: data||{}
                });
            },error=>{
                dispatch({
                    type: types.MEMBER_SUBMIT_STATE,
                    data: {submitState: "fail",errorMsg:error.errMsg}
                });
                return false;

            }
        );
    }
}

/**
 *
 */
export function commonSetCardState(type, data) {
    return (dispatch) => {
        dispatch({
            type: type,
            data: data
        });
    }
}

/**
 * 拍单购药列表
 */
export function getRewardList() {
    return (dispatch) => {
        const url = "/wap/memberCardActivateRewardSetting/listNewMemberCardActivateReward";
        window.jsonFetch(
            url,
            {},
            json => {

                const action = {
                    type: types.MEMBER_CARD_GET_NEW_MEMBER_REWARD_LIST,
                    rewardList: json
                };
                dispatch(action);
            }
        );
    }
}