<template>
  <div class="hotSearch">
    <h2 class="title">热门搜索</h2>
    <ul class="keyList" @click="getHotKey($event)">
      <li v-for="key of keysArr">{{ key.key }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeMount } from "vue";
import { getHotKeys } from "@/network/search/search";
export default defineComponent({
  emits: ["sendHotKey"],
  setup(props, context) {
    let keysArr = ref();
    onBeforeMount(async () => {
      keysArr.value = await getHotKeys();
      keysArr.value = keysArr.value!.hotKeys;
    });
    function getHotKey(e: obj) {
      if (e.target.tagName != "LI") return;
      context.emit("sendHotKey", e.target.innerHTML.trim());
    }
    return {
      keysArr,
      getHotKey,
    };
  },
});
</script>

<style lang="scss" scoped>
.title {
  margin: 20px 0 20px 0;
  font-size: 14px;
  color: $color-text-l;
}
.keyList {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  li {
    padding: 5px 10px;
    background-color: $color-highlight-background;
    font-size: 14px;
    color: $color-text-ll;
    margin-right: 18px;
    margin-bottom: 14px;
    border-radius: 5px;
  }
}
</style>
