/**
 * @author chencheng
 * @date 2018/3/30
 * 文件上传组件
 *
 * 回调方法：
 * onSuccess(file)：file为刚上传成功的文件，主要包含字段fileName、fileId、webUrl
 * 参数：
 * numberOfSize：允许上传的文件大小，单位MB，默认2MB
 * show：是否显示上传按钮，true/false
 * accept：允许上传的文件类型 image-图片、text-文本、audio-音频、video-视频、other-其他
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Upload from 'rc-upload';

class FileUpload extends Component {

    handleSuccess = (ret) => {
        if (typeof this.props.onSuccess === "function") {
            this.props.onSuccess(ret);
        }
    };

    handleError = (err) => {
        window.errorTip('上传异常：' + err);
    };

    handelBeforeUpload = (file, fileList, accept) => {
        let fileType = file.type;
        if (!fileType || fileType.length < 1 ){
            window.errorTip('不支持的文件格式');
            return false;
        }

        const numberOfSize = this.props.numberOfSize || 2;//默认上传大小限制2MB
        const isLimitSize = file.size / 1024 / 1024 < numberOfSize;
        if (!isLimitSize) {
            window.errorTip('文件大小不能超过'+numberOfSize+"MB");
            return false;
        }
        return true;
    };

    getAccept = (accept)=>{
        if (accept === 'image'){
            return 'image/*';
        }
        if (accept === 'text'){
            return 'text/*';
        }
        if (accept === 'audio'){
            return 'audio/*';
        }
        if (accept === 'video'){
            return 'video/*';
        }
        return '*/*';
    };

    render() {
        const self = this;
        const accept = this.getAccept(this.props.accept);
        const params = {
            action: '/wap/file/uploadFile',
            accept:accept,
            multiple: false,
            onSuccess(ret) {
                self.handleSuccess(ret);
            },
            onError(err) {
                self.handleError(err);
            },
            beforeUpload(file, fileList) {
                return self.handelBeforeUpload(file, fileList, accept);
            }
        };
        if (this.props.show === false){
            return null;
        }
        return (
            <Upload {...params}>
                {this.props.children}
            </Upload>
        );
    }
}

FileUpload.propTypes = {
    onSuccess: PropTypes.func.isRequired,
    numberOfSize: PropTypes.number,
    show: PropTypes.bool.isRequired,
    accept: PropTypes.string.isRequired
};
export default FileUpload

