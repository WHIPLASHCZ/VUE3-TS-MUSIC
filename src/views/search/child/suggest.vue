<template>
  <div class="suggest" v-show="isShow">
    <scroll
      :click="true"
      class="suggestScroll"
      :style="{ height: scrollHeight + 'px' }"
      v-loading:[loadingText]="isLoading"
      v-noResult:[noResultText]="isNone"
      ref="scrollRef"
      :pullUpLoad="true"
      :probeType="3"
    >
      <ul class="suggest-list" @click="searchBySong($event)">
        <li v-if="singer" class="item singer">
          <i class="icon-mine"></i>
          <div class="desc">{{ singer.name }}</div>
        </li>
        <li
          v-for="(res, idx) of suggestList"
          class="item"
          :key="res.id"
          :data-id="res.id"
          :data-idx="idx"
        >
          <i class="icon-music"></i>
          <div class="desc">{{ res.name }} - {{ res.singer }}</div>
        </li>

        <div
          class="loadMore"
          v-show="isShowLoading"
          v-loading:[loadingText]="isSearching"
        >
          <div v-show="!haveMore">没有更多结果！</div>
        </div>
      </ul>
    </scroll>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
  onMounted,
  computed,
  nextTick,
} from "vue";
import {
  suggestType,
  getSearchSuggest,
  getSearchSuggestWithCancel,
  abort,
} from "@/network/search/search";
import scroll from "@/components/wrap-scroll/wrap-scroll";
import { findParentByClassName } from "@/utils/dom";
import { processSongs } from "@/network/singer/song";
import usePullUp from "../hooks/usePullUp";
import { useStore } from "vuex";
export default defineComponent({
  name: "suggest",
  props: {
    query: {
      type: String,
      default: "",
    },
    showSinger: {
      type: Boolean,
      default: false,
    },
    Height: {
      type: Number,
      default: window.innerHeight - 160,
    },
  },
  emits: ["selectSong", "selectSinger"],
  setup(props, context) {
    let $store = useStore();
    const scrollHeight = computed(() => {
      let height = props.Height;
      return $store.state.player.playList.length ? height - 60 : height;
    });
    let suggestList = ref<any[]>([]);
    let currentSuggestPage = ref(1);
    let errorOrNone = ref(false);
    let haveMore = ref(true);
    let singer = ref("");
    let loadingText = ref("");
    let noResultText = ref("抱歉，没有搜索到相关结果！");
    let isSearching = ref(false);
    let requestClash = ref(false);
    // computed
    let isShow = computed(() => !!props.query);
    let isNone = computed(
      () =>
        props.query &&
        !suggestList.value.length &&
        errorOrNone.value &&
        !requestClash.value
    );
    let isLoading = computed(
      () =>
        (props.query &&
          !suggestList.value.length &&
          !errorOrNone.value &&
          !requestClash.value) ||
        (props.query && requestClash.value && isSearching.value)
    );
    let isShowLoading = computed(
      () =>
        (isPullUpLoad.value && !isNone.value && !requestClash.value) ||
        (!isLoading.value && isSearching.value && !requestClash.value) ||
        (!haveMore.value && !isNone.value && !requestClash.value) ||
        (requestClash.value && suggestList.value.length)
    );

    // hooks
    let { scrollRef, isPullUpLoad, searchForMore } = usePullUp(
      currentSuggestPage,
      suggestList,
      Search,
      props,
      haveMore,
      isSearching
    );

    // watch
    watch(
      () => props.query,
      async (newval) => {
        if (!newval) {
          suggestList.value = [];
          errorOrNone.value = false;
          abort("取消请求");
          return;
        }
        initSearch();
        suggestList.value = await Search(newval);

        scrollRef.value.scroll.refresh();
        if (isNone.value || !props.query) return;
        if (suggestList.value.length && haveMore.value) searchForMore();
      }
    );

    // fn
    function searchBySong(e: obj) {
      let idx = -1;
      let selectedSong: obj;
      let target: HTMLElement;
      if (e.target.tagName == "LI") {
        target = e.target;
      } else {
        target = findParentByClassName(e.target, "item")!;
      }
      idx = Number(target.dataset.idx);
      if (target.classList.contains("singer")) {
        context.emit("selectSinger", singer.value);
      } else {
        selectedSong = suggestList.value[idx];
        context.emit("selectSong", selectedSong);
      }
    }

    function initSearch() {
      currentSuggestPage.value = 1;
      suggestList.value = [];
      haveMore.value = true;
      singer.value = "";
      errorOrNone.value = false;
      isSearching.value = false;
      requestClash.value = false;
    }
    async function Search(newval: string) {
      isSearching.value = true;
      let result = await getSearchSuggestWithCancel({
        query: newval,
        page: currentSuggestPage.value,
        showSinger: props.showSinger,
      }).catch((err) => {
        return { songs: [], hasMore: false, singer: "" };
      });
      haveMore.value = result.hasMore;
      singer.value = result.singer;

      if (props.query && props.query === newval) {
        requestClash.value = false;
      } else {
        requestClash.value = true;
        result = suggestList.value;
        return result;
      }

      if (result.songs && result.songs.length) {
        result.songs = await processSongs(result.songs);
        errorOrNone.value = false;
      } else {
        currentSuggestPage.value > 1 && currentSuggestPage.value--;
        if (props.query && props.query === newval) errorOrNone.value = true;
      }
      result = result.songs;
      nextTick(() => scrollRef.value.scroll.finishPullUp());
      isSearching.value = false;
      return result;
    }
    return {
      suggestList,
      scrollHeight,
      scrollRef,
      haveMore,
      singer,

      isPullUpLoad,
      isLoading,
      isShowLoading,
      isSearching,

      isShow,
      isNone,
      loadingText,
      noResultText,

      searchBySong,
    };
  },
  components: {
    scroll,
  },
});
</script>

<style lang="scss" scoped>
.suggest {
  position: relative;
  background-color: $color-background;
  width: 100%;
  .suggest-list {
    position: absolute;
    background-color: $color-background;
    width: 100%;
    .item {
      display: flex;
      font-size: 14px;
      height: 40px;
      line-height: 40px;
      @include no-wrap();
      .desc {
        overflow: hidden;
        @include no-wrap();
        width: 100%;
      }
      .icon-music,
      .icon-mine {
        width: 36px;
        text-align: center;
        line-height: 40px;
      }
    }
    .loadMore {
      width: 100%;
      height: 40px;
      position: relative;
      background-color: $color-background;
      line-height: 40px;
      text-align: center;
      font-size: 14px;
      color: $color-text-d;
    }
  }
}
.suggestScroll {
  // height: calc(100vh - 220px) !important;
}
</style>
