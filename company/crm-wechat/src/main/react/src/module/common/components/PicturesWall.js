/**
 * @author chencheng
 * @date 2018/3/30
 * 图片墙样式的上传组件
 *
 * 回调方法：
 * onSuccess(file)：file为刚上传成功的文件，主要包含字段fileName、fileId、webUrl
 * onRemove(file)：file为刚删除的文件，主要包含字段fileName、fileId、webUrl
 * 参数：
 * numberOfLimit：允许上传的图片数量，达到这个数量后上传按钮消失，默认最多3张图片
 * numberOfSize：允许上传的图片大小，单位MB，默认2MB
 * sign：同时引用多个上传组件的标志
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Upload, Icon, Modal} from 'antd';
import '../style/PicturesWall.css';
import {photoCompressToDataURL, dataURLToBlob} from '../../../util/photoCompress';

class PicturesWall extends Component {
    state = {
        previewVisible: false,
        previewSrc: '',
        previewName: '',
        fileList: [],
        doneFiles:[],
        sign:""
    };

    handleSuccess = (file) => {
        let response = file.response;
        if (!response || file.status !== 'done'){
            return;
        }

        let doneFiles = this.state.doneFiles;
        let doneFile = null;
        for (let dFile of doneFiles){
            if (dFile.uid === file.uid){
                doneFile = dFile;
                break;
            }
        }
        //新增完成文件
        if (null === doneFile){
            doneFile = {
                fileId:response.fileId,
                fileName:response.fileName,
                webUrl:response.webUrl,
                uid:file.uid
            };
            doneFiles.push(doneFile);
            this.setState({doneFiles});
            if (typeof this.props.onSuccess === "function") {
                this.props.onSuccess(this.props.sign?{sign:this.props.sign,file:doneFile}:this.props.sign === 0?{sign:this.props.sign,file:doneFile}: doneFile);
            }
        }
    };

    handleRemove = (file) => {
        let fileList = this.state.fileList;
        for (let index = 0, len = fileList.length; index < len; index++){
            if (fileList[index].uid === file.uid){
                fileList.splice(index,1);
                break;
            }
        }
        let doneFiles = this.state.doneFiles;
        for (let index = 0, len = doneFiles.length; index < len; index++){
            let doneFile = doneFiles[index];
            if (doneFile.uid === file.uid){
                doneFiles.splice(index,1);

                if (typeof this.props.onRemove === "function") {
                    this.props.onRemove(this.props.sign?{sign:this.props.sign,file:doneFile}:this.props.sign === 0?{sign:this.props.sign,file:doneFile}:doneFile);
                }
                break;
            }
        }
        this.setState({fileList:fileList, doneFiles:doneFiles});
    };

    handleError = (err) => {
        window.errorTip('上传异常：' + err);
    };

    handelBeforeUpload = (file, fileList) => {
        let fileType = file.type;
        if (!fileType || fileType.length < 1 ){
            window.errorTip('不支持的文件格式');
            return false;
        }

        const numberOfSize = this.props.numberOfSize || 2;//默认上传大小限制2MB
        const fileSize = file.size / 1024 / 1024;
        const isLimitSize = fileSize < numberOfSize;
        if (!isLimitSize) {
            window.warningTip('图片大小不能超过'+numberOfSize+"MB");
            return false;
        }

        return new Promise((resolve) => {
            let quality = 0.9;
            if (fileSize > 2){
                quality = 0.8
            }
            if (fileSize > 5){
                quality = 0.7
            }
            photoCompressToDataURL(file, quality, (base64)=>{
                //由于ios的原因，这里只能转成Blob对象，而不能直接转成File对象
                let blob = dataURLToBlob(base64);
                blob.uid = file.uid;
                blob.name = file.name;
                blob.lastModified = file.lastModified;
                blob.lastModifiedDate = file.lastModifiedDate;
                blob.webkitRelativePath = file.webkitRelativePath;
                blob.thumbUrl = base64;
                resolve(blob);
            });
        });
    };

    handlePreviewCancel = () => {
        this.setState({previewVisible: false});
    };

    handlePreview = (file) => {
        this.setState({
            previewName: file.name,
            previewSrc: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };

    handleChange = ({ file,fileList }) => {
        //由于ios的原因，上传时使用了Blob对象，所以这里需要手动把dataURL赋值一下
        for (let iFile of fileList){
            iFile.thumbUrl=iFile.originFileObj.thumbUrl;
        }
        file.thumbUrl=file.originFileObj.thumbUrl;
        if (file.status === 'done'){
            this.handleSuccess(file);
        }
        this.setState({fileList:fileList});
    };

    render() {
        const self = this;
        const numberOfLimit = this.props.numberOfLimit || 3;//默认最多上传三张图片
        const {previewVisible, previewName, previewSrc, fileList} = this.state;
        const params = {
            action: '/wap/file/uploadFile',
            accept:'image/*',
            listType: 'picture-card',
            multiple: false,
            supportServerRender:true,
            fileList: fileList,
            headers: {'Content-Types': 'multipart/form-data'},
            data(file){
                return {fileName:file.name}
            },
            onRemove(file) {
                self.handleRemove(file);
            },
            onError(err) {
                self.handleError(err);
            },
            beforeUpload(file, fileList) {
                return self.handelBeforeUpload(file, fileList);
            },
            onPreview(file) {
                self.handlePreview(file);
            },
            onChange(ret){
                self.handleChange(ret);
            }
        };

        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text"/>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload {...params}>
                    {fileList.length >= numberOfLimit ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handlePreviewCancel}>
                    <img alt={previewName} style={{width: '100%'}} src={previewSrc}/>
                </Modal>
            </div>
        );
    }
}

PicturesWall.propTypes = {
    onSuccess: PropTypes.func,
    onRemove: PropTypes.func,
    numberOfLimit: PropTypes.number,
    numberOfSize: PropTypes.number,
    sign:PropTypes.number
};
export default PicturesWall

