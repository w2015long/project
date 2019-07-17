/**
 * @author chencheng
 * @date 2018/3/19
 * 应用入口
 */
import React from 'react';
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import reducer from './Reducer'
import MenuRouter from './MenuRouter'
import ErrorBoundary from './ErrorBoundary'
import {Modal, message, notification} from 'antd';
import('./App.css');


window.message = message;
window.notification = notification;
window.modalConfirm = Modal.confirm;
/**
 * 创建store仓库
 */
const store = createStore(
    reducer,
    applyMiddleware(thunk, createLogger)
);

// window.history.replaceState(null,null,"/#/");

require('./util/common');
const App = () => {
    return (
        <Provider store={store}>
            <ErrorBoundary>
                <MenuRouter/>
            </ErrorBoundary>
        </Provider>
    );
};

export default App
