<template>
  <div class="root">
    <div class="singer" v-loading:[loadingText]="!singerList.length">
      <singerList
        v-if="singerList.length"
        :list="singerList"
        @sendSingerInfo="getSingerInfo"
      ></singerList>
    </div>
    <router-view :listInfo="singer" v-slot="{ Component }">
      <transition name="slide">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts">
import { onBeforeMount, ref } from "vue";
import { getSingerList } from "@/network/singer/singer";
import singerList from "@/components/index-list/index-list.vue";
import { useRouter } from "vue-router";
import type {gotInfos} from '@/types/index'
import type {RouteLocationRaw} from 'vue-router';
import Localcache from "@/utils/cache";
import {SINGER} from '@/globalRegister/consts'
export default {
  name: "singer",
  setup() {
    let singerList = ref([]);
    let $router = useRouter();
    let loadingText = "正在加载歌手列表...";
    let singer = ref({});
    onBeforeMount(async () => {
      getSingerList().then((res) => {
        singerList.value = res.singers;
      });
    });
    function getSingerInfo(singerInfo: any) {
      singer.value = singerInfo;
      Localcache.set(SINGER,singerInfo);
      $router.push({
        path:`/singer/${singerInfo.mid}`,
      });
    }
    return {
      singerList,
      loadingText,
      getSingerInfo,
      singer,
    };
  },
  components: {
    singerList,
  },
};
</script>

<style lang="scss" scoped>
.singer {
  // position: relative;
  height: 100%;
}
.root {
  // position: relative;
  overflow: hidden;
}
</style>
