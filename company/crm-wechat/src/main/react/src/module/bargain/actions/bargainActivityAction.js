/**
 * 砍价活动
 * Created by liezihao on 2018/12/27
 */
import {
    BARGAIN_ACTIVITY_PAGE,
    MUTUAL_BARGAIN_SHARE_RECORD_PAGE_ACTION_TYPES,
    BARGAIN_ACTIVITY_UPDATE_SHOW_TAB
} from '../../activity/constants/ActionTypes';


/**
 * 砍价活动 -分页
 * @param page
 * @param size
 * @param activity
 */
export function bargainActivityPage(page,size,activity=[]) {
    return (dispatch) => {
        const url = 'wap/mutualBargainActivity/pageMutualBargainActivity';
        let data = {
            page:page,
            size:size
        };
        window.textFetch(
            url, {
                method:'POST',
                body:JSON.stringify(data)
            }, json => {
                let data = {
                    page:page,
                    size:size,
                    activity:activity.concat(json.data),
                    recordsFiltered:json.recordsFiltered
                };
                const action = {
                    type:BARGAIN_ACTIVITY_PAGE,
                    data:data
                };
                dispatch(action);
            }
        );
    }
}


/**
 * 该会员参加互助砍价活动 -分页
 * @param page
 * @param size
 * @param activity
 */
export function mutualBargainShareRecordPage(page,size,mutualBargainShareRecord=[]) {
    return (dispatch) => {
        const url = 'wap/mutualBargainShareRecord/pageMutualBargainShareRecord';
        let data = {
            page:page,
            size:size
        };
        window.textFetch(
            url, {
                method:'POST',
                body:JSON.stringify(data)
            }, json => {
                let data = {
                    page:page,
                    size:size,
                    mutualBargainShareRecord:mutualBargainShareRecord.concat(json.data),
                    recordsFiltered:json.recordsFiltered
                };
                const action = {
                    type:MUTUAL_BARGAIN_SHARE_RECORD_PAGE_ACTION_TYPES,
                    data:data
                };
                dispatch(action);
            }
        );
    }
}

/**
 * 保存分享者记录
 * @param mutualBargainActivityId 互助砍价活动ID
 * @param activityProductId 活动商品ID
 * @param callback 保存成功回调
 * @param memberLoginInCallback 会员未登录回调
 */


export function saveMutualBargainShareRecord(mutualBargainActivityId,activityProductId,callback= () => {},memberLoginInCallback= () => {}) {
    return (dispatch) => {
        const url = 'wap/mutualBargainShareRecord/saveMutualBargainShareRecord?mutualBargainActivityId='+mutualBargainActivityId+"&activityProductId="+activityProductId;
        window.textFetch(
            url, {}, json => {
                if(json === "SYS_USER_NOT_LOGIN"){
                    //会员未登录 跳转的登录页面
                    memberLoginInCallback();
                }else {
                    callback(json);
                }
            }
        );
    }
}


/**
 * 更改显示tab
 *  true 显示砍价商品 false显示我的砍价
 */
export function updateShowTab(showThatTab) {
    return (dispatch) => {
        dispatch({
            type: BARGAIN_ACTIVITY_UPDATE_SHOW_TAB,
            showThatTab: showThatTab
        });
    }

}


