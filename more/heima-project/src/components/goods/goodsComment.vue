<template>
	<div class="goods-comment">
		<comment :id="id" />				
	</div>
</template>
<script type="text/javascript">
	import { request } from '../../util/index.js';
	import { Toast } from 'mint-ui';
	import Comment from '../subComponents/comment.vue';
	export default {
		name:"goodsComment",
		components:{
			comment:Comment
		},
		data() {
			return {
				id:this.$route.params.id
			}
		},
		created(){
		},
		mounted(){
		},
		methods:{

		}
	}
</script>
<style lang="scss" scoped>
	.goods-comment{

	}		


</style>