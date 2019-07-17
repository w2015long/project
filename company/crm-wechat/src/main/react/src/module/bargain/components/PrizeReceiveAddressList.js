/**
 * 再砍详情
 * Created by liezihao on 2018/12/29
 */
// 引入react组件
import React, {Component} from 'react';
// 引入方法
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import '../style/againBargainReceive.css';
import {getBargainAddressList} from "../../bargain/actions/bargainAddressAction";
import {getBargainActivityInfo} from "../actions/bargainAction";
import {saveMutualBargainShareRecord} from "../actions/bargainActivityAction";
import Prompt from "../../common/components/PromptLayer";
class PrizeReceiveAddressList extends Component {

    state = {
        backShowModal: false,
    };

    //在组件首次渲染之前调用，这时候DOM节点已经首次加载完成。整个生命周期只会执行一次
    componentWillMount() {

        document.title = '再砍详情';
        const {mutualBargainActivityId, mutualBargainShareRecordId} = this.props.match.params;
        if (!(this.props.bargainAddressState && this.props.bargainAddressState.addressList && this.props.bargainAddressState.addressList.length > 0)) {
            this.props.actions.getBargainAddressList(mutualBargainActivityId, mutualBargainShareRecordId);
        }
        if (!(this.props.bargainState && this.props.bargainState.bargainActivityInfo)) {
            this.props.actions.getBargainActivityInfo({mutualBargainShareRecordId: mutualBargainShareRecordId});
        }
    }

    componentWillUnmount() {
        this.setState({backShowModal: true});
    }

    //保存分享者记录
    saveMutualBargainShareRecord(mutualBargainActivityId, activityProductId) {
        let self = this;
        this.props.actions.saveMutualBargainShareRecord(mutualBargainActivityId, activityProductId, (mutualBargainShareRecordId) => {
            self.toBarCodeScan(mutualBargainShareRecordId)
        });
    }

    toBarCodeScan(mutualBargainShareRecordId) {
        this.props.history.push('/bargain/mutualBargain/' + mutualBargainShareRecordId);
    }
    render() {
        let _this = this;
        const {addressList} = this.props.bargainAddressState;
        const {bargainActivityInfo} = this.props.bargainState;
        return (
            <div className="againBargainDetails">
                <Prompt msg={"亲~是否为您需要发起砍价"} successFunc={() =>{ _this.saveMutualBargainShareRecord(bargainActivityInfo.mutualBargainActivityId, bargainActivityInfo.productId)}}  />
                <div className="bargaining-details-main">
                    <div className="top_text">
                        <div className="title">领礼品再砍一次</div>
                        <div className="process">
                            <span className="cur">1.去到领取地点</span>
                            <span className="cur">2.领取礼品</span>
                            <span>3.再砍一次</span>
                        </div>
                    </div>
                    {
                        addressList && bargainActivityInfo &&
                        <div className="gift">
                            <div className="gift_item">
                                <div className="g_title">当前礼品</div>
                                <div className="gift_list">
                                    <div className="list_item">
                                        <div className="list_pic">
                                            <img src={bargainActivityInfo.boostPrizePic} alt={'奖品图'}/>
                                        </div>
                                        <div className="list_text">{bargainActivityInfo.boostPrizeNm}</div>
                                    </div>
                                </div>
                                <div className="Pick_up_address">
                                    <div className="add_title">领取地址</div>
                                    <div className="address_list">
                                        {
                                            addressList.map((address, index) => {
                                                return (
                                                    <div className="add_item" key={index}>
                                                        <div
                                                            className="add_item_l">{address.activityArea + address.activitySite}</div>
                                                        <div className="add_item_r"><a
                                                            href={'tel:' + address.managerTel}>联系我们</a></div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    <div className="footer">
                        {
                            bargainActivityInfo && "Y" === bargainActivityInfo.isReceived ?
                                <div className="footer_item">你已领取,成功为好友砍下第二刀</div>
                                :
                                <div className="footer_item">领取后再砍</div>
                        }
                    </div>
                </div>
                {
                    bargainActivityInfo && this.state.backShowModal &&
                    <div className="elastic_layer">
                        <div className="layer_item2">
                            <div className="layer_pic">
                                <img src={bargainActivityInfo.productMainPic}  alt={'奖品图'}/>
                                <div className="tips_text">砍后{bargainActivityInfo.activityPriceDouble}元</div>
                            </div>
                            <h5>亲~您需要发起砍价？</h5>
                            <p>
                                <span onClick={() => this.props.history.goBack()}>直接返回</span>
                                <span className="cur"
                                      onClick={() => _this.saveMutualBargainShareRecord(bargainActivityInfo.mutualBargainActivityId, bargainActivityInfo.productId)}>立即参与</span>
                            </p>
                        </div>
                    </div>
                }

            </div>
        )
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        bargainAddressState: store.bargainAddressState,
        bargainState: store.bargainState
    }
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            getBargainAddressList,
            getBargainActivityInfo,
            saveMutualBargainShareRecord
            }, dispatch)
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(PrizeReceiveAddressList);
