import type {RouteLocationRaw} from 'vue-router';
export interface obj {
  [index: string]: any;
}

 interface haveInfos {
  infos?:any
}
export type gotInfos = RouteLocationRaw | haveInfos
export type playMode = 'sequence' | 'loop' | 'random'
