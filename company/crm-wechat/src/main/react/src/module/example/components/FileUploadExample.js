/**
 * @author chencheng
 * @date 2018/3/30
 * 文件上传例子
 */
import React, { Component } from 'react';
import FileUpload from '../../common/components/FileUpload';
import '../../shop/style/ShopComplaint.css'

class FileUploadExample extends Component {
    state={
        files:[]
    };

    onFileUploadSuccess(file){
        let files = this.state.files;
        files.push(file);
        this.setState({files:files});
    }

    handleFileDelete(fileId){
        let files = this.state.files;
        for (let index=0,len=files.length; index<len; index++){
            if (files[index].fileId === fileId){
                files.splice(index, 1);
                this.setState({files:files});
                break;
            }
        }
    }

    render() {
        const uploadParams = {
            onSuccess:this.onFileUploadSuccess.bind(this),
            show:this.state.files.length < 5,
            accept:'image',
            numberOfSize:2
        };
        return (
            <div className="shop-complaint">
                <div className="mc">
                    <div className="mc-pic">
                        <h5>上传图片</h5>
                        <div className="pic-box">
                            {
                                this.state.files.map(file=>{
                                    return (
                                        <div className="item" key={file.fileId}><img src={file.webUrl} alt=""/><span className="del-btn" onClick={()=>{this.handleFileDelete(file.fileId)}}/></div>
                                    )
                                })
                            }
                            <FileUpload {...uploadParams}><div className="item"><span className="add-btn"/></div></FileUpload>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default FileUploadExample