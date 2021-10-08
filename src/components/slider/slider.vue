<template>
  <div class="slide-wrapper" ref="wrapperRef">
    <div class="slide-content">
      <div class="slide-page" v-for="(i, index) in sliders" :key="index">
        <template v-if="i.pic">
          <a :href="i.link"> <img :src="i.pic" alt=""/></a>
        </template>
        <slot name="el"></slot>
      </div>
    </div>
    <div class="dots">
      <span
        v-for="(i, index) of sliders"
        :key="i.id"
        :class="{ active: index == currentIndex }"
      ></span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ref, watch, withDefaults, defineProps, toRefs } from "vue";
import { getSlide, slideType } from "@/utils/recommend/BS-slide";
import useSlider from "./hooks/useSlider";
export default {
  name: "slider",
  props: {
    sliders: {
      type: Array,
    },
    auto: {
      type: Boolean,
      default: true,
    },
    speed: {
      type: Number,
      default: 400,
    },
    interval: {
      type: Number,
      default: 3500,
    },
  },
  setup(props: any, context: any) {
    let wrapperRef = ref<HTMLElement>();
    let { currentIndex } = useSlider(wrapperRef, props);
    return {
      wrapperRef,
      currentIndex,
    };
  },
};
</script>

<style lang="scss" scoped>
.slide-wrapper {
  position: relative;
  // height: 153px;
  .dots {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    text-align: center;
    span {
      display: inline-block;
      border-radius: 50%;
      width: 10px;
      height: 10px;
      background-color: $color-text-l;
      margin: 0 4px;
      transition: all 0.2s ease;
      box-sizing: border-box;
    }
    .active {
      background-color: rgba(255, 255, 255, 0.8);
      width: 20px;
      border-radius: 10px;
      border: 1px solid #ccc;
    }
  }
}
.slide-content {
  display: flex;
  .slide-page {
    width: 100%;
    // float: left;
    img {
      width: 100%;
    }
  }
}
</style>
