import BScroll from "@better-scroll/core";
import {
  onMounted,
  ref,
  nextTick,
  onActivated,
  onDeactivated,
  onUnmounted,
} from "vue";
import ObserveDOM from "@better-scroll/observe-dom";
import Pullup from "@better-scroll/pull-up";
BScroll.use(Pullup);
BScroll.use(ObserveDOM);
export default function(wrapperRef: any, options: any) {
  const scroll = ref();
  onMounted(() => {
    scroll.value = new BScroll(wrapperRef.value, {
      observeDOM: true,
      click: true,
      ...options,
      directionLockThreshold: 5,
    });
    nextTick(() => {
      scroll.value.refresh();
    });
  });

  onActivated(async () => {
    await nextTick();
    scroll.value && scroll.value.enable();
    scroll.value && scroll.value.refresh();
  });

  onDeactivated(async () => {
    await nextTick();
    scroll.value && scroll.value.disable();
  });
  onUnmounted(() => {
    scroll.value.destroy();
  });
  return {
    scroll,
  };
}
