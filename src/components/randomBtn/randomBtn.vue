<template>
  <div class="randomBox" v-show="songs.length" @click="playRandom">
    <div class="playBtn">
      <i class="icon-play"></i>
      <span class="randomTxt">随机播放全部</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";
import { useStore } from "vuex";
export default defineComponent({
  name: "randomBtn",
  props: {
    songs: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const $store = useStore();

    function playRandom() {
      $store.dispatch("player/randomPlay", props.songs);
    }
    return {
      playRandom,
    };
  },
});
</script>

<style lang="scss" scoped>
.randomBox {
  position: absolute;
  color: $color-theme;
  z-index: 5;
  left: 50%;
  transform: translateX(-50%);
  bottom: 40px;
  width: 200px;
  text-align: center;
  height: 30px;
  line-height: 30px;
  border: 1px solid $color-theme;
  border-radius: 20px;
  font-size: 14px;
  background-color: rgba(0, 0, 0, 0.3);
  .randomTxt {
    margin-left: 20px;
  }
  .icon-play {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
