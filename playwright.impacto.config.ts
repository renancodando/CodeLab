import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {defineConfig} from '@playwright/test';
import base from './playwright.config';
const plano=JSON.parse(readFileSync('plano-validacao.json','utf8'));
const contratos=[
 'build de produção executa a missão com WebAssembly e CSP do servidor',
 'cancelamento, limite de memória e recuperação do executor',
 'exportação e importação preservam jornada local',
 'laboratório HTML renderiza sem acesso ao documento pai',
 'Python, C# e C++ continuam offline após preparação, sem submissões externas',
 'escopos mantém axe e os programas completos de 220 a 4000 px'
];
const fase=process.env.CODELAB_FASE??plano.fase;
const smoke=fase==='pos-merge'?[contratos[0],contratos[3]]:fase==='publico'?[contratos[2],contratos[4],contratos[5]]:contratos;
const usarSmoke=process.env.CODELAB_SMOKE==='1'||plano.smoke;
const arquivosSmoke=['local-platform.spec.ts','learning.spec.ts','learning-hub.spec.ts','aspnet-escopos.spec.ts'];
const nomes=[...plano.navegador.map((p:string)=>p.split('/').at(-1)),...(usarSmoke?arquivosSmoke:[])];
const escapar=(texto:string)=>texto.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const filtros=[...plano.navegador.map((p:string)=>escapar(p.split('/').at(-1)!)),...(usarSmoke?smoke.map(escapar):[])];
const servidores=Array.isArray(base.webServer)?base.webServer:[];
export default defineConfig({...base,
 testMatch:nomes,grep:new RegExp(filtros.join('|')||'a^'),
 use:{...base.use,baseURL:process.env.CODELAB_PUBLIC_URL??base.use?.baseURL,channel:process.env.CODELAB_CANAL??'chromium'},
 webServer:process.env.CODELAB_PUBLIC_URL?undefined:servidores.filter((_,indice)=>indice===0||indice===1&&plano.api||indice===2&&plano.dev).map(s=>s.command.includes('dotnet run')?{...s,cwd:resolve('server'),command:'dotnet bin/Release/net10.0/CodeLab.Api.dll',env:{ASPNETCORE_URLS:'http://127.0.0.1:5080'}}:s)
});
