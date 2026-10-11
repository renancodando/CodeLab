import {compilarTypescript} from './compilador-ts';
const arquivos=import.meta.glob<string>('/node_modules/typescript/lib/lib.{es5,es2015*,es2016*,es2017*,es2018*,es2019*,es2020*,es2021*,es2022*,decorators*}.d.ts',{query:'?raw',import:'default',eager:true});
const bibliotecas=new Map(Object.entries(arquivos).map(([caminho,texto])=>['/'+caminho.split('/').at(-1),texto]));
self.onmessage=(evento:MessageEvent<{codigo:string}>)=>{
 try{self.postMessage({tipo:'resultado',resultado:compilarTypescript(evento.data.codigo,bibliotecas)});}
 catch{self.postMessage({tipo:'resultado',resultado:{javascript:'',diagnosticos:[],versao:'',erro:'Não foi possível compilar este programa. Reduza a complexidade dos tipos e tente novamente.'}});}
};
self.postMessage({tipo:'pronto'});
