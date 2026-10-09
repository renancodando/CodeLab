export type Quality='high'|'medium'|'low'|'reduced';
export function tetoQualidade(nucleos:unknown,memoria:unknown):Exclude<Quality,'reduced'> {
 const recurso=(valor:unknown)=>typeof valor==='number'&&Number.isFinite(valor)&&valor>0?valor:Infinity;
 const menor=Math.min(recurso(nucleos),recurso(memoria));
 return menor<=2?'low':menor<=4?'medium':'high';
}
export function proporcaoRenderizacao(largura:number,altura:number,proporcaoDispositivo:number,qualidade:Quality) {
 const limite=qualidade==='high'?1.5:qualidade==='medium'?1:.75;
 const pixels=qualidade==='high'?4500000:qualidade==='medium'?2500000:1200000;
 const area=Number.isFinite(largura)&&Number.isFinite(altura)?Math.max(1,largura)*Math.max(1,altura):1;
 const proporcao=Number.isFinite(proporcaoDispositivo)&&proporcaoDispositivo>0?proporcaoDispositivo:1;
 return Math.min(proporcao,limite,Math.sqrt(pixels/area));
}
export class QualityController {
 tier:Quality='medium';private samples=0;private total=0;private slow=0;private fast=0;
 constructor(private teto:Exclude<Quality,'reduced'>='high'){this.tier=teto==='low'?'low':'medium';}
 sample(ms:number,budget:number,reduced:boolean):boolean{const before=this.tier;if(reduced){this.tier='reduced';this.reset();return before!==this.tier;}if(this.tier==='reduced'){this.tier=this.teto==='low'?'low':'medium';this.reset();}this.total+=ms;this.samples++;if(this.samples<30)return before!==this.tier;const average=this.total/this.samples;this.samples=0;this.total=0;if(average>budget*1.45){this.slow++;this.fast=0;}else if(average<budget*1.16){this.fast++;this.slow=0;}else{this.slow=0;this.fast=0;}if(this.slow>=2){this.tier=this.tier==='high'?'medium':'low';this.slow=0;}if(this.fast>=24){this.tier=this.teto==='low'?'low':this.tier==='low'?'medium':this.teto;this.fast=0;}return before!==this.tier;}
 get ratio(){return this.tier==='high'?1.5:this.tier==='medium'?1:.75;}
 get particles(){return this.tier==='high'?1:this.tier==='medium'?.6:.3;}
 reset(){this.samples=0;this.total=0;this.slow=0;this.fast=0;}
}
