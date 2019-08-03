<template>
	<div class="photos">
		<!-- 顶部导航 -->
		<div id="slider" class="mui-slider">
			<div id="sliderSegmentedControl" class="mui-scroll-wrapper mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">
				<div class="mui-scroll">
					<a 
						:class="['mui-control-item',item.id == 0 ? 'mui-active' : '']" 
						href="#" 
						v-for="item in cates" 
						:key="item.id"
						@click="getImgById(item.id)">
						{{item.title}}
					</a>					
				</div>
			</div>
		</div>
		<!-- 图片 -->
		<ul class="photo-list">
		  <li v-for="item in list" :key="item.category_id">
		    <img v-lazy="item.img_url">
		    <div class="content">
		    	<h2>{{item.title}}</h2>
		    	<p class="text">{{ item.seo_description }}</p>
		    </div>
		  </li>
		</ul>		
	</div>
</template>
<script type="text/javascript">
	import mui from '../../lib/mui/js/mui.min.js';

	import { request } from '../../util/index.js';
	import { Toast } from 'mint-ui';
	export default {
		name:"news",
		components:{
			
		},
		data() {
			return {
				cates:[],
				list:[]
			}
		},
		created(){
			this.getAllCategory();
			this.getImgById(0);
		},
		mounted(){
			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
			});			
		},
		methods:{
			getAllCategory(){
				request({
					url:"http://www.liulongbin.top:3005/api/getimgcategory"
				})
				.then(data=>{
					if(data.status == 0){
						data.message.unshift({id:0,title:"全部"});
						this.cates = data.message;						
					}

				})
				.catch(err=>{
					Toast('获取分类失败')
				})
			},
			getImgById(cateId){
				request({
					url:"http://www.liulongbin.top:3005/api/getimages/" + cateId
				})
				.then(data=>{
					if(data.status == 0){
						this.list = data.message;						
					}

				})
				.catch(err=>{
					Toast('获取分类图片失败')
				})				
			}
		}
	}
</script>
<style lang="scss" scoped>
	*{
		margin: 0;
		padding: 0;
		touch-action:pan-y;
	}
	.photo-list{
		list-style: none;
		margin-bottom: 10px;
		li{
			position: relative;
			padding: 0 9px;
			box-shadow: 0 0 10px #999;
			img{
				width: 100%;
			}
			.content{
				position: absolute;
				bottom: 0;
				width: 302px;
				background-color: transparent;
				color:#fff;
				max-height: 85px;
				text-align: left;
				h2{
					font-size: 14px;
					height: 14px;
					line-height: 14px;
					overflow: hidden;
					text-overflow:ellipsis;
				}
				.text{
					color:#fff;
					font-size: 12px;
				}
			}
		}
	}
	img[lazy=loading] {
	  width: 40px;
	  height: 300px;
	  margin: auto;
	}	
</style>