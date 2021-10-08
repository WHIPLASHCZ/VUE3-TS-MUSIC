<template>
  <div class="detail">
    <musicList
      :title="info.name"
      :pic="info.pic"
      :songs="songList"
      :isLoad="isLoad"
    ></musicList>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { getSingerDetail, singerType } from "@/network/singer/singer";
import { SINGER } from "@/globalRegister/consts";
import createDetail from "@/hooks/createDetail/createDetail";

const ctx = createDetail("singerDetail", SINGER, getSingerDetail, "singer");
export default defineComponent(ctx);

// export default defineComponent({
//   name: "singerDetail",
//   props: {
//     singerInfo: {
//       type: Object,
//       required: true,
//     },
//   },
//   setup(props) {
//     let $router = useRouter();
//     let $route = useRoute();
//     let singer = ref();
//     let songList = ref();
//     let isLoad = ref(true);
//     singer.value = Localcache.get(SINGER) || props.singerInfo;
//     let isIDRIGHT = $route.params.id == singer.value.mid;
//     if (!isIDRIGHT) {
//       $router.push({ name: "singer" });
//     }

//     onBeforeMount(async () => {
//       if (!isIDRIGHT) return;
//       let result = await getSingerDetail<objWithSingerType>(
//         singer.value as objWithSingerType
//       );
//       songList.value = await processSongs(result.songs);
//       isLoad.value = false;
//     });
//     return {
//       singer,
//       songList,
//       isLoad,
//     };
//   },
//   components: {
//     musicList,
//   },
// });
</script>

<style lang="scss" scoped>
.detail {
  position: absolute;
  top: 0px;
  z-index: 10;
  background-color: $color-background;
  width: 100%;
  min-height: 100%;
  .imgbox {
    width: 100%;
    img {
      width: 100%;
    }
  }
}
</style>
