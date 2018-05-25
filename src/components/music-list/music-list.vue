<template>
  <div class="music-list">
    <!-- 歌手详情页 -->
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length>0" ref="playBtn">
          <i class="icon-play">
            <span class="text">随机播放全部</span>
          </i>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll
      @scroll="scroll"
      :probe-type="probeType" 
      :listen-scroll="listenScroll" 
      :data="songs" 
      class="list" 
      ref="list"
    >
      <div class="song-list-wrapper">
        <!-- 歌曲列表 -->
        <song-list @select="selectItem" :songs="songs"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from "../../base/scroll/scroll";
import SongList from "../../base/song-list/song-list";
import {prefixStyle} from 'common/js/dom'
import Loading from '../../base/loading/loading'
import {mapActions} from 'vuex'
const transform=prefixStyle('transform')
const backdrop=prefixStyle('backdrop-filter')
const RESERVED_HEIGHT=40
export default {
  props: {
    bgImage: {
      type: String,
      default: ""
    },
    songs: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ""
    }
  },
  data(){
    return{
      scrollY:0
    }
  },
  computed: {
    // 详情页背景
    bgStyle() {
      return `background-image:url(${this.bgImage})`;
    }
  },
  created(){
    this.probeType=3
    this.listenScroll=true
  },
  mounted(){
    this.imageHeight=this.$refs.bgImage.clientHeight
    this.minTranslateY = -this.imageHeight+RESERVED_HEIGHT
    this.$refs.list.$el.style.top=`${this.imageHeight}px`
  },
  methods:{
    scroll(pos){
      this.scrollY=pos.y
    },
    // 点击左上角返回歌手列表页
    back(){
      this.$router.back()
    },
    // 点击歌曲播放
    selectItem(item,index){
      this.selectPlay({
        list:this.songs,
        index
      })
    },
    ...mapActions([
      'selectPlay'
    ])
  },
  watch:{
    // 监听滚动位置
    scrollY(newY){
      let translateY = Math.max(this.minTranslateY,newY)
      let zIndex=0
      let scale=1
      let blur=0
      this.$refs.layer.style[transform]=`translate3d(0,${translateY}px,0)`
      const percent=Math.abs(newY/this.imageHeight)
      if(newY>0){
        scale=1+percent
        zIndex=10
      }else{
        blur=Math.min(20*percent,20)
      }
      this.$refs.filter.style[backdrop]=`blur(${blur}px)`
      if(newY<this.minTranslateY){
        zIndex=10
        this.$refs.bgImage.style.paddingTop=0
        this.$refs.bgImage.style.height=`${RESERVED_HEIGHT}px`
        this.$refs.playBtn.style.display='none'
      }else{
        this.$refs.bgImage.style.paddingTop='70%'
        this.$refs.bgImage.style.height=0
        this.$refs.playBtn.style.display=''
      }
      this.$refs.bgImage.style.zIndex=zIndex
      this.$refs.bgImage.style[transform]=`scale(${scale})`
    }
  },
  components: {
    Scroll,
    SongList,
    Loading
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';
@import '~common/stylus/mixin.styl';

.music-list {
  position: fixed;
  z-index: 100;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  background: $color-bg;
}

.back {
  position: absolute;
  top: 0px;
  left: 6px;
  z-index: 50;
}

.icon-back {
  display: block;
  padding: 10px;
  font-size: $font-size-xl;
  color: $color-theme;
  font-style normal
}

.title {
  position: absolute;
  top: 0px;
  left: 10%;
  z-index: 40;
  width: 80%;
  no-wrap();
  text-align: center;
  line-height: 40px;
  font-size: $font-size-l;
  color: $color-text;
}

.bg-image {
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 70%;
  transform-origin: top;
  background-size: cover;
  // z-index 10
}

.play-wrapper {
  position: absolute;
  bottom: 20px;
  z-index: 50;
  width: 100%;
}

.play {
  box-sizing: border-box;
  width: 135px;
  padding: 7px 0;
  margin: 0 auto;
  text-align: center;
  border: 1px solid $color-theme;
  color: $color-theme;
  border-radius: 100px;
  font-size: 0;
}

.icon-play {
  display: inline-block;
  vertical-align: middle;
  font-size: $font-size-s;
  font-style normal
}

.filter {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: rgba(7, 17, 27, 0.4);
}
.bg-layer
  position relative
  height 100%
  background $color-bg
.list
  position fixed
  top 0px
  bottom 0px
  width 100%
  // overflow hidden
  background $color-bg
.song-list-wrapper
  padding 20px 30px
.loading-container
  position absolute
  width 100%
  top 50%
  transform translateY(-50%)
</style>
