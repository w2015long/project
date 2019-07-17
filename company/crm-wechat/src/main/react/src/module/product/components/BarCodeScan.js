import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Link} from "react-router-dom";
import "../style/BarCodeScan.css";
import {getCart, scanChangeItemQuantity} from "../../cart/actions/normalCartAction";
import {findProductScanInfo} from "../actions/productActions";
import {initJsSdk} from "../../common/actions/jssdkAction";
import saotiaomao from "../../../media/images/saotiaomao.png";
import jiagouwuche from "../../../media/images/jiagouwuche.png";
import weixinzhifu from "../../../media/images/weixinzhifu.png";
import tiquma from "../../../media/images/tiquma.png";
import banyaun from "../../../media/images/banyaun.png";
import saomaluru from "../../../media/images/saomaluru.png";
import gouwuche3 from "../../../media/images/gouwuche3.png";
import shoudonshuru from "../../../media/images/shoudonshuru.png";


// 扫码购物
class BarCodeScan extends Component {
    state = {
        continuous: "N", // 是否连续扫码
        isShowMsg: false, // 是否显示消息框
        msg: "",// 消息框内容
    };


    componentWillMount() {
        document.title = "扫码购物";
        let self = this;
        let continuous = window.getCookie("continuous");
        if (continuous && continuous === "Y") {
            self.setState({continuous: continuous});
        } else {
            self.setState({continuous: "N"});
            window.setCookie("continuous", "N");
            continuous = "N";
        }
        self.props.actions.getCart();//获取购物车
    }

    // 加入购物车
    addCart(barCode, continuous) {
        let self = this;
        // 后台查询该条形码的商品信息
        self.props.actions.findProductScanInfo(barCode, function (res) {
            // 如果是非处方则允许加入购物车
            if (res.medicinalTypeCode && res.medicinalTypeCode !== "RX") {
                self.addToCart(res.skuId, function () {
                    // 成功
                    self.showTip("成功加入购物车");
                    setTimeout(function () {
                        // 是否开启连续
                        if (continuous === "Y") {
                            self.scanCode();
                        }
                    },2000);
                }, function (err) {
                    self.showTip("无法加入购物车");
                });
            } else {
                self.showTip("处方药请联系店员");
            }
        });
    }

    /**
     * 消息框显示
     */
    showTip(msg) {
        let self = this;
        self.setState({
            isShowMsg: true, // 是否显示消息框
            msg: msg,// 消息框内容
        });
        setTimeout(function () {
            self.setState({
                isShowMsg: false, // 是否显示消息框
                msg: "",// 消息框内容
            });
        }, 2000);
    }


    /**
     * 加入购物车
     */
    addToCart(skuId, callbackFunc, failCallback) {
        //购物车商品增加
        this.props.actions.scanChangeItemQuantity(skuId, callbackFunc, failCallback);
    }

    // 扫码
    scanCode() {
        let self = this;
        initJsSdk(
            () => {
                console.log("初始化成功")
            },
            () => {
                console.log("初始化失败")
            }, {
                scanAnccCode: true, successFun: function (result) {
                    let continuous = window.getCookie("continuous");
                    if (continuous !== "Y") {
                        continuous = "N";
                    }
                    self.addCart(result, continuous);
                }
            }
        )
    }

    getCartTotalProductQuantity() {
        let quantity = 0;
        let items = this.props.normalCartState.normalCart.cartItemList || [];
        for (let item of items) {
            quantity += item.quantity;
        }
        return quantity;
    }

    // 连续扫码开关控制
    continuousSwitch(event) {
        let continuous = this.state.continuous;
        this.setState({continuous: continuous === "Y" ? "N" : "Y"});
        window.setCookie("continuous", continuous === "Y" ? "N" : "Y");
    }

    // 跳到手动输入
    toManualInputPage() {
        this.props.history.push('/scan/barCodeManualInput');
    }

    render() {
        let self = this;
        let {normalCart} = this.props.normalCartState;
        let continuous = this.state.continuous;
        return (
            <div className="bar_code_scan">
                <div className="code_main">
                    <div className="top">
                        <h5>扫码购物流程</h5>
                        <div className="items_list">
                            <div className="items">
                                <div className="i_pic">
                                    <img src={saotiaomao} alt=""/>
                                </div>
                                <div className="i_text">
                                    <p>扫一扫</p>
                                    <p>商品条码</p>
                                </div>
                            </div>

                            <div className="items">
                                <div className="i_pic">
                                    <img src={jiagouwuche} alt=""/>
                                </div>
                                <div className="i_text">
                                    <p>加购物车</p>
                                </div>
                            </div>

                            <div className="items">
                                <div className="i_pic">
                                    <img src={weixinzhifu} alt=""/>
                                </div>
                                <div className="i_text">
                                    <p> 微信支付</p>
                                </div>
                            </div>

                            <div className="items">
                                <div className="i_pic">
                                    <img src={tiquma} alt=""/>
                                </div>
                                <div className="i_text">
                                    <p>凭提取码</p>
                                    <p>门店取货</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb">
                        <div className="bg_pic">
                            <img src={banyaun} alt=""/>
                        </div>
                        <div className="mb-cont" onClick={() => {
                            this.scanCode()
                        }}>
                            <div className="saoma_pic">
                                <img src={saomaluru} alt=""/>
                            </div>
                        </div>
                        <div className="mb_tab">
                            <div className="tab_list">
                                <div className="items">
                                    <div className="switcher" onClick={() => {
                                        self.continuousSwitch()
                                    }}>
                                        <a type="checkbox" name={continuous === "Y" ? "checked" : ""}
                                           className="input-box2" onClick={() => {
                                            self.continuousSwitch()
                                        }}/>
                                        <span className="switch"><i></i></span>
                                    </div>
                                    <div className="_text">连续扫码</div>
                                </div>
                                <div className="items"><Link to={'/cart/normalCart'}>
                                    <div className="cart_icon act">
                                        <img src={gouwuche3} alt=""/>
                                        {this.getCartTotalProductQuantity() > 0 &&
                                        <span>{this.getCartTotalProductQuantity()}</span>}
                                    </div>
                                    <div className="_text">购物车</div>
                                </Link>
                                </div>
                                <div className="items" onClick={() => {
                                    this.toManualInputPage()
                                }}>
                                    <div className="hand_icon">
                                        <img src={shoudonshuru} alt=""/>
                                    </div>
                                    <div className="_text">手动输入</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={this.state.isShowMsg ? "succ_card" : ""}>{this.state.msg}</div>
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
        actions: bindActionCreators({getCart, findProductScanInfo, scanChangeItemQuantity,}, dispatch)
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(BarCodeScan);