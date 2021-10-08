import { RootState, playerModuleType } from "../types";
import { Module } from "vuex";
import { playMode } from "@/types";
import { shuffle } from "@/utils/shuffle";
import { FAVLIST } from "@/globalRegister/consts";
import { processSongs } from "@/network/singer/song";
let object: obj = {};
import localCache from "@/utils/cache";
interface songListType {
  index: number;
  list: any[];
}
let mode: playMode[] = ["sequence", "loop", "random"];

const playerModule: Module<playerModuleType, RootState> = {
  namespaced: true,
  state: {
    sequeceList: [],
    playList: [],
    isPlaying: false,
    playMode: "sequence",
    currentIndex: 0,
    fullScreen: false,
    favList: localCache.get(FAVLIST) || [],
    maxFav: 100,
  },
  getters: {
    currentSong(state) {
      return state.playList[state.currentIndex] || {};
    },
  },
  mutations: {
    setPlayState(state, playing: boolean) {
      state.isPlaying = playing;
    },
    setSequeceList(state, list: any[]) {
      let newlist = [...list];
      state.sequeceList = newlist;
    },
    setPlayMode(state, mode: playMode) {
      state.playMode = mode;
    },
    setFullScreen(state, full: boolean) {
      state.fullScreen = full;
    },
    setPlayList(state, list: any[]) {
      let newlist = [...list];
      state.playList = newlist;
    },
    setCurrentIndex(state, index: number) {
      if (index === state.currentIndex) return;
      state.currentIndex = index;
    },
    setFavList(state, list) {
      state.favList = list;
    },
    addToFavList(state, song: obj) {
      if (state.favList.length >= state.maxFav) {
        state.favList.shift();
      }
      state.favList.push(song);
    },
    removeFromFavList(state, index: number) {
      state.favList.splice(index, 1);
    },
    addLyric(state, { mid, lyric }) {
      let currentIdx = state.playList.findIndex((song) => song.mid === mid);
      if (currentIdx < 0) return;
      state.playList[currentIdx].lyric = lyric;
    },
    removeFromPlayList(state, idx) {
      state.playList.splice(idx, 1);
    },
    removeFromSeqList(state, idx) {
      state.sequeceList.splice(idx, 1);
    },
    clearAll(state) {
      state.playList = [];
      state.sequeceList = [];
      state.isPlaying = false;
      state.currentIndex = -1;
    },
    cantPlay(state, index) {
      if (!state.playList[index] || !state.playList[index].url) {
        return true;
      }
      return false;
    },
  },
  actions: {
    addSong({ commit, state }, song) {
      let playIdx = state.playList.findIndex((s) => s.id == song.id);
      let sequenceIdx = state.sequeceList.findIndex((s) => s.id == song.id);
      if (playIdx == -1) {
        state.playList.push(song);
        commit("setCurrentIndex", state.playList.length - 1);
      } else {
        commit("setCurrentIndex", playIdx);
      }
      if (sequenceIdx === -1) {
        state.sequeceList.push(song);
      }
      commit("setPlayState", true);
      commit("setFullScreen", true);
    },
    selectPlay({ commit }, payload: songListType) {
      commit("setPlayMode", "sequence");
      commit("setSequeceList", payload.list);
      commit("setPlayState", true);
      commit("setFullScreen", true);
      commit("setPlayList", payload.list);
      commit("setCurrentIndex", payload.index);
      return commit("cantPlay", payload.index);
    },
    randomPlay({ commit, state }, list: any[]) {
      commit("setSequeceList", list);
      let randomList = shuffle(list);
      commit("setPlayMode", "random");
      // commit("setSequeceList", randomList);
      commit("setPlayList", randomList);
      commit("setPlayState", true);
      commit("setFullScreen", true);

      commit("setCurrentIndex", 0);
      return commit("cantPlay", state.currentIndex);
    },
    changePlayMode({ commit, state, getters }) {
      let originIdx = mode.indexOf(state.playMode);
      let newPlayMode = mode[(originIdx + 1) % mode.length];
      let currentId = getters.currentSong.mid;
      commit("setPlayMode", newPlayMode);
      if (state.playMode == "random") {
        commit("setPlayList", shuffle(state.sequeceList));
      } else if (state.playMode == "sequence") {
        commit("setPlayList", state.sequeceList);
      } else {
        commit("setPlayList", state.sequeceList);
      }
      let index = state.playList.findIndex((song) => song.mid === currentId);
      commit("setCurrentIndex", index);
    },
    removeSong({ commit, state }, song) {
      let newPlayList = state.playList;
      let newSeqList = state.sequeceList;
      let seqIdx = state.sequeceList.findIndex(
        (item: obj) => item.id === song.id
      );
      let playIdx = state.playList.findIndex(
        (item: obj) => item.id === song.id
      );
      if (playIdx < 0) return;
      newPlayList.splice(playIdx, 1);
      newSeqList.splice(seqIdx, 1);

      let curIdx = state.currentIndex;
      if (
        playIdx < state.currentIndex ||
        state.currentIndex === state.playList.length
      ) {
        curIdx--;
      }
      commit("setSequeceList", newSeqList);
      commit("setPlayList", newPlayList);
      commit("setCurrentIndex", curIdx);
      if (!newPlayList.length) {
        commit("setPlayState", false);
      }
    },
  },
};

export default playerModule;
