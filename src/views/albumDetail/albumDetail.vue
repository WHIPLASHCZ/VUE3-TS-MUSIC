<template>
  <div class="album">
    <musicList
      :title="info.name"
      :pic="info.pic"
      :songs="songList"
      :isLoad="isLoad"
    ></musicList>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ALBUM } from "@/globalRegister/consts";
import { getAlbum } from "@/network/recommend/recommend";
import createDetail from "@/hooks/createDetail/createDetail";
const ctx = createDetail("albumDetail", ALBUM, getAlbum, "recommend");
export default defineComponent(ctx);
</script>

<style lang="scss" scoped>
.album {
  position: absolute;
  z-index: 9;
  background-color: $color-background;
  width: 100%;
  min-height: 100%;
  overflow: hidden;
  top: 0;
}
</style>
