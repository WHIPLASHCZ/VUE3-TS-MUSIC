<template>
  <div class="player" v-show="list.length">
    <bubble ref="bubbleRef"></bubble>

    <transition
      name="normal"
      @enter="enter"
      @afterEnter="afterEnter"
      @leave="leave"
      @afterLeave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen && currentSong">
        <div class="top">
          <div class="goback" @click="notFullScreen">
            <div class="iconbox"><i class="icon-back"></i></div>
          </div>
          <h1 class="title">{{ currentSong.name }}</h1>
          <h1 class="singer">{{ currentSong.singer }}</h1>
        </div>
        <div
          class="mid"
          @touchstart.prevent="onMiddleTouchStart"
          @touchmove.prevent="onMiddleTouchMove"
          @touchend.prevent="onMiddleTouchEnd"
          ref="midBoxRef"
        >
          <div class="mid-l" :style="midLStyle">
            <div class="cd-wrapper" ref="cdWrapperRef">
              <div class="cd" ref="cdRef">
                <img
                  :src="currentSong.pic"
                  ref="albumRef"
                  alt=""
                  class="album"
                  :class="{ playing: isPlaying }"
                />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <p class="playing-lyric">{{ playingLyric }}</p>
            </div>
          </div>
          <div class="mid-r" :style="midRStyle">
            <scroll :probeType="3" class="lyricScroll" ref="scrollRef">
              <div class="lyric-wrapper">
                <div v-if="currentLyric" ref="lyricListRef">
                  <p
                    class="text"
                    v-for="(line, index) in currentLyric.lines"
                    :class="{ currentLine: currentLineNum === index }"
                    :key="line.num"
                  >
                    {{ line.txt }}
                  </p>
                </div>
                <div class="pure-music" v-show="pureMusicLyric">
                  <p>{{ pureMusicLyric }}</p>
                </div>
              </div>
            </scroll>
          </div>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span
              class="dot"
              :class="{ activeDot: currentShowPage === 'CD' }"
            ></span>
            <span
              class="dot"
              :class="{ activeDot: currentShowPage === 'lyric' }"
            ></span>
          </div>
          <div class="barbox">
            <span class="time">{{ songCurrentTime }}</span>
            <progressBar
              class="bar"
              :progress="progress"
              @drag="dragHandler"
              @dragDone="dragDoneHandler"
              ref="progressBarRef"
            ></progressBar>
            <span class="holeTime">{{ holeDuration }}</span>
          </div>
          <div class="opt">
            <div class="icon i-left">
              <i :class="playModeIcon" @click="changePlayMode"></i>
            </div>
            <div class="icon i-left">
              <i class="icon-prev" @click="prev" :class="isDisabled"></i>
            </div>

            <div class="icon i-mid">
              <i :class="playIconClass" @click="pauseOrPlay"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-next" @click="next" :class="isDisabled"></i>
            </div>
            <div class="icon i-right">
              <i :class="favorIcon(currentSong)" @click="toggleFavorate"></i>
            </div>
          </div>
        </div>

        <div class="background">
          <div class="filter"></div>
          <img :src="currentSong.pic" alt="" />
        </div>
      </div>
    </transition>
    <miniPlayer :progress="progress" v-show="currentSong"> </miniPlayer>
    <audio
      ref="audioRef"
      @pause="pauseHandler"
      @canplay="ready"
      @error="errorHandler"
      @ended="endedHandler"
      @timeupdate="updateTime"
    ></audio>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch, nextTick } from "vue";
