import {LivingWorld} from '../../src/environment/world';
import {defaultEnvironment} from '../../src/environment/weather';
import {criarCenario} from '../../src/environment/meteorologia/cenarios';
import type {cenariosAtmosfericos} from '../../src/environment/meteorologia/cenarios';
import {initialFrame,stepEnvironment} from '../../src/environment/simulation';
const mundo=new LivingWorld(document.querySelector('#world')!);
const renderizador=Reflect.get(mundo,'renderer'),canvas=renderizador.domElement as HTMLCanvasElement;
let maiorBuffer=canvas.width*canvas.height;
for(const atributo of ['width','height'] as const){
 const descritor=Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype,atributo)!;
 Object.defineProperty(canvas,atributo,{get(){return descritor.get!.call(canvas);},set(valor:number){descritor.set!.call(canvas,valor);maiorBuffer=Math.max(maiorBuffer,canvas.width*canvas.height);}});
}
Object.assign(window,{maiorBuffer:()=>maiorBuffer,definirCondensacao(valor:number){Reflect.get(mundo,'climate').condensacao=valor;},descartarMundo:()=>mundo.dispose(),mostrarCenario(nome:typeof cenariosAtmosfericos[number]){
 const estado=criarCenario(nome,defaultEnvironment,Date.now()),frame=initialFrame(estado);
 if(nome.startsWith('noite'))frame.daylight=0;
 if(nome==='pos-chuva'){frame.wetness=.8;frame.aguaAcumulada=2;}
 for(let i=0;i<600;i++)stepEnvironment(frame,estado,1);
 const nuvens=Reflect.get(mundo,'cloudLayer');
 for(let i=0;i<180;i++)nuvens.step(frame,1,1,.6);
 Object.assign(Reflect.get(mundo,'climate'),frame);Reflect.set(mundo,'lastAstronomy',0);mundo.setEnvironment(estado);
 return {chuva:frame.rain,solo:frame.wetness,neblina:frame.fog,condensacao:frame.condensacao,vento:frame.ventoEfetivo,massas:nuvens.campo.massas.length};
}});
