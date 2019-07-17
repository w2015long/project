import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
// 引入方法
import {changeTabState, getModuleTabList, pageProductCategory} from "../actions/mallIndexActions";
import {Link} from "react-router-dom";
import EmptyPage from "../../../common/components/EmptyPage";
//自动加载下一页
import AutoLoadMore from "../../../common/components/AutoLoadMore";
import Img from "../../../common/components/Img";

/**
 * 微商城首页 商品分类
 */
class MallProductCategory extends Component{


    state={
      lastPageModuleTabId : 0,//上一次咨询分类id
    };

    //在组件首次渲染之前调用，这时候DOM还没有，而且整个生命周期中只会被执行一次，在这里面setState是无效的
    componentWillMount(){
    }
    //在组件首次渲染之后调用，这时候DOM节点已经首次加载完成。整个生命周期只会执行一次
    componentDidMount() {
        //加载 商品 tab
        let {productCategoryPage} = this.props.mallIndexState;
        this.props.actions.getModuleTabList("wap_index_commodity_pro",productCategoryPage.size,()=>MallProductCategory.init());
    }
    static init(){
        new window.Swiper('.tab-tit', {
            freeMode : true,
            slidesPerView : 'auto'
        });
    }
    //加载商品列表
    reloadProduct(pageModuleTabId){
        let lastPageModuleTabId = this.state.lastPageModuleTabId;
        let {productCategoryPage} = this.props.mallIndexState;
        this.props.actions.pageProductCategory(pageModuleTabId,lastPageModuleTabId,0, productCategoryPage.size);
    }

    loadMoreFunc(){
        let {productCategoryPage} = this.props.mallIndexState;
        let lastPageModuleTabId = this.state.lastPageModuleTabId;
        this.props.actions.pageProductCategory(productCategoryPage.pageModuleTabId,lastPageModuleTabId,productCategoryPage.page + 1, productCategoryPage.size, productCategoryPage.products);
    }
    /**
     * 点击切换商品tab
     * @param pageModuleTabId tabId
     */
    clickChangeModuleTab(pageModuleTabId){
        this.reloadProduct(pageModuleTabId);
        this.props.actions.changeTabState(pageModuleTabId);
        this.setState({lastPageModuleTabId:pageModuleTabId});
    }
    render(){
        let {moduleTabList, moduleTabId, productCategoryPage} = this.props.mallIndexState;
        let moduleTabs =  moduleTabList || [];
        let mTabId =  moduleTabId || [];
        let productPage =  productCategoryPage.products || [];
        const isHaveNextPage = productCategoryPage.size * (productCategoryPage.page + 1) < productCategoryPage.recordsFiltered;
        return (
            <div>
            <div className="gd-box">
                <div className="tab-tit swiper-container">
                    <ul className="tab-nav swiper-wrapper clearfix">
                        {
                            moduleTabs.map(moduleTab => {
                                return(
                                    <li className={mTabId === moduleTab.pageModuleTabId?"swiper-slide cur":"swiper-slide"} key={moduleTab.pageModuleTabId} >
                                        <a onClick={()=>this.clickChangeModuleTab(moduleTab.pageModuleTabId)}>{moduleTab.tabName}</a>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div className="gd-cont">
                    {/*广告*/}
                    {/*<div className="space"><a href="javascript:void(0)"><img src="case/pic588x117.jpg" alt=""/></a></div>*/}
                    {productPage.length === 0 ? <EmptyPage/>:<ul className="commodity" id={'productCategory'}>
                        {
                            productPage.map((product,index) => {
                                return(
                                    <Link to={"/product/detail/"+product.productId+"/"+product.platformType}  key={index}>
                                    <li className="item">
                                        <div className="pic"><Img  src={product.fileId} alt=""/></div>
                                        <div className="arrive"><span className="bg-blue">5天内达</span></div>
                                        <div className="title elli">{product.productNm}</div>
                                        <div className="price">￥{product.priceDouble}</div>
                                    </li>
                                    </Link>
                                )
                            })
                        }
                        {productPage.length > 0 && <AutoLoadMore container={'productCategory'} isHaveNextPage = {isHaveNextPage} loadMoreFunc={this.loadMoreFunc.bind(this)}/> }

                    </ul>
                    }
                </div>
            </div>
            </div>
        )
    }
}
const mapStateToProps = (store, ownProps) => {
    return {
        mallIndexState: store.mallIndexState
    }
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({getModuleTabList,changeTabState,pageProductCategory}, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MallProductCategory);
