<template>
  <teleport to="body">
    <transition name="slide">
      <div class="addSong" v-if="isShow">
        <Reminder ref="reminderRef"></Reminder>
        <div class="header">
          <h2>添加歌曲到列表</h2>
          <i class="icon-close" @click="hide"></i>
        </div>
        <div class="searchBox">
          <SearchInput v-model:searchInfo="searchInfo"></SearchInput>
        </div>
        <div class="suggest-box">
          <div class="suggest-inner">
            <Suggest
              :query="searchInfo"
              @selectSong="getSelectedSong"
              :showSinger="false"
              :Height="scrollHeight"
            ></Suggest>
          </div>
        </div>
        <div class="playTab">
          <Switcher
            :items="switches"
            v-model:currentIndex="currentIndex"
          ></Switcher>
        </div>
        <div class="listBox">
          <div class="recently" v-show="!currentIndex">
            <Scroll
              :click="true"
              :probeType="3"
              :style="{ height: playListHeight + 'px' }"
              ref="recentListRef"
            >
              <SongList
                :songs="playHistory"
                @songSelected="songSelectedHandler"
              ></SongList>
            </Scroll>
          </div>
          <div class="historybox" v-show="currentIndex">
            <div class="backup" v-if="!hasSearchHistory">暂无搜索历史</div>
            <HistoryList
              :showTitle="false"
              :height="historyListHeight"
              :canDelete="false"
              @searchByHistory="searchByHistoryHandler"
              ref="historyListRef"
            ></HistoryList>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import {
  defineComponent,
  nextTick,
  ref,
  watch,
  computed,
  onMounted,
} from "vue";
import Suggest from "@/views/search/child/suggest.vue";
import SearchInput from "@/components/search/search-input.vue";
import useSearchAndSuggest from "@/hooks/searchAndSuggest/useSchAndSug";
import HistoryList from "@/views/search/child/historyList.vue";
import SongList from "@/components/song-list/song-list.vue";
import Reminder from "@/components/reminder/reminder.vue";
import Scroll from "@/components/scroll/scroll.vue";
import Switcher from "@/components/switcher/switcher.vue";
import { useStore } from "vuex";
export default defineComponent({
  name: "addSong",
  setup() {
    const $store = useStore();
    let isShow = ref(false);
    let currentIndex = ref(0);
    const switches = ref(["最近播放", "搜索历史"]);
    const scrollHeight = window.innerHeight - 55;
    const playListHeight = window.innerHeight - 210;
    const historyListHeight = window.innerHeight - 125;
    let historyListRef = ref();
    let playHistory = computed(() => $store.state.playHistory);
    let hasSearchHistory = computed(() => $store.state.searchHistory.length);
    const recentListRef = ref();
    let reminderRef = ref();
    let {
      searchInfo,
      selectedSong,
      selectedSinger,
      getSelectedSong,
    } = useSearchAndSuggest();
    // let activeBoxPosition = computed(() => {
    //   return {
    //     transform: `translate3d(${currentIndex.value * 110}px,0,0)`,
    //   };
    // });

    watch(selectedSong, (newval) => {
      if (newval) {
        reminderRef.value.mention();
      }
    });
    watch(currentIndex, async (newval) => {
      if (newval == 1) {
        await nextTick();
        historyListRef.value.refreshScroll();
      }
    });
    watch(searchInfo, async (newInfo) => {
      if (newInfo == "") {
        await nextTick();
        console.log("刷新");
        historyListRef.value.refreshScroll();
        recentListRef.value.scroll.refresh();
      }
    });

    async function show() {
      console.log("SHOW");
      isShow.value = true;
      await nextTick();
      historyListRef.value.refreshScroll();
      recentListRef.value.scroll.refresh();
    }
    function hide() {
      isShow.value = false;
    }
    async function changeOver(e: obj) {
      currentIndex.value = parseInt(e.target.dataset.idx);
      await nextTick();
      historyListRef.value.refreshScroll();
      recentListRef.value.scroll.refresh();
    }
    function searchByHistoryHandler(name: string) {
      searchInfo.value = name;
    }
    function songSelectedHandler(song: obj) {
      $store.dispatch("player/addSong", song.song);
      reminderRef.value && reminderRef.value.mention();
    }
    return {
      historyListRef,
      recentListRef,
      historyListHeight,

      isShow,
      currentIndex,
      switches,
      // activeBoxPosition,
      scrollHeight,
      playListHeight,

      hasSearchHistory,
      playHistory,

      songSelectedHandler,

      reminderRef,

      searchInfo,
      searchByHistoryHandler,
      selectedSong,
      selectedSinger,

      getSelectedSong,

      //   getSelectedSinger,
      changeOver,
      show,
      hide,
    };
  },
  components: {
    Suggest,
    SearchInput,
    HistoryList,
    SongList,
    Reminder,
    Scroll,
    Switcher,
  },
});
</script>

<style lang="scss" scoped>
.addSong {
  position: fixed;

  top: 0px;
  z-index: 20;
  width: 100%;
  height: 100%;
  background-color: $color-background;
  .backup {
    color: $color-text-l;
    font-size: 14px;
  }
  .header {
    position: relative;
    height: 50px;
    h2 {
      text-align: center;
      line-height: 40px;
      font-size: 18px;
    }
    .icon-close {
      position: absolute;
      right: 0px;
      top: 0px;
      height: 100%;
      width: 40px;
      text-align: center;
      line-height: 40px;
      color: $color-theme;
      //   top: 50%;
      //   transform: translateY(-50%);
    }
  }
  .searchBox {
    width: 90%;
    margin: 0px auto 10px;
    // height: 90px;
    padding: 0px 0 10px 0;
  }
  .suggest-box {
    position: relative;
    background-color: $color-background;
    // overflow: hidden;
    .suggest-inner {
      position: absolute;
      overflow: hidden;
      width: 100%;
      z-index: 12;
      background-color: $color-background;
    }
  }
  .listBox {
    .historybox {
      width: 90%;
      margin: auto;
    }
  }
}
</style>
