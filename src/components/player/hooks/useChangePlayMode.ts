import {computed} from 'vue';
import type {Ref} from 'vue';
export default function($store:any,sequenceList:Ref,audioRef?:Ref){
    let playMode = computed(()=>($store.state.player.playMode));
    let playModeIcon = computed(() => {
        return `icon-${playMode.value}`;
      });

      let modeText = computed(()=>{
        const obj:obj = {
          sequence:'顺序播放',
          loop:'单曲循环',
          random:'随机播放'
        }
        return obj[playMode.value]
      })
      


    function loop() {
      audioRef!.value.currentTime = 0;
      $store.commit("player/setPlayState", true);
      audioRef!.value.play();
    }

      function changePlayMode() {
        $store.dispatch("player/changePlayMode");
      }
      return{
        playModeIcon,
        changePlayMode,
        loop,
        playMode,
        modeText

      }
}