import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import Home from '../components/tabbar/home.vue';
import Member from '../components/tabbar/member.vue';
import Search from '../components/tabbar/search.vue';
import Shopcar from '../components/tabbar/shopcar.vue';

export default new VueRouter({
	routes :[
		{path:'/',redirect:'/home'},
		{path:'/home',component:Home},
		{path:'/member',component:Member},
		{path:'/shopcar',component:Shopcar},
		{path:'/search',component:Search}
	],
	linkActiveClass:"mui-active",
});