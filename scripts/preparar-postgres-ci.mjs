import {spawnSync} from 'node:child_process';
import {setTimeout} from 'node:timers/promises';
import {pathToFileURL} from 'node:url';

const nome='codelab-postgres-ci';
const imagens=['public.ecr.aws/docker/library/postgres:18','postgres:18'];

function executarDocker(argumentos,prazo){
 const resultado=spawnSync('docker',argumentos,{stdio:'inherit',timeout:prazo});
 if(resultado.error&&resultado.error.code!=='ETIMEDOUT')throw resultado.error;
 return resultado.status??1;
}

export async function prepararPostgres(executar=executarDocker,esperar=setTimeout){
 let imagem;
 for(const candidata of imagens){
  if(executar(['pull',candidata],120000)===0){imagem=candidata;break;}
  console.warn('Falhou a obtenção da imagem '+candidata+'.');
 }
 if(!imagem)throw new Error('Nenhuma fonte oficial de PostgreSQL 18 ficou disponível.');
 if(executar(['run','--detach','--pull=never','--name',nome,'--publish','127.0.0.1:5432:5432',
  '--env','POSTGRES_USER=codelab','--env','POSTGRES_PASSWORD=codelab','--env','POSTGRES_DB=codelab',imagem],30000)!==0){
  throw new Error('Não foi possível iniciar o PostgreSQL descartável.');
 }
 for(let tentativa=0;tentativa<5;tentativa++){
  if(executar(['exec',nome,'pg_isready','-h','127.0.0.1','-U','codelab','-d','codelab'],5000)===0){
   const versao="DO $versao$ BEGIN IF current_setting('server_version_num')::integer / 10000 <> 18 THEN RAISE EXCEPTION 'PostgreSQL 18 obrigatório no CI'; END IF; END; $versao$;";
   if(executar(['exec',nome,'psql','--no-psqlrc','--set','ON_ERROR_STOP=1','--username','codelab','--dbname','codelab','--command',versao],10000)!==0){
    throw new Error('O banco não confirmou o contrato PostgreSQL 18.');
   }
   console.log('PostgreSQL 18 pronto a partir de '+imagem+'.');
   return imagem;
  }
  if(tentativa<4)await esperar(10000);
 }
 executar(['logs','--tail','50',nome],5000);
 throw new Error('O PostgreSQL não ficou pronto nas cinco verificações.');
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 if(process.env.GITHUB_ACTIONS!=='true')throw new Error('Este preparo usa um contêiner descartável exclusivo do CI.');
 await prepararPostgres();
}
