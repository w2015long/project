import Vue from 'vue';
import App from './App.vue';
import router from './router';

import { Header } from 'mint-ui';
Vue.component(Header.name, Header);

import { Button } from 'mint-ui';
Vue.component(Button.name, Button);

import { Swipe, SwipeItem } from 'mint-ui';

Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);

import './lib/mui/css/mui.min.css';
import './lib/mui/css/icons-extra.css';

new Vue({
	router,
	render: h => h(App)
}).$mount('#app');