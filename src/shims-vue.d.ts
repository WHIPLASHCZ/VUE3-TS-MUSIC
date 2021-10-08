/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module '*.vue'

declare interface obj {
  [index: string]: any;
}

declare module 'lyric-parser';

declare enum playmode{
  sequence='sequence',
  loop='loop',
  random='random'
}

declare module 'create-keyframe-animation';

declare type fn<T=void> = (...args)=>T

declare const FAVLIST = 'favlist'