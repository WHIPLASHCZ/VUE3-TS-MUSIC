// import store from "@/store";
import { ref, onMounted, onUnmounted, computed,watch,nextTick,onActivated,onDeactivated } from "vue";
import type {ComputedRef} from 'vue';
import BScroll from "@better-scroll/core";
import Slide from "@better-scroll/slide";
import usePrevAndNext from "../../hooks/usePrevAndNext";
BScroll.use(Slide);


const sliderSetting = {
    click:true,
    scrollX:true,
    scrollY:false,
    momentum:false,
    bounce:false,
    probeType:2,
    slide:{
        autoplay:false,
        loop:true
    }
}
export default function(isShow:ComputedRef,$store:obj) {
  let sliderWrapperRef = ref();
  let slider = ref();

  let currentIndex  = computed(()=>$store.state.player.currentIndex);
  let playList = computed(()=>$store.state.player.playList);
  let fullScreen = computed(() => $store.state.player.fullScreen);
  let playMode = computed(()=>$store.state.player.playMode);


  const sliderShow = computed(() => {
    return !fullScreen.value && !!playList.value.length
  })
  function setSlider(){
    return new BScroll( sliderWrapperRef.value,sliderSetting)
  }

  onMounted(() => {
    let slideVal:obj;
    watch(isShow,async (newIsShowVal)=>{
      await nextTick();
       if(newIsShowVal){
            if(!slideVal){
              slider.value = setSlider();
              slideVal = slider.value;
              slideVal.on('slidePageChanged',async(page:obj)=>{
                if(isShow.value){
                  console.log(isShow.value,page.pageX===currentIndex.value);
                    $store.commit('player/setCurrentIndex',page.pageX);
                }
              }) 
            }else{
              slideVal.refresh();
           }
           slideVal.goToPage( currentIndex.value,0,0);
       }
    })


    watch(currentIndex,(newval)=>{
        if(slider.value&&slideVal) {
          slider.value.goToPage(newval,0,0);
          // console.log(slider.value.getCurrentPage());
        }
    })
    watch(playList,(newval)=>{
          if(slideVal&&newval.length&&isShow.value){
            nextTick(()=>{
              slideVal&&slideVal.refresh();
           })
          }
    },{deep:true})

    watch(playMode,async()=>{
      if(slideVal&&isShow.value){
        await nextTick();
        slideVal&&slideVal.refresh();
      }
    })
  });

  onActivated(async()=>{
    await nextTick();
    slider.value&&slider.value.enable();
    slider.value&&slider.value.refresh();
  });

  onDeactivated(async()=>{
    await nextTick();
    slider.value&&slider.value.disable();
  })


  onUnmounted(() => {
    if(slider.value)slider.value.destroy();
  });
  return {
    sliderWrapperRef,
    slider
  };
}
