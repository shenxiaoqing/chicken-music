<template>
  <div class="recommend">
    <!-- 首页 -->
    <scroll ref="scroll" :data="discList" class="recommend-content">
      <div>
        <div v-if="recommends.length" class="slider-wrapper">
          <Slider>
            <div v-for="( v,i) in recommends" :key="i">
              <a :href="v.linkUrl">
                <img class="needsclick" @load="loadImage" :src="v.picUrl" alt="">
              </a>
            </div>
          </Slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="(v,i) in discList" :key="i" class="item">
              <div class="icon">
                <img width="60" height="60" v-lazy="v.imgurl" alt="">
              </div>
              <div class="text">
                <h2 class="name" v-html="v.creator.name"></h2>
                <p class="desc" v-html="v.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import { getRecommend, getDiscList } from "../../api/recommend";
import { ERR_OK } from "../../api/config";
import Slider from "../../base/slider/slider.vue";
import Scroll from "../../base/scroll/scroll.vue";
import Loading from "base/loading/loading.vue";

export default {
  data() {
    return {
      recommends: [],
      discList: []
    };
  },
  created() {
    this._getRecommend();
    this._getDiscList();
  },
  methods: {
    // 获取轮播图数据
    _getRecommend() {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider;
        }
      });
    },
    // 获取推荐歌单数据
    _getDiscList() {
      getDiscList().then(res => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list;
        }
      });
    },
    // 实现图片懒加载
    loadImage() {
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh();
        this.checkLoaded = true;
      }
    }
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0px;
}

.recommend-content {
  height: 100%;
  overflow: hidden;

  .slider-wrapper {
    position: relative;
    width: 100%;
    overflow: hidden;
  }
}

.recommend-list {
  .list-title {
    height: 65px;
    line-height: 65px;
    text-align: center;
    font-size: $font-size-m;
    color: $color-theme;
  }
}

.item {
  display: flex;
  box-sizing: border-box;
  align-items: center;
  padding: 0 20px 20px 20px;
}

.icon {
  flex: 0 0 60px;
  width: 60px;
  padding-right: 20px;
}

.text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  line-height: 20px;
  overflow: hidden;
  font-size: $font-size-m;
}

.name {
  margin-bottom: 10px;
  color: $color-text;
}

.desc {
  color: $color-text-d;
}

.loading-container {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}
</style>
