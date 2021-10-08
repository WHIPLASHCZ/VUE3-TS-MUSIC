import loading from "@/base-UI/loading/loading.vue";
import type {obj} from '@/types';
import {createApp} from 'vue';
import type {ComponentPublicInstance} from 'vue';
import {addClass } from '@/utils/dom';

const rlt = 'g-relative';

interface haveInstance extends HTMLElement {
  instance:any
  once?:number
  [index:string]:any
}

interface haveSetTitle {
  setTitle?:(title:string)=>void;
  
}

type setTit = ComponentPublicInstance |  haveSetTitle;

export default function LoadinAlikegDirectsCreater(component:any,name:string){
    function appendOrRemove(el:haveInstance,bool:boolean,instanceName:string){
  let styles = window.getComputedStyle(el[instanceName].$el);
  if(bool){
    if(['absolute','fixed','relative'].indexOf(styles.position)===-1){
      addClass(el,rlt);
    }
    el.appendChild(el[instanceName].$el);
  }
  else{
      try{
        for(let i=0;i<el.children.length;i++){
          if(el.children[i]==el[instanceName].$el){
            el.removeChild(el[instanceName].$el);
          }
        }
        
      }catch(err){
        console.log(err);
      }
      addClass(el,rlt,false);
  }
    }
    let dirs:obj = {
        [name]: {
            mounted(el:haveInstance, binding: any) {
              const app = createApp(component);
              const instance:setTit = app.mount(document.createElement('div'));
              let title = binding.arg;
              if(title!=null){
                (instance as haveSetTitle).setTitle!(title);
              }
              el[name] = instance;
              appendOrRemove(el,binding.value,name);
            },
            updated(el:haveInstance, binding: any){
              let title = binding.arg;
              if(title){
                (el[name] as haveSetTitle).setTitle!(title);
              }
              appendOrRemove(el,binding.value,name);
            }
        },
      };
      return dirs;
}
