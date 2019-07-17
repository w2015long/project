/**
 * Created by olx on 2018/9/27.
 */
import * as types from "../constants/ActionTypes";


export function getPublicNumberPicture(initMemberShareParamCalBackFun=()=>{},sharerId) {
    return (dispatch) => {
        const url = '/wap/promoteReward/getpromoteUrlPic?sharerId='+sharerId;
        window.textFetch(
            url,
            {
                method: 'GET',
            },
            json => {

                dispatch({
                    type: types.MEMBER_PROMOTE_GET_PUBLIC_NUMBER_PICTURE,
                    publicNumberPicture: json
                });
                initMemberShareParamCalBackFun()
            }
        );
    }
}
//获取登录会员信息
export function getLoginMemberId(initMemberShareParamCallBack=()=>{}) {
    return (dispatch) => {
        const url = '/wap/promoteReward/getLoginMemberId';
        window.textFetch(
            url,
            {
                method: 'GET',
            },
            json => {
                dispatch({
                    type: types.MEMBER_PROMOTE_GET_LOGIN_MEMBER_ID,
                    loginMemberId: json
                });
                initMemberShareParamCallBack(json);
            }
        );
    }
}
export function getList(failCallBack=()=>{},successCallBack=()=>{}) {
    return (dispatch) => {
        const url = '/wap/promoteReward/getPromoterList';
        window.textFetch(
            url,
            {
                method: 'GET',
            },
            json => {
                if(!json){
                    failCallBack();
                    dispatch({
                        type: types.MEMBER_PROMOTE_GET_PROMOTER_LIST,
                        isLogin: false
                    });
                    return
                }
                successCallBack();
                dispatch({
                    type: types.MEMBER_PROMOTE_GET_PROMOTER_LIST,
                    promoterList: json,
                    isLogin: true
                });


            }
        );
    }
}



export function setPromoterState(data) {
    return (dispatch) => {
            dispatch({
            type: types.MEMBER_PROMOTE_CHANGE_LAYER_STATE,
            data: data
        });
    }
}
export function setMemberPromoteSetSharerId(data) {
    return (dispatch) => {
            dispatch({
            type: types.MEMBER_PROMOTE_SET_SHARER_ID,
            data: data
        });
    }
}