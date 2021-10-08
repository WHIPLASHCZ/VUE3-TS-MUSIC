import {computed} from 'vue';
import type {Ref} from 'vue';
export default function usePrevAndNext(isReady:Ref,list:Ref,currentIndex:Ref,loop:fn,$store:any){
  let playMode = computed(()=>($store.state.player.playMode));
    function prev() {
        if (isReady.value) {
          isReady.value = false;
          if (list.value.length == 1) {
            loop();
            return;
          } else if (!list.value.length) return;
          let idx =
            currentIndex.value <= 0
              ? list.value.length - 1
              : currentIndex.value - 1;
          $store.commit("player/setCurrentIndex", idx);
        }
      }
      function next() {
        if (isReady.value) {
          isReady.value = false;
          if (list.value.length == 1) {
            loop();
            return;
          } else if (!list.value.length) return;
          let curIdx = $store.state.player.currentIndex;
          let idx = curIdx >= list.value.length - 1 ? 0 : currentIndex.value + 1;
          $store.commit("player/setCurrentIndex", idx);
        }
      }

      function endedHandler() {
        if (playMode.value == "loop") {
          loop();
        }else{
          next();
        }
      }


      return{
          prev,
          next,
          endedHandler
      }
}