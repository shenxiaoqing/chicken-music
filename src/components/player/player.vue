<template>
  <div class="player" v-show="playlist.length>0">
    <transition name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterleave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image" alt=""/>
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="suntitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image" alt=""/>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :present="present"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i class="icon-sequence"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" >
              <i 
                :class="playIcon" 
                @click="togglePlaying"
              ></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition> 
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon img">
          <img :class="cdCls" width="40" height="40" :src="currentSong.image" alt=""/>
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <i @click.stop="togglePlaying" :class="miniIcon"></i>
          <i class="icon icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio :src="currentSong.url" ref="audio" @canplay="ready" @error="error" @timeupdate="updateTime"></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import animations from "create-keyframe-animation";
import { prefixStyle } from "../../common/js/dom";
import ProgressBar from "../../base/progress-bar/progress-bar";

const transform = prefixStyle("transform");
export default {
  data() {
    return {
      songReady: false,
      currentTime: 0
    };
  },
  computed: {
    cdCls() {
      return this.playing ? "play" : "play pause";
    },
    playIcon() {
      return this.playing ? "icon-pause" : "icon-play";
    },
    miniIcon() {
      return this.playing ? "icon-pause-mini" : "icon-play-mini";
    },
    disableCls() {
      return this.songReady ? "" : "disabled";
    },
    present() {
      return this.currentTime / this.currentSong.duration;
    },
    ...mapGetters([
      "fullScreen",
      "playlist",
      "currentSong",
      "playing",
      "currentIndex"
    ])
  },
  methods: {
    back() {
      this.setFullScreen(false);
    },
    open() {
      this.setFullScreen(true);
    },
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale();
      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      };
      animations.registerAnimation({
        name: "move",
        animation,
        presets: {
          duration: 400,
          easing: "linear"
        }
      });
      animations.runAnimation(this.$refs.cdWrapper, "move", done);
    },
    afterEnter() {
      animations.unregisterAnimation("move");
      this.$refs.cdWrapper.style.animation = "";
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = "all 0.4s";
      const { x, y, scale } = this._getPosAndScale();
      this.$refs.cdWrapper.style[
        transform
      ] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
      this.$refs.cdWrapper.addEventListener("transitionend", done);
    },
    afterleave() {
      this.$refs.cdWrapper.style.transition = "";
      this.$refs.cdWrapper.style.transform = "";
    },
    _getPosAndScale() {
      const targetWidth = 40;
      const paddingLeft = 40;
      const paddingBottom = 30;
      const paddingTop = 80;
      const width = window.innerWidth * 0.8;
      const scale = targetWidth / width;
      const x = -(window.innerWidth / 2 - paddingLeft);
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
      return {
        x,
        y,
        scale
      };
    },
    togglePlaying() {
      this.setPlayingState(!this.playing);
    },
    next() {
      if (!this.songReady) {
        return;
      }
      let index = this.currentIndex + 1;
      if (index === this.playlist.length) {
        index = 0;
      }
      this.setCurrentIndex(index);
      if (!this.playing) {
        this.togglePlaying(0);
      }
      this.songReady = false;
    },
    prev() {
      if (!this.songReady) {
        return;
      }
      let index = this.currentIndex - 1;
      if (index === -1) {
        index = this.playlist.length - 1;
      }
      this.setCurrentIndex(index);
      if (!this.playing) {
        this.togglePlaying(0);
      }
      this.songReady = false;
    },
    ready() {
      this.songReady = true;
    },
    error() {
      this.songReady = true;
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime;
    },
    format(interval) {
      interval = interval | 0;
      const minute = (interval / 60) | 0;
      const second = this._pad(interval % 60);
      return minute + ":" + second;
    },
    _pad(num, n = 2) {
      let len = num.toString().length;

      while (len < n) {
        num = "0" + num;
        len++;
      }
      return num;
    },
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN",
      setPlayingState: "SET_PLAYING_STATE",
      setCurrentIndex: "SET_CURRENT_INDEX"
    })
  },
  watch: {
    currentSong() {
      this.$nextTick(() => {
        this.$refs.audio.play();
      });
    },
    playing(newPlaying) {
      const audio = this.$refs.audio;
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause();
      });
    }
  },
  components: {
    ProgressBar
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';
@import '~common/stylus/mixin.styl';

.player {
  .normal-player {
    position: fixed;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    z-index: 150;
    background: $color-bg;
  }

  .background {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.6;
    filter: blur(20px);
  }

  .top {
    position: relative;
    margin-bottom: 25px;
  }

  .back {
    position: absolute;
    top: 0px;
    left: 6px;
    z-index: 50;
  }

  .icon-back {
    display: block;
    padding: 9px;
    font-size: $font-size-xl;
    color: $color-theme;
    transform: rotate(-90deg);
  }

  .title {
    width: 70%;
    margin: 0 auto;
    line-height: 40px;
    text-align: center;
    no-wrap();
    font-size: $font-size-l;
    color: $color-text;
  }

  .suntitle {
    text-align: center;
    line-height: 20px;
    font-size: $font-size-m;
    font-weight: 400;
    color: $color-text;
  }
}

.middle {
  position: fixed;
  width: 100%;
  top: 80px;
  bottom: 170px;
  white-space: nowrap;
  font-size: 0;

  .middle-l {
    display: inline-block;
    vertical-align: top;
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 80%;

    .cd-wrapper {
      position: absolute;
      left: 10%;
      top: 0;
      width: 80%;
      height: 100%;

      .cd {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        border: 10px solid rgba(255, 255, 255, 0.1);
        border-radius: 50%;

        .image {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }

        &.play {
          animation: rotate 20s linear infinite;
        }

        &.pause {
          animation-play-state: paused;
        }
      }
    }
  }

  .playing-lyric {
    width: 80%;
    overflow: hidden;
    text-align: center;
    margin: 30px auto 0;

    .playing-lyric {
      height: 20px;
      line-height: 20px;
      font-size: $font-size-m;
      color: $color-text-l;
    }
  }

  .middle-r {
    display: inline-block;
    vertical-align: top;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .playing-lyric {
      width: 80%;
      margin: 0 auto;
      text-align: center;
      overflow: hidden;

      .text {
        line-height: 32px;
        font-size: $font-size-m;
        color: $color-text-l;

        &.current {
          color: $color-text;
        }
      }
    }
  }
}

.bottom {
  position: absolute;
  bottom: 50px;
  width: 100%;

  .dot-wrapper {
    text-align: center;
    font-size: 0;

    .dot {
      display: inline-block;
      vertical-align: middle;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $color-text-l;

      &.active {
        width: 20px;
        border-radius: 5px;
        background: $color-text-ll;
      }
    }
  }
}

.progress-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80%;
  margin: 0px auto;
  padding: 10px 0;

  .time {
    color: $color-text;
    font-size: $font-size-s;
    // flex:30px;
    line-height: 30px;
    width: 30px;

    &.time-l {
      text-align: left;
    }

    &.time-r {
      text-align: right;
    }
  }

  .progress-bar-wrapper {
    // flex: 1;
    width: 80%;
  }
}

