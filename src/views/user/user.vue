<template>
  <div class="user" v-noResult:[noResultText]="isNone">
    <div class="header">
      <Switcher
        :items="items"
        v-model:currentIndex="currentIndex"
        style="height:50px"
      >
        <i class="icon-back" @click="goBack"></i>
      </Switcher>
    </div>
    <div class="randomPlayBox">
      <RandomBtn class="random" :songs="defaultPlayList"></RandomBtn>
    </div>
    <div class="listBox">
      <div
        v-for="(list, index) of ListArr"
        v-show="currentIndex == index"
        class="songListBox"
      >
        <Scroll
          :probeType="2"
          :click="true"
          :style="{ height: scrollReallyHeight + 'px' }"
          ref="ScrollRef"
          v-show="list.length"
        >
          <SongList
            v-show="list.length"
            :songs="list"
            @songSelected="songSelectedHandler"
          ></SongList>
          <!-- <div class="backup" v-else>123213</div> -->
        </Scroll>

        <!-- <div class="backup" v-else>123213</div> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  watch,
  nextTick,
} from "vue";
import Switcher from "@/components/switcher/switcher.vue";
import { useRouter } from "vue-router";
import RandomBtn from "@/components/randomBtn/randomBtn.vue";
import SongList from "@/components/song-list/song-list.vue";
import Scroll from "@/components/wrap-scroll/wrap-scroll";
import { useStore } from "vuex";
export default defineComponent({
  name: "user",
  setup() {
    const $router = useRouter();
    const $store = useStore();
    const scrollHeight = window.innerHeight - 160;

    const ScrollRef = ref();
    const items = ref(["我喜欢的", "最近播放"]);
    let currentIndex = ref(0);

    let favList = computed(() => $store.state.player.favList);
    let recentPlay = computed(() => $store.state.playHistory);
    let playList = computed(() => $store.state.player.playList);
    const ListArr = computed(() => [favList.value, recentPlay.value]);
    let defaultPlayList = computed(() => ListArr.value[currentIndex.value]);
    let noResultText = computed(() => {
      let name = currentIndex.value ? "最近播放歌曲" : "收藏歌曲";
      return `暂无${name}`;
    });
    let isNone = computed(() => !defaultPlayList.value.length);
    let scrollReallyHeight = computed(() => {
      return playList.value.length ? scrollHeight - 60 : scrollHeight;
    });

    onMounted(() => {
      watch(currentIndex, async () => {
        await nextTick();
        ScrollRef.value.scroll.refresh();
      });
    });

    function goBack() {
      $router.back();
    }

    function songSelectedHandler(songInfo: obj) {
      $store.dispatch("player/addSong", songInfo.song);
    }

    return {
      items,
      currentIndex,
      scrollReallyHeight,
      ScrollRef,
      noResultText,
      isNone,

      favList,
      recentPlay,
      defaultPlayList,
      ListArr,

      goBack,
      songSelectedHandler,
    };
  },
  components: {
    Switcher,
    RandomBtn,
    SongList,
    Scroll,
  },
});
</script>

<style lang="scss" scoped>
.user {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  z-index: 10;
  background-color: #222;
  .randomPlayBox {
    position: relative;
    // overflow: hidden;
    height: 80px;
    .random {
      border-color: $color-text-ll;
      color: $color-text-ll;
      width: 160px;
    }
  }
  .icon-back {
    position: absolute;
    left: 0px;
    height: 100%;
    line-height: 50px;
    width: 40px;
    text-align: center;
    color: $color-theme;
  }
}
</style>
