import { ref, computed, onBeforeMount } from "vue";
import Localcache from "@/utils/cache";
import { useRouter, useRoute } from "vue-router";
import musicList from "@/components/musicList/music-list.vue";
import { processSongs } from "@/network/singer/song";

export default function createDefault(
  name: string,
  key: string,
  fetch: <T extends obj>(obj: T) => Promise<any>,
  backUrl: string
) {
  console.log(name);

  return {
    name: name,
    props: {
      listInfo: {
        type: Object,
        required: true,
      },
    },
    setup(props: any) {
      let $route = useRoute();
      let $router = useRouter();
      let info = ref();
      let songList = ref();
      let isLoad = ref(true);
      info.value = Localcache.get(key) || props.listInfo;
      const ID: string = info.value.mid || info.value.id;
      // let topThree = computed(() => {
      //   return function(rank: number) {
      //     return {
      //       background:
      //     };
      //   };
      // });
      function topThree(rank: number) {
        return "top" + (rank + 1);
      }
      let isIDRIGHT = $route.params.id == ID + "";
      if (!isIDRIGHT) {
        console.log($route.params.id, ID);
        $router.push({ name: backUrl });
      }

      onBeforeMount(async () => {
        if (!isIDRIGHT) return;
        let result = await fetch(info.value as obj);
        songList.value = await processSongs(result.songs);
        isLoad.value = false;
      });

      return {
        info,
        songList,
        isLoad,
        topThree,
      };
    },
    components: {
      musicList,
    },
  };
}
