import Vue from 'vue';
import App from './App.vue';
import router from './router';
import filters from './filters';
import store from './store';
Vue.config.devtools = true;
Vue.config.productionTip = false;
//注册全局过滤器
Object.keys(filters).forEach(key=>Vue.filter(key,filters[key]));

import { Header,Button,Swipe, SwipeItem,Lazyload } from 'mint-ui';
Vue.component(Header.name, Header);
Vue.component(Button.name, Button);
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
Vue.use(Lazyload);

// 图片预览插件
import VuePreview from 'vue-preview';
Vue.use(VuePreview);
//重置样式
import './lib/reset/reset.css';
// mui样式
import './lib/mui/css/mui.min.css';
import './lib/mui/css/icons-extra.css';

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app');