<template>
    <div class="star" :class="'star-'+size">
        <span class="star-item"
              v-for="(curClass,index) in classArr"
              :key="index"
              :class="curClass"
        ></span>
    </div>
</template>

<script>
    const CLASS_ON = 'on';
    const CLASS_HALF = 'half';
    const OFF = 'off';
    export default {
        name: "Star",
        props: {
            size: Number,
            score: Number,
        },
        computed: {
            classArr () {
                /**
                 * 3.2 3on 0half 2off
                 * 4.7 4on 1half 0off
                 * 2.5 2on 1half 2off
                 */
                let classArr = [];
                const scoreInt = Math.floor(this.score);
                for (let i=0;i<scoreInt;i++) {
                    classArr.push(CLASS_ON)
                }
                if (Math.round(this.score) > this.score) {
                    classArr.push(CLASS_HALF);
                }
                while (classArr.length < 5) {
                    classArr.push(OFF)
                }
                return classArr;
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../common/stylus/mixins.styl"
    .star //2x图 3x图
        float left
        font-size 0
        .star-item
            display inline-block
            background-repeat no-repeat
        &.star-48
            .star-item
                width 20px
                height 20px
                margin-right 22px
                background-size 20px 20px
                &:last-child
                    margin-right: 0
                &.on
                    bg-image('./images/stars/star48_on')
                &.half
                    bg-image('./images/stars/star48_half')
                &.off
                    bg-image('./images/stars/star48_off')
        &.star-36
            .star-item
                width 15px
                height 15px
                margin-right 6px
                background-size 15px 15px
                &:last-child
                    margin-right 0
                &.on
                    bg-image('./images/stars/star36_on')
                &.half
                    bg-image('./images/stars/star36_half')
                &.off
                    bg-image('./images/stars/star36_off')
        &.star-24
            .star-item
                width 10px
                height 10px
                margin-right 3px
                background-size 10px 10px
                &:last-child
                    margin-right 0
                &.on
                    bg-image('./images/stars/star24_on')
                &.half
                    bg-image('./images/stars/star24_half')
                &.off
                    bg-image('./images/stars/star24_off')
</style>