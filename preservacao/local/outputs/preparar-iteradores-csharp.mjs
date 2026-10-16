import {readFile,writeFile} from 'node:fs/promises';
const caminho=new URL('../work/CodeLab/src/content/deep/csharp.ts',import.meta.url);
const fonte=await readFile(caminho,'utf8');
const prefixo="import type {DeepCourse} from './types';\nexport default ";
const curso=JSON.parse(fonte.slice(fonte.indexOf('export default ')+15,fonte.lastIndexOf(' satisfies DeepCourse;')));
const aula=curso.lessons.find(aula=>aula.id==='cs-iteradores-descarte');
const novos=[
 [1,'No exercício de avanço, producidos só muda imediatamente antes de yield return. O valor de Current corresponde ao último MoveNext bem-sucedido, não ao próximo. Encerrar o percurso após dois valores não exige gerar o terceiro. Uma nova enumeração da fonte ilustrada começa outro percurso e repete seus efeitos; não reutiliza a posição do enumerador descartado.'],
 [2,'Quem obtém um enumerador manualmente precisa delimitar seu uso. using (var percurso = Fonte().GetEnumerator()) envolve tanto MoveNext quanto o processamento, garantindo Dispose na saída normal e por exceção. Coloque a observação da liberação depois desse bloco. Descartar antes do primeiro avanço não executa uma aquisição que ainda não começou; percorrer tudo para forçar o fechamento pode repetir trabalho ou nunca terminar.'],
 [4,'A pausa de materialização usa uma origem finita de quatro inteiros e um contador no produtor. Guardar a consulta Where mantém a avaliação adiada: percorrê-la duas vezes repete o produtor. ToArray() e ToList() consomem essa consulta na chamada e guardam somente os resultados aceitos; percorrer a coleção resultante não volta à origem. O filtro pode não guardar nenhum valor e ainda precisar examinar toda a origem. Materializar não serve para uma fonte infinita nem elimina o custo de armazenamento; a escolha pertence ao contrato.']
];
for(const [indice,paragrafo] of novos)if(!aula.sections[indice].text.includes(paragrafo))aula.sections[indice].text.push(paragrafo.replace('producidos','produzidos'));
await writeFile(caminho,prefixo+JSON.stringify(curso,null,2)+' satisfies DeepCourse;\n');
