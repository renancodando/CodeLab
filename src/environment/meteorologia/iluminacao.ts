import type {AmbientFrame} from '../simulation';
const limitar=(n:number)=>Math.max(0,Math.min(1,n));
export function transmissaoAtmosferica(estado:AmbientFrame,ocultacao:number){
 const camadas=limitar(1-estado.nuvensBaixas*.65-estado.nuvensMedias*.25-estado.nuvensAltas*.08);
 const radiacao=estado.radiacaoDireta===null||estado.daylight<.05?1:limitar(estado.radiacaoDireta/650);
 const direta=(.12+camadas*.88)*(1-ocultacao*.8)*(.4+radiacao*.6)*(1-estado.rain*.2);
 const difusa=estado.radiacaoDifusa===null?.65:limitar(estado.radiacaoDifusa/350);
 return {direta,difusa:.65+difusa*.35,noturna:(1-ocultacao*.92)*(1-estado.nuvensBaixas*.15)};
}
