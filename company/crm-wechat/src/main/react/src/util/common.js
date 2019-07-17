/**
 * @author chencheng
 * @date 2018/3/19
 * 这里定义公用的全局函数，一些使用较少的方法不要定义在这里
 * 定义格式：window.xxx = () =>{}
 * 使用格式：window.xxx()
 */

/**
 * 对fetch的一个二次封装，注意这里写了jsonFetch（接口返回json类型的数据）、textFetch（接口返回文本，或者无返回数据），根据接口返回值类型选择不同的方法
 * 1、让大家写尽量少的代码就可以发起一个服务请求
 * 2、对请求过程发生的任何错误做一个统一的处理
 * @param url 请求的url
 * @param init fetch API 原生的配置，常用参数如下：
method: 'POST',
headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
},
body: JSON.stringify({
    firstParam: 'yourValue',
    secondParam: 'secondValue',
})
 * @param successCallback 请求成功时的回调，会带有一个json参数，json参数对应controller返回的对象。回调格式：successCallback(json)
 * @param errorCallback 请求失败时的回调，会带有一个error参数，error参数对应本次的错误信息。回调格式：errorCallback(error)
 *                        一般情况下，不需要自己处理错误。当然有时候想要在发生错误时执行一些操作，则可以提供该回调方法即可。
 *                        并且在errorCallback方法中return false 则可以阻止默认的错误弹窗操作，但是除非你进行了一些其他友好的提示，否则绝对不允许隐藏掉错误！！！
 */
window.jsonFetch = (url, init = {}, successCallback, errorCallback) => {
    init = fetchInit(init);
    doFetch(url, init)
        .then(
            json => {
                if (typeof json !== "object") {
                    throw (json);
                }
                if (json.hasException === true) {
                    throw (json);
                }
                if (json.status && json.status !== 200) {
                    throw (json);
                }
                if (typeof successCallback === 'function') {
                    successCallback(json);
                }
            }
        )
        .catch(
            errorMsg => {
                fetchError(errorMsg, errorCallback)
            }
        )
};

window.textFetch = (url, init = {}, successCallback, errorCallback) => {
    init = fetchInit(init);
    doFetch(url, init)
        .then(
            json => {
                if (typeof json === "object") {
                    if (json.hasException === true) {
                        throw (json);
                    }
                    if (json.status && json.status !== 200) {
                        throw (json);
                    }
                }

                if (typeof successCallback === 'function') {
                    successCallback(json);
                }
            }
        )
        .catch(
            errorMsg => {
                fetchError(errorMsg, errorCallback)
            }
        )
};

function fetchInit(init) {
    init = Object.assign({}, {credentials: 'include'}, init);
    if (init.method === 'POST' || init.method === 'post') {
        init = Object.assign(
            {},
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            },
            init
        );
    }
    return init;
}

function doFetch(url, init) {
    return fetch(url, init)
        .then(
            response => {
                return response.text();
            }
        )
        .then(
            text => {
                try {
                    return JSON.parse(text);
                } catch (error) {
                    return text;
                }
            }
        );
}
function fetchError(err, errorCallback) {
    let showError = true;
    if (typeof errorCallback === 'function') {
        if (errorCallback(err) === false) {
            showError = false
        }
    }
    if (showError) {
        if (typeof err === "string") {
            window.errorTip(err);
        }else if (typeof err === "object"){
            if (err.errMsg){
                window.errorTip(err.errMsg);
                return;
            }
             if (err.message){
                window.errorTip(err.message);
                 return;
            }
            if (err.error){
                window.errorTip(err.error);
            }
        }
    }
}

/**
 * 三种不会自动消失的消息提示，需要用户手动点击关闭
 * 操作成功用success，操作失败用error，提示用warning
 * @param msg 消息
 * @param title 自定义标题，可空，默认：温馨提醒
 */
