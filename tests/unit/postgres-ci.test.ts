import {it,expect,vi,afterEach} from 'vitest';
import {prepararPostgres} from '../../scripts/preparar-postgres-ci.mjs';

afterEach(()=>vi.restoreAllMocks());

it.each([true,false])('prepara o mesmo banco descartável quando o espelho responde: %s',async espelho=>{
 vi.spyOn(console,'warn').mockImplementation(()=>{});vi.spyOn(console,'log').mockImplementation(()=>{});
 const executar=vi.fn((argumentos:string[])=>argumentos[0]==='pull'&&argumentos[1].startsWith('public.')&&!espelho?1:0),esperar=vi.fn();
 expect(await prepararPostgres(executar,esperar)).toBe(espelho?'public.ecr.aws/docker/library/postgres:18':'postgres:18');
 expect(executar.mock.calls.filter(([a])=>a[0]==='pull').map(([a])=>a[1])).toEqual(espelho?['public.ecr.aws/docker/library/postgres:18']:['public.ecr.aws/docker/library/postgres:18','postgres:18']);
 const inicio=executar.mock.calls.find(([a])=>a[0]==='run')![0];
 expect(inicio).toEqual(['run','--detach','--pull=never','--name','codelab-postgres-ci','--publish','127.0.0.1:5432:5432','--env','POSTGRES_USER=codelab','--env','POSTGRES_PASSWORD=codelab','--env','POSTGRES_DB=codelab',espelho?'public.ecr.aws/docker/library/postgres:18':'postgres:18']);
 expect(executar.mock.calls.find(([a])=>a.includes('pg_isready'))![0]).toEqual(['exec','codelab-postgres-ci','pg_isready','-h','127.0.0.1','-U','codelab','-d','codelab']);
 const conferir=executar.mock.calls.find(([a])=>a.includes('psql'))![0];
 expect(conferir).toContain('ON_ERROR_STOP=1');expect(conferir.at(-1)).toContain("current_setting('server_version_num')::integer / 10000 <> 18");
 expect(esperar).not.toHaveBeenCalled();
});

it('falha se os dois registros recusam a imagem, sem iniciar outro servidor',async()=>{
 vi.spyOn(console,'warn').mockImplementation(()=>{});
 const executar=vi.fn(()=>1);
 await expect(prepararPostgres(executar,vi.fn())).rejects.toThrow('Nenhuma fonte oficial');
 expect(executar.mock.calls).toHaveLength(2);
});

it('não transforma ausência de Docker em tentativa de outro registro',async()=>{
 const executar=vi.fn(()=>{throw Object.assign(new Error('Docker indisponível'),{code:'ENOENT'});});
 await expect(prepararPostgres(executar,vi.fn())).rejects.toThrow('Docker indisponível');expect(executar).toHaveBeenCalledTimes(1);
});

it('falha na criação do contêiner sem ocultar o erro com outra imagem',async()=>{
 const executar=vi.fn((a:string[])=>a[0]==='run'?1:0);
 await expect(prepararPostgres(executar,vi.fn())).rejects.toThrow('iniciar o PostgreSQL');
 expect(executar.mock.calls.map(([a])=>a[0])).toEqual(['pull','run']);
});

it('espera a prontidão antes de conferir a versão e liberar os testes',async()=>{
 vi.spyOn(console,'log').mockImplementation(()=>{});let verificacoes=0;
 const executar=vi.fn((a:string[])=>a.includes('pg_isready')&&++verificacoes<3?1:0),esperar=vi.fn();
 await prepararPostgres(executar,esperar);
 expect(verificacoes).toBe(3);expect(esperar.mock.calls).toEqual([[10000],[10000]]);
 expect(executar.mock.calls.filter(([a])=>a.includes('psql'))).toHaveLength(1);
});

it('recusa o banco que permanece indisponível e mantém a espera limitada',async()=>{
 const executar=vi.fn((a:string[])=>a.includes('pg_isready')?1:0),esperar=vi.fn();
 await expect(prepararPostgres(executar,esperar)).rejects.toThrow('cinco verificações');
 expect(executar.mock.calls.filter(([a])=>a.includes('pg_isready'))).toHaveLength(5);
 expect(esperar.mock.calls).toEqual([[10000],[10000],[10000],[10000]]);
 expect(executar.mock.calls.some(([a])=>a.includes('psql'))).toBe(false);
});

it('não aceita falha de conexão ou de versão na confirmação SQL',async()=>{
 const executar=vi.fn((a:string[])=>a.includes('psql')?3:0);
 await expect(prepararPostgres(executar,vi.fn())).rejects.toThrow('contrato PostgreSQL 18');
});
