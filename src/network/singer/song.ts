import $send from "@/network";
export async function processSongs(songs: any[]) {
  if (!songs.length) return await songs;
  let res = await $send.get("/api/getSongsUrl", {
    mid: songs.map((song) => {
      return song.mid;
    }),
  });
  res = res.result.map;
  return songs
    .map((song) => {
      song.url = res[song.mid];
      return song;
    })
    .filter((song) => {
      return song.url.indexOf("vkey") > -1;
    });
}

let none = "[00:00:00] 该歌曲暂无歌词";

export async function getLyric(mid: number): Promise<string> {
  let res = await $send.get("/api/getLyric", {
    mid,
  });

  res = res ? res.result : none;
  res = res ? (res.lyric ? res.lyric : none) : none;
  return res;
}
