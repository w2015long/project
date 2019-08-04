import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import Home from '../components/tabbar/home.vue';
import Member from '../components/tabbar/member.vue';
import Search from '../components/tabbar/search.vue';
import Shopcar from '../components/tabbar/shopcar.vue';
import News from '../components/news/news.vue';
import NewsInfo from '../components/news/newsInfo.vue';
import PhotoList from '../components/photos/photoList.vue';
import PhotoInfo from '../components/photos/photoInfo.vue';
import goodsList from '../components/goods/goodsList.vue';
import goodsInfo from '../components/goods/goodsInfo.vue';
import goodsDesc from '../components/goods/goodsDesc.vue';
import goodsComment from '../components/goods/goodsComment.vue';

export default new VueRouter({
	routes :[
		{path:'/',redirect:'/home'},
		{path:'/home',component:Home},
		{path:'/member',component:Member},
		{path:'/shopcar',component:Shopcar},
		{path:'/search',component:Search},
		{path:'/home/news',component:News},
		{path:'/home/news/:id',component:NewsInfo},
		{path:'/home/photoList',component:PhotoList},
		{path:'/home/photoList/:id',component:PhotoInfo},
		{path:'/home/goodsList',component:goodsList},
		{path:'/home/goodsInfo/:id',component:goodsInfo,name:'goodsInfo'},
		{path:'/home/goodsDesc/:id',component:goodsDesc,name:'goodsDesc'},
		{path:'/home/goodsComment/:id',component:goodsComment,name:'goodsComment'},
	],
	linkActiveClass:"mui-active",
});