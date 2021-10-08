import loading from "@/base-UI/loading/loading.vue";
import noResult from "@/base-UI/no-result/no-result.vue";

import LoadinAlikegDirectsCreater from "./loadingDir-alike-Creater";
let dirsArr: any[] = [];
let loadingDirs = LoadinAlikegDirectsCreater(loading, "loading");
let noResultDirs = LoadinAlikegDirectsCreater(noResult, "noResult");
dirsArr.push(loadingDirs, noResultDirs);

export default function(app: any) {
  dirsArr.forEach((dir) => {
    for (let k in dir) {
      app.directive(k, dir[k]);
    }
  });
}
