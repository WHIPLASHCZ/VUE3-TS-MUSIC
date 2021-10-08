<template>
  <div class="toplist" v-loading="isLoading">
    <router-view :listInfo="listInfo" v-slot="{ Component }">
      <transition name="slide">
        <component :is="Component" />
      </transition>
    </router-view>
    <scroll class="scroll" :probeType="3" :click="true" ref="scrollRef">
      <ul class="list-wrapper">
        <li
          v-for="(i, idx) in toplist"
          class="item"
          @click="checkListDetail(i)"
        >
          <div class="imgbox">
            <img v-lazy="i.pic" alt="" />
          </div>
          <div class="songlist">
            <p v-for="(y, idy) of i.songList">
              {{ idy + 1 }}. {{ y.songName }}-{{ y.singerName }}
            </p>
          </div>
        </li>
      </ul>
    </scroll>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "@vue/runtime-core";
import { getTopList } from "@/network/toplist/toplist";
import { ref, onBeforeMount, toRefs } from "vue";
import { useRouter } from "vue-router";
import scroll from "@/components/wrap-scroll/wrap-scroll";
import Localcache from "@/utils/cache";
import { LIST } from "@/globalRegister/consts";
export default defineComponent({
  name: " toplist",
  setup() {
    let toplist = ref();
    let scrollRef = ref();
    let isLoading = ref(true);
    let listInfo = ref<obj>({});
    let $router = useRouter();
    onBeforeMount(async () => {
      toplist.value = await getTopList();
      toplist.value = toplist.value.topList;
      isLoading.value = false;
    });
    onMounted(() => {
      scrollRef.value && scrollRef.value.scroll.refresh();
    });

    function checkListDetail(list: obj) {
      listInfo.value.id = list.id;
      listInfo.value.pic = list.pic;
      listInfo.value.name = list.name;
      $router.push({ path: `/toplist/${list.id}` });
      Localcache.set(LIST, listInfo.value);
      console.log(list);
    }
    return {
      toplist,
      scrollRef,
      isLoading,
      listInfo,
      checkListDetail,
    };
  },
  components: {
    scroll,
  },
});
</script>

<style lang="scss" scoped>
.list-wrapper {
  overflow: hidden;
}
.toplist {
  // padding-top: 30px;
  // position: relative;
  overflow: hidden;
}
.item {
  // margin-bottom: 30px;
  margin: 20px auto 20px;
  height: 100px;
  display: flex;
  background-color: $color-highlight-background;
  font-size: 14px;
  width: 90%;
  letter-spacing: 1px;
  .imgbox {
    width: 33%;
    height: 100%;
    img {
      // width: 100%;
      height: 100px;
    }
  }
  .songlist {
    width: 67%;
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    padding: 10px;
    align-content: space-around;
    color: $color-text-l;
    p {
      @include no-wrap();
      width: 100%;
    }
  }
}
</style>
