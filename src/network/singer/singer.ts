import $send from "@/network";
export async function getSingerList() {
  let res = await $send.get("/api/getSingerList", {});
  return res.result;
}

export interface singerType {
  mid?: string | number;
}

export async function getSingerDetail<T extends singerType>(singer: T) {
  let res = await $send.get("api/getSingerDetail", {
    mid: singer.mid,
  });
  return res.result;
}
