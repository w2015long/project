/**
 * @author chencheng
 * @date 2018/3/31
 * 列表固钉
 */
import React,{Component} from 'react';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { Affix } from 'antd';
import {changeAffixIndex} from '../actions/affixForListAction'

class AffixForList extends Component{

    changeAffixIndex(affixed, index){
        if (affixed) {
            this.props.actions.changeAffixIndex(index);
        }else {
            this.props.actions.changeAffixIndex(index-1);
        }
    }
    render(){
        const {affixIndex} = this.props.commonState;
        const index = this.props.index;
        const offsetTop = this.props.offsetTop;
        if (index >= affixIndex){
            return <Affix offsetTop={offsetTop?offsetTop:20} onChange={affixed => this.changeAffixIndex(affixed, index)}>{this.props.children}</Affix>
        }else {
            return this.props.children
        }
    }
}

AffixForList.propTypes = {
    index:PropTypes.number.isRequired,
    offsetTop:PropTypes.number
};

const mapStateToProps = (store, ownProps) => {
    return {
        commonState:store.commonState
    }
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({changeAffixIndex}, dispatch)
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(AffixForList);