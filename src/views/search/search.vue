<template>
  <div class="search">
    <router-view :listInfo="selectedSinger" v-slot="{ Component }">
      <transition name="slide">
        <component :is="Component" />
      </transition>
    </router-view>
    <div class="search-box">
      <Search-input v-model:searchInfo="searchInfo"></Search-input>
    </div>
    <div class="suggest-box">
      <Suggest
        :query="searchInfo"
        @selectSong="getSelectedSong"
        @selectSinger="getSelectedSinger"
        :showSinger="true"
      ></Suggest>
    </div>
    <div class="hotkeys">
      <HotKeys @sendHotKey="getHotKey"></HotKeys>
    </div>
    <div class="history-box">
      <HistoryList @searchByHistory="searchByHistoryHandler"></HistoryList>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import SearchInput from "@/components/search/search-input.vue";
import HotKeys from "./child/hotkeys.vue";
import Suggest from "./child/suggest.vue";
import HistoryList from "./child/historyList.vue";
import useSearchAndSuggest from "@/hooks/searchAndSuggest/useSchAndSug";
export default defineComponent({
  name: "search",
  setup() {
    let currentHotKey = ref("");
    let {
      searchInfo,
      selectedSong,
      selectedSinger,
      getSelectedSong,
      getSelectedSinger,
    } = useSearchAndSuggest();

    function getHotKey(key: string) {
      currentHotKey.value = key;
      searchInfo.value = key;
    }

    function searchByHistoryHandler(name: string) {
      searchInfo.value = name;
    }
    return {
      searchInfo,
      selectedSinger,
      selectedSong,
      // searchHistory,
      getHotKey,
      getSelectedSong,
      getSelectedSinger,
      searchByHistoryHandler,
      // clearAllHandler,
      // deleteHandler,
    };
  },
  components: {
    SearchInput,
    HotKeys,
    Suggest,
    HistoryList,
  },
});
</script>

<style lang="scss" scoped>
.search {
  width: 100%;
  height: 100%;
  margin: auto;
  // position: relative;
  overflow: hidden;
}
.search-box {
  width: 90%;
  margin: 15px auto 10px;
}
.suggest-box {
  position: relative;
  width: 90%;
  margin: auto;
  overflow: hidden;
}
.hotkeys {
  width: 90%;
  margin: auto;
}
.history-box {
  width: 90%;
  margin: auto;
}
</style>
