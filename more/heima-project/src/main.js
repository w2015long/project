import Vue from 'vue';
import App from './App.vue';
import router from './router';
import filters from './filters';
//注册全局过滤器
Object.keys(filters).forEach(key=>Vue.filter(key,filters[key]));

import { Header,Button,Swipe, SwipeItem,Lazyload } from 'mint-ui';
Vue.component(Header.name, Header);
Vue.component(Button.name, Button);
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
Vue.use(Lazyload);

import './lib/mui/css/mui.min.css';
import './lib/mui/css/icons-extra.css';

new Vue({
	router,
	render: h => h(App)
}).$mount('#app');