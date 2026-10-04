import {newQuickJSWASMModuleFromVariant,newVariant,type QuickJSWASMModule} from 'quickjs-emscripten-core';
import variant from '@jitl/quickjs-wasmfile-release-sync';
import wasmUrl from '@jitl/quickjs-wasmfile-release-sync/wasm?url';
let modulePromise:Promise<QuickJSWASMModule>|undefined;
const getQuickJS=()=>modulePromise??=newQuickJSWASMModuleFromVariant(typeof self==='undefined'?variant:newVariant(variant,{wasmLocation:new URL(wasmUrl,self.location.origin).href}));
import type { RunResult } from '../types';
import type { CodeCheck } from '../learning/types';
export async function evaluate(code:string, missionId:string, checks:CodeCheck[]=[]): Promise<RunResult> {
 const started = performance.now();
 const response: RunResult = {passed:false,tests:[],actions:[],logs:[],duration:0};
 if (code.length > 30000) return {...response,error:'Seu código ultrapassa 30.000 caracteres. Divida o problema em partes menores.'};
 const QuickJS = await getQuickJS();
 const runtime = QuickJS.newRuntime();
 runtime.setMemoryLimit(4 * 1024 * 1024);
 runtime.setMaxStackSize(256 * 1024);
 const deadline = performance.now() + 1200;
 runtime.setInterruptHandler(() => performance.now() > deadline);
 const vm = runtime.newContext();
 const serializer = vm.unwrapResult(vm.evalCode('(value) => { try { return (JSON.stringify(value) ?? "null").slice(0, 2000); } catch { return "\\\"[valor não serializável]\\\""; } }'));
 const boundedValue = (value:Parameters<typeof vm.dump>[0]):unknown => { const result=vm.callFunction(serializer,vm.undefined,value); if(result.error){result.error.dispose();return '[limite de saída]';} const text=vm.getString(result.value);result.value.dispose();try{return JSON.parse(text);}catch{return text;} };
 let recording = true;
 let actions: RunResult['actions'] = [];
 const install = (name:string,type:string) => { const fn = vm.newFunction(name,(...args) => { if (actions.length >= 200) return vm.undefined; actions.push({type,value:args[0] ? boundedValue(args[0]) : true}); return vm.undefined; }); vm.setProp(vm.global,name,fn); fn.dispose(); };
 for (const [name,type] of Object.entries({acender:'light',dizer:'message',abrirPonte:'bridge',plantar:'tree',mostrar:'items',iluminar:'beacon'})) install(name,type);
 const consoleObject = vm.newObject();
 const log = vm.newFunction('log',(...args) => { if (recording && response.logs.length < 50) response.logs.push(args.slice(0,10).map(arg => { const value = vm.typeof(arg)==='undefined'?'undefined':boundedValue(arg); return typeof value === 'string' ? value : JSON.stringify(value); }).join(' ').slice(0,1000)); });
 vm.setProp(consoleObject,'log',log); vm.setProp(vm.global,'console',consoleObject); log.dispose(); consoleObject.dispose();
 const run = (source:string):unknown => { const result = vm.evalCode(source,'missao.js'); if (result.error) { const error = vm.dump(result.error); result.error.dispose(); throw new Error(`${error.name || 'Error'}: ${error.message || error}`); } const value = boundedValue(result.value); result.value.dispose(); return value; };
 const check = (label:string,passed:boolean) => response.tests.push({label,passed});
 const callActions = (source:string,type:string) => { actions = []; run(source); return actions.filter(x => x.type === type).length; };
 try {
  run(code);
  for(let jobs=0;runtime.hasPendingJob();jobs++){
   if(jobs>=1000||performance.now()>deadline)throw new Error('interrupted');
   const pending=runtime.executePendingJobs(1);
   if(pending.error){const error=vm.dump(pending.error);pending.error.dispose();throw new Error(error.message||'Falha em Promise');}
  }
  response.actions = [...actions]; recording = false;
  switch (missionId) {
   case 'primeira-luz': check('A lanterna foi acesa.',actions.some(x => x.type === 'light')); check('A ação foi chamada uma única vez.',actions.filter(x=>x.type==='light').length===1); break;
   case 'seu-nome': { const messages = actions.filter(x=>x.type==='message'); check('Uma mensagem foi apresentada.',messages.length>0); check('A mensagem tem pelo menos duas letras.',messages.some(x=>typeof x.value==='string' && x.value.trim().length>=2)); break; }
   case 'energia': { const exists = run('typeof energia !== "undefined"')===true; const number = exists && run('typeof energia === "number"')===true; const value = number ? run('energia') : 0; check('A variável energia existe.',exists); check('O valor é um número.',number); check('A energia é igual a 100.',value===100); response.actions.push({type:'energy',value}); break; }
   case 'ponte': check('A ponte abre com energia 80.',callActions('atravessar(80)','bridge')===1); check('A ponte fica fechada com energia 20.',callActions('atravessar(20)','bridge')===0); check('Casos de fronteira e novos valores funcionam.',[0,49,50,51,100,73].every(n=>callActions(`atravessar(${n})`,'bridge')===(n>=50?1:0))); break;
   case 'jardim': case 'debug': { const n = missionId==='debug'?3:5; check(`${n===3?'Três':'Cinco'} árvores para quantidade ${n}.`,callActions(`cultivar(${n})`,'tree')===n); check('Zero árvores para quantidade 0.',callActions('cultivar(0)','tree')===0); check('Outras quantidades também funcionam.',[1,2,7,11].every(n=>callActions(`cultivar(${n})`,'tree')===n)); break; }
   case 'inventario': check('A lista de exemplo resulta em [12, 20].',JSON.stringify(run('selecionar([4,12,7,20])'))==='[12,20]'); check('Uma lista vazia continua vazia.',JSON.stringify(run('selecionar([])'))==='[]'); check('Valores diferentes e o limite 10 são tratados.',JSON.stringify(run('selecionar([-3,10,9,30,10])'))==='[10,30,10]'); break;
   case 'farol': check('O farol recebe energia 100.',response.actions.some(x=>x.type==='beacon' && x.value===100)); check('A soma funciona com outros números.',run('somar(7,8)')===15 && run('somar(2,5)')===7); check('Zero e números negativos funcionam.',run('somar(0,0)')===0 && run('somar(-7,2)')===-5); break;
   case 'aula': for(const item of checks)check(item.label,JSON.stringify(run(item.expression))===JSON.stringify(item.expected)); break;
   case 'laboratorio': check('O programa terminou sem erros.',true); break;
   default: throw new Error('Missão desconhecida.');
  }
  response.passed = response.tests.length > 0 && response.tests.every(t=>t.passed);
 } catch (error) {
  const message = String(error);
  response.error = /interrupted/.test(message) ? 'O programa levou tempo demais. Verifique se algum loop nunca termina.' : /out of memory/.test(message) ? 'O programa atingiu o limite de memória. Tente trabalhar com menos dados.' : /SyntaxError/.test(message) ? `Há uma instrução incompleta. Confira parênteses, chaves e aspas.\n${message}` : /ReferenceError/.test(message) ? `Um nome foi usado antes de ser definido. Confira a grafia e a declaração.\n${message}` : message;
 } finally { serializer.dispose(); vm.dispose(); runtime.dispose(); }
 response.duration = Math.round(performance.now()-started);
 return response;
}
