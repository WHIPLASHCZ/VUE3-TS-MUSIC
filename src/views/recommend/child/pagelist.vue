<template>
  <div class="rec-list">
    <h1 v-if="title">{{ title }}</h1>
    <ul class="list">
      <li v-for="i of albumList" :key="i.id" @click="getAlbumList(i)">
        <slot name="img" :data="i.pic"> </slot>
        <div class="txt">
          <div class="title">{{ i.username }}</div>
          <div class="desc">{{ i.title }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { getAlbum } from "@/network/recommend/recommend";
import { ref } from "vue";
export default {
  name: "page-list",
  emits: ["sendAlbumInfo"],
  props: {
    albumList: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: "",
    },
  },
  setup(props: any, context: any) {
    const result = ref<obj>({});
    async function getAlbumList(album: obj) {
      let resVal = result.value;
      resVal.name = album.title;
      resVal.pic = album.pic;
      resVal.id = album.id;
      let res = await getAlbum(album);
      resVal.songs = res.songs;
      context.emit("sendAlbumInfo", resVal);
    }
    return {
      getAlbumList,
    };
  },
  components: {},
};
</script>
<style scoped lang="scss">
.rec-list {
  max-height: 5000px;
  h1 {
    height: 70px;
    text-align: center;
    line-height: 70px;
    font-size: 14px;
    color: $color-theme;
  }
  .list {
    box-sizing: border-box;
    padding: 0 14px;
    li {
      height: 60px;
      padding-bottom: 10px;
      display: flex;

      .txt {
        box-sizing: border-box;
        padding-top: 10px;
        font-size: 15px;

        .title {
          margin-bottom: 12px;
          font-weight: 600;
        }
        .desc {
          font-size: 14px;
          color: $color-text-d;
          @include no-wrap();
        }
      }
    }
  }
}
</style>
