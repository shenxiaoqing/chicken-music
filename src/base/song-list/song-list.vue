<template>
  <div class="song-list">
    <ul>
      <li 
        @click="selecItem(song,i)"
        class="item" 
        v-for="(song,i ) in songs" 
        :key="i"
      >
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props:{
    songs:{
      type:Array,
      default:[]
    }
  },
  methods:{
    getDesc(song){
      return `${song.singer}。${song.album}`
    },
    selecItem(item,index){
      // console.log(item)
      this.$emit('select',item,index)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';
@import '~common/stylus/mixin.styl';
.song-list
  .item
    display flex
    align-items center
    box-sizing border-box
    height 64px
    font-size $font-size-m
    .content
      // flex 1
      line-height 20px
      overflow hidden
    .name
      no-wrap()
      color $color-text
    .desc
      no-wrap()
      margin-top 4px
      color $color-text-d
</style>