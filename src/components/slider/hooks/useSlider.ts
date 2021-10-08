import { ref, onMounted, watch, onUnmounted,nextTick,onActivated,onDeactivated } from "vue";
import type {Ref} from 'vue';
import { getSlide, slideType } from "@/utils/recommend/BS-slide";
export default function(wrapperRef:Ref,props:any) {
  let slideInstance = ref<any>();
  let currentIndex = ref(0);
  onMounted(() => {
    slideInstance.value = getSlide(wrapperRef.value!,true,false,props.auto,props.speed,props.interval);
    slideInstance.value.on('slideWillChange',(page:any)=>{
        currentIndex.value = page.pageX;
    })
  });

  onActivated(async()=>{
    await nextTick();
    slideInstance.value&&slideInstance.value.enable();
    slideInstance.value&&slideInstance.value.refresh();
  });

  onDeactivated(async()=>{
    await nextTick();
    slideInstance.value&&slideInstance.value.disable();
  })


  onUnmounted(() => {
    slideInstance.value.destroy();
  });

  return {
    wrapperRef,
    currentIndex
  };
}
