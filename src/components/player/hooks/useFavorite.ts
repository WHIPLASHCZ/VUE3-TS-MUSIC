import type {Ref} from 'vue';
import { computed,ref } from 'vue';
import localCache from '@/utils/cache'
import { FAVLIST } from "@/globalRegister/consts";
export default function(currentSong:Ref,$store:any,bubble:Ref) {
    
    let favlist = computed(()=>{
        return $store.state.player.favList
    });
    let isInFavList = computed(()=>(song:obj)=>favlist.value.findIndex((fav: obj) => fav.mid === song.mid) != -1);
    let favorIcon = computed(()=>(song:obj)=>{
        return isInFavList.value(song)?'icon-favorite':'icon-not-favorite'
    })
    function toggleFavorate(song?:obj){
        const cursong = song?currentSong.value:song;
        if(favlist.value.length==$store.state.player.maxFav){
            bubble&&bubble.value.showBubble('最多添加100首歌！',1000);
        }
        if( !isInFavList.value(cursong) ){
            $store.commit('player/addToFavList',cursong);
            bubble&&bubble.value.showBubble('已添加至喜欢列表',1000);
        }else{
            let idx = favlist.value.findIndex((fav:obj)=>fav.mid===cursong.mid);
            $store.commit('player/removeFromFavList', idx);
            bubble&&bubble.value.showBubble('已移除出喜欢列表',1000);
        }
        localCache.set(FAVLIST,favlist.value );
    }

    return {
        toggleFavorate,
        favlist,
        favorIcon,
        isInFavList,
    }
}
