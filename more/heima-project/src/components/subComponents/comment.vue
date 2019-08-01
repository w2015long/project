<template>
	<div class="container">
		<h3 class="title">发表评论</h3>
		<hr>
		<textarea placeholder="请输入评论内容(最多吐槽120个字)" 
		maxlength="120" v-model="msg"></textarea>
		<mt-button type="primary" size="large" @click="postComment">发表评论</mt-button>

		<div class="cmt-list">
			<div class="cmt-item" v-for="(item,i) in comments" :key="i">
				<p class="cmt-title">第{{i+1}}楼&nbsp;&nbsp;用户:{{item.user_name}}&nbsp;&nbsp;发表时间:{{item.add_time | dateFormat }}</p>
				<p class="cmt-body">
					{{ item.content == 'undefined' ?"该用户很懒，什么都没有评论" : item.content }}
				</p>
			</div>
		</div>
		<mt-button type="danger" size="large" plain @click="getMore">加载更多</mt-button>
	</div>
</template>
<script type="text/javascript">
	import { request } from '../../util/index.js';
	import { Toast } from 'mint-ui';
	export default {
		name:"news",
		data() {
			return {
				pageIndex:1,
				comments:[],
				msg:''
			}
		},
		props:['id'],
		created(){
			this.getComments();
		},
		methods:{
			getComments(){
				request({
					url:"http://www.liulongbin.top:3005/api/getcomments/"+this.id+"?pageindex="+this.pageIndex
				})
				.then(data=>{
					// console.log(data)
					if(data.status == 0){
						this.comments = this.comments.concat(data.message);
					}
				})
				.catch(err=>{
					Toast("获取评论列表失败")
				})
			},
			getMore(){
				this.pageIndex++;
				this.getComments();
			},
			postComment(){
				if(!this.msg.trim()) return Toast('请输入内容后再评论');
				request({
					url:"http://www.liulongbin.top:3005/api/postcomment/"+this.$route.params.id,
					data:{
						msg:this.msg.trim()
					},
					method:'post'
				})
				.then(data=>{
					if(data.status == 0){
						let cmt = {
							user_name:'匿名用户',
							add_time:new Date(),
							content:this.msg.trim()
						}
						this.comments.unshift(cmt);
						this.msg = '';
						Toast(data.message);
					}
				})
			}
		}
	}
</script>
<style lang="sass" scoped>
	.container{
		.title{
			font-size: 14px;
		}
		textarea{
			font-size: 15px;
			margin: 0;
			height: 90px;
		}
		.cmt-list{
			.cmt-item{
				margin-top: 5px;
				.cmt-title{
					background-color: #ccc;
				}
				.cmt-body{
					font-size: 16px;
					text-indent: 2em;
				}
			}
		}
	}
</style>