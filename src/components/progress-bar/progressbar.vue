<template>
  <div class="progress-bar" ref="barRef" @click="jumpTo">
    <div class="bar-inner">
      <div class="progress" :style="progressStyle" ref="progressRef"></div>
      <div
        class="progress-btn-wrapper"
        ref="btnRef"
        :style="btnStyle"
        @touchstart.prevent="startHandler"
        @touchmove.prevent="moveHandler"
        @touchend.prevent="dragEndHandler"
        muted
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
  onMounted,
  computed,
  onBeforeUnmount,
  nextTick,
} from "vue";
import { useStore } from "vuex";
export default defineComponent({
  name: "progress-bar",
  props: {
    progress: {
      type: Number,
      default: 0,
    },
  },
  emits: ["drag", "dragDone"],
  setup(props, context) {
    let offset = ref(0);
    let $store = useStore();
    let barRef = ref<HTMLElement>();
    const btnWidth = 16;
    let progressRef = ref<HTMLElement>();
    let clickPosition = ref({ x1: 0, x2: 0, beginWidth: 0 });
    let fullScreen = computed(() => $store.state.player.fullScreen);
    let barWidth = ref(0);
    let isDraging = ref(false);
    function startHandler(e: any) {
      clickPosition.value.x1 = e.touches[0].pageX;
      clickPosition.value.beginWidth = progressRef.value?.clientWidth!;
    }
    function moveHandler(e: any) {
      isDraging.value = true;
      let distance = e.touches[0].pageX - clickPosition.value.x1; //拖动距离
      let tempwidth = clickPosition.value.beginWidth + distance; //进度条本身宽度加上拖动距离等于拖动终点
      let progressPercent = Math.min(
        1,
        Math.max(tempwidth / barWidth.value, 0) //拖动距离除以总宽度 得到拖动的长度比例
      ); //百分比
      offset.value = barWidth.value * progressPercent; //进度条宽度等于总宽度乘以拖动比例
      context.emit("drag", progressPercent);
    }
    function dragEndHandler(e: any) {
      isDraging.value = false;
      let progress = progressRef.value!.clientWidth / barWidth.value; //播放进度百分比
      context.emit("dragDone", progress);
    }
    onMounted(() => {
      barWidth.value = barRef.value!.clientWidth - btnWidth;
    });
    function jumpTo(e: any) {
      let clickPosition = e.offsetX;
      let percent = Math.min(1, Math.max(clickPosition / barWidth.value, 0));
      offset.value = barWidth.value * percent;
      context.emit("dragDone", percent);
    }

    let progressStyle = computed(() => {
      return {
        width: `${offset.value}px`,
      };
    });
    let btnStyle = computed(() => {
      return {
        transform: `translate3d(${offset.value}px,0,0)`,
        width: btnWidth + "px",
      };
    });
    function changeBarWidth(progress: any) {
      if (typeof progress == "number") {
        barWidth.value = barRef.value!.clientWidth - btnWidth;
        offset.value = barWidth.value * progress;
      } else if (progress.value) {
        barWidth.value = barRef.value!.clientWidth - btnWidth;
        offset.value = barWidth.value * progress.value;
      }
    }
    watch(
      () => props.progress,
      (newval) => {
        if (isDraging.value) return;
        // offset.value = barWidth.value * newval;
        changeBarWidth(newval);
      }
    );

    return {
      offset,
      barRef,
      btnStyle,
      progressStyle,
      startHandler,
      moveHandler,
      dragEndHandler,
      progressRef,
      jumpTo,
      changeBarWidth,
    };
  },
});
</script>

<style lang="scss" scoped>
.progress-bar {
  height: 30px;
  position: relative;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
      left: 0;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>
