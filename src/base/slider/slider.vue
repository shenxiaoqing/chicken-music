<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="slider-group">
      <slot></slot>
    </div>
    <div class="dots">
      <span 
        class="dot" 
        v-for="(item,i) in dots" 
        :key="i"
        :class="{active:currentPageIndex===i}"
      ></span>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll';
import {addClass} from 'common/js/dom';

export default {
  data(){
    return{
      children:null,
      dots:[],
      currentPageIndex:0
    }
  },
  props:{
    loop:{
      type:Boolean,
      default:true
    },
    autoPlay:{
      type:Boolean,
      default:true
    },
    interval:{
      type:Number,
      default:2000
    }
  },
  mounted(){
    setTimeout(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSider()
      if(this.autoPlay){
        this._play()
      }
    }, 20)
    window.addEventListener('resize',()=>{
      if(!this.slider){
        return
      }
      this._setSliderWidth(true)
      this.slider.refresh()
    })
  },
  methods:{
    _setSliderWidth(isResize){
      this.children=this.$refs['slider-group']['children']
      let width=0
      let sliderWidth=this.$refs.slider.clientWidth
      for(let i=0;i<this.children.length;i++){
        let child=this.children[i]
        addClass(child,'slider-item')
        child.style.width=sliderWidth+"px"
        width+=sliderWidth
      }
      if(this.loop&&!isResize){
        width+=2*sliderWidth
      }
      this.$refs['slider-group'].style.width=width+'px';
    },
    _initDots(){
      this.dots=new Array(this.children.length);
    },
    _initSider(){
      this.slider=new BScroll(this.$refs.slider,{
        scrollX:true,
        scrollY:false,
        momentum:false,
        snap:true,
        snapLoop:this.loop,
        snapThreshold:0.3,
        snapSpeed:400
      })
      this.slider.on('scrollEnd',()=>{
        let pageIndex=this.slider.getCurrentPage().pageX
        if(this.loop){
          pageIndex-=1
        }
        this.currentPageIndex=pageIndex
        if(this.autoPlay){
          clearTimeout(this.timer)
          this._play()
        }
      })
    },
    _play(){
      let pageIndex=this.currentPageIndex+1
      if(this.loop){
        pageIndex+=1
      }
      this.timer=setTimeout(() => {
        this.slider.goToPage(pageIndex,0,400)
      }, this.interval);
    }
  },
  destroyed(){
    clearTimeout(this.timer)
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable.styl';

.slider
  min-height 1px
.slider-group
  position relative
  overflow hidden
  white-space nowrap
.slider-item
  float left
  box-sizing border-box
  overflow hidden
  text-align center
a
  display block
  width 100%
  overflow hidden
  text-decoration none
img
  display block
  width 100%
.dots
  position absolute
  right 0px
  left 0px
  bottom 12px
  text-align center
  font-size 0
  .dot
    display inline-block
    margin 0 4px
    width 8px
    height 8px
    border-radius 50%
    background $color-text-l
    &.active
      width 20px
      border-radius 5px
      background $color-text-ll
</style>