<template>
  <teleport to="body">
    <transition name="fall">
      <div class="reminder" v-show="isShow" @click="hide">
        <i class="icon-ok"></i>
        {{ title }}
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "reminder",
  props: {
    title: {
      type: String,
      default: "已成功添加1首歌曲到播放列表",
    },
  },
  setup() {
    let isShow = ref(false);
    let timer: any;
    function mention() {
      isShow.value = true;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        isShow.value = false;
      }, 1000);
    }
    function hide() {
      isShow.value = false;
    }
    return {
      isShow,

      mention,
      hide,
    };
  },
});
</script>

<style lang="scss" scoped>
.reminder {
  z-index: 24;
  position: fixed;
  top: 0px;
  width: 100%;
  height: 40px;
  background-color: $color-dialog-background;
  text-align: center;
  font-size: 14px;
  line-height: 40px;
  color: $color-text-ll;
  //   transform: translate3d(0, -100%, 0);
  .icon-ok {
    color: $color-theme;
  }
}
</style>
