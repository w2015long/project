import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import '../style/Freight.css';
import {showFreight} from "../actions/freightAction";

class Freight extends Component {
    componentWillMount() {

    }

    componentDidMount() {

    }

    componentDidUpdate (){

    }

    componentWillUnmount(){

    }

    render() {
        const {actions, haveValidO2OProduct, haveValidB2CProduct} = this.props;
        const {normalCart, freightInfo} = this.props.normalCartSettlementState;

        return(
            freightInfo.showFreight==='Y' &&
            <div className='freight'>
                <div className="freight-layer" onClick={(e) => {e.target.className==='freight-layer' ? actions.showFreight('N') : {}}}>
                    <div className="freight-box">
                        <div className="mt">配送费说明 <a className="close" onClick={() => actions.showFreight('N')}/></div>
                        <div className="mc">
                            {
                                haveValidO2OProduct==='Y' &&
                                <p>1、门店配送费：{normalCart.freightAmountOfO2ODouble}元；</p>
                            }
                            {
                                haveValidB2CProduct==='Y' &&
                                <p>{haveValidO2OProduct==='Y' ? '2' : '1'}、商城配送费：{normalCart.freightAmountOfB2CDouble}元。</p>
                            }
                        </div>
                        <div className="md"><a onClick={() => actions.showFreight('N')}>关闭</a></div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        normalCartSettlementState: store.normalCartSettlementState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            showFreight
        }, dispatch)
    }
};

Freight.propTypes = {
    haveValidO2OProduct: PropTypes.string.isRequired,
    haveValidB2CProduct: PropTypes.string.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Freight);