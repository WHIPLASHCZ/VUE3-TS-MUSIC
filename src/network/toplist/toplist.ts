import $send from "../index";
export async function getTopList() {
  let res = await $send.get("/api/getTopList", {});
  return res.result;
}

export async function getTopDetail(listInfo: obj) {
  let res = await $send.get("/api/getTopDetail", { id: listInfo.id });
  return res.result;
}
