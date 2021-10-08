<template>
  <ul class="songlist">
    <li
      class="item"
      v-for="(song, index) in songs"
      :key="song.id"
      @click="listenSong(song, index)"
    >
      <slot name="rank" :ranking="index"></slot>
      <div class="content">
        <h2 class="name">{{ song.name }}</h2>
        <p class="desc">{{ getDesc(song) }}</p>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/runtime-core";
import { useStore } from "vuex";

export default defineComponent({
  name: "song-list",
  props: {
    songs: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["songSelected"],
  setup(props, context) {
    let $store = useStore();
    let currentIndex = computed(() => $store.state.player.currentIndex);
    function getDesc(song: any) {
      return `${song.singer} - ${song.name}`;
    }
    function listenSong(song: any, index: number) {
      context.emit("songSelected", { song, index });
    }
    return {
      getDesc,
      listenSong,
      currentIndex,
    };
  },
  components: {},
});
</script>

<style lang="scss" scoped>
.songlist {
  padding-top: 20px;
  box-sizing: border-box;
  position: relative;
  background-color: $color-background;
  .item {
    height: 70px;
    padding: 10px 25px;
    box-sizing: border-box;
    display: flex;
    overflow: hidden;
    .content {
      flex: 1;
      overflow: hidden;
    }
    .name {
      font-family: "Microsoft JhengHei";
      font-size: 15px;
      font-weight: bold;
      @include no-wrap();
    }
    .desc {
      margin-top: 10px;
      color: $color-text-l;
      font-size: 13px;
      @include no-wrap();
    }
  }
  .active {
    background-color: $color-highlight-background;
    color: $color-theme;
  }
}
</style>
