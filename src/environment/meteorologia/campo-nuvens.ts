import type {AmbientFrame} from '../simulation';
export type MassaNuvem={semente:number;camada:0|1|2;x:number;y:number;z:number;largura:number;altura:number;densidade:number;idade:number;vida:number;velocidade:number};
export type CelulaVisual={x:number;z:number;raio:number;intensidade:number};
const limitar=(n:number)=>Math.max(0,Math.min(1,n));
export class CampoNuvens {
 readonly massas:MassaNuvem[]=[];
 readonly celulas:CelulaVisual[]=[];
 private semente:number;
 constructor(semente=414){
  this.semente=semente;
  for(let i=0;i<42;i++){const camada=(i%3) as 0|1|2;this.massas.push(this.criar(camada,true));}
  for(let i=0;i<4;i++)this.celulas.push({x:0,z:0,raio:1,intensidade:0});
 }
 private aleatorio(){this.semente=(this.semente*1664525+1013904223)>>>0;return this.semente/4294967296;}
 private criar(camada:0|1|2,inicial=false):MassaNuvem{
  const vida=600+this.aleatorio()*1500;
  return {semente:this.aleatorio()*1000,camada,x:(this.aleatorio()-.5)*260,y:23+camada*21+this.aleatorio()*13,z:-25-this.aleatorio()*145,
   largura:25+camada*7+this.aleatorio()*30,altura:(camada===2?3:9)+this.aleatorio()*(camada===2?4:12),densidade:0,idade:inicial?vida*(.1+this.aleatorio()*.6):0,vida,velocidade:.3+this.aleatorio()*.5};
 }
 avancar(estado:AmbientFrame,dt:number,movimento=1){
  const coberturas=[estado.nuvensBaixas,estado.nuvensMedias,estado.nuvensAltas],angulo=estado.direction*Math.PI/180;
  for(const massa of this.massas){
   massa.idade+=dt;const crescimento=limitar(massa.idade/90),dissipacao=limitar((massa.vida-massa.idade)/120);
   const alvo=coberturas[massa.camada]*crescimento*dissipacao*(.55+.45*Math.sin(massa.semente)**2);
   massa.densidade+=(alvo-massa.densidade)*(1-Math.exp(-dt/30));
   const deslocamento=dt*(.04+estado.ventoEfetivo/75)*massa.velocidade/(1+massa.camada*.65)*movimento;
   massa.x-=Math.sin(angulo)*deslocamento;massa.z-=Math.cos(angulo)*deslocamento;
   if(massa.idade>massa.vida&&massa.densidade<.01)Object.assign(massa,this.criar(massa.camada));
   if(massa.x>155)massa.x-=310;if(massa.x< -155)massa.x+=310;
   if(massa.z> -15)massa.z-=170;if(massa.z< -185)massa.z+=170;
  }
  for(let i=0;i<this.celulas.length;i++){
   const massa=this.massas[i*3],celula=this.celulas[i];celula.x=massa.x;celula.z=massa.z;celula.raio=massa.largura*.6;
   celula.intensidade=Math.max(estado.rain,estado.chuvaDistante)*limitar(massa.densidade*3);
  }
 }
 ocultacao(x:number,y:number,z:number,origem={x:2,y:15,z:48}){
  const dz=z-origem.z;if(dz>=-.01)return 0;let transparencia=1;
  for(const massa of this.massas){
   const t=(massa.z-origem.z)/dz;if(t<=0||t>=1)continue;
   const px=(origem.x+(x-origem.x)*t-massa.x)/(massa.largura*.55),py=(origem.y+(y-origem.y)*t-massa.y)/(massa.altura*.65);
   const borda=limitar(1-px*px-py*py),detalhe=.7+.3*Math.sin(px*7+massa.semente)*Math.sin(py*5+massa.semente);
   transparencia*=1-borda*detalhe*massa.densidade*(massa.camada===2?.35:.85);
  }
  return limitar(1-transparencia);
 }
}
