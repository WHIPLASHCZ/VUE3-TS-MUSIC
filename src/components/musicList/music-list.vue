<template>
  <div class="musiclist">
    <div class="top" :style="{ zIndex: zIndex }">
      <div class="opt" ref="optRef">
        <div class="goback" @click="goBack"><i class="icon-back"></i></div>
        <h3>
          {{ title }}
        </h3>
      </div>
      <RandomBtn v-show="showRandom" :songs="songs"></RandomBtn>
      <div class="bg-image" :style="bgImgStyle" ref="imgRef"></div>
      <div class="filter" :style="filterStyle"></div>
    </div>
    <scroll
      class="list"
      v-loading="isLoad"
      v-noResult="!isLoad && !songs.length"
      ref="scrollRef"
      :probeType="3"
      :style="{ top: scrollOffsetTop + 'px', height: scrollHeight + 'px' }"
      :click="true"
    >
      <songList
        :songs="songs"
        @songSelected="songSelectedHandler"
        class="songlist"
      >
        <template v-slot:rank="data">
          <slot name="Rank" :rankData="data"></slot>
        </template>
      </songList>
    </scroll>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  watch,
  computed,
  nextTick,
} from "vue";
import { useRouter } from "vue-router";
import scroll from "@/components/wrap-scroll/wrap-scroll";
import songList from "@/components/song-list/song-list.vue";
import useScrollUpStyles from "./hooks/useScrollUpStyles";
import { useStore } from "vuex";
import player from "@/components/player/player.vue";
import RandomBtn from "@/components/randomBtn/randomBtn.vue";
import cantPlay from "@/hooks/cantPlay";
export default defineComponent({
  name: "music-list",
  props: {
    title: String,
    pic: String,
    songs: {
      type: Array,
      default: () => [],
    },
    isLoad: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    let $router = useRouter();
    let $store = useStore();
    let {
      bgImgStyle,
      zIndex,
      scrollRef,
      scrollOffsetTop,
      imgRef,
      imgHeight,
      scrollLimits,
      scrollY,
      filterStyle,
      showRandom,
    } = useScrollUpStyles(props);

    let scrollHeight = computed(() => {
      let listlen = $store.state.player.playList.length;
      nextTick(() => {
        scrollRef.value && scrollRef.value.scroll.refresh();
      });
      return listlen ? window.innerHeight - 320 : window.innerHeight - 260;
    });

    function goBack() {
      $router.back();
    }

    function playRandom() {
      $store.dispatch("player/randomPlay", props.songs);
    }

    function songSelectedHandler(songInfo: obj) {
      $store.dispatch("player/selectPlay", {
        index: songInfo.index,
        list: props.songs,
      });
    }

    onMounted(() => {
      imgHeight.value = imgRef.value?.clientHeight!;
      scrollLimits.value = -(imgHeight.value - 46);
      scrollOffsetTop.value = imgHeight.value;
      scrollRef.value?.scroll.on("scroll", (pos: any) => {
        scrollY.value = pos.y;
      });
    });
    return {
      goBack,
      bgImgStyle,
      zIndex,
      scrollRef,
      scrollOffsetTop,
      scrollHeight,
      imgRef,
      imgHeight,
      scrollLimits,
      filterStyle,
      songSelectedHandler,
      showRandom,
      playRandom,
    };
  },
  components: {
    songList,
    scroll,
    player,
    RandomBtn,
  },
});
</script>

<style scoped lang="scss">
.musiclist {
  .top {
    position: relative;
    // overflow: hidden;
    .opt {
      overflow: hidden;
      position: absolute;
      width: 100%;
      top: 14px;
      padding: 0 20px;
      box-sizing: border-box;
      z-index: 60;
    }
    h3 {
      text-align: center;
      width: 100%;
      float: left;
      font-size: 18px;
      //   font-weight: 600;
    }
    .goback {
      position: absolute;
      //   padding-top: 1px;
      .icon-back {
        font-size: 18px;
        color: $color-theme;
      }
    }
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
    .bg-image {
      //   transform-origin: top;
      background-size: cover;
    }
  }
  .list {
    // height: calc(100vh - 350px);
    width: 100%;
    z-index: 5;
    position: absolute;
    overflow: inherit;
    bottom: 80;
  }
  .filter {
    position: absolute;
    top: 0px;
    width: 100%;
    height: 100%;

    background-color: rgba(0, 0, 0, 0.1);
  }
}
</style>
