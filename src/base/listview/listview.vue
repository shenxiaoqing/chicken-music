<template>
  <Scroll 
    class="listview" 
    :data="data" 
    ref="listview" 
    :listenScroll="listenScroll"
    :probeType="probeType"
    @scroll="scroll"
  >
  <!-- 歌手列表页 -->
    <ul>
      <li v-for="(group,i) in data" :key="i" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <!--首拼相同的歌手列表 -->
        <ul>
          <li @click="selectItem(item)" v-for="(item,j) in group.items" :key="j" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar"/>
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 侧边导航栏 -->
    <div class="list-shortcut"
      @touchstart="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
    >
      <ul>
        <li 
          class="item" 
          v-for="(v,i) in shortcutList" 
          :key="i"
          :data-index="i"
          :class="{'current':currentIndex===i}"
        >{{v}}</li>
      </ul>
    </div>
    <!-- 定位title -->
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <!-- 数据加载时的loading -->
    <div v-show="!data.length" class="loading-container">
      <Loading></Loading>
    </div>
  </Scroll>
</template>

<script>
import Scroll from "base/scroll/scroll";
import { getData } from "common/js/dom";
import Loading from "base/loading/loading";

// 歌手列表组件

const ANCHRO_HEIGHT = 18;
const TITLE_HEIGHT = 30;

export default {
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    };
  },
  props: {// 接受data数据
    data: {
      type: Array,
      default: []
    }
  },
  created() {
    this.touch = {};
    this.listenScroll = true;
    this.listHeight = [];
    this.probeType = 3;
  },
  components: {
    Scroll,
    Loading
  },
  computed: {
    // 计算侧边导航首字母
    shortcutList() {
      return this.data.map(v => {
        return v.title.substr(0, 1);
      });
    },
    // 计算定位title应是哪一个首字母或者类别
    fixedTitle() {
      if (this.scrollY > 0) {
        return "";
      }
      return this.data[this.currentIndex]
        ? this.data[this.currentIndex].title
        : "";
    }
  },
  methods: {
    // 从导航栏touchstart事件，获取touchstart时的坐标
    onShortcutTouchStart(e) {
      let anchorIndex = getData(e.target, "index");
      let firstTouch = e.touches[0];
      this.touch.y1 = firstTouch.pageY;
      this.touch.anchorIndex = anchorIndex;
      this._srollTo(anchorIndex);
    },
    // 导航栏touchmove事件，获取移动的坐标
    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0];
      this.touch.y2 = firstTouch.pageY;
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHRO_HEIGHT) | 0;
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
      this._srollTo(anchorIndex);
    },
    // 侧边栏滚动函数，根据传递的下标，改变歌手列表的位置
    _srollTo(index) {
      if (!index && index !== 0) {
        return;
      }
      this.scrollY = -this.listHeight[index];
      this.$refs.listview.scroll.scrollToElement(
        this.$refs.listGroup[index],
        0
      );
    },
    // 滚动事件函数
    scroll(pos) {
      this.scrollY = pos.y;
    },
    // 计算每段歌手列表的高度
    _calculateHeight() {
      this.listHeight = [];
      const list = this.$refs.listGroup;
      let height = 0;
      this.listHeight.push(height);
      for (var i = 0; i < list.length; i++) {
        let item = list[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    // 出发选择函数，传参给歌手详情页
    selectItem(item) {
      this.$emit("select", item);
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight();
      }, 20);
    },
    scrollY(newY) {
      const listHeight = this.listHeight;
      // 当滚动到顶部，newY>0
      if (newY > 0) {
        this.currentIndex = 0;
        return;
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i];
        let height2 = listHeight[i + 1];
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i;
          this.diff = height2 + newY;
          return;
        }
      }
      // 当滚动到底部,且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2;
    },
    // 改变定位title，添加改变时动画
    diff(newVal) {
      let fixedTop =
        newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0;
      if (this.fixedTop === fixedTop) {
        return;
      }
      this.fixedTop = fixedTop;
      this.$refs.fixed.style.transform = "translate3d(0," + fixedTop + "px,0)";
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';

.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;
}

.list-group {
  padding-bottom: 30px;
}

.list-group-title {
  height: 30px;
  line-height: 30px;
  padding-left: 20px;
  font-size: $font-size-s;
  color: $color-text-l;
  background: $color-hl-bg;
}

.list-group-item {
  display: flex;
  align-items: center;
  padding: 20px 0 0 30px;

  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }

  .name {
    margin-left: 20px;
    color: $color-text-l;
    font-size: $font-size-m;
  }
}

.list-shortcut {
  position: absolute;
  z-index: 99;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  padding: 20px 0;
  border-radius: 10px;
  text-align: center;
  background: $color-bd-d;
  font-family: Helvetica;

  .item {
    padding: 3px;
    line-height: 1;
    color: $color-text-l;
    font-size: $font-size-s;

    &.current {
      color: $color-theme;
    }
  }
}

.list-fixed {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;

  .fixed-title {
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
    font-size: $font-size-s;
    color: $color-text-l;
    background: $color-hl-bg;
  }
}

.loading-container {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}
</style>
