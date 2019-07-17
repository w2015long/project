/**
 * 主入口文件
 */

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
//用来在生产环境中管理缓存的
registerServiceWorker();
