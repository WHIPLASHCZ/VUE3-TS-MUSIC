import { ref, onMounted,nextTick } from "vue";
import type {Ref} from 'vue';
export default function usePullUp(currentSuggestPage:Ref,suggestList:Ref,Search:(newval: string)=>Promise<any>,props:obj,haveMore:Ref,isSearching:Ref) {
  let scrollRef = ref();
  let isPullUpLoad = ref(false);

  onMounted(() => {
    scrollRef.value.scroll.on("pullingUp", async () => {
        if(isSearching.value) {
            scrollRef.value.scroll.finishPullUp();
            console.log(isSearching.value);
            return;
        }
        isPullUpLoad.value = true;
      if(!haveMore.value) {
        currentSuggestPage.value = 1;
        isPullUpLoad.value = false;
      }else{
        await searchNextPage();
        isSearching.value = false;
        isPullUpLoad.value = false;
      }
      console.log('请求完毕');
      nextTick(()=>{
        scrollRef.value.scroll.refresh();
      })
      if(!isPullUpLoad.value)scrollRef.value.scroll.finishPullUp();

    });
  });

  async function searchNextPage(){
    currentSuggestPage.value++;
    if(!props.query) return;
    let newVals = await Search(props.query);
    if(newVals.length){
        suggestList.value = suggestList.value.concat(newVals);
        await searchForMore();
    } 
  }

  async function searchForMore(){
      await nextTick();
      if(scrollRef.value.scroll.maxScrollY>=-1&&haveMore.value){
        console.log(scrollRef.value.scroll.maxScrollY);
        await searchNextPage();
      }

  }

  return{
    scrollRef,
    isPullUpLoad,
    searchForMore
  }
}
