import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import "../style/PharmacistList.css";
import {pagePharmacistList} from "../actions/indexActions";
import AutoLoadMore from "../../../module/common/components/AutoLoadMore";
import EmptyPage from "../../../module/common/components/EmptyPage";

//药师咨询列表
class PharmacistList extends Component {

    componentWillMount() {
        const {pharmacistPage} = this.props.indexState;
        this.props.actions.pagePharmacistList(pharmacistPage.page, pharmacistPage.size);
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    componentDidUpdate(){

    }

    //加载更多
    loadMoreData() {
        let {pharmacistPage} = this.props.indexState;
        this.props.actions.pagePharmacistList(pharmacistPage.page + 1, pharmacistPage.size,pharmacistPage.pharmacists);
    }

    render() {
        const {pharmacistPage} = this.props.indexState;
        const isHaveNextPage = pharmacistPage.size * (pharmacistPage.page + 1) < pharmacistPage.recordsFiltered;

        return (
            <div className="pharmacist-list">
               {  pharmacistPage.pharmacists.length === 0 ? <EmptyPage/> :
                <div className="pharmacist-main" id="pharmacistList">
                    {
                        pharmacistPage.pharmacists.map(pharmacist => {
                            return(
                                <div className="item">
                                    <div className="pic"><img src={(undefined === pharmacist.url || "" === pharmacist.url) ? "" : pharmacist.url} alt=""/></div>
                                    <span>{pharmacist.name}</span>
                                    <i>药师</i>
                                    {pharmacist.tel ? <a href={"tel:" + pharmacist.tel} className="call-btn"/> : <span className="call-btn"/>}
                                </div>
                            )
                        })
                    }
                    <AutoLoadMore container={'pharmacistList'} isHaveNextPage={isHaveNextPage} loadMoreFunc={this.loadMoreData.bind(this)}/>
                </div>
               }
            </div>
        )
    }
}

PharmacistList.propTypes = {};

PharmacistList.contextTypes = {

};

const mapStateToProps = (store, ownProps) => {
    return {
        indexState: store.indexState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({pagePharmacistList}, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PharmacistList);