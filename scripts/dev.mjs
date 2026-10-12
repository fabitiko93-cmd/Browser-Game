import { createServer } from 'node:http';
import { readFile, stat, watch } from 'node:fs';
import { promisify } from 'node:util';
import { resolve, sep, extname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { mediaRange } from '../src/media-range.js';
const root = resolve(import.meta.dirname, '..'), output = resolve(root, 'docs');
const build = () => execFileSync(process.execPath, [resolve(root, 'scripts/build.mjs')], { stdio: 'inherit' });
build();
let timeout;
for (const dir of ['src', 'web']) watch(resolve(root, dir), { recursive: true }, () => { clearTimeout(timeout); timeout = setTimeout(() => { try { build(); } catch (e) { console.error(e.message); } }, 100); });
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.mp3':'audio/mpeg' };
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const requested = decodeURIComponent(url.pathname).replace(/^\/+/, '');
    const path = resolve(output, requested.endsWith('/') || !requested ? requested + 'index.html' : requested);
    if (!path.startsWith(output + sep) || !(await promisify(stat)(path)).isFile()) { res.writeHead(404); return res.end('Not found'); }
    const content = await promisify(readFile)(path);
    const response=await mediaRange(new Request(url,{headers:req.headers}),new Response(content,{headers:{'Content-Type':types[extname(path)]??'application/octet-stream','Cache-Control':'no-store'}}));
    res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
  } catch { res.writeHead(404); res.end('Not found'); }
});
const port = Number(process.env.ORBIT_PORT ?? 4174);
server.listen(port, '0.0.0.0', () => console.log(`ORBIT 3077: http://127.0.0.1:${port}/`));
