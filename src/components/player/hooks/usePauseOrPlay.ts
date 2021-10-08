import { ref } from "vue";

export default function($store: any) {
  let isReady = ref(false);
  function pauseOrPlay() {
    // console.log(isReady.value);
    // if (!isReady.value) return;
    $store.commit("player/setPlayState", !$store.state.player.isPlaying);
  }

  function errorHandler() {
    isReady.value = true;
  }

  return {
    isReady,
    pauseOrPlay,
    errorHandler,
  };
}
