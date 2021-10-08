<template>
  <div class="loading">
    <div class="loading-content">
      <img src="@/assets/images/loading.gif" alt="" />
      <p class="desc">{{ title }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
export default {
  name: "loading",
  setup() {
    let title = ref("正在加载");
    function setTitle(tit: string) {
      title.value = tit;
    }
    return {
      title,
      setTitle,
    };
  },
};
</script>

<style lang="scss" scoped>
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .loading-content {
    text-align: center;
    .desc {
      line-height: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
    }
    img {
      width: 30px;
      height: 30px;
    }
  }
}
</style>
