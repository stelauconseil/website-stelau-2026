import {decode} from './decode';
self.onmessage=(event:MessageEvent<Uint8Array>)=>{
 try{self.postMessage({ok:true,data:decode(event.data)});}
 catch(error){self.postMessage({ok:false,error:error instanceof Error?error.message:String(error)});}
};
