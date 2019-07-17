/**
 * @author ly 商品分类页面
 * @date 2018/8/15
 */
// 引入react组件
import React, {Component} from "react";
// 引入css
import '../style/B2cProductClassify.css';

//引入方法
import {listMgrCategory} from "../actions/productActions";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

//引入link，用来做页面跳转，实际上它会被渲染成a标签
import {Link} from "react-router-dom";

class B2cProductClassify extends Component{


    state={
        selectedFirstMgrCategory:{},//已选择的一级管理分类
    };

    //构造方法，基本没有使用
    constructor(prosp){
        super(prosp);
    }

    componentWillMount(){
        document.title='商品分类';
        //加载商品管理分类
        this.props.actions.listMgrCategory();
    }


    //点击事件 ： 选择一级管理分类
    selectFirstMgrCategory(category){
        // 当前选中的一级对象(category) 设置给 state 中 的 selectedFirstMgrCategory
        this.setState({selectedFirstMgrCategory:category});
    }

    //点击事件 ： 二级/三级菜单去往对应的查询列表
    searchProductByCategory(keywords,category) {
        //去往商品列表 : 并带上指定的参数
        this.props.history.push({pathname:'/product/list/b2c',param:{
                keyword:keywords,
                mgrCategoryCode:category.categoryCode
            }});
    }


    render(){
        //获取商品管理分类列表
        let {b2cProductSearchParams,mgrCategories} = this.props.productState;
        let selectedFirstMgrCategory = this.state.selectedFirstMgrCategory;//选中的一级分类 (这里获取的是state中的selectedFirstMgrCategory)
        let secondMgrCategories = selectedFirstMgrCategory.children || mgrCategories;//一级分类对应的二级分类(这里的selectedFirstMgrCategory是指上面的那个 let 出来的 selectedFirstMgrCategory)

        return(
            <div className="product-classify">
                <div className="index-search-main">
                        <div className="mt">
                            <div className="search-box">
                                <Link to={'/product/search/b2c'}>
                                    <input type="text" placeholder="请输入疾病、商品名称" value={b2cProductSearchParams.keywords} readOnly/>
                                </Link>
                            </div>
                        </div>
                        <div className="mc">
                            <div className="mc-nav">
                                    <ul>
                                        {
                                            mgrCategories.map(category => {
                                                 return(
                                                     <li className={selectedFirstMgrCategory.categoryCode === category.categoryCode ? 'cur':''} key={category.categoryCode}><a onClick={() => this.selectFirstMgrCategory(category)}>{category.title}</a></li>
                                                 )
                                            })
                                        }
                                    </ul>
                            </div>
                            <div className="mc-cont">
                                    <div className="item">
                                        {
                                            secondMgrCategories.map(secondCategory=>{
                                                let children = secondCategory.children || [];
                                                return(
                                                    <dl key={secondCategory.categoryCode}>
                                                        <dt><a onClick={() => this.searchProductByCategory('',secondCategory)}>{secondCategory.title}</a></dt>
                                                        <dd>
                                                            {
                                                                children.map(child=>{
                                                                    return <a onClick={() => this.searchProductByCategory('',child)} key={child.categoryCode}>{child.title}</a>
                                                                })
                                                            }
                                                        </dd>
                                                    </dl>
                                                )
                                            })
                                        }
                                    </div>
                            </div>
                        </div>
                    </div>
            </div>
        );
    };
}

const mapStateToProps = (store, ownProps) => {
    return {
        productState: store.productState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({listMgrCategory}, dispatch)
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(B2cProductClassify);