import {test,expect} from '@playwright/test';
test('API sem contas e sem progresso remoto, catálogo completo',async({request})=>{
 const base='http://127.0.0.1:5080';
 expect((await request.get(base+'/api/health')).status()).toBe(200);
 expect(await (await request.get(base+'/api/capabilities')).json()).toMatchObject({accounts:false,progress:false,storage:'browser-only'});
 for(const route of ['/api/auth/me','/api/progress'])expect((await request.get(base+route)).status()).toBe(404);
 expect((await request.post(base+'/api/auth/register',{data:{}})).status()).toBe(404);
 expect(await (await request.get(base+'/api/trilhas')).json()).toHaveLength(12);
 expect(await (await request.get(base+'/api/licoes')).json()).toHaveLength(60);
 expect((await request.get(base+'/api/licoes/sql-join')).status()).toBe(200);
 expect((await request.get(base+'/api/licoes/inexistente')).status()).toBe(404);
 const r=await request.post(base+'/api/executions',{data:{language:'python',code:'print(1)'},headers:{Origin:base}});
 expect(r.status()).toBe(503);expect(await r.json()).toMatchObject({error:expect.stringContaining('Judge0')});
 expect((await request.post(base+'/api/executions',{data:{language:'python',code:'print(1)'},headers:{Origin:'https://outro.example','Sec-Fetch-Site':'cross-site'}})).status()).toBe(403);
});
