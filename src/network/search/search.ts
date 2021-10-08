import $send from "../index";
export async function getHotKeys() {
  let res = await $send.get("/api/getHotKeys");
  return res.result;
}

export interface suggestType {
  query: string;
  page: number;
  showSinger?: boolean;
}

export async function getSearchSuggest(suggest: suggestType) {
  let res = await $send.get("/api/search", suggest);
  return res.result;
}

export async function getSearchSuggestWithCancel(suggest: suggestType) {
  let res = await $send.getWithCancelToken("/api/search", suggest);
  return res.result;
}

export function abort(errorInfo?: string) {
  $send.abort(errorInfo);
}