.operators {
  display: flex;
  align-items: center;
  justify-content: space-around;

  // box-sizing: border-box;
  // padding: 0 10px;
  .icon {
    flex: 1;
    color: $color-theme;

    &.disabled {
      color: $color-theme-d;
    }

    i {
      font-size: 30px;
    }
  }

  .i-left {
    text-align: right;
  }

  .i-center {
    padding: 0 20px;
    text-align: center;

    .icon-play {
      font-size: 40px;
    }

    .icon-pause {
      font-size: 40px;
    }
  }

  .i-right {
    text-align: left;
  }

  .icon-favorite {
    color: $color-sub-theme;
  }
}

.normal-enter-active, .normal-leave-active {
  transition: all 0.4s;

  .top, .bottom {
    transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
  }
}

.normal-enter, .normal-leave-to {
  opacity: 0;

  .top {
    transform: translate3d(0, -100px, 0);
  }

  .bottom {
    transform: translate3d(0, 100px, 0);
  }
}

.mini-player {
  // box-sizing: border-box;
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 180;
  width: 100%;
  height: 60px;
  background: $color-hl-bg;

  // padding: 0 130px 0 70px;
  &.mini-enter-active, &.mini-leave-active {
    transition: all 0.4s;
  }

  &.mini-enter, &.mini-leave-to {
    opacity: 0;
  }

  .img {
    // position: absolute;
    // top: 10px;
    // left: 20px;
    flex: 0 0 40px;
    width: 40px;
    padding: 0 10px 0 20px;

    img {
      border-radius: 50%;

      &.play {
        animation: rotate 10s linear infinite;
      }

      &.pause {
        animation-play-state: paused;
      }
    }
  }

  .text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;

    // width: 100%;
    // height: 100%;
    .name {
      margin-bottom: 2px;
      // line-height: 20px;
      no-wrap();
      font-size: $font-size-m;
      color: $color-text-d;
    }

    .desc {
      no-wrap();
      font-size: $font-size-s;
      color: $color-text-d;
    }
  }

  .control {
    width: 100px;
    position: absolute;
    top: 10px;
    right: 20px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    // flex: 0 0 30px;
    // width: 30px;
    // padding: 0 10px;
    .icon-play-mini, .icon-pause-mini, .icon-playlist {
      font-size: 30px;
      color: $color-theme-d;
    }

    .icon-play-mini, .icon-pause-mini {
      // position: absolute;
      // left: 0;
      // top: 0;
      font-size: 36px;
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>