import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import filters from './filters';

//注册全局过滤器
Object.keys(filters).forEach(key=>Vue.filter(key,filters[key]));

import './mock/mockServer';// 加载mockServer即可
import VueLazyload from 'vue-lazyload'
import loading from './common/imgs/loading.gif'
Vue.config.productionTip = false

import { Button } from 'mint-ui';
Vue.component(Button.name, Button);

Vue.use(VueLazyload, {
  loading
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
