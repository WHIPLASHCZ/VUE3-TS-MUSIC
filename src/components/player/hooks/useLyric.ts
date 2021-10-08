import { useStore } from "vuex";
import { computed, watch, ref } from "vue";
import type {Ref} from 'vue';
import { getLyric } from "@/network/singer/song";
import Lyric from "lyric-parser";
import scroll from "@/components/scroll/scroll.vue";
export default function useLyric(isReady:Ref,currentTime:Ref,isPlaying:Ref) {
  let currentLyric = ref();
  let store = useStore();
  let currentLineNum = ref(0);
  let scrollRef = ref();
  let lyricListRef = ref<HTMLElement>();
  let pureMusicLyric = ref('');
  let playingLyric = ref('');
  watch(
    () => store.getters["player/currentSong"],
    async (newval) => {
      stopLyric();
      currentLyric.value = null;
      currentLineNum.value = 0;
      playingLyric.value = '';
      pureMusicLyric.value = '';
      if(scrollRef.value)scrollRef.value.scroll.scrollTo(0,0,0);
      if (!newval.url || !newval.id) return;
      let lyric = '';
      if (newval.lyric) {
        lyric = newval.lyric;
        currentLyric.value = new Lyric(lyric, lyricHandler);
        if(isReady.value) playLyric();
      } else {
        lyric = await getLyric(newval.mid);
        store.commit("player/addLyric", {mid:newval.mid,lyric});
        if(newval.lyric!==lyric){
          console.log('ERROR');
          return;
        }
       currentLyric.value = new Lyric(lyric, lyricHandler);
       if(isReady.value) playLyric();
      }
      const hasLyric = currentLyric.value.lines.length;
      if(!hasLyric){
        pureMusicLyric.value = lyric.replace(/\[(\d{2}):(\d{2}):(\d{2})\]/g,'');
        playingLyric.value =  pureMusicLyric.value;
      }
    }
  );


  function lyricHandler(line: any) {
    currentLineNum.value = line.lineNum;
    playingLyric.value = line.txt;
    let scrollComp = scrollRef.value;
    let listEl = lyricListRef.value;
    if(!listEl||!listEl.children.length||!scrollComp) return;
    if(line.lineNum>5){
      // 从第五行开始 每次让当前第五行歌词高亮(让当前播放时间对应的歌词处于第五行)
      let lineEl = listEl.children[line.lineNum-5];
      if(lineEl){
        scrollComp.scroll.scrollToElement(lineEl,1000);
      }else{
        scrollComp.scroll.scrollTo(0,0,1000);
      }
    }else{
      scrollComp.scroll.scrollTo(0,0,1000);
    }
  }
  function playLyric(){
    const currentLyricVal = currentLyric.value;
    if(currentLyricVal&&!currentLyricVal.isPlaying){
      currentLyricVal.seek(currentTime.value*1000)
      currentLyricVal.isPlaying = true;
    }
  }
  function stopLyric(){
    const currentLyricVal = currentLyric.value;
    if(currentLyricVal){
       currentLyricVal.stop();
       currentLyricVal.isPlaying = false;
       playingLyric.value = '';
       pureMusicLyric.value = '';
      }
  }
  return {
    currentLyric,
    currentLineNum,
    playLyric,
    scrollRef,
    lyricListRef,
    stopLyric,
    pureMusicLyric,
    playingLyric
  };
}
