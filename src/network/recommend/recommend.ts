import $send from "@/network";

export async function getRecommend() {
  let res = await $send.get("/api/getRecommend", {});
  return res.result;
}

export async function getAlbum(album: obj) {
  let res = await $send.get("/api/getAlbum", { id: album.id });
  return res.result;
}
