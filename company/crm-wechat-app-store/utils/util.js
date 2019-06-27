const token = "TOKEN";

//开发时也可以用localhost或者改成自己的ip地址,但是不要提交
const webRoot = "https://s.gdjkyf.com/xcx/clerk/";

const formatTime = date => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
};
const formatDay = date => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return [year, month, day].map(formatNumber).join('-')
};

const formatNumber = n => {
    n = n.toString();
    return n[1] ? n : '0' + n
};

/**
 * 提示框
 * @param title 提示的内容（必填）
 * @param icon  图标,默认值是 'success' (可选值有 loading，success，none)
 */
const showToast = (title, icon = "success") => {
    wx.showToast({
        title: title,
        icon: icon,
        duration: 1500
    });
};

/**
 * 模态框
 * @param title 标题，不需要则传null,默认值为‘提示’ 必填
 * @param content 提示的消息 必填
 * @param confirmFun 确认回调 非必填
 * @param cancelFun  取消回调 非必填
 *
 */
const showModal = (title, content, confirmFun, cancelFun) => {
    wx.showModal({
        title: title ? title : "提示",
        content: content,
        success: function (res) {
            if (res.confirm) {
                if (typeof confirmFun === 'function') {
                    confirmFun();
                }
            } else if (res.cancel) {
                if (typeof cancelFun === 'function') {
                    cancelFun();
                }
            }
        }
    })
};

/**
 * 确认提示框
 * @param title
 * @param content
 */
const showConfirm = (title, content) => {
    wx.showModal({
        title: title ? title : "提示",
        content: content,
        showCancel: false,
        confirmColor: '#007aff'
    })
};

/**
 * 发起请求
 * @param init 请求配置
 * @param success 业务成功回调
 * @param fail 业务异常回调
 * @param complete 请求
 */
const doRequest = (init = {}, success, fail, complete) => {
    init = initParam(init);
    init = Object.assign({}, init, {
        success: function (res) {
            if (res.statusCode !== 200) {
                handlerError(res, fail, () => {
                    doRequest(Object.assign({}, init, {
                        url: init.url.split(webRoot)[1]
                    }), success, fail, complete);
                });
                return;
            }
            if (typeof success === 'function') {
                success(res);
            }
        },
        fail: function () {
            //发起请求失败了,这里要进行友好提示
            showToast("请求数据失败了", "none")
        },
        complete: function () {
            //请求成功或者失败都会执行
            if (typeof complete === 'function') {
                complete();
            }
        }
    });
    wx.request(init);
};

/**
 * 全局异常处理
 * @param res
 * @param failFun
 * @param loginSuccessCallBack 登录成功,继续执行刚刚的方法
 */
function handlerError(res, failFun, loginSuccessCallBack) {
    //本地没有token或者服务器缓存没有该token的键值对(通常是服务器重启了,缓存没有了),重新发起自动登录
    if (res.data && res.data.message === "店员未登录") {
        autoLogin(loginSuccessCallBack, wx.getStorageSync(token));//自动登录
        return;
    }

    if (res.data && res.data.errMsg === "XCX_CLERK店员从未登录过") {
        showToast(res.data.errMsg, "none");
        return;
    }

    //如果有自定义的异常处理,则只处理自定义的就返回。
    if (typeof failFun === 'function') {
        failFun(res);
        return;
    }
    //自定义的业务异常
    if (res.data && res.data.hasException) {
        showToast(res.data.errMsg, "none");
    }
    //其他异常
    if (res.data && res.data.message) {
        showToast(res.data.message, "none");
    }
}

/**
 * 检查自动登录状态
 */
const checkLogin = (callBack) => {
    console.log("检查自动登录状态开始");
    //获取本地缓存token
    let localToken = wx.getStorageSync(token);
    //本地没token,发起自动登录
    if (!localToken) {
        console.log("本地没token,发起自动登录");
        autoLogin(callBack, "");
    } else {
        //token是否过期,有token的情况下默认为没过期,通过调用wx.checkSession判断是否在有效期内
        wx.checkSession({
            success: function () {
                if (typeof callBack === 'function') {
                    console.log("token没过期  允许请求");
                    callBack();
                }
            },
            fail: function () {
                console.log("token已经过期,重新登录后，要在服务器缓存中清除掉旧的用户登录信息");
                autoLogin(callBack, localToken);
            }
        });
    }
};

/**
 * 自动登录,并且更新授权token
 * @param callback 回调方法
 * @param oldToken 过期的token
 */
