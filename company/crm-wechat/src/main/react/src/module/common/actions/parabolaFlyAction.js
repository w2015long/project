/**
 * @author chencheng
 * @date 2018/6/4
 * 抛物线飞行，主要用于加入购物车动画
 */


var myParabolaFly;
var myTarget;
export function parabolaFly(clickEvent, target, imgUrl) {
    let flyElement = document.getElementById('parabolaFlyItem');
    flyElement.src=imgUrl;
    flyElement.style.left = clickEvent.clientX +  "px";
    flyElement.style.top = clickEvent.clientY +  "px";
    flyElement.style.visibility = "visible";

    if (!myParabolaFly || myTarget !== target) {
        myTarget = target;
        myParabolaFly = initParabolaFly(
            flyElement,
            target,
            {
                speed: 100,
                curvature: 0.01
            }
        );
    }

    myParabolaFly.position().move();
}


export function initParabolaFly(element, target, options) {
    //兼容检查
    checkRequestAnimationFrame();
    //默认配置
    let defaults = {
        speed: 166.67, // 每帧移动的像素大小，每帧（对于大部分显示屏）大约16~17毫秒
        curvature: 0.009,  // 实际指焦点到准线的距离，你可以抽象成曲率，这里模拟扔物体的抛物线，因此是开口向下的
        progress: function () {
        },
        complete: function () {
        }
    };
    //合并配置：自定义配置覆盖默认配置
    let params = {};
    options = options || {};
    for (let key in defaults) {
        params[key] = options[key] || defaults[key];
    }
    //对外的方法
    let exports = {
        mark: function () {
            return this;
        },
        position: function () {
            return this;
        },
        move: function () {
            return this;
        },
        init: function () {
            return this;
        }
    };

    /* 确定移动的方式
     * IE6-IE8 是margin位移
     * IE9+使用transform
    */
    let moveStyle = "margin", testDiv = document.createElement("div");
    if ("oninput" in testDiv) {
        ["", "ms", "webkit"].forEach(function (prefix) {
            let transform = prefix + (prefix ? "T" : "t") + "ransform";
            if (transform in testDiv.style) {
                moveStyle = transform;
            }
        });
    }

    /**
     * 根据两点坐标以及曲率确定运动曲线函数（也就是确定a, b的值）
     * 公式： y = a*x*x + b*x + c;
     */
    let a = params.curvature, b = 0;
    // 是否执行运动的标志量
    let flagMove = true;
    if (element && target && element.nodeType === 1 && target.nodeType === 1) {
        let rectElement = {}, rectTarget = {};
        // 移动元素的中心点位置，目标元素的中心点位置
        let centerElement = {}, centerTarget = {};
        // 目标元素的坐标位置
        let coordElement = {}, coordTarget = {};
        // 标注当前元素的坐标
        exports.mark = function () {
            if (flagMove === false) return this;
            if (typeof coordElement.x === "undefined") this.position();
            element.setAttribute("data-center", [coordElement.x, coordElement.y].join());
            target.setAttribute("data-center", [coordTarget.x, coordTarget.y].join());
            return this;
        };

        exports.position = function () {
            if (flagMove === false) return this;

            let scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft,
                scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

            // 初始位置
            if (moveStyle === "margin") {
                element.style.marginLeft = element.style.marginTop = "0px";
            } else {
                element.style[moveStyle] = "translate(0, 0)";
            }

            // 四边缘的坐标
            rectElement = element.getBoundingClientRect();
            rectTarget = target.getBoundingClientRect();

            // 移动元素的中心点坐标
            centerElement = {
                x: rectElement.left + (rectElement.right - rectElement.left) / 2 + scrollLeft,
                y: rectElement.top + (rectElement.bottom - rectElement.top) / 2 + scrollTop
            };

            // 目标元素的中心点位置
            centerTarget = {
                x: rectTarget.left + (rectTarget.right - rectTarget.left) / 2 + scrollLeft,
                y: rectTarget.top + (rectTarget.bottom - rectTarget.top) / 2 + scrollTop
            };

            // 转换成相对坐标位置
            coordElement = {
                x: 0,
                y: 0
            };
            coordTarget = {
                x: -1 * (centerElement.x - centerTarget.x),
                y: -1 * (centerElement.y - centerTarget.y)
            };

            /*
             * 因为经过(0, 0), 因此c = 0
             * 于是：
             * y = a * x*x + b*x;
             * y1 = a * x1*x1 + b*x1;
             * y2 = a * x2*x2 + b*x2;
             * 利用第二个坐标：
             * b = (y2+ a*x2*x2) / x2
            */
            // 于是
            b = (coordTarget.y - a * coordTarget.x * coordTarget.x) / coordTarget.x;

            return this;
        };

        // 按照这个曲线运动
        exports.move = function () {
            // 如果曲线运动还没有结束，不再执行新的运动
            if (flagMove === false) return this;

            let startx = 0, rate = coordTarget.x > 0 ? 1 : -1;
            let step = function () {
                // 切线 y'=2ax+b
                let tangent = 2 * a * startx + b;
                // 下面是根据确定的移动速度，得到当前切线下x也就是水平方向移动的大小
                // 已知两点之间的距离为
                // Math.sqrt((x2-x1) * (x2-x1) + (y2-y1) * (y2-y1));
                // 因此应当是
                // Math.sqrt(△x*△x + △y*△y) = speed
                // y*y + x*x = speed
                // (tangent * x)^2 + x*x = speed
                // x = Math.sqr(speed / (tangent * tangent + 1));
                startx = startx + rate * Math.sqrt(params.speed / (tangent * tangent + 1));

                // 防止过界
                if ((rate === 1 && startx > coordTarget.x) || (rate === -1 && startx < coordTarget.x)) {
                    startx = coordTarget.x;
                }
                let x = startx, y = a * x * x + b * x;

                // 标记当前位置，这里有测试使用的嫌疑，实际使用可以将这一行注释
                element.setAttribute("data-center", [Math.round(x), Math.round(y)].join());

                // x, y目前是坐标，需要转换成定位的像素值
                if (moveStyle === "margin") {
                    element.style.marginLeft = x + "px";
                    element.style.marginTop = y + "px";
                } else {
                    element.style[moveStyle] = "translate(" + [x + "px", y + "px"].join() + ")";
                }

                if (startx !== coordTarget.x) {
                    params.progress(x, y);
                    window.requestAnimationFrame(step);
                } else {
                    // 运动结束，回调执行
                    element.style.visibility = "hidden";
                    params.complete();
                    flagMove = true;
                }
            };
            window.requestAnimationFrame(step);
            flagMove = false;

            return this;
        };

        // 初始化方法
        exports.init = function () {
            this.position().mark().move();
        };
    }

    return exports;
}

//兼容
function checkRequestAnimationFrame() {
    let lastTime = 0;
    let vendors = ['webkit', 'moz'];
    for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // name has changed in Webkit
            window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback) {
            let currTime = new Date().getTime();
            let timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            let id = window.setTimeout(function () {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    }
}
