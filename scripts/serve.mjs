import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
export function serve({port=4215,basePath=''}={}) {
 const root=resolve('out');
 const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain'};
 const server=createServer(async(req,res)=>{
  try {
   const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
   if(basePath && pathname!==basePath && !pathname.startsWith(basePath+'/')) throw Error('404');
   let file=resolve(root,'.'+(pathname.slice(basePath.length)||'/'));
   if(file!==root && !file.startsWith(root+sep)) throw Error('404');
   if((await stat(file)).isDirectory()) file=resolve(file,'index.html');
   const bytes=await readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream'});res.end(bytes);
  }catch{res.writeHead(404);res.end('Page introuvable');}
 });
 return new Promise(r=>server.listen(port,'127.0.0.1',()=>r(server)));
}
if(process.argv[1]?.endsWith('serve.mjs')) {
 const basePath=process.env.NEXT_PUBLIC_BASE_PATH||'';
 await serve({basePath});console.log(`Escale : http://127.0.0.1:4215${basePath}/`);
}
