import type {Ref} from 'vue';
import { computed,ref,watch,nextTick } from 'vue';
export default function($store:any){
    let cdRef = ref<HTMLElement>();
    let albumRef = ref<HTMLElement>();
    let isPlaying = computed(() => {
        let bool = $store.state.player.isPlaying;
        if(!bool){
                syncTransform(cdRef.value!,albumRef.value!);
        }
        return bool;
    });


    function syncTransform(outer:HTMLElement,inner:HTMLElement){
        if(!outer||!inner) return;
        const outerTransform = getComputedStyle(outer).transform;
        // 相对于上一次旋转的角度继续开始旋转。因为每次点完暂停再开始，img都是重新从0开始旋转的，所以要记住上次旋转的角度 附加给外层
        let innerTransform = getComputedStyle(inner).transform;
        // 将外层已经有的旋转角度加上这次内层新的旋转角度附加到一块赋值给外层 这样当点暂停 内层回到0后 外层旋转到自身本身角度加上内层旋转角度 这样视觉上看起来是没有动的
        outer.style.transform =(outerTransform=='none')? innerTransform :innerTransform.concat(' ',outerTransform) ;
        // outer.style.transform = innerTransform;
    }

    return {
        isPlaying,
        cdRef,
        albumRef,
    }
}