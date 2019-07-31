<template>
	<div class="container">
		<h3 class="title">发表评论</h3>
		<hr>
		<textarea placeholder="请输入评论内容(最多吐槽120个字)" maxlength="120"></textarea>
		<mt-button type="primary" size="large">发表评论</mt-button>

		<div class="cmt-list">
			<div class="cmt-item">
				<p class="cmt-title">第一楼&nbsp;&nbsp;用户:匿名用户&nbsp;&nbsp;发表时间:2015-10-10</p>
				<p class="cmt-body">
					人生若只如初见，何事秋风悲画扇
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
				comments:[]
			}
		},
		props:['id'],
		created(){
			this.getComments();
		},
		methods:{
			getComments(){
				request({
					url:"http://www.liulongbin.top:3005/api/getcomments/"+this.id+"?pageIndex="+this.pageIndex
				})
				.then(data=>{
					console.log(data)
					if(data.status == 0){
						this.comments = this.comments.concat(this.data.message);
					}
				})
				.catch(err=>{
					Toast("获取评论列表失败")
				})
			},
			getMore(){
				this.pageIndex++;
				this.getComments();
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