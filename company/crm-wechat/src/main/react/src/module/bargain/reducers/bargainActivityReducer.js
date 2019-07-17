/**
 * 砍价活动
 * Created by liezihao on 2018/12/27
 */
// 引入定义常量
import {
    BARGAIN_ACTIVITY_PAGE,
    MUTUAL_BARGAIN_SHARE_RECORD_PAGE_ACTION_TYPES,
    BARGAIN_ACTIVITY_UPDATE_SHOW_TAB
} from '../../activity/constants/ActionTypes';

const bargainActivityPageReducer={
    activityPage:{  //活动砍价
        page:0,
        size:5,
        activity:[]
    },

    mutualBargainShareRecordPage:{  //该会员参加互助砍价活动
        page:0,
        size:5,
        mutualBargainShareRecord:[]
    },
    showThatTab : true, //true 显示砍价商品 false显示我的砍价
};

export default function (state = bargainActivityPageReducer, action) {
    switch (action.type) {
        case BARGAIN_ACTIVITY_PAGE:
            return Object.assign({},state,{
                activityPage:action.data
            });
        case MUTUAL_BARGAIN_SHARE_RECORD_PAGE_ACTION_TYPES:
            return Object.assign({},state,{
                mutualBargainShareRecordPage:action.data
            });
        case BARGAIN_ACTIVITY_UPDATE_SHOW_TAB:
            return Object.assign({},state,{
                showThatTab:action.showThatTab
            });
        default:
            return state;
    }
}