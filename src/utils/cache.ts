class Localcache {
  set(key: string, val: any) {
    if (!val) return;
    window.localStorage.setItem(key, JSON.stringify(val));
  }
  get(key: string) {
    let res = window.localStorage?.getItem(key);
    if (res && res != "undefined" && res != "" && res.length) {
      return JSON.parse(res);
    }
    return null;
  }
  remove(key: string) {
    return window.localStorage.removeItem(key);
  }
  clear() {
    return window.localStorage.clear();
  }
  isRemembered(key: string) {
    return window.localStorage.getItem(key) !== null;
  }
}

export default new Localcache();
