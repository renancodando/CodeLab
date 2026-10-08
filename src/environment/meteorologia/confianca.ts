import {variaveisVazias} from './modelo';
import type {LeituraMeteorologica,ResultadoAtmosferico,VariaveisAtmosfericas} from './modelo';

const limitar=(n:number)=>Math.max(0,Math.min(1,n));
export function qualidadeAtual(leitura:LeituraMeteorologica,agora:number):number {
 if(leitura.capturadoEm===null||![leitura.capturadoEm,leitura.recebidoEm,leitura.validade,leitura.qualidade].every(Number.isFinite)||leitura.capturadoEm>agora+120000||leitura.recebidoEm>agora+120000||leitura.validade<=0)return 0;
 const idade=Math.max(0,agora-leitura.capturadoEm),recepcao=Math.max(0,agora-leitura.recebidoEm);
 if(idade>=leitura.validade*3||recepcao>=leitura.validade*3)return 0;
 const frescor=Math.exp(-Math.max(idade,recepcao)/leitura.validade);
 const distancia=leitura.tipo==='modelo'||leitura.tipo==='radar'?1:leitura.distanciaKm===null?.15:Math.exp(-Math.max(0,leitura.distanciaKm)/8);
 return limitar(leitura.qualidade)*frescor*distancia;
}
export function combinarMeteorologia(fontes:LeituraMeteorologica[],agora=Date.now()):ResultadoAtmosferico {
 const unicas=new Map<string,LeituraMeteorologica>();
 for(const fonte of fontes){const chave=fonte.tipo+':'+fonte.fonte,anterior=unicas.get(chave);if(!anterior||(fonte.capturadoEm??0)>(anterior.capturadoEm??0))unicas.set(chave,fonte);}
 const avaliadas=[...unicas.values()].map(leitura=>({leitura,peso:qualidadeAtual(leitura,agora)})).filter(f=>f.peso>.01);
 const variaveis={...variaveisVazias};
 for(const chave of Object.keys(variaveis) as (keyof VariaveisAtmosfericas)[]){
  let soma=0,pesos=0,x=0,y=0;
  for(const {leitura,peso} of avaliadas){const valor=leitura.variaveis[chave];if(typeof valor!=='number'||!Number.isFinite(valor))continue;
   const p=peso*(leitura.tipo==='modelo'?.4:1);soma+=valor*p;pesos+=p;if(chave==='direcao'){x+=Math.cos(valor*Math.PI/180)*p;y+=Math.sin(valor*Math.PI/180)*p;}
  }
  if(pesos>0)variaveis[chave]=chave==='direcao'?((Math.atan2(y,x)*180/Math.PI+360)%360):soma/pesos;
 }
 const recentes=avaliadas.filter(f=>f.leitura.capturadoEm!==null&&agora-f.leitura.capturadoEm<=f.leitura.validade&&f.peso>.2);
 const locais=recentes.filter(f=>f.leitura.tipo!=='modelo'&&f.leitura.cobertura==='ponto'&&(f.leitura.tipo==='radar'||(f.leitura.distanciaKm!==null&&f.leitura.distanciaKm<=5)));
 const positivas=locais.filter(f=>f.leitura.detectouChuva===true||(f.leitura.variaveis.precipitacao??0)>.02);
 const negativas=locais.filter(f=>f.leitura.detectouChuva===false||f.leitura.variaveis.precipitacao===0);
 const radar=positivas.some(f=>f.leitura.tipo==='radar'),pluvio=positivas.some(f=>f.leitura.tipo==='pluviometro');
 const distante=recentes.filter(f=>f.leitura.tipo!=='modelo'&&(f.leitura.cobertura==='proximidades'||f.leitura.cobertura==='ponto'&&!locais.includes(f))&&(f.leitura.detectouChuva===true||(f.leitura.variaveis.precipitacao??0)>.02));
 const modelos=recentes.filter(f=>f.leitura.tipo==='modelo');
 const possibilidade=modelos.some(f=>(f.leitura.variaveis.precipitacao??0)>.02||(f.leitura.variaveis.probabilidade??0)>=35);
 const divergencia=positivas.length>0&&negativas.length>0||negativas.length>0&&possibilidade;
 const taxa=(itens:typeof avaliadas)=>{let soma=0,pesos=0;for(const f of itens){const mm=f.leitura.variaveis.precipitacao??f.leitura.intensidadeIndicativa;if(mm!==undefined&&mm!==null&&Number.isFinite(mm)){soma+=Math.max(0,Math.min(250,mm))*f.peso;pesos+=f.peso;}}return pesos?soma/pesos:0;};
 const observada=radar&&pluvio&&!divergencia||positivas.some(f=>f.leitura.tipo==='observacao'&&f.peso>.65)&&!divergencia;
 const situacao=observada?'observada':positivas.length?'provavel':distante.length?'proximidades':negativas.length?'nao-detectada':possibilidade?'possibilidade':avaliadas.length?'estimada':'insuficiente';
 const confiancaChuva=limitar(positivas.reduce((p,f)=>Math.max(p,f.peso),0)+(radar&&pluvio?.18:0))*(divergencia?.45:1);
 const intensidadeLocal=positivas.length?taxa(positivas)*(divergencia?.35:1):0;
 const convectiva=positivas.some(f=>f.leitura.tempestade===true)&&confiancaChuva>.5;
 return {...variaveis,situacao,confiancaChuva,intensidadeLocal,intensidadeDistante:taxa(distante),tempestade:convectiva?confiancaChuva:0,
  granizo:convectiva&&positivas.some(f=>f.leitura.granizo)?intensidadeLocal:0,neve:locais.reduce((n,f)=>Math.max(n,f.leitura.neve??0),0),divergencia,fontes:[...unicas.values()]};
}