function autoLogin(callback, oldToken) {
    wx.login({
        success: function (res) {
            if (res.code) {
                wx.request({
                    url: webRoot + "user/login/auto?code=" + res.code + "&inValidToken=" + oldToken,
                    success: function (res) {
                        if (res.statusCode === 200) {//自动登录成功
                            console.log("自动登录成功,token为" + res.data);
                            wx.setStorageSync(token, res.data);
                            showToast("自动登录成功");
                            if (typeof callback === 'function') {
                                callback();
                            }
                        } else if (res.statusCode === 500) {
                            if (res.data && res.data.errMsg === "XCX_CLERK店员从未登录过") {
                                wx.redirectTo({
                                    url: '/pages/user/login/login',
                                    fail: function () {
                                        console.log("跳转到登录页面失败");
                                    }
                                })
                            }
                        }else{
                            console.log("自动登录失败:");
                            console.log(res);
                        }
                  }
                })
            }
      },
      fail: function () {
        console.log("在微信页面未拿到授权code");
      }
    });
}


/**
 * 拿到请求的sessionId
 * @param res
 * @returns {string}
 */
const getResHeadSessionId = (res) => {
    let header = res.header;
    let sessionId = JSON.stringify(header).split("JSESSIONID=")[1].substr(0, 32);
    console.log("本次请求的sessionId:" + sessionId);
    return sessionId;
};

/**
 * 跳转到只对登录用户开放的页面
 * @param url
 * @param successCallBack
 * @param failCallBack
 * @param complete
 */
const privateNavigateTo = (url, successCallBack, failCallBack, complete) => {
    checkLogin(function () {
        wx.navigateTo({
            url: url
        })
    })
};

/**
 * 跳转到开放页面
 * @param url
 * @param successCallBack
 * @param failCallBack
 * @param complete
 */
const publicNavigateTo = (url, successCallBack, failCallBack, complete) => {
    wx.navigateTo({
        url: url,
    })
};

/**
 * 重定向到只对登录用户开放的页面
 * @param url
 * @param successCallBack
 * @param failCallBack
 * @param complete
 */
const privateRedirectTo = (url, successCallBack, failCallBack, complete) => {
    checkLogin(function () {
        wx.redirectTo({
            url: url
        })
    })
};

/**
 * 重定向到开放页面
 * @param url
 * @param successCallBack
 * @param failCallBack
 * @param complete
 */
const publicRedirectTo = (url, successCallBack, failCallBack, complete) => {
    wx.redirectTo({
        url: url,
    })
};

/**
 * 配置请求参数
 * @param init
 * @returns {*}
 */
function initParam(init) {
    init = Object.assign({}, init, {
        url: webRoot + init.url,
        header: {
            'token': wx.getStorageSync(token)
        }
    });
    return init;
}

/**
 * 比较开始时间是否大于结束时间(不能处理日期)
 * 如8:00 12:00  return false
 */
function compareTime(startTime, endTime) {
    let startTimes = startTime.split(":");
    let endTimes = endTime.split(":");
    if (parseInt(startTimes[0]) > parseInt(endTimes[0])) {
        return true;
    } else if (parseInt(startTimes[0]) === parseInt(endTimes[0])) {
        if (parseInt(startTimes[1]) >= parseInt(endTimes[1])) {
            return true;
        }
    }
    return false;
}

function inArray(arr, key, val) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][key] === val) {
            return i
        }
    }
    return -1
}

// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
    const hexArr = Array.prototype.map.call(
        new Uint8Array(buffer),
        function (bit) {
            return ('00' + bit.toString(16)).slice(-2)
        }
    );
    return hexArr.join(',')
}
// 将str转换为ArrayBuff并写入打印机
function str2ab(str) {
    let buffer = new ArrayBuffer(str.length);
    let dataView = new DataView(buffer);
    for (let i = 0; i < str.length; i++) {
        dataView.setUint8(i, str.charAt(i).charCodeAt(0))
    }
    return buffer;
}

// 上传图片到服务器
function uploadFile(filePath,successCallBack=()=>{}) {
    const self = this;
    wx.uploadFile({
        url: webRoot + "file/uploadFile",
        filePath: filePath,
        name: 'file',
        header: {
            'token': wx.getStorageSync(token)
        },
        formData: {
            'user': 'test'
        },
        success: function (res) {
            let data = JSON.parse(res.data);
            if (res.statusCode !== 200) {
                showConfirm(null,"上传图片失败，请稍后再试!");
                return;
            }
            successCallBack(data.fileId);
        },
        fail: function (err) {
            showConfirm(null,"上传图片失败，请稍后再试!");
            console.log(err)
        }
    })
}

module.exports = {
    formatTime: formatTime,
    formatDay: formatDay,
    showToast: showToast,
    doRequest: doRequest,
    showModal: showModal,
    showConfirm: showConfirm,
    webRoot: webRoot,
    token: token,
    privateNavigateTo: privateNavigateTo,
    checkLogin: checkLogin,
    publicNavigateTo: publicNavigateTo,
    publicRedirectTo: publicRedirectTo,
    compareTime: compareTime,
    privateRedirectTo: privateRedirectTo,
    inArray:inArray,
    ab2hex:ab2hex,
    str2ab:str2ab,
    uploadFile:uploadFile
};
