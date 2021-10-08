<template>
  <div class="topDetail">
    <musicList
      :title="info.name"
      :pic="info.pic"
      :songs="songList"
      :isLoad="isLoad"
    >
      <template v-slot:Rank="data">
        <h1 class="rank">
          <template v-if="data.rankData.ranking < 3">
            <div :class="topThree(data.rankData.ranking)"></div>
          </template>
          <template v-else>
            <span>{{ data.rankData.ranking + 1 }}</span>
          </template>
        </h1>
      </template>
    </musicList>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import createDetail from "@/hooks/createDetail/createDetail";
import { LIST } from "@/globalRegister/consts";
import musicList from "@/components/musicList/music-list.vue";
import { getTopDetail } from "@/network/toplist/toplist";
export default defineComponent(
  createDetail("topDetail", LIST, getTopDetail, "toplist")
);
</script>

<style lang="scss" scoped>
.topDetail {
  position: absolute;
  top: 0px;
  z-index: 9;
  background-color: $color-background;
  width: 100%;
  min-height: 100%;
  .rank {
    width: 50px !important;
    // text-align: center;
    box-sizing: border-box;
    // padding-left: 8px;
    line-height: 40px;
    font-size: 20px;
    color: $color-theme;
    span {
      padding-left: 10px;
    }
  }
}
.top1,
.top2,
.top3 {
  background-size: cover;
  margin: 0;
  margin-top: 5px;
  width: 30px;
  height: 30px;
}
.top1 {
  @include bg-img("~@/assets/images/first");
}
.top2 {
  @include bg-img("~@/assets/images/second");
}
.top3 {
  @include bg-img("~@/assets/images/third");
}
</style>
