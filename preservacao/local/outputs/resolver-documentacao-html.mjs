import {readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
for(const nome of ['aprendizagem-com-pratica','continuidade','prontidao-producao']){
 const arquivo=new URL('../work/CodeLab/docs/'+nome+'.md',import.meta.url);
 const codigo=await readFile(arquivo,'utf8');
 const conflitos=[...codigo.matchAll(/^<<<<<<< HEAD\r?\n([\s\S]*?)^=======\r?\n([\s\S]*?)^>>>>>>> pratica\/sql-null-contratos\r?$/gm)];
 assert.equal(conflitos.length,1,nome);
 let resolvido=codigo.replace(conflitos[0][0],conflitos[0][1]+'\n'+conflitos[0][2]);
 resolvido=resolvido.replace('depende do head SQL `35b7267db303de45b78e5942dac5a1ce5c0f28e4`','depende do head SQL `09d232b5b3c197c4180e68ffea2b0484dd3fce52`');
 resolvido=resolvido.replace('A correção será propagada para a branch HTML','A correção foi incorporada à branch HTML');
 assert.ok(!/^<<<<<<<|^=======|^>>>>>>>/m.test(resolvido));
 await writeFile(arquivo,resolvido);
}
