<template>
  <div class="header">
    <div alt="" class="logo" />
    <div class="title">WHIPLASH MUSIC</div>
    <i class="icon-mine" @click="goToUser"></i>
  </div>
</template>

<script lang="ts">
import { useRouter } from "vue-router";
export default {
  name: "headers",
  setup() {
    const $router = useRouter();
    function goToUser() {
      $router.push({
        path: "/user",
      });
    }

    return {
      goToUser,
    };
  },
};
</script>

<style lang="scss" scoped>
// @import "@assets/css/mixin.scss";

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  color: $color-theme;
  z-index: 99;
  position: relative;
  // top: 0px;
  background-color: #2222;
  .icon-mine {
    position: absolute;
    right: 0px;
    height: 100%;
    width: 30px;
    line-height: 44px;
    font-size: 16px;
  }
  .logo {
    width: 30px;
    height: 30px;
    @include bg-img("~@/assets/images/logo");
    background-size: contain;
    background-repeat: no-repeat;
  }
  .title {
    margin-left: 6px;
    padding-top: 4px;
  }
}
</style>
