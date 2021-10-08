<template>
  <div class="recommend" v-loading:[loadingText]="isMounted">
    <router-view :listInfo="albumInfo" v-slot="{ Component }">
      <transition name="slide">
        <component :is="Component" />
      </transition>
    </router-view>
    <scroll class="scroll" ref="scrollRef" :click="true">
      <div class="content">
        <div class="sliderbox">
          <slider
            v-if="recommend.sliders.length"
            :sliders="recommend.sliders"
            class="slider"
          ></slider>
        </div>
        <page-list
          v-if="recommend.albums.length"
          :albumList="recommend.albums"
          title="热门歌单推荐"
          @sendAlbumInfo="getAlbumInfo"
        >
          <template v-slot:img="data">
            <div class="img">
              <img v-lazy="data.data" alt="" />
            </div>
          </template>
        </page-list>
      </div>
    </scroll>
  </div>
</template>

<script lang="ts">
import { getRecommend } from "@/network/recommend/recommend";
import { onBeforeMount,onMounted, ref} from "vue";
import slider from '@/components/slider/slider.vue';
import type { recommendType} from './types';
import pageList from './child/pagelist.vue'
import scroll from "@/components/wrap-scroll/wrap-scroll";
import {useRouter} from 'vue-router';
import Localcache from "@/utils/cache";
import {ALBUM} from '@/globalRegister/consts'
export default {
  name: "recommend",
  setup() {
    let recommend = ref<recommendType>({sliders:[],albums:[]});
    let scrollRef = ref<any>();
    let isMounted = ref(true);
    let loadingText = '正在加载推荐页面...';
    let $router = useRouter();
    let albumInfo = ref<obj>({});
    onBeforeMount(async () => {
      recommend.value = await getRecommend();
       isMounted.value = false;

    });

    function getAlbumInfo(album:obj){
      albumInfo.value = album;
      Localcache.set(ALBUM,album);
        $router.push({
         path:`/recommend/${album.id}`
       });
    }
    return{
       recommend,
      scrollRef,
      isMounted,
      loadingText,

      getAlbumInfo,
      albumInfo
    }
  },
  components:{
    slider,
     pageList,
     scroll
  }
};
</script>

<style scoped lang="scss">
.recommend {
  overflow: hidden;
}
.scroll {
  height: $content-height;
}
.sliderbox {
  height: 155px;
}
.img {
  height: 100%;
  margin-right: 20px;
  img {
    height: 100%;
  }
}
</style>
