<template>
  <div class="loading">
    <!-- loading组件 -->
    <img width="24" height="24" src="./loading.gif" alt="">
    <p class="desc">{{title}}</p>
  </div>
</template>

<script>
export default {
  props:{
    title:{
      type:String,
      default:'拼命加载中...'
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl'

.loading
  width 100%
  text-align center
.desc
  line-height 20px
  font-size $font-size-s
  color $color-text-l
</style>
