import axios from "axios";
import type {AxiosInstance,CancelTokenSource} from 'axios';
class Send {
  baseUrl: string;
  myAxios:AxiosInstance;
  OK_CODE:number
  timeout:number
  abortEvent:CancelTokenSource
  cancelToken:any
  cancelFn:any
  constructor(baseUrl: string,OK_CODE:number) {
    this.myAxios = axios.create();
    this.baseUrl = baseUrl;
    this.myAxios.defaults.baseURL = this.baseUrl;
    this.OK_CODE = OK_CODE;
    this.timeout = 5000;
    this.myAxios.defaults.timeout = this.timeout;
    this.abortEvent = axios.CancelToken.source();
    this.cancelToken = axios.CancelToken;
    this.cancelFn;
  }
  get(url:string,params?:any){
      return this.myAxios.get(url,{
          params,
          // 
      }).then(res=>{
        if(res.data.code==this.OK_CODE){
            return res.data;
        }
      }).catch(err=>{
          console.log(err);
          
      })
  }
  getWithCancelToken(url:string,params:any){
    const that = this;
    return this.myAxios.get(url,{
      params,
      cancelToken: new this.cancelToken(function executor(c:any){
        that.cancelFn = c;
      })
  }).then(res=>{
    if(res.data.code==this.OK_CODE){
        return res.data;
    }
  }).catch(err=>{
      console.log(err);
  })
  }
  abort(errorInfo?:string){
    // this.abortEvent.cancel(errorInfo);
    if(typeof this.cancelFn!=='function') {
      console.log('错误');
      return;
    }
    this.cancelFn(errorInfo);
  }
}

export default Send