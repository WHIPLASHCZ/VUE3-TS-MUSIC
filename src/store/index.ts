import { createStore, createLogger } from "vuex";
import playerModule from "./player/playerModule";
import { RootState, playerModuleType } from "./types";
import Localcache from "@/utils/cache";
import { SEARCH_HISTORY, PLAY_HISTORY } from "@/globalRegister/consts";
import { State } from "vue3-lazy/dist/types/types";
const debug = process.env.NODE_ENV !== "production";

export default createStore<RootState>({
  state: {
    searchHistory: Localcache.get(SEARCH_HISTORY) || [],
    playHistory: Localcache.get(PLAY_HISTORY) || [],
  },
  mutations: {
    setPlayHistory(state, list) {
      state.playHistory = list;
    },
    addRecord(state, record: string) {
      addRecoredHelper(state.searchHistory, record, SEARCH_HISTORY);
    },
    removeRecord(state, record: string) {
      let dltIdx = state.searchHistory.findIndex(
        (item: string) => item == record
      );
      if (dltIdx == -1) return;
      state.searchHistory.splice(dltIdx, 1);
      Localcache.set(SEARCH_HISTORY, state.searchHistory);
    },
    clearHistory(state) {
      state.searchHistory = [];
      Localcache.set(SEARCH_HISTORY, state.searchHistory);
    },
    addPlayedRecord(state, playedSong: obj) {
      addRecoredHelper(state.playHistory, playedSong, PLAY_HISTORY);
    },
  },
  actions: {},
  modules: {
    player: playerModule,
  },
  // strict: debug,
  // plugins: debug ? [createLogger()] : [],
});

function addRecoredHelper(recordList: any[], record: any, KEY: string) {
  if (recordList.length > 20) recordList.pop();
  let Idx = 0;
  if (typeof record == "object") {
    Idx = recordList.findIndex((item: obj) => item.id == record.id);
  } else if (typeof record == "string") {
    Idx = recordList.findIndex((item: string) => item == record);
  }

  if ((Idx !== -1 && typeof record == "string") || Idx == 0) {
    return;
  } else if (Idx !== -1 && typeof record == "object") {
    recordList.splice(Idx, 1);
  }
  recordList.unshift(record);
  Localcache.set(KEY, recordList);
}
