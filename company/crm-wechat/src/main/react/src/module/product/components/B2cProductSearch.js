import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import "../style/B2cProductSearch.css";
import {listFrequentlyMgrCategory} from "../actions/productActions";
//B2C商品搜索
class ShopProductSearch extends Component {
    state={
        b2cProductSearchRecords:ShopProductSearch.getSearchRecords()
    };

    componentWillMount() {
        document.title = '商城商品搜索';
        this.props.actions.listFrequentlyMgrCategory();
    }

    searchProduct(e) {
        if (e.keyCode === 13) {
            const keyword = this.refs.b2cSearchWord.value;
            this.goSearch(keyword);
        }
    }
    clickToSearchProduct(e) {
        const keyword = this.refs.b2cSearchWord.value;
        this.goSearch(keyword);
    }

    goSearch(keywords,mgrCategoryCode="") {
        this.saveToSearchRecords(keywords);
        this.props.history.push({pathname:'/product/list/b2c',param:{
                keyword:keywords,
                mgrCategoryCode:mgrCategoryCode
        }});
    }

    saveToSearchRecords(keyword) {
        keyword = keyword.trim();
        if (keyword.length <= 0) {
            return;
        }
        let searchRecords = ShopProductSearch.getSearchRecords();
        searchRecords = searchRecords.filter(e => e !== keyword);//清除原有相同的搜索记录
        //长度等于10则移除最后一个元素
        if (searchRecords.length === 10){
            searchRecords.pop();
        }
        searchRecords.unshift(keyword);//追加到前面
        this.updateSearchRecords(searchRecords);
    }

    updateSearchRecords(searchRecords){
        this.setState({b2cProductSearchRecords:searchRecords});
        window.localStorage.b2cProductSearchRecords = searchRecords.join('|');
    }

    static getSearchRecords(){
        let {b2cProductSearchRecords} = window.localStorage;
        if (!b2cProductSearchRecords) {//之前没有搜索记录
            return [];
        } else {//之前已有搜索记录
            return b2cProductSearchRecords.split('|');
        }
    }

    clearSearchRecords() {
        this.setState({b2cProductSearchRecords:[]});
        window.localStorage.removeItem('b2cProductSearchRecords');
    }

    //清空搜索框值
    clearSearchField() {
        this.refs.b2cSearchWord.value = '';
    }

    render() {
        const shopProductSearchRecord = this.state.b2cProductSearchRecords ||[];
        const {keywords} = this.props.productState.shopProductSearchParams;
        const frequentlyMgrCategory = this.props.productState.frequentlyMgrCategory||[];

        return (
            <div className="b2c-index-search-main">
                <div className="mt">

                    <div ref={'searchDiv'} className="search-box search-focus">
                        <input onKeyDown={e => this.searchProduct(e)} defaultValue={keywords} autoFocus type="search"
                               placeholder="请输入疾病、商品名称" ref={'b2cSearchWord'}/>
                            <a  className="search-btn"></a>
                            <a  className="del-btn" onClick={() => this.clearSearchField()}></a>
                            <a  className="search-tex" onClick={() => this.clickToSearchProduct()}>搜索</a>
                    </div>
                </div>
                <div className="mc">

                    <div className="search-common">
                        {frequentlyMgrCategory.length > 0 && <h5>常用分类</h5>}
                        <ul>
                            {
                                frequentlyMgrCategory.map((category, index) => {
                                    return (
                                        <li key={index}><a onClick={() => this.goSearch("",category.categoryCode)}>{category.title}</a></li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                    <div className="search-history">
                        {shopProductSearchRecord.length > 0 &&
                        <p>历史搜索<a className="clear-btn" onClick={() => this.clearSearchRecords()}>清空</a></p>}
                        <ul>
                            {
                                shopProductSearchRecord.map((value, index) => {
                                    return (
                                        <li key={index}><a onClick={() => this.goSearch(value)}>{value}</a></li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

ShopProductSearch.propTypes = {};

ShopProductSearch.contextTypes = {};

const mapStateToProps = (store, ownProps) => {
    return {
        productState: store.productState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({listFrequentlyMgrCategory}, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopProductSearch);




