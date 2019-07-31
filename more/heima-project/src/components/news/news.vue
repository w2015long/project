<template>
	<div class="news">
		<ul class="mui-table-view">
			<li class="mui-table-view-cell mui-media" v-for="item in newsList" :key="item.id">
				<router-link :to="'/home/news/' + item.id">
					<img class="mui-media-object mui-pull-left" :src="item.img_url">
					<div class="mui-media-body">
						<h1>{{ item.title }}</h1>
						<p class='mui-ellipsis'>
							<span>发表时间:{{ item.add_time | dateFormat}}</span>
							<span>点击数:{{ item.click }}</span>
						</p>
					</div>
				</router-link>
			</li>

		</ul>
	</div>
</template>
<script type="text/javascript">
	import { request } from '../../util/index.js';
	import { Toast } from 'mint-ui';
	export default {
		name:"news",
		data() {
			return {
				newsList:[]
			}
		},
		created(){
			this.getNewsList();
		},
		methods:{
			getNewsList(){
				request({
					url:"http://www.liulongbin.top:3005/api/getnewslist"
				})
				.then(data=>{
					if(data.status == 0){
						this.newsList = data.message;
					}
				})
				.catch(err=>{
					Toast('获取新闻列表失败')
				})
			}
		}
	}
</script>
<style lang="sass" scoped>
	.mui-table-view{
		.mui-media-body{
			h1{
				font-size: 14px;
			}
			.mui-ellipsis{
				display: flex;
				justify-content: space-between;
				color: #226aff;
				font-size: 12px;
			}			
		}

	}
</style>