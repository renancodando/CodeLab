import {LivingWorld} from '../../src/environment/world';
import {defaultEnvironment} from '../../src/environment/weather';
import {criarCenario} from '../../src/environment/meteorologia/cenarios';
import type {cenariosAtmosfericos} from '../../src/environment/meteorologia/cenarios';
import {initialFrame,stepEnvironment} from '../../src/environment/simulation';
const mundo=new LivingWorld(document.querySelector('#world')!);
Object.assign(window,{mostrarCenario(nome:typeof cenariosAtmosfericos[number]){
 const estado=criarCenario(nome,defaultEnvironment,Date.now()),frame=initialFrame(estado);
 if(nome.startsWith('noite'))frame.daylight=0;
 if(nome==='pos-chuva'){frame.wetness=.8;frame.aguaAcumulada=2;}
 for(let i=0;i<600;i++)stepEnvironment(frame,estado,1);
 const nuvens=Reflect.get(mundo,'cloudLayer');
 for(let i=0;i<180;i++)nuvens.step(frame,1,1,.6);
 Object.assign(Reflect.get(mundo,'climate'),frame);Reflect.set(mundo,'lastAstronomy',0);mundo.setEnvironment(estado);
 return {chuva:frame.rain,solo:frame.wetness,neblina:frame.fog,vento:frame.ventoEfetivo,massas:nuvens.campo.massas.length};
}});
