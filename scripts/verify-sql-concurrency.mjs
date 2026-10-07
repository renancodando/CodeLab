import {readFile} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {strict as assert} from 'node:assert';
import ts from 'typescript';

// Verifica somente cronogramas de estudo publicados. Não executa código de usuários.
const output=ts.transpileModule(await readFile('src/content/deep/sql.ts','utf8'),{
 compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}
}).outputText;
const {default:course}=await import('data:text/javascript;base64,'+Buffer.from(output).toString('base64'));
const cases=course.lessons.flatMap(lesson=>[
 ...(lesson.postgresScenario?[{name:lesson.id+'-referencia',scenario:lesson.postgresScenario}]:[]),
 ...(lesson.practices??[]).filter(p=>p.postgresScenario).map(p=>({name:lesson.id+'-'+p.id,scenario:p.postgresScenario}))
]);
assert.ok(cases.length>0,'Nenhum cronograma de isolamento foi publicado.');
let sequence=0;
function connect(name){
 const child=spawn('psql',['--no-psqlrc','--quiet','--no-align','--tuples-only',
  '--set','ON_ERROR_STOP=1','--set','VERBOSITY=verbose'],{
  env:{...process.env,PGAPPNAME:name},stdio:['pipe','pipe','pipe']
 });
 let buffer='',stderr='',pending,closed=false,spawnError;
 const ended=new Promise(resolve=>{
  child.on('error',error=>{spawnError=error;closed=true;if(pending)finish(error);resolve();});
  // close garante que stdout/stderr terminaram de drenar após a saída do processo.
  child.on('close',code=>{
   closed=true;
   if(pending){
    if(pending.expectedError)finish(undefined,{rows:pending.rows,stderr,code});
    else finish(new Error(name+' encerrou inesperadamente: '+code+' '+stderr));
   }
   resolve();
  });
 });
 function finish(error,value){
  if(!pending)return;
  const item=pending;pending=undefined;clearTimeout(item.timer);
  if(error)item.reject(error);else item.resolve(value);
 }
 child.stdout.setEncoding('utf8');
 child.stdout.on('data',chunk=>{
  buffer+=chunk;
  let newline;
  while((newline=buffer.indexOf('\n'))>=0){
   const line=buffer.slice(0,newline).replace(/\r$/,'');buffer=buffer.slice(newline+1);
   if(!pending)continue;
   if(line===pending.marker)finish(undefined,{rows:pending.rows,stderr,code:0});
   else pending.rows.push(line);
  }
 });
 child.stderr.setEncoding('utf8');
 child.stderr.on('data',chunk=>{stderr=(stderr+chunk).slice(-32000);});
 return {
  async send(sql,expectedError=false){
   if(closed)throw spawnError??new Error(name+' já encerrou.');
   if(pending)throw new Error(name+' tem um comando pendente.');
   const marker='CODELAB_END_'+(++sequence);
   return new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>{
     finish(new Error(name+' ultrapassou o prazo de 15 segundos.'));
     child.kill('SIGTERM');
    },15000);
    pending={marker,rows:[],expectedError,resolve,reject,timer};stderr='';
    child.stdin.write(sql+'\n\\echo '+marker+'\n',error=>{
     if(error)finish(error);
    });
   });
  },
  async close(){
   if(!closed)child.stdin.end('\\quit\n');
   const timer=setTimeout(()=>{child.kill('SIGTERM');},2000);
   try{await ended;}finally{clearTimeout(timer);}
  }
 };
}
for(let index=0;index<cases.length;index++){
 const {name,scenario}=cases[index],schema='codelab_isolamento_'+process.pid+'_'+index;
 const sql=text=>text.replaceAll('{{schema}}',schema);
 const admin=connect(name+'-controle'),sessions=new Map();
 try{
  await admin.send('CREATE SCHEMA '+schema+';\n'+sql(scenario.setup));
  for(const [stepIndex,step] of scenario.steps.entries()){
   let session=sessions.get(step.session);
   if(!session){session=connect(name+'-'+step.session);sessions.set(step.session,session);}
   const result=await session.send(sql(step.sql),!!step.expectedError);
   const context=name+' passo '+(stepIndex+1)+' sessão '+step.session;
   if(step.expectedError){
    assert.match(step.expectedError,/^[0-9A-Z]{5}$/,context+' categoria SQLSTATE válida.');
    assert.equal(result.code,3,context+' deve encerrar psql por ON_ERROR_STOP.');
    assert.match(result.stderr,new RegExp('\\b'+step.expectedError+'\\b'),context+' SQLSTATE.');
   }else{
    assert.equal(result.code,0,context);
    assert.deepEqual(result.rows,step.expectedOutput??[],context);
   }
  }
  const final=await admin.send(sql(scenario.finalSql));
  assert.deepEqual(final.rows,scenario.finalOutput,name+' resultado confirmado final.');
  console.log('OK '+name+' — sessões reais e resultado conferidos');
 }finally{
  // Encerrar conexões primeiro libera quaisquer transações e locks pendentes.
  await Promise.all([...sessions.values(),admin].map(session=>session.close()));
  const cleanup=connect(name+'-limpeza');
  try{await cleanup.send('DROP SCHEMA IF EXISTS '+schema+' CASCADE;');}
  finally{await cleanup.close();}
 }
}
console.log(cases.length+' cronogramas PostgreSQL verificados com conexões distintas.');
