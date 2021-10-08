<template>
  <scroll class="scroll" ref="scrollRef" :probeType="3" :click="true">
    <div class="list">
      <ul class="groupList" ref="listRef">
        <li v-for="(group, idx) of list" :key="group.title">
          <h2 class="tit">{{ group.title }}</h2>
          <ul class="singerList" @click="checkSingerDetail">
            <li
              v-for="(singer, index) of group.list"
              :key="singer.id"
              :data-listIndex="idx"
              :data-singerIndex="index"
              class="singerItem"
            >
              <div class="avatar">
                <img v-lazy="singer.pic" alt="" />
              </div>
              <div class="name">
                <span>{{ singer.name }}</span>
              </div>
            </li>
          </ul>
        </li>
      </ul>
      <teleport to=".singer">
        <h2 class="fixed tit" v-show="scrollY > 0" :style="fixedStyle">
          {{ fixedTitle }}
        </h2>
        <div class="title-list">
          <ul
            @touchstart.stop.prevent="getDistance"
            @touchmove.stop.prevent="moving"
            @touchend.stop.prevent="scrollToTitle"
            ref="shortCutRef"
          >
            <li
              v-for="(i, index) of list"
              :class="{ active: currentIndex == index }"
              :data-title="i.title"
              :style="{ height: shortCutHeight + 'px' }"
              :data-index="index"
            >
              {{ i.title }}
            </li>
          </ul>
        </div>
      </teleport>
    </div>
  </scroll>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import scroll from "@/components/wrap-scroll/wrap-scroll";
import useFixed from "./hooks/useFixed";
import useShortCut from "./hooks/useShortCut";

import { findParentByClassName } from "@/utils/dom";
export default defineComponent({
  name: "singer-list",
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["sendSingerInfo"],
  setup(props, context) {
    let {
      listRef,
      fixedTitle,
      scrollRef,
      scrollY,
      fixedStyle,
      currentIndex,
      mapTitleToHeight,
    } = useFixed(props);
    let shortCutHeight = ref(18);
    let { getDistance, scrollToTitle, moving, shortCutRef } = useShortCut(
      props,
      mapTitleToHeight,
      scrollRef,
      shortCutHeight
    );
    function checkSingerDetail(e: any) {
      if (e.target.tagName == "LI") {
        let singer = getSinger(e.target);
        context.emit("sendSingerInfo", singer);
      } else {
        let parent = findParentByClassName(e.target, "singerItem");
        let singer = getSinger(parent!);
        context.emit("sendSingerInfo", singer);
      }
    }
    function getSinger(el: HTMLElement) {
      let idx = Number(el!.dataset.listindex);
      let singerId = Number(el!.dataset.singerindex);
      let Singer = (props.list[idx] as any).list[singerId];
      return Singer;
    }
    return {
      listRef,
      fixedTitle,
      scrollRef,
      scrollY,
      fixedStyle,
      currentIndex,
      getDistance,
      scrollToTitle,
      moving,
      shortCutHeight,
      shortCutRef,
      checkSingerDetail,
    };
  },
  components: {
    scroll,
  },
});
</script>

<style scoped lang="scss">
.scroll {
  // position: relative;
  // bottom: 60px;
}
.tit {
  background-color: rgb(49, 49, 49);
  height: 30px;
  line-height: 30px;
  box-sizing: border-box;
  padding: 0 25px;
  color: $color-text-l;
  font-size: 15px;
}
.active {
  color: $color-theme;
}
.fixed {
  position: fixed;
  top: 92px;
  width: 100%;
  background-color: rgb(49, 49, 49);
}
.list {
  position: relative;
}
.title-list {
  position: fixed;
  top: 60%;
  transform: translateY(-50%);
  right: 8px;
  font-size: 12px;
  color: $color-text-l;
  ul {
    background-color: rgb(15, 15, 15);
    padding: 10px 0px;
    border-radius: 20px;
  }
  li {
    text-align: left;
    text-align: center;
    width: 28px;
    line-height: 18px;
  }
}

.groupList {
  .singerList {
    box-sizing: border-box;
    li {
      display: flex;
      align-items: center;
      height: 70px;
      padding: 0 25px;
      .avatar {
        width: 50px;
        border-radius: 50%;
        overflow: hidden;
        img {
          width: 100%;
        }
      }
      .name {
        font-size: 14px;
        margin-left: 20px;
        color: $color-text-l;
      }
    }
  }
}
</style>
