/**
 * @author chencheng
 * @date 2018/3/29
 * 门店投诉
 */
import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import PicturesWall from "../../common/components/PicturesWall";

import "../style/ShopComplaint.css";

class ShopComplaint extends Component {
    state={
        files:[]
    };

    componentWillMount() {
        document.title = '投诉';
    }

    submit(){
        let memberName = this.refs.memberName.value.trim();
        if (!memberName){
            window.warningTip('请填写联系人');
            return;
        }
        let memberTel = this.refs.memberTel.value.trim();
        if (!memberTel){
            window.warningTip('请填写联系电话');
            return;
        }
        let mobileTest = /^1\d{10}$/;
        if (!mobileTest.test(memberTel)){
            window.warningTip('联系电话格式错误');
            return;
        }
        let complainContent = this.refs.complainContent.value.trim();
        if (!complainContent){
            window.warningTip('请填写投诉内容');
            return;
        }
        let fileIds = '';
        let files = this.state.files;
        for (let index=0,len=files.length; index < len; index++){
            if (index === (len-1)){
                fileIds += files[index].fileId;
            }else {
                fileIds += files[index].fileId + ',';
            }
        }

        let data = {
            shopId:this.props.match.params.shopId,
            memberName:memberName,
            memberTel:memberTel,
            complainContent:complainContent,
            fileIds:fileIds
        };
        this.doAdd(data);
    }

    doAdd(data){
        const self = this;
        const url = '/wap/shop/addComplaint';
        window.textFetch(
            url,
            {
                method:'post',
                body:JSON.stringify(data)
            },
            text => {
                window.successTip('投诉成功');
                setTimeout(function () {
                    self.refs.btnSubmit.disabled=false;
                    self.goBack();
                },2000);
            },
            err =>{
                self.refs.btnSubmit.disabled=false;
            }
        );
        self.refs.btnSubmit.disabled=true;
    }

    goBack(){
        this.props.history.goBack()
    }

    onFileUploadSuccess(file){
        let files = this.state.files;
        files.push(file);
        this.setState({files:files});
    }

    handleFileDelete(file){
        let files = this.state.files;
        for (let index=0,len=files.length; index<len; index++){
            if (files[index].fileId === file.fileId){
                files.splice(index, 1);
                this.setState({files:files});
                break;
            }
        }
    }

    render() {
        const {shopDetail} = this.props.shopDetailState;
        const uploadParams = {
            onSuccess:this.onFileUploadSuccess.bind(this),
            onRemove:this.handleFileDelete.bind(this),
            numberOfLimit:3,
            numberOfSize:10
        };
        return (
            <div className="shop-complaint">
                <div className="mt">
                    <span className="back" onClick={()=>this.goBack()}/>
                    <span>我要投诉</span>
                    <a className="sub-btn" onClick={()=>this.submit()} ref="btnSubmit">提交</a>
                </div>
                <div className="mc">
                    <div className="hold-div-top"/>
                    <div className="mc-top">
                        <div className="store-pic"><img src={shopDetail.wechatPhoto} alt=""/></div>
                        <div className="name elli">{shopDetail.name}</div>
                    </div>
                    <div className="mc-pic">
                        <h5>上传图片</h5>
                        <div className="pic-box">
                            <PicturesWall {...uploadParams}/>
                        </div>
                    </div>
                    <div className="mc-info">
                        <div className="item">
                            <div className="cell-hd">联系人</div>
                            <div className="cell-bd"><input ref='memberName' type="text" placeholder="填写联系人"/></div>
                        </div>
                        <div className="item">
                            <div className="cell-hd">联系电话</div>
                            <div className="cell-bd"><input ref='memberTel' type="number" placeholder="填写11位手机号码"/></div>
                        </div>
                        <div className="item">
                            <div className="cell-hd">内容</div>
                            <div className="cell-bd"><textarea ref='complainContent' name="" rows="3" placeholder="请输入投诉建议内容"/></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

ShopComplaint.propTypes = {
};

ShopComplaint.contextTypes = {
};

const mapStateToProps = (store, ownProps) => {
    return {
        shopDetailState:store.shopDetailState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({}, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopComplaint);