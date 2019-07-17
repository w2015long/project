import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import "../style/Product.css";
import {changeIsShowDeleteBtnForInput} from "../actions/productActions";
//门店商品搜索
class ShopProductSearch extends Component {
    state={
        shopProductSearchRecords:ShopProductSearch.getSearchRecords()
    };

    componentWillMount() {
        document.title = '门店商品搜索';
    }

    searchProduct(e) {
        if (e.keyCode === 13) {
            this.clickToSearchProduct()
        }
    }

    goSearch(keywords) {
        this.saveToSearchRecords(keywords);
        this.props.history.push({pathname:'/product/list/shop',param:{
                keyword:keywords.trim()
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
        this.setState({shopProductSearchRecords:searchRecords});
        window.localStorage.shopProductSearchRecords = searchRecords.join('|');
    }

    static getSearchRecords(){
        let {shopProductSearchRecords} = window.localStorage;
        if (!shopProductSearchRecords) {//之前没有搜索记录
            return [];
        } else {//之前已有搜索记录
            return shopProductSearchRecords.split('|');
        }
    }

    clearSearchRecords() {
        this.setState({shopProductSearchRecords:[]});
        window.localStorage.removeItem('shopProductSearchRecords');
    }

    //清空搜索框值
    clearSearchField() {
        this.refs.searchWord.value = '';
    }
    clickToSearchProduct() {
        const keyword = this.refs.searchWord.value.trim();
        this.goSearch(keyword);
    }

    render() {
        const shopProductSearchRecord = this.state.shopProductSearchRecords;
        const {keywords} = this.props.productState.shopProductSearchParams;
        const {isShowDeleteBtnForInput} = this.props.productState;

        return (
            <div className="shop-product">
                <div className="index-search-main">
                    <div className="mt">
                        <div ref={'searchDiv'} className="search-box">
                            <input onKeyDown={e => this.searchProduct(e)} onChange={e=>{this.changeShowDeleteBtnForInput(e)}}  defaultValue={keywords} autoFocus type="search" placeholder="商品名|通用名|厂家|品牌|69码|商品编码" ref={'searchWord'}/>
                            <span className="search-btn"/>
                            {isShowDeleteBtnForInput&& <span className="del-btn" onClick={() => this.clearSearchField()}/>}
                            <a  className="search-tex" onClick={() => this.clickToSearchProduct()}>搜索</a>
                        </div>
                    </div>
                    <div className="mc">
                        {shopProductSearchRecord.length > 0 &&
                        <p>历史搜索<a className="clear-btn" onClick={() => this.clearSearchRecords()}>清空</a></p>}
                        <ul className="input-result">
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

    changeShowDeleteBtnForInput(e) {
        const {actions} = this.props;
        actions.changeIsShowDeleteBtnForInput(e.target.value.trim())
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
        actions: bindActionCreators({changeIsShowDeleteBtnForInput}, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopProductSearch);