import { useStore } from "vuex";
import useChangePlayMode from "./hooks/useChangePlayMode";
import usePrevAndNext from "./hooks/usePrevAndNext";
import useFavorite from "./hooks/useFavorite";
import progressBar from "@/components/progress-bar/progressbar.vue";
import useShowSoneTimes from "./hooks/useShowSongTimes";
import { turnSecsToMin } from "@/utils/timer";
import useCD from "./hooks/useCD";
import useLyric from "./hooks/useLyric";
import scroll from "@/components/scroll/scroll.vue";
import useToggleCurrentPage from "./hooks/useToggleCDandLyric";
import miniPlayer from "./child/mini-player.vue";
import usePauseOrPlay from "./hooks/usePauseOrPlay";
import useAnimation from "./hooks/useAnimation";
import cantPlay from "@/hooks/cantPlay";
export default defineComponent({
  name: "player",
  setup() {
    let $store = useStore();

    // REF
    let audioRef = ref();
    let currentTime = ref<number>(0);

    // VUEX
    let fullScreen = computed(() => $store.state.player.fullScreen);
    let currentSong = computed(() => $store.getters["player/currentSong"]);
    let list = computed(() => $store.state.player.playList);
    let sequenceList = computed(() => $store.state.player.sequeceList);
    let currentIndex = computed(() => $store.state.player.currentIndex);
    let playIconClass = computed(() => {
      return $store.state.player.isPlaying ? "icon-pause" : "icon-play";
    });
    let isDraging = ref(false);

    // computed
    let isDisabled = computed(() => {
      return isReady.value ? "" : "disabled";
    });

    let { playModeIcon, changePlayMode, loop } = useChangePlayMode(
      $store,
      sequenceList,
      audioRef
    );

    // hookes
    let { bubbleRef, cantNotPlay } = cantPlay();
    let { isReady, pauseOrPlay, errorHandler } = usePauseOrPlay($store);
    let { prev, next, endedHandler } = usePrevAndNext(
      isReady,
      list,
      currentIndex,
      loop,
      $store
    );

    let { toggleFavorate, favorIcon } = useFavorite(
      currentSong,
      $store,
      bubbleRef
    );
    let {
      progress,
      updateTime,
      holeDuration,
      songCurrentTime,
      progressBarRef,
    } = useShowSoneTimes(currentSong, currentTime, isDraging);
    let { isPlaying, cdRef, albumRef } = useCD($store);
    let {
      currentLyric,
      currentLineNum,
      playLyric,
      scrollRef,
      lyricListRef,
      stopLyric,
      pureMusicLyric,
      playingLyric,
    } = useLyric(isReady, currentTime, isPlaying);
    let {
      currentShowPage,
      midLStyle,
      midRStyle,
      midBoxRef,
      forbidScrollY,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd,
    } = useToggleCurrentPage();
    let { cdWrapperRef, enter, afterEnter, leave, afterLeave } = useAnimation();

    // watches
    watch(currentSong, async (newval) => {
      let cantPlay = cantNotPlay(newval);
      let listLen = $store.state.player.playList.length;
      if (cantPlay || !listLen || !newval.url) return;
      await nextTick();
      let audio = audioRef.value;
      isReady.value = false;
      currentTime.value = 0;
      audio.src = newval.url;
      holeDuration.value = turnSecsToMin(newval.duration);
      audio.play();

      $store.commit("player/setPlayState", true);
    });
    watch(
      () => $store.state.player.isPlaying,
      (newval) => {
        let listLen = $store.state.player.playList.length;
        nextTick(() => {
          let audio = audioRef.value;
          if (newval) {
            if (audio.src && currentIndex.value > -1 && listLen) {
              audio.play();
              if (isReady.value) playLyric();
            }
          } else {
            audio.pause();
            stopLyric();
          }
        });
      }
    );
    watch(fullScreen, async (newval) => {
      if (newval && progressBarRef.value) {
        await nextTick(() => {});
        progressBarRef.value.changeBarWidth(progress);
      }
    });

    function dragHandler(progress: number) {
      isDraging.value = true;
      currentTime.value = currentSong.value.duration * progress;
      playLyric(); //跟随拖动时变化的currentTIME滚动到对应歌词
      stopLyric(); //停止自动播放
    }
    function dragDoneHandler(progress: number) {
      isDraging.value = false;
      let jumpTime = currentSong.value.duration * progress;
      audioRef.value.currentTime = jumpTime;
      currentTime.value = jumpTime;
      if (!$store.state.player.isPlaying) {
        $store.commit("player/setPlayState", true);
      }
      if (isPlaying.value) {
        stopLyric();
        playLyric();
      } else {
        stopLyric();
      }
    }
    function pauseHandler() {
      $store.commit("player/setPlayState", false);
      stopLyric();
    }

    function notFullScreen() {
      $store.commit("player/setFullScreen", false);
    }
    function ready() {
      if (isReady.value) return;
      isReady.value = true;
      $store.commit("addPlayedRecord", currentSong.value);
      if (isPlaying.value) playLyric();
    }

    return {
      fullScreen,
      notFullScreen,
      currentSong,
      audioRef,
      playIconClass,
      pauseOrPlay,
      prev,
      next,
      ready,
      isDisabled,
      changePlayMode,
      playModeIcon,
      errorHandler,
      endedHandler,
      pauseHandler,
      toggleFavorate,
      favorIcon,
      bubbleRef,
      progressBar,
      progress,
      updateTime,
      songCurrentTime,
      holeDuration,
      dragDoneHandler,
      dragHandler,
      isPlaying,
      cdRef,
      albumRef,
      currentLyric,
      currentLineNum,
      scrollRef,
      lyricListRef,
      pureMusicLyric,
      playingLyric,

      currentShowPage,
      midLStyle,
      midRStyle,
      midBoxRef,
      forbidScrollY,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd,
      list,
      progressBarRef,

      cdWrapperRef,
      enter,
      afterEnter,
      leave,
      afterLeave,
    };
  },
  components: {
    progressBar,
    scroll,
    miniPlayer,
  },
});
</script>

