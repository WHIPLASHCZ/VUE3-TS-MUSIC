import type {Ref,ComputedRef} from 'vue';
import {computed,ref} from 'vue';
import {turnSecsToMin} from '@/utils/timer';
export default function(currentSong:Ref,currentTime:Ref,isDraging:Ref) {
  let progressBarRef = ref();
  let progress = computed<number>(() => {
    let curSongVal = currentSong.value;
    let num = curSongVal?curSongVal.duration:0;
    return currentTime.value / num 
  });
  let holeDuration = ref('');
  let songCurrentTime = computed(() => {
    return `${turnSecsToMin(currentTime.value)}`;
  });
  function updateTime(e: any) {
    if(isDraging.value) return;
    currentTime.value = e.target.currentTime;
  }

  return {
    progress,
    updateTime,
    holeDuration,
    songCurrentTime,
    progressBarRef
  }
}
