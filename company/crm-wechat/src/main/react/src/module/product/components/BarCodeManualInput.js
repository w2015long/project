import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Link} from "react-router-dom";
import "../style/BarCodeManualInput.css";
import tiaoxin from "../../../media/images/tiaoxin.png";
import {findProductScanInfo} from "../actions/productActions";
import {getCart, scanChangeItemQuantity} from "../../cart/actions/normalCartAction";


// 扫码购物
class BarCodeManualInput extends Component {
    state = {
        opacity: false // 按钮样式 1  与  0.5
    };


    componentWillMount() {
        document.title = "扫码购物";
        let self = this;
        self.props.actions.getCart();//获取购物车
    }

    // 输入
    inputContent() {
        let barCode = this.refs.barCode.value;
        this.setState({opacity: barCode.length > 0});
    }

    // 校验并跳转
    execute() {
        let barCode = this.refs.barCode.value;
        if (!barCode) {
            window.errorTip("输入内容不能为空!");
            return;
        }
        if (barCode.length > 20) {
            window.errorTip("请输入正确的条形码!");
            return;
        }
        // 加入购物车
        this.addCart(barCode);
    }

    // 加入购物车
    addCart(barCode) {
        let self = this;
        // 后台查询该条形码的商品信息
        self.props.actions.findProductScanInfo(barCode, function (res) {
            // 如果是非处方则允许加入购物车
            if (res.medicinalTypeCode && res.medicinalTypeCode !== "RX") {
                self.props.actions.scanChangeItemQuantity(res.skuId, function () {
                    // 成功
                    window.successTip("成功加入购物车");
                    setTimeout(function () {
                        self.props.history.push('/scan/barCodeScan');// 转到快速买单
                    }, 2000);
                });
            } else {
                window.successTip("处方药请联系店员");
            }
        });
    }

    render() {
        let self = this;
        return (
            <div className="bar_code_manual_input">
                <div className="enter_main">
                    <div className="barcode_pic">
                        <img src={tiaoxin} alt=""/>
                    </div>
                    <div className="code_input">
                        <span>条形码</span>
                        <input type="text" ref={'barCode'} className="ininput" placeholder="请输入条形码" onChange={() => {
                            this.inputContent()
                        }}/>
                    </div>
                    <a onClick={() => {
                        this.execute()
                    }} className="determine_btn" style={{opacity: this.state.opacity ? "1" : "0.5"}}>确定</a>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        normalCartState: store.normalCartState
    }
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({getCart, findProductScanInfo, scanChangeItemQuantity}, dispatch)
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(BarCodeManualInput);