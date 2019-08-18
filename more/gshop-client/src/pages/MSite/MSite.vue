<template>
    <!--首页外卖-->

        <section class="msite">
            <!--首页头部-->
            <HeaderTop :title="address.name">
                <span class="header_search" slot="left">
                    <i class="iconfont icon-sousuo"></i>
                </span>
                <span class="header_login" slot="right">
                    <span class="header_login_text">登录|注册</span>
                 </span>
            </HeaderTop>
            <!--首页导航-->
            <nav class="msite_nav">
                <div class="swiper-container" v-if="categorys.length">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide" v-for="(minArr,idx) in getTwoLevelCate" :key="idx">
                            <a href="javascript:" class="link_to_food" v-for="(item,index) in minArr" :key="index">
                                <div class="food_container">
                                    <img :src="baseUrl+item.image_url">
                                </div>
                                <span>{{ item.title }}</span>
                            </a>
                        </div>
                    </div>
                    <!-- Add Pagination -->
                    <div class="swiper-pagination"></div>
                </div>
                <img src="./images/msite_back.svg" alt="back" v-else>
            </nav>
            <!--首页附近商家-->
            <div class="msite_shop_list">
                <div class="shop_header">
                    <i class="iconfont icon-xuanxiang"></i>
                    <span class="shop_header_title">附近商家</span>
                </div>
                <ShopList />
            </div>
        </section>

</template>

<script>
    import Swiper from 'swiper';
    import 'swiper/dist/css/swiper.min.css';
    import ShopList from '../../components/ShopList/ShopList.vue';
    import HeaderTop from '../../components/HeaderTop/HeaderTop.vue';
    import { mapState ,mapActions  } from 'vuex'
    export default {
        name: "MSite",
        data(){
            return {
                baseUrl:'https://fuss10.elemecdn.com'
            }
        },
        components: {
            ShopList,
            HeaderTop
        },
        mounted(){
            this.getFoodCategory();//获取首页轮播图
            this.getShops();//获取商家信息
        },
        watch: {
            categorys () {//数据更新执行
                //界面更新就立即创建Swiper对象
                this.$nextTick(() => {//将回调延迟到下次 DOM 更新循环之后执行
                    new Swiper('.swiper-container', {
                        loop: true, // 可以循环轮播
                        pagination: {
                            el: '.swiper-pagination',
                        },
                    });
                })
            }
        },
        methods:{
            ...mapActions (['getFoodCategory','getShops'])
        },
        computed: {
            ...mapState(['address','categorys']),
            /**
             * 根据category生成一个二维数组
             */
            getTwoLevelCate () {
                const outArr = [];
                let minArr = [];
                this.categorys.forEach((elem)=>{
                    if (minArr.length == 8) {
                        minArr = [];
                    }

                    if (!minArr.length) {
                        outArr.push(minArr);
                    }

                    minArr.push(elem);
                });
                return outArr;
            }

        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../common/stylus/mixins.styl"
    .msite  //首页
        width 100%
        .msite_nav
            bottom-border-1px(#e4e4e4)
            margin-top 45px
            height 200px
            background #fff
            .swiper-container
                width 100%
                height 100%
                .swiper-wrapper
                    width 100%
                    height 100%
                    .swiper-slide
                        display flex
                        justify-content center
                        align-items flex-start
                        flex-wrap wrap
                        .link_to_food
                            width 25%
                            .food_container
                                display block
                                width 100%
                                text-align center
                                padding-bottom 10px
                                font-size 0
                                img
                                    display inline-block
                                    width 50px
                                    height 50px
                            span
                                display block
                                width 100%
                                text-align center
                                font-size 13px
                                color #666
                .swiper-pagination
                    >span.swiper-pagination-bullet-active
                        background #02a774
        .msite_shop_list
            top-border-1px(#e4e4e4)
            margin-top 10px
            background #fff
            .shop_header
                padding 10px 10px 0
                .shop_icon
                    margin-left 5px
                    color #999
                .shop_header_title
                    color #999
                    font-size 14px
                    line-height 20px

</style>