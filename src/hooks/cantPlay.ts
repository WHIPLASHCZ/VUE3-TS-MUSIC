import { useStore } from "vuex";
import { ref, nextTick } from "vue";
export default function cantPlay() {
  let bubbleRef = ref();
  let $store = useStore();
  function cantNotPlay(songInfo: obj) {
    let listLen = $store.state.player.playList.length;
    if ((!songInfo.url && listLen) || (!songInfo.id && listLen)) {
      bubbleRef.value &&
        bubbleRef.value.showBubble("该歌曲暂时无法播放！", 2000);
      nextTick(() => {
        console.log(444);

        $store.commit("player/setPlayState", false);
        $store.commit("player/setFullScreen", false);
      });
      return true;
    }
    return false;
  }

  return {
    bubbleRef,
    cantNotPlay,
  };
}
