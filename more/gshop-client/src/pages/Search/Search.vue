<template>
    <section class="search">
        <HeaderTop title="搜索"></HeaderTop>
        <form class="search_form"  @submit.prevent="goSearch">
            <input type="search" name="search"
                   placeholder="请输入商家或美食名称"
                   class="search_input"
                   v-model="keyword"
            >
            <input type="submit" name="submit" class="search_submit">
        </form>

        <!-- 搜索结果 -->
        <section class="list" v-if="hasResult">
            <ul class="list_container">
                <!--:to="'/shop?id='+item.id"-->
                <!-- :to="{path:'/shop', query:{id:item.id}}"-->
                <router-link :to="item.link"
                             tag="li"
                             v-for="item in searchResult"
                             :key="item.id"
                             class="list_li"
                >
                    <section class="item_left">
                        <img v-lazy="item.pic" class="restaurant_img">
                    </section>
                    <section class="item_right">
                        <div class="item_right_text">
                            <p>
                                <span>{{item.title}}</span>
                            </p>
                            <p>作者 {{item.author}} </p>
                            <p>发布时间{{ item.songid | date-format }}</p>
                        </div>
                    </section>
                </router-link>
            </ul>
        </section>
        <div class="search_none" v-else>很抱歉！无搜索结果</div>
    </section>
</template>

<script>
    import {mapState} from 'vuex'
    import HeaderTop from '../../components/HeaderTop/HeaderTop.vue';
    export default {
        name: "FooterGuide",
        data(){
            return {
                keyword:'',
                hasResult:true,//是否有搜索结果
            }
        },
        mounted(){

        },
        computed:{
            ...mapState(['searchResult'])
        },
        methods:{
            goSearch () {
                const keyword = this.keyword.trim();
                if (!keyword) return
                this.$store.dispatch('getSearchList',keyword);
            }

        },
        components: {
            HeaderTop
        },
        watch:{
            searchResult (val) {
                if (val.length) {
                    this.hasResult = true
                } else {
                    this.hasResult = false
                }
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../common/stylus/mixins.styl"
    .search
        width 100%
        height 100%
        overflow hidden
        .search_form
            clearFix()
            margin-top 45px
            background-color #fff
            padding 12px 8px
            input
                height 35px
                padding 0 4px
                border-radius 2px
                font-weight bold
                outline none
                &.search_input
                    float left
                    width 79%
                    border 4px solid #f2f2f2
                    font-size 14px
                    color #333
                    background-color #f2f2f2
                &.search_submit
                    float right
                    width 18%
                    border 4px solid #02a774
                    font-size 16px
                    color #fff
                    background-color #02a774

        .list
            .list_container
                background-color: #fff;
                .list_li
                    display: flex;
                    justify-content: center;
                    padding: 10px
                    border-bottom: 1px solid $bc;
                    .item_left
                        margin-right: 10px
                        .restaurant_img
                            width 50px
                            height 50px
                            display block
                    .item_right
                        font-size 12px
                        flex 1
                        .item_right_text
                            p
                                line-height 12px
                                margin-bottom 6px
                                &:last-child
                                    margin-bottom 0
        .search_none
            margin: 0 auto
            color: #333
            background-color: #fff
            text-align: center
            margin-top: 0.125rem
</style>