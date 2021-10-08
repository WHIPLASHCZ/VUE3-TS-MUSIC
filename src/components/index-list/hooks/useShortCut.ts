import type {Ref} from 'vue';
import {ref,onMounted} from 'vue';
export default function useShortCut(props: any, maps: Ref,scrollRef:Ref,shortCutHeight:Ref) {
    let title = '';
    let offsetHeight=0;
    let touch:obj = {};
    let startIndex = 0;
    let shortCutRef = ref<HTMLElement>();
    let childs:HTMLCollection;
    onMounted(()=>{
        childs = shortCutRef.value?.children!;
    })
  function getDistance(e:any) {
      if(!e.target) return;
    title = e.target.dataset.title;
    startIndex = Number(e.target.dataset.index);
    touch.y1 = e.touches[0].pageY;
    scrollToTarget(title);
  }

  function scrollToTitle(e:any){
    
  }
  function moving(e:any){
    if(!e.target) return;
    touch.y2 = e.touches[0].pageY;
    let res = touch.y2 - touch.y1;
    let overNum = Math.round( res / shortCutHeight.value);
    let targetIndex =  startIndex+overNum;
    scrollToTarget(targetIndex);
  }

  function scrollToTarget(index:number|string){
      if(index>=childs.length||index<0) return;
    if(typeof index == 'number'){
        let targetTitle = (childs[index] as HTMLElement).dataset.title;
        offsetHeight = maps.value.get(targetTitle);
        scrollRef.value.scroll.scrollTo(0, -offsetHeight-1,200);
    }else if (typeof index=='string'){
        offsetHeight = maps.value.get(index);
        scrollRef.value.scroll.scrollTo(0, -offsetHeight-1,200);
    }
  }

  return {
    getDistance,
    scrollToTitle,
    moving,
    shortCutRef
}
}
