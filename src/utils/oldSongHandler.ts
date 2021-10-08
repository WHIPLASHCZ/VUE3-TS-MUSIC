import localCache from "@/utils/cache";
import { processSongs } from "@/network/singer/song";
import { FAVLIST } from "@/globalRegister/consts";
import { PLAY_HISTORY } from "@/globalRegister/consts";
import store from "@/store";

const oldListsKeys = [FAVLIST, PLAY_HISTORY];
const commits = ["player/setFavList", "setPlayHistory"];
let newList2: any[];

function getNewSongList(keyArr: string[]) {
  return keyArr.map((key) => oldSongHandler(key));
}

Promise.all(getNewSongList(oldListsKeys)).then((res) => {
  newList2 = res;
  newList2.forEach((list, index) => {
    store.commit(commits[index], list);
  });
});

async function oldSongHandler(key: string): Promise<any[]> {
  let oldSongs = localCache.get(key);
  if (!oldSongs || !oldSongs.length) {
    return [];
  }
  let newSongList = await processSongs(oldSongs);
  localCache.set(key, newSongList);
  return newSongList;
}
