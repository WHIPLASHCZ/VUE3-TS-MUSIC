<template>
  <div class="playTab">
    <slot></slot>
    <ul class="tabs">
      <li
        v-for="(i, idx) of items"
        :class="{ active: currentIndex == idx }"
        :data-idx="idx"
        @click="changeOver(idx)"
      >
        {{ i }}
      </li>
      <div class="activeBar" :style="activeBoxPosition"></div>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "switcher",
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    currentIndex: {
      type: Number,
      default: 0,
    },
  },
  emits: ["update:currentIndex"],
  setup(props, context) {
    let activeBoxPosition = computed(() => {
      return {
        transform: `translate3d(${props.currentIndex * 110}px,0,0)`,
      };
    });

    function changeOver(idx: number) {
      context.emit("update:currentIndex", idx);
    }

    return {
      activeBoxPosition,
      changeOver,
    };
  },
});
</script>

<style lang="scss" scoped>
.playTab {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.activeBar {
  //  color: $color-text-ll;
  background-color: $color-highlight-background;
  position: absolute;
  width: 110px;
  height: 30px;
  z-index: 0;
  transition: all 0.2s ease-in-out;
}
.tabs {
  display: flex;
  border: 1px solid $color-dialog-background;
  border-radius: 4px;

  .active {
    font-size: 14px;
    color: $color-text-ll;
    // background-color: $color-highlight-background;
  }
  li {
    font-size: 14px;
    width: 110px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-right: 1px solid $color-dialog-background;
    box-sizing: border-box;
    color: $color-text-d;
    z-index: 1;
  }

  li:last-child {
    border-right: none;
  }
}
</style>
