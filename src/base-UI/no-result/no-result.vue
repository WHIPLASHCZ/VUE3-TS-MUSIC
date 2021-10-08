<template>
  <div class="no-result">
    <div class="content">
      <div class="pic"></div>
      <p class="txt">{{ title }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { ref } from "vue";
export default defineComponent({
  name: "noResult",
  setup() {
    let title = ref("抱歉，没有结果！");
    function setTitle(tit: string) {
      title.value = tit;
    }
    return {
      title,
      setTitle,
    };
  },
});
</script>

<style lang="scss" scoped>
.no-result {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .pic {
    @include bg-img("~@/assets/images/no-result");
    width: 60px;
    height: 60px;
    margin: auto;
    background-size: cover;
    margin-bottom: 10px;
  }
  .content {
    text-align: center;
    .txt {
      line-height: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      text-align: center;
    }
    img {
      width: 30px;
      height: 30px;
    }
  }
}
</style>
