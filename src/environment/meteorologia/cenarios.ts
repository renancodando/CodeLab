import type {EnvironmentState} from '../../types';
import {normalizarEvidencia} from './normalizacao';
export const cenariosAtmosfericos=['limpo','parcial','encoberto','chuva-fraca','chuva-moderada','chuva-forte','pos-chuva','neblina','vento','rajada','noite-nublada','noite-parcial','tempestade'] as const;
export function criarCenario(nome:typeof cenariosAtmosfericos[number],base:EnvironmentState,agora:number):EnvironmentState {
 const chuva=nome==='chuva-fraca'?.2:nome==='chuva-moderada'?3:nome==='chuva-forte'||nome==='tempestade'?12:0;
 const nuvens=nome==='limpo'?5:nome.includes('parcial')?45:95,vento=nome==='vento'?35:nome==='rajada'?18:7;
 const fonte=normalizarEvidencia('observacao',{fonte:'Cenário de desenvolvimento',capturadoEm:agora,recebidoEm:agora,distanciaKm:0,cobertura:'ponto',qualidade:1,detectouChuva:chuva>0,tempestade:nome==='tempestade',
  variaveis:{precipitacao:chuva,temperatura:nome==='neblina'?12:22,umidade:nome==='neblina'?99:75,pontoDeOrvalho:nome==='neblina'?11.9:15,nebulosidade:nuvens,nuvensBaixas:nuvens,nuvensMedias:nuvens*.7,nuvensAltas:nuvens*.4,vento,rajada:nome==='rajada'?65:vento*1.2,direcao:130,visibilidade:nome==='neblina'?300:30000}});
 return {...base,fontes:[fonte],rain:chuva,clouds:nuvens,code:0};
}
