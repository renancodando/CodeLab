export type TipoFonte = 'modelo'|'observacao'|'radar'|'pluviometro';
export type VariaveisAtmosfericas = {
 temperatura:number|null; umidade:number|null; pontoDeOrvalho:number|null;
 nebulosidade:number|null; nuvensBaixas:number|null; nuvensMedias:number|null; nuvensAltas:number|null;
 precipitacao:number|null; probabilidade:number|null; vento:number|null; direcao:number|null; rajada:number|null;
 visibilidade:number|null; radiacaoDireta:number|null; radiacaoDifusa:number|null;
};
export type LeituraMeteorologica = {
 fonte:string; tipo:TipoFonte; capturadoEm:number|null; recebidoEm:number; validade:number;
 distanciaKm:number|null; qualidade:number; cobertura:'ponto'|'proximidades'|'regional';
 variaveis:Partial<VariaveisAtmosfericas>; detectouChuva?:boolean; intensidadeIndicativa?:number; tempestade?:boolean; granizo?:boolean; neve?:number;
};
export type SituacaoChuva = 'observada'|'provavel'|'proximidades'|'possibilidade'|'nao-detectada'|'estimada'|'insuficiente';
export type ResultadoAtmosferico = VariaveisAtmosfericas & {
 situacao:SituacaoChuva; confiancaChuva:number; intensidadeLocal:number; intensidadeDistante:number;
 tempestade:number; granizo:number; neve:number; divergencia:boolean; fontes:LeituraMeteorologica[];
};
export const rotulosChuva:Record<SituacaoChuva,string> = {
 observada:'Chuva observada na região',provavel:'Chuva provável',proximidades:'Chuva nas proximidades',
 possibilidade:'Possibilidade de chuva', 'nao-detectada':'Nenhuma chuva detectada',
 estimada:'Condição estimada',insuficiente:'Dados temporariamente insuficientes'
};
export const variaveisVazias:VariaveisAtmosfericas = {
 temperatura:null,umidade:null,pontoDeOrvalho:null,nebulosidade:null,nuvensBaixas:null,nuvensMedias:null,nuvensAltas:null,
 precipitacao:null,probabilidade:null,vento:null,direcao:null,rajada:null,visibilidade:null,radiacaoDireta:null,radiacaoDifusa:null
};
