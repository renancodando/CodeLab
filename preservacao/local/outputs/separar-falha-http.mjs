import {readFileSync,writeFileSync} from 'node:fs';
const arquivo='src/learning/http.ts';let texto=readFileSync(arquivo,'utf8').replace('if(primeira&&primeira.quantidade===tentativa.quantidade)tentativa.servidorEm=',"if(primeira&&tentativa.falha!=='429'&&tentativa.falha!=='503'&&primeira.quantidade===tentativa.quantidade)tentativa.servidorEm=");writeFileSync(arquivo,texto);
const testes='tests/unit/http.test.ts';texto=readFileSync(testes,'utf8').replace(" it('a repetição idêntica aguarda",` it('uma falha de transporte injetada não aguarda a intenção original',()=>{
  const estado=reproduzirExperimentoHttp([pedido({processamento:1500}),pedido({falha:'429'}),avancar(300)]).estado;
  expect(estado.tentativas.map(t=>t.status)).toEqual([null,429]);expect(estado.tentativas[1].cliente).toBe('respondeu');expect(estado.reservas).toEqual([]);
 });
 it('a repetição idêntica aguarda`);writeFileSync(testes,texto);