<style lang="scss" scoped>
.player {
  z-index: 19;
  .normal-player {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    // background-color: chocolate;
    z-index: 19;
    .mid {
      position: relative;
      top: 46px;
      z-index: 10;
      height: 280px;
      display: flex;
      width: 200%;
      right: 0%;
      // transition: all 0.3s ease;
      p,
      .playing-lyric {
        line-height: 26px;
        color: $color-text-ll;
        box-sizing: border-box;
        padding: 0 10px;
        text-align: center;
        font-size: 14px;
      }
      .mid-l {
        width: 100%;
        // transition: all;
        .playing-lyric-wrapper {
          margin-top: 16px;
        }
      }

      .cd-wrapper {
        height: 100%;
        width: 100%;
        text-align: center;
        .cd {
          width: 280px;
          height: 280px;
          // height: 280px;
          text-align: center;
          border-radius: 50%;
          overflow: hidden;
          margin: auto;
          border: 10px rgba(255, 255, 255, 0.2) solid;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          .album {
            // height: 100%;
            width: 290px;
          }
        }
      }

      .mid-r {
        width: 100%;
        height: 312px;
        font-size: 14px;
        text-align: center;
        // transition: all;
        .lyricScroll {
          height: 100%;

          .currentLine {
            font-size: 16px;
            color: $color-theme;
          }
          .pure-music {
            height: 100%;
            p {
              line-height: 312px;
            }
          }
        }
      }
    }
    .playing {
      animation: rotate 20s linear infinite;
    }
    .top {
      position: relative;
      overflow: hidden;
      color: white;
      top: 12px;
      z-index: 19;
      text-align: center;
      //   justify-items: center;
      justify-content: center;
      width: 100%;
      box-sizing: border-box;
      .title {
        font-size: 19px;
        font-family: "Microsoft JhengHei";
        font-weight: bold;
        margin-top: 1px;
        box-sizing: border-box;
        padding: 0 10px;
        // @include no-wrap();
      }
      .singer {
        font-size: 14px;
        margin-top: 10px;
      }
      .goback {
        position: absolute;
        left: 25px;
        .iconbox {
          transform: rotate(-90deg);
          color: $color-theme;
          text-align: start;
          .icon-back {
            font-size: 20px;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      z-index: 19;
      bottom: 50px;
      width: 100%;
      .opt {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        margin-top: 10px;
      }
      [class^="icon-"] {
        font-size: 30px;
        color: $color-theme;
      }
      .i-mid i {
        font-size: 40px;
      }
      .disabled {
        color: $color-theme-d;
      }
      .dot-wrapper {
        text-align: center;
        .dot {
          display: inline-block;
          width: 10px;
          height: 10px;
          background-color: rgba(255, 255, 255, 0.5);
          margin: 0 5px;
          border-radius: 5px;
          transition: all ease 0.3s;
        }
        .activeDot {
          width: 20px;
          background-color: rgba(255, 255, 255, 0.8);
        }
      }
    }
    .background {
      width: 100%;
      height: 100%;
      z-index: 0;
      position: absolute;
      top: 0;
      .filter {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0px;
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(20px);
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
.barbox {
  padding: 0 10px;
  box-sizing: border-box;
  z-index: 19;
  display: flex;
  align-items: center;
  .bar {
    z-index: 19;
    flex: 1;
  }
  .time,
  .holeTime {
    position: relative;
    z-index: 19;
    width: 60px;
    text-align: center;
    font-size: 14px;
  }
}

.normal-enter-active,
.normal-leave-active {
  transition: all 0.3s;
  .top,
  .bottom {
    transition: all 0.3s cubic-bezier(0.45, 0, 0.55, 1);
  }
}
.normal-enter-from,
.normal-leave-to {
  opacity: 0;
  .top {
    transform: translate3d(0, -100px, 0);
  }
  .bottom {
    transform: translate3d(0, 100px, 0);
  }
}
</style>