window.notification.config({
    placement: 'topRight',//弹出位置，可选 topLeft topRight bottomLeft bottomRight
    top: 50,//消息从顶部弹出时，距离顶部的位置，单位像素。
    bottom: 50,//消息从底部弹出时，距离底部的位置，单位像素。
    duration: 0,//默认 4.5 秒后自动关闭，配置为 0 则不自动关闭
});
window.successAlert = (msg, title)=>{
    notification('success',msg,title);
};
window.errorAlert = (msg, title)=>{
    notification('error',msg,title);
};
window.warningAlert = (msg, title)=>{
    notification('warning',msg,title);
};
function notification(type, msg, title){
    const args = {
        message: title || '温馨提醒',
        description: msg,
    };
    window.notification[type](args);
}

/**
 * 三种没有按钮的消息提示，2秒后自动消失
 * 操作成功用success，操作失败用error，验证等提示用warning
 * @param msg 消息
 */
window.message.config({
    top:window.innerHeight/2-50,//居中显示
    duration: 2//两秒自动消失
});
window.successTip = (msg) => {
    window.message.success(msg);
};
window.errorTip = (msg) => {
    window.message.error(msg);
};
window.warningTip = (msg) => {
    window.message.warning(msg);
};

/**
 * 显示一个对话框，有确认、取消按钮
 * 当需要用户选择确认或取消时用
 * @param msg 对话内容
 * @param okCallback 确认按钮回调事件，默认关闭弹层
 * @param cancelCallback 取消按钮回调事件，可空，默认关闭弹层
 * @param okBtnLabel 自定义确认按钮文字，可空，默认：确认
 * @param cancelBtnLabel 自定义取消按钮文字，可空，默认：取消
 */
window.showConfirm = (msg, okCallback, cancelCallback, okBtnLabel='确认', cancelBtnLabel='取消') => {
    window.modalConfirm({
        title: msg,
        content: '',
        iconType:'',
        okText: okBtnLabel,
        cancelText: cancelBtnLabel,
        onOk() {
            return new Promise((resolve, reject) => {
                if (typeof okCallback === 'function'){
                    if (okCallback() === false){
                        reject();
                    }
                }
                resolve();
            }).catch(() => window.errorTip('系统异常'));
        },
        onCancel() {
            if (typeof cancelCallback === 'function'){
                cancelCallback();
            }
        },
    });
};


/**
 * 数组或者对象深拷贝
 */
window.objDeepCopy = (source) =>{
    if (!source){
        return null;
    }

    let sourceCopy = source instanceof Array ? [] : {};
    for (let item in source) {
        if (source.hasOwnProperty(item)) {
            sourceCopy[item] = typeof source[item] === 'object' ? window.objDeepCopy(source[item]) : source[item];
        }
    }

    return sourceCopy;
};


//去除字符串两边的空白
String.prototype.trim=function(){
    return this.replace(/(^\s*)|(\s*$)/g, "");
};

//只去除字符串左边空白
String.prototype.ltrim=function(){
    return this.replace(/(^\s*)/g,"");
};

//只去除字符串右边空白
String.prototype.rtrim=function(){
    return this.replace(/(\s*$)/g,"");

};


//创建cookie
window.setCookie = (name, value) => {
    var cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    document.cookie = cookieText;
};

//获取cookie
window.getCookie = (name) => {
    var cookieName = encodeURIComponent(name) + '=';
    var cookieStart = document.cookie.indexOf(cookieName);
    var cookieValue = null;
    if (cookieStart > -1) {
        var cookieEnd = document.cookie.indexOf(';', cookieStart);
        if (cookieEnd == -1) {
            cookieEnd = document.cookie.length;
        }
        cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
    }
    return cookieValue;
};

//删除cookie
window.unsetCookie = (name) => {
    document.cookie = name + "= ; expires=" + new Date(0);
};

export function isJSON(str) {
    if (typeof str == 'string') {
        try {
            var obj=JSON.parse(str);
            if(typeof obj == 'object' && obj ){
                return true;
            }else{
                return false;
            }

        } catch(e) {
            console.log('error：'+str+'!!!'+e);
            return false;
        }
    }
    console.log('It is not a string!')
}