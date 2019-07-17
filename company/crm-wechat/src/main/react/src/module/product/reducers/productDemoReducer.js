import {
    PRODUCT_DEMO_PRODUCT_LIST
} from "../constants/ActionTypes";

/**
 * @author chencheng
 * @date 2018/8/14
 * 定义数据
 */

// 定义初始化数据，这里面的数据最终是给组件去使用的
const productDemoState = {

    // 商品搜索参数
    productSearchParams:{
        orderBy: "",                //排序的字段
        sortOrder: "",              //升序、降序
        keywords: "九芝堂",              //商品名称、疾病名称
        sellCategoryId: "",       //销售分类ID
        isOnlyShop: "Y"            //只搜索门店商品
    },

    //商品分页
    productPage:{
        page:0,
        size:10,
        products:[]
    }

};

/**
 * reducer方法
 * @param state 上次的state
 * @param action
 * @returns {*}
 */
export default function (state = productDemoState, action) {
    switch (action.type) {
        case PRODUCT_DEMO_PRODUCT_LIST:
            //当动作类型为 PRODUCT_DEMO_PRODUCT_LIST 的时候，改变productDemoState里面的productPage
            return Object.assign({}, state, {
                productPage: action.data
            });
        default:
            return state;
    }
}

