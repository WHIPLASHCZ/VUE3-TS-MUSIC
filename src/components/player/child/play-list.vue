<template>
  <teleport to="body">
    <bubble ref="bubbleRef"></bubble>
    <confirm ref="confirmRef" @confirm="confirmHandler"></confirm>
    <AddSong ref="addSongRef"></AddSong>
    <transition name="list-fade">
      <div class="playlist" v-show="visible && playList.length" @click="hide">
        <div class="list-wrapper" @click.stop>
          <div class="list-header">
            <div class="mytitle">
              <i
                class="icon"
                :class="playModeIcon"
                @click.stop="changePlayMode"
              ></i>
              <span class="text">{{ modeText }}</span>
              <div class="clear" @click.stop="clearAll">
                <i class="icon icon-clear"></i>
              </div>
            </div>
          </div>
          <scroll
            class="list-content"
            ref="scrollRef"
            :probeType="3"
            :click="true"
          >
            <transition-group name="list" tag="ul" class="wrapper">
              <li
                class="item"
                v-for="(song, idx) in sequenceList"
                :key="song.id"
                @click.stop="selectItem(song)"
                :class="currentIdx(song)"
              >
                <i class="current" :class="getCurrentIcon(song)"></i>
                <span class="text">{{ song.name }}</span>
                <span class="favorite" @click.stop="toggleFavorate(song)">
                  <i :class="favorIcon(song)"></i>
                </span>
                <span
                  class="delete"
                  @click.stop="removeSong(song)"
                  :class="{ disable: removing }"
                >
                  <i class="icon-delete"></i>
                </span>
              </li>
            </transition-group>
          </scroll>
          <div class="addSong">
            <div class="addSongBtn" @click="addSongToList">
              <i class="icon-add"></i>
              添加歌曲到队列
            </div>
          </div>
          <div class="list-footer" @click.stop="hide">
            <span>关闭</span>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, nextTick } from "vue";
import { useStore } from "vuex";
import scroll from "@/components/scroll/scroll.vue";
import useChangePlayMode from "../hooks/useChangePlayMode";
import useFavorite from "../hooks/useFavorite";
import confirm from "@/base-UI/dialog/dialogs.vue";
import AddSong from "@/components/addSong/addSong.vue";
export default defineComponent({
  setup() {
    const visible = ref(false);
    const removing = ref(false);
    const scrollRef = ref();
    const listRef = ref(null);
    const confirmRef = ref();
    const addSongRef = ref();
    const bubbleRef = ref();

    const store = useStore();
    const playList = computed(() => store.state.player.playList);
    const sequenceList = computed(() => store.state.player.sequeceList);
    const currentSong = computed(() => store.getters["player/currentSong"]);
    const currentIdx = computed(() => {
      return function(song: obj) {
        if (song.id === currentSong.value.id) {
          return "currentItem";
        }
        return "";
      };
    });
    // computed

    // hooks
    let {
      playModeIcon,
      changePlayMode,
      loop,
      playMode,
      modeText,
    } = useChangePlayMode(store, sequenceList);

    let { toggleFavorate, favlist, favorIcon, isInFavList } = useFavorite(
      currentSong,
      store,
      bubbleRef
    );

    watch(currentSong, (newval) => {
      if (!visible.value || !newval.id) return;
      nextTick(() => {
        scrollToCurrent();
      });
    });

    // fn
    function confirmHandler() {
      store.commit("player/clearAll");
      hide();
    }
    function getCurrentIcon(song: obj) {
      if (song.id === currentSong.value.id) {
        return "icon-play";
      }
    }
    function selectItem(song: obj) {
      const index = playList.value.findIndex((item: obj) => {
        return song.id === item.id;
      });
      store.commit("player/setCurrentIndex", index);
      store.commit("player/setPlayState", true);
    }
    function hide() {
      visible.value = false;
    }

    function scrollToCurrent() {
      let childrens = document.querySelector(".wrapper")?.children;
      let idx = currentSong.value.id;
      if (idx < 0) return;
      let currentIdx = sequenceList.value.findIndex(
        (song: obj) => song.id === currentSong.value.id
      );
      let currentEl = childrens![currentIdx];
      scrollRef.value!.scroll.scrollToElement(currentEl, 500, 0);
    }

    function show() {
      visible.value = true;
      nextTick(() => {
        scrollRef.value!.scroll!.refresh();
        scrollToCurrent();
      });
    }
    function removeSong(song: obj) {
      if (removing.value) return;
      removing.value = true;
      store.dispatch("player/removeSong", song);
      if (store.state.player.playList.length < 1) {
        hide();
      }
      setTimeout(() => {
        removing.value = false;
      }, 300);
    }

    function clearAll() {
      if (confirmRef.value) {
        confirmRef.value!.setText("确定清空列表吗？");
        confirmRef.value.show();
        // debugger;
      }
    }

    function addSongToList() {
      console.log("123");

      addSongRef.value.show();
    }

    return {
      visible,
      removing,
      playList,
      sequenceList,
      currentIdx,

      //   Ref
      scrollRef,
      listRef,
      confirmRef,
      addSongRef,
      bubbleRef,

      // mode
      modeText,
      playModeIcon,
      changePlayMode,

      //   favorate
      toggleFavorate,
      favlist,
      favorIcon,
      isInFavList,

      addSongToList,

      getCurrentIcon,
      selectItem,
      hide,
      show,
      removeSong,
      clearAll,
      confirmHandler,
    };
  },
  components: {
    scroll,
    confirm,
    AddSong,
  },
});
</script>

<style lang="scss" scoped>
.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0px;
  z-index: 10;
  user-select: none;
  background-color: $color-background-d;
  .addSong {
    width: 100%;
    height: 60px;
    // line-height: 60px;
    font-size: 14px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    .addSongBtn {
      color: $color-text-l;
      .icon-add {
        font-size: 12px;
        margin-right: 5px;
      }
      display: inline-block;
      width: 150px;
      height: 30px;
      border: 1px solid #ccc;
      line-height: 30px;
      border-radius: 15px;
      text-align: center;
    }
  }
  .list-enter-active,
  .list-leave-active {
    transition: all 0.3s;
  }
  .list-enter-from,
  .list-leave-to {
    height: 0 !important;
  }
  &.list-fade-enter-active,
  &.list-fade-leave-active {
    transition: opacity 0.3s;
    .list-wrapper {
      transition: all 0.3s;
    }
  }
  &.list-fade-enter-from,
  &.list-fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
  .list-wrapper {
    position: fixed;
    left: 0;
    bottom: 0px;
    z-index: 210;
    width: 100%;
    background-color: $color-highlight-background;
    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;
      .mytitle {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 10px;
          font-size: 24px;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
        .clear {
          @include extend-click();
          .icon-clear {
            font-size: 20px;
            color: $color-text-d;
          }
        }
      }
    }
    .list-content {
      max-height: 240px;
      overflow: hidden;
      .currentItem {
        .text {
          color: #fff !important;
        }
        background-color: $color-text-d;
      }
      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;
        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-small;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text-d;
        }
        .favorite {
          @include extend-click();
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
        .delete {
          @include extend-click();
          font-size: $font-size-small;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
        }
      }
    }
    .list-add {
      width: 140px;
      margin: 20px auto 30px auto;
      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid $color-text-l;
        border-radius: 100px;
        color: $color-text-l;
        .icon-add {
          margin-right: 5px;
          font-size: $font-size-small-s;
        }
        .text {
          font-size: $font-size-small;
        }
      }
    }
    .list-footer {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
}
</style>
