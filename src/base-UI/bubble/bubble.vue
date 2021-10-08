<template>
  <teleport to="body">
    <transition name="fade">
      <div class="div" v-show="isShow">{{ title }}</div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { ref } from "vue";
export default defineComponent({
  name: "bubble",
  setup() {
    let title = ref("");
    let isShow = ref(false);
    let timer: any;
    function setTitle(tit: string) {
      title.value = tit;
    }
    function showBubble(tit: string, timeout: number = 2000) {
      setTitle(tit);
      isShow.value = true;
      if (timer) clearInterval(timer);
      timer = setTimeout(() => {
        isShow.value = false;
      }, timeout);
    }
    return {
      title,
      setTitle,
      showBubble,
      isShow,
    };
  },
});
</script>

<style scoped lang="scss">
.div {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0 20px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  color: white;
  text-align: center;
  line-height: 40px;
  border-radius: 20px;
  font-size: 14px;
}
</style>
