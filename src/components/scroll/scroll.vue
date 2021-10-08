<template>
  <div ref="wrapperRef" class="scroll">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import useScroll from "./hooks/useScroll";
import { nextTick, onMounted, ref, watch, computed } from "vue";
import { useStore } from "vuex";
export default {
  name: "scroll",
  props: {
    click: {
      type: Boolean,
      default: false,
    },
    probeType: {
      type: Number,
      default: 0,
    },
    pullUpLoad: {
      type: Boolean,
      default: false,
    },
    forbid: {
      type: Boolean,
      default: false,
    },
  },
  emits: [],
  setup(props: any) {
    let wrapperRef = ref();
    let $store = useStore();
    let { scroll } = useScroll(wrapperRef, props);
    let height = window.innerHeight;
    let contentHeight = height - 90;
    let playList = computed(() => $store.state.player.playList);
    // let scrollHeight = computed(() => {
    //   return {
    //     height: playList.value.length
    //       ? `${contentHeight - 70}px`
    //       : `${contentHeight}px`,
    //   };
    // });

    return {
      wrapperRef,
      scroll,
      // scrollHeight,
    };
  },
};
</script>

<style scoped lang="scss">
.scroll {
  height: $content-height;
  overflow: hidden;
}
</style>
