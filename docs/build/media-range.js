// Shared by the development server and the generated classic service worker.
export async function mediaRange(request,response) {
 const range=request.headers.get('Range');
 if(!range||response.status!==200)return response;
 const bytes=await response.arrayBuffer(),size=bytes.byteLength;
 const match=/^bytes=(\d*)-(\d*)$/i.exec(range);
 let start=0,end=size-1,valid=Boolean(match&&size);
 if(valid){
  if(!match[1]){
   const suffix=Number(match[2]);valid=Number.isSafeInteger(suffix)&&suffix>0;start=Math.max(0,size-suffix);
  }else{
   start=Number(match[1]);end=match[2]?Math.min(size-1,Number(match[2])):size-1;
   valid=Number.isSafeInteger(start)&&Number.isSafeInteger(end)&&start<size&&start<=end;
  }
 }
 const headers=new Headers(response.headers);headers.set('Accept-Ranges','bytes');headers.delete('Content-Encoding');
 if(!valid){headers.set('Content-Range',`bytes */${size}`);headers.set('Content-Length','0');return new Response(null,{status:416,headers});}
 headers.set('Content-Range',`bytes ${start}-${end}/${size}`);headers.set('Content-Length',String(end-start+1));
 return new Response(bytes.slice(start,end+1),{status:206,headers});
}
