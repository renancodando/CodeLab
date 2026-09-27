export type Quality='high'|'medium'|'low'|'reduced';
export class QualityController {
 tier:Quality='medium';private samples=0;private total=0;private slow=0;private fast=0;
 sample(ms:number,budget:number,reduced:boolean):boolean{const before=this.tier;if(reduced){this.tier='reduced';return before!==this.tier;}if(this.tier==='reduced')this.tier='medium';this.total+=ms;this.samples++;if(this.samples<30)return before!==this.tier;const average=this.total/this.samples;this.samples=0;this.total=0;if(average>budget*1.45){this.slow++;this.fast=0;}else if(average<budget*1.16){this.fast++;this.slow=0;}else{this.slow=0;this.fast=0;}if(this.slow>=2){this.tier=this.tier==='high'?'medium':'low';this.slow=0;}if(this.fast>=24){this.tier=this.tier==='low'?'medium':'high';this.fast=0;}return before!==this.tier;}
 get ratio(){return this.tier==='high'?1.5:this.tier==='medium'?1:.75;}
 get particles(){return this.tier==='high'?1:this.tier==='medium'?.6:.3;}
 reset(){this.samples=0;this.total=0;this.slow=0;this.fast=0;}
}
