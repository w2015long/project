<template>
	<div class="container">
		<h3 class="flag">{{ newsInfo.title }}</h3>
		<p class="subTitle">
			<span>发表时间:{{ newsInfo.add_time | dateFormat }}</span>
			<span>点击数:{{ newsInfo.click }}</span>
		</p>
		<hr>
		<div class="content" v-html="newsInfo.content">
		</div>
		<!-- 评论组件 -->
		<comment :id="id" />
	</div>
</template>
<script type="text/javascript">
	import { request } from '../../util/index.js';
	import { Toast } from 'mint-ui';
	import Comment from '../subComponents/comment.vue';
	export default {
		name:"news",
		components:{
			comment:Comment
		},
		data() {
			return {
				id:this.$route.params.id,
				newsInfo:''
			}
		},
		created(){
			this.getNewsInfo();
		},
		methods:{
			getNewsInfo(){
				request({
					url:"http://www.liulongbin.top:3005/api/getnew/"+this.id
				})
				.then(data=>{
					if(data.status == 0){
						this.newsInfo = data.message[0];
					}
				})
				.catch(err=>{
					Toast('获取新闻详情失败')
				})
			}
		}
	}
</script>
<style lang="sass" scoped>
	.container{
		padding: 0 4px;
		.flag{
			font-size: 16px;
			color: #f55;
			text-align: center;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.subTitle{
			display: flex;
			justify-content: space-between;
			span{
				font-size: 12px;
				color:#aeaeae;
			}
		}
	}
</style>