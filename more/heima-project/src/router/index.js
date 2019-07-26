import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import User from '../pages/user/user.vue';

export default new VueRouter({
	routes :[
		{path:'/',redirect:'/home'},
		{path:'/home',component:User},
		// {path:'/cart',component:Cart},
		// {path:'/me',component:Me},
		
	]
});