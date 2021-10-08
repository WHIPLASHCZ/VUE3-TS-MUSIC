import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Localcache from "@/utils/cache";
import { SINGER, SEARCH_HISTORY } from "@/globalRegister/consts";

export default function useSearchAndSuggest() {
  let searchInfo = ref("");
  let $store = useStore();
  let $router = useRouter();
  let selectedSong = ref<obj>({});
  let selectedSinger = ref<obj>({});

  function getSelectedSong(song: obj) {
    selectedSong.value = song;
    $store.dispatch("player/addSong", song);
    $store.commit("addRecord", song.name);
  }
  function getSelectedSinger(singer: obj) {
    selectedSinger.value = singer;
    $store.commit("addRecord", singer.name);
    Localcache.set(SINGER, singer);
    $router.push({
      path: `/search/${singer.mid}`,
    });
  }

  return {
    searchInfo,
    selectedSong,
    selectedSinger,

    getSelectedSong,
    getSelectedSinger,
  };
}
