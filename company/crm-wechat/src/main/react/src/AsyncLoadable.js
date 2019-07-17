/**
 * @author chencheng
 * @date 2018/3/19
 * 提供动态加载组件的支持
 */
import React from 'react'
import Loadable from 'react-loadable';
import { Spin, Icon } from 'antd';
import ProgressBar from "./module/common/components/ProgressBar";

/**
 * 动态加载组件
 * @param importComponent 组件加载的import方法，比如:()=> import ('./module/example/components/Index')
 */
export default function asyncLoadComponent(importComponent) {
    return Loadable({
        loader: importComponent,//import方法
        loading: LoadingComponent,//加载中组件
        delay: 200//单位毫秒，表示加载超过一定时间就显示加载中...
    });
}

const LoadingComponent = (props) => {
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
    if (props.isLoading && props.pastDelay) {
        return <ProgressBar/>
    }else if (props.error) {
        return <Spin indicator={antIcon} />
    }else {
        return null
    }
};