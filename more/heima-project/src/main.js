import Vue from 'vue';
import App from './App.vue';
import router from './router'

import { Header } from 'mint-ui';
Vue.component(Header.name, Header);

import './lib/mui/css/mui.min.css';

new Vue({
	router,
	render: h => h(App)
}).$mount('#app');