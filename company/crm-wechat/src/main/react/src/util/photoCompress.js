/**
 * @author chencheng
 * @date 2018/4/11
 * 图片压缩
 */


/**
 * 图片压缩
 * @param file 源文件
 * @param quality 压缩比率，默认压缩为原质量的0.7
 * @param callback 回调方法，图片压缩完成时会自动调用，含有参数压缩完成后的dataURL
 */
export function photoCompressToDataURL(file, quality=0.7, callback){
    let ready=new FileReader();
    /*开始读取指定的Blob对象或File对象中的内容. 当读取操作完成时,readyState属性的值会成为DONE,如果设置了onloadend事件处理程序,则调用之.同时,result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容.*/
    ready.readAsDataURL(file);
    ready.onload=()=>{
        canvasDataURL(ready.result, quality, callback);
    };
}

/**
 * 通过画布进行压缩
 * @param dataURL 读取到的原dataURL
 * @param quality 压缩比率，默认压缩为原质量的0.7
 * @param callback 回调方法，图片压缩完成时会自动调用，含有参数压缩完成后的dataURL
 */
export function canvasDataURL(dataURL, quality=0.7, callback){
    let img = new Image();
    img.src = dataURL;
    img.onload = ()=> {
        let width = img.width;
        let height = img.height;

        //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
        let ratio;
        if ((ratio = width * height / 4000000) > 1) {
            ratio = Math.sqrt(ratio);
            width /= ratio;
            height /= ratio;
        } else {
            ratio = 1;
        }
        //生成canvas
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;

        //铺底色
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //如果图片像素大于100万则使用瓦片绘制
        let count;
        if ((count = width * height / 1000000) > 1) {
            count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
            //计算每块瓦片的宽和高
            let nw = ~~(width / count);
            let nh = ~~(height / count);

            let tCanvas = document.createElement('canvas');
            let tctx = canvas.getContext('2d');
            tCanvas.width = nw;
            tCanvas.height = nh;

            for (let i = 0; i < count; i++) {
                for (let j = 0; j < count; j++) {
                    tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, i*nw, j*nh, nw, nh);
                    ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
                }
            }
        } else {
            ctx.drawImage(img, 0, 0, width, height);
        }

        // quality值越小，所绘制出的图像越模糊，默认图片质量为0.7
        let base64 = canvas.toDataURL("image/jpeg", quality);
        if (typeof callback === "function"){
            callback(base64);
        }
    }
}

/**
 * dataURL数据转成File对象
 * @param dataURL dataURL数据
 * @param filename 文件名称
 * @returns {File} 转换后的File文件
 */
export function dataURLToFile(dataURL, filename) {
    let arr = dataURL.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

/**
 * dataURL数据转成Blob对象
 * @param dataURL dataURL数据
 * @returns {Blob} 转换后的Blob对象
 */
export function dataURLToBlob(dataURL){
    let arr = dataURL.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}