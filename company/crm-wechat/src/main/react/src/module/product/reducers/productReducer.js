import {
    CHANGE_COMMENT_POINT_SEARCH_PAGE,
    CHANGE_CURRENT_GRADE,
    CHANGE_IS_SHOW_INSTRUCTIONS,
    PRODUCT_ALL_COMMENT,
    PRODUCT_B2C_PRODUCT_LIST,
    PRODUCT_CHANGE_B2C_PRODUCT_SEARCH_PARAMS,
    PRODUCT_CHANGE_IS_SHOW_DELETE_BTN_FOR_INPUT,
    PRODUCT_CHANGE_SHOP_PRODUCT_SEARCH_PARAMS,
    PRODUCT_DETAIL_DATA,
    PRODUCT_FREQUENTLY_MGR_CATEGORY,
    PRODUCT_GRADE_COMMENT,
    PRODUCT_MGR_CATEGORYS,
    PRODUCT_SELL_CATEGORYS,
    PRODUCT_SHOP_PRODUCT_LIST,
    SHIFT_PRODUCT_DETAIL_TAB,
    SUPPORT_SHOP_IDS,
    NEW_PRODUCT_SHOP_PRODUCT_LIST,
    NEW_PRODUCT_CHANGE_SHOP_PRODUCT_SEARCH_PARAMS,
    COUPON_PRODUCT_EMPLOY_DETAILS,
    COUPON_SHORT_MONEY,
    COUPON_PRODUCT_MONEY,
} from "../constants/ActionTypes";


const productState = {
    //门店商品搜索参数
    shopProductSearchParams: {
        orderBy: "",                //排序的字段
        sortOrder: "",              //升序、降序
        keywords: "",              //商品名称、疾病名称
        sellCategoryId: "",       //销售分类ID
        isOnlyShop: "Y"            //只搜索门店商品
    },
    //门店商品列表
    shopProductPage: {
        page: 0,
        size: 10,
        recordsFiltered:0,
        products: []
    },

    // 门店商品搜索参数-支持优惠券
    newShopProductSearchParams: {
        orderBy: "",               // 排序的字段
        sortOrder: "",             // 升序、降序
        keywords: "",              // 商品名称、疾病名称
        sellCategoryId: "",        // 销售分类ID
        isOnlyShop: "Y",           // 只搜索门店商品
        couponId:null,             // 优惠券Id
    },
    // 新-门店商品列表-支持优惠券
    newShopProductPage: {
        page: 0,
        size: 10,
        recordsFiltered:0,
        products: []
    },

    // 优惠券支持商品详情
    couponProductDetails:{
       couponDetails:[],        // 优惠券详情
    },

    // 优惠券优惠
    couponReduceMoneyStr:"",     // 优惠券信息
    productSumMoney:0,        // 商品总金额

    //b2c商品搜索参数
    b2cProductSearchParams: {
        orderBy: "",                //排序的字段
        sortOrder: "",              //升序、降序
        keywords: "",              //商品名称、疾病名称
        sellCategoryId: "",       //销售分类ID
        mgrCategoryCode: "",      //管理分类编码
        isOnlyShop: "N"            //包含门店商品与连锁商品
    },
    //b2c商品列表
    b2cProductPage: {
        page: 0,
        size: 10,
        recordsFiltered:0,
        products: []
    },
    // 评价分页
    commentPointSearchPage: {
        page: 0,
        size: 10,
        recordsFiltered: 0,
        gradeLevelType: '',
        productId: 0,
        platformType: '',
        shopId: '',
        productGradeComments: []
    },
    isShowInstructions:false,//展示图文详情、说明书
    currentTab:"PRODUCT",//PRODUCT：商品，DETAIL：详情，COMMENT：评价
    gradeLevelType: '',//评论等级
    productComments:[],//商品评论
    //商品销售分类
    sellCategories: [],
    //商品管理分类
    mgrCategories: [],
    //商品常用分类
    frequentlyMgrCategory: [],
    //商品详情信息
    productDetailData: {},
    isShowDeleteBtnForInput: false,
    //支持商品的门店ids
    supportShopIds: [],
    // 优惠券支持商品Ids
    loadCouponProduct: [],
};

export default function (state = productState, action) {
    switch (action.type) {
        case PRODUCT_CHANGE_SHOP_PRODUCT_SEARCH_PARAMS:
            return Object.assign({}, state, {
                shopProductSearchParams: Object.assign({}, state.shopProductSearchParams, action.data)
            });
        case PRODUCT_SHOP_PRODUCT_LIST:
            return Object.assign({}, state, {
                shopProductPage: action.data
            });
        case PRODUCT_CHANGE_B2C_PRODUCT_SEARCH_PARAMS:
            return Object.assign({}, state, {
                b2cProductSearchParams: Object.assign({}, state.b2cProductSearchParams, action.data)
            });
        case PRODUCT_B2C_PRODUCT_LIST:
            return Object.assign({}, state, {
                b2cProductPage: action.data
            });
        case PRODUCT_SELL_CATEGORYS:
            return Object.assign({}, state, {
                sellCategories: action.data || []
            });
        case PRODUCT_MGR_CATEGORYS:
            return Object.assign({}, state, {
                mgrCategories: action.data || []
            });
        case PRODUCT_FREQUENTLY_MGR_CATEGORY:
            return Object.assign({}, state, {
                frequentlyMgrCategory: action.data || []
            });
        case PRODUCT_DETAIL_DATA:
            return Object.assign({}, state, {
                productDetailData: action.data
            });
        case CHANGE_IS_SHOW_INSTRUCTIONS:
            return Object.assign({}, state, {
                isShowInstructions: action.data
            });
        case SHIFT_PRODUCT_DETAIL_TAB:
            return Object.assign({}, state, {
                currentTab: action.data
            });
        case PRODUCT_ALL_COMMENT:
            return Object.assign({}, state, {
                productComments: action.data
            });
        case PRODUCT_GRADE_COMMENT:
            return Object.assign({}, state, {
                commentPointSearchPage: action.data
            });
        case CHANGE_COMMENT_POINT_SEARCH_PAGE:
            return Object.assign({}, state, {
                commentPointSearchPage: action.data
            });
        case CHANGE_CURRENT_GRADE:
            return Object.assign({}, state, {
                gradeLevelType: action.data
            });
        case PRODUCT_CHANGE_IS_SHOW_DELETE_BTN_FOR_INPUT:
            return Object.assign({}, state, {
                isShowDeleteBtnForInput: !!action.data
            });
        case SUPPORT_SHOP_IDS:
            return Object.assign({}, state, {
                supportShopIds: action.data
            });
        case NEW_PRODUCT_SHOP_PRODUCT_LIST:
            return Object.assign({}, state, {
                newShopProductPage: action.data
            });
        case NEW_PRODUCT_CHANGE_SHOP_PRODUCT_SEARCH_PARAMS:
            return Object.assign({}, state, {
                newShopProductSearchParams: action.data
            });
        case COUPON_PRODUCT_EMPLOY_DETAILS:
            return Object.assign({}, state, {
                couponProductDetails: action.data
            });
        case COUPON_SHORT_MONEY:
            return Object.assign({}, state, {
                couponReduceMoneyStr: action.data
            });
        case COUPON_PRODUCT_MONEY:
            return Object.assign({}, state, {
                productSumMoney: action.data
            });
        default:
            return state;
    }
}
