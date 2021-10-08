<template>
  <transition name="mini">
    <div class="mini-player" v-show="isShow" @click="showFullScreen">
      <div class="cd-wrapper">
        <div class="cd" ref="cdRef">
          <img
            width="40"
            height="40"
            :src="currentSong.pic"
            ref="albumRef"
            :class="{ playing: isPlaying }"
          />
        </div>
      </div>
      <div class="slider-wrapper" ref="sliderWrapperRef">
        <div class="slider-content">
          <div class="slider-page" v-for="song in playlist" :key="song.id">
            <h2 class="name">{{ song.name }}</h2>
            <p class="desc">{{ song.singer }}</p>
          </div>
        </div>
      </div>
      <div class="control">
        <div class="playbox" @click.stop="pauseOrPlay">
          <progressCircle :radius="32" :progress="progress">
            <i class="icon-mini" :class="playIcon"></i>
          </progressCircle>
        </div>
        <div class="listbox" @click.stop="showPlayList">
          <i class="icon-playlist"></i>
        </div>
      </div>
      <PlayList ref="PlayListRef"></PlayList>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useStore } from "vuex";
import useCD from "../hooks/useCD";
import progressCircle from "./progress-circle.vue";
import usePauseOrPlay from "../hooks/usePauseOrPlay";
import useMiniSlider from "./hooks/useMiniSlider";
import PlayList from "./play-list.vue";
export default defineComponent({
  name: "lil-player",
  props: {
    progress: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    let $store = useStore();

    let PlayListRef = ref();

    let playlist = computed(() => $store.state.player.playList);
    let currentSong = computed(() => $store.getters["player/currentSong"]);
    let fullScreen = computed(() => $store.state.player.fullScreen);
    let isShow = computed(() => {
      return !!(!fullScreen.value && playlist.value.length);
    });

    let playIcon = computed(() => {
      return $store.state.player.isPlaying
        ? "icon-pause-mini"
        : "icon-play-mini";
    });

    let { isPlaying, cdRef, albumRef } = useCD($store);

    let { sliderWrapperRef } = useMiniSlider(isShow, $store);

    let { pauseOrPlay } = usePauseOrPlay($store);

    function showFullScreen() {
      $store.commit("player/setFullScreen", true);
    }
    function showPlayList() {
      PlayListRef.value.show();
    }
    return {
      currentSong,
      fullScreen,
      isPlaying,
      cdRef,
      albumRef,
      showFullScreen,
      playIcon,
      pauseOrPlay,
      playlist,
      sliderWrapperRef,
      isShow,

      PlayListRef,
      showPlayList,
    };
  },
  components: {
    progressCircle,
    PlayList,
  },
});
</script>

<style lang="scss" scoped>
.mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 10;
  width: 100%;
  height: 60px;
  font-size: 14px;
  background: $color-highlight-background;

  .cd-wrapper {
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    padding: 0 10px 0 20px;
    .cd {
      height: 100%;
      width: 100%;
      img {
        border-radius: 50%;
        &.playing {
          animation: rotate 10s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
      }
    }
  }
  .slider-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;
    .slider-content {
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      .slider-page {
        display: inline-block;
        width: 100%;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
        .name {
          margin-bottom: 2px;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text;
        }
        .desc {
          @include no-wrap();
          font-size: $font-size-small;
          color: $color-text-d;
        }
      }
    }
  }
  .control {
    // flex: 0 0 30px;
    width: 94px;
    // margin-right: 16px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    // padding: 0 10px;
    .playbox {
      @include extend-click();
    }
    .listbox {
      // @include extend-click();
      margin-left: 14px;
      // margin-right: 20px;
      height: 100%;
      display: flex;
      align-items: center;
      position: relative;
      right: 0;
      width: 170px;
    }
    .icon-playlist {
      position: relative;
      top: -3px;
      font-size: 31px;
      color: $color-theme-d;
    }
    .icon-mini {
      position: absolute;
      left: 0;
      top: 0;
      color: $color-theme-d;
      font-size: 31px;
    }
  }
  &.mini-enter-active,
  &.mini-leave-active {
    transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
  }
  &.mini-enter-from,
  &.mini-leave-to {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
}
</style>
