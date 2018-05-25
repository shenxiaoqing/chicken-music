<template>
  <div ref="wrapper">
    <!-- 滚动组件 -->
    <slot></slot>
  </div>
</template>

<script>
import BScroll from "better-scroll";
// 数据通过props传递
export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    listenScroll:{
      type:Boolean,
      default:false
    }
  },
  mounted() {
    // 保证在DOM渲染完毕后初始化BScroll
    setTimeout(() => {
      this._initScroll();
    }, 20);
  },
  methods: {
    // 初始化BScroll
    _initScroll() {
      if (!this.$refs.wrapper) {
        return;
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      });
      // 是否派发滚动事件
      if(this.listenScroll){
        let that=this
        this.scroll.on('scroll',(pos)=>{
          that.$emit('scroll',pos)
        })
      }
    },
    // 可以滚动
    enable() {
      this.scroll && this.scroll.enable();
    },
    // 禁止滚动
    disable() {
      this.scroll && this.scroll.disable();
    },
    // 刷新
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    // 滚动到指定位置
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    // 滚动到指定dom
    scrollToElement(){
      this.scroll && this.scroll.scrollToElement.apply(this.scroll,arguments)
    }
  },
  watch: {
    // 监听数据的变化，延时refreshDelay时间后调用refresh方法重新计算，保证滚动效果正常
    data() {
      setTimeout(() => {
        this.refresh();
      }, 20);
    }
  }
};
</script>

<style>

</style>
