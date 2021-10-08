import {
  h,
  mergeProps,
  withCtx,
  renderSlot,
  ref,
  computed,
  watch,
  nextTick,
  normalizeStyle,
} from "vue";
import { useStore } from "vuex";
import Scroll from "@/components/scroll/scroll.vue";
export default {
  name: "wrap-scroll",
  class: "scroll",
  props: Scroll.props,
  emits: Scroll.emits,
  //   style: normalizeStyle(ctx.scrollHeight),
  render(ctx: obj) {
    return h(
      Scroll,
      mergeProps({ ref: "wrapperRef" }, ctx.$props, {
        style: ctx.scrollerHeight,
      }),
      {
        default: withCtx(() => {
          return [renderSlot(ctx.$slots, "default")];
        }),
      }
    );
  },
  setup() {
    let wrapperRef = ref();
    let $store = useStore();
    let playList = computed(() => $store.state.player.playList);
    let scroll = computed(() => wrapperRef.value.scroll);
    let height = window.innerHeight;
    let contentHeight = height - 90;
    watch(playList, () => {
      nextTick(() => {
        scroll.value.refresh();
      });
    });

    let scrollerHeight = computed(() => {
      return {
        height: playList.value.length
          ? `${contentHeight - 60}px`
          : `${contentHeight}px`,
      };
    });

    return {
      wrapperRef,
      scroll,
      scrollerHeight,
    };
  },
};
