<template>
	<div class="photoInfo">
		<h2>{{photoInfo.title}}</h2>
		<p class="text">
			<span>发表时间:{{photoInfo.add_time | dateFormat}}</span>
			<span>点击次数:{{photoInfo.click}}</span>
		</p>
		<!-- 缩略图 -->
		<div class="tuumbs">
			<vue-preview :slides="slide" @close="handleClose"></vue-preview>
		</div>
		<!-- 内容提供 -->
		<div class="content" v-html="photoInfo.content"></div>

		<!-- 评论子组件 -->
		<comment :id="id" />
	</div>
</template>
<script type="text/javascript">
	import { request } from '../../util/index.js';
	import { Toast } from 'mint-ui';
	import Comment from '../subComponents/comment.vue'
	export default {
		name:"photoInfo",
		components:{
			comment:Comment
		},
		data() {
			return {
				id:this.$route.params.id,
				photoInfo:{},
				slide:[]
			}
		},
		created(){
			this.getImgDetail();
			this.getPreview();
		},
		mounted(){
	
		},
		methods:{
			getImgDetail(){
				request({
					url:"http://www.liulongbin.top:3005/api/getimageInfo/" + this.id
				})
				.then(data=>{
					if(data.status == 0){
						this.photoInfo = data.message[0];						
					}

				})
				.catch(err=>{
					Toast('获取图片详情失败')
				})
			},
			getPreview(){
				request({
					url:"http://www.liulongbin.top:3005/api/getthumimages/" + this.id
				})
				.then(data=>{
					if(data.status == 0){
						data.message.forEach(item=>{
							item.msrc = item.src;
                        	item.w = 600;
                        	item.h = 400;							
						});
						this.slide = data.message;					
					}

				})
				.catch(err=>{
					Toast('获取缩略图失败')
				})				
			}
		}
	}
</script>
<style lang="scss">
	*{
		margin: 0;
		padding: 0;
	}
	.photoInfo{
		padding: 5px;
		h2{
			font-size: 14px;
			color:#26A2FF;
			text-align: center;
			margin: 15px 0;
		}
		.text{
			display: flex;
			justify-content: space-between;
			font-size: 13px;
		}
		.content{
			font-size: 14px;
		}
		.tuumbs{
			.my-gallery{
				figure{
					margin: 0;
					img{
						width: 100%;
					}
				}				
			}

		}		
	}

</style>