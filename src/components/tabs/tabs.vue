<template>
  <div class="tabs">
    <router-link
      v-for="i of tabs"
      :key="i.name"
      :to="i.path"
      class="item"
      active-class="active"
    >
      <div>{{ i.name }}</div>
    </router-link>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
export default {
  name: "tabs",
  setup() {
    let tabs = [
      { name: "推荐", path: "/recommend" },
      { name: "歌手", path: "/singer" },
      { name: "排行", path: "/toplist" },
      { name: "搜索", path: "/search" },
    ];
    let currentIndex = ref(0);
    return {
      tabs,
      currentIndex,
    };
  },
};
</script>

<style lang="scss" scoped>
.tabs {
  display: flex;
  justify-content: space-around;
  z-index: 99;
  height: 40px;
  align-items: center;
  font-size: 14px;
  padding-bottom: 8px;
  background-color: $color-background;
  .item {
    display: block;
    color: $color-text-l;
    width: 25%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    div {
      height: 100%;
      line-height: 40px;
      box-sizing: border-box;
    }
  }
  .active {
    color: $color-theme;
    div {
      border-bottom: 2px solid $color-theme;
    }
  }
}
</style>
