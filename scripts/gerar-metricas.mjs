import {readFile, writeFile} from 'node:fs/promises';
import ts from 'typescript';

async function lerConteudo(arquivo) {
 const codigo = ts.transpileModule(await readFile(arquivo, 'utf8'), {
  compilerOptions: {target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext}
 }).outputText;
 return import('data:text/javascript;base64,' + Buffer.from(codigo).toString('base64'));
}
const [{practiceActivities: atividades}, {learningPaths: percursos, capstoneProjects: projetos}, matriz] = await Promise.all([
 lerConteudo('src/content/practice.ts'), lerConteudo('src/content/project-paths.ts'),
 readFile('docs/cobertura-curriculo.json', 'utf8').then(JSON.parse)
]);
const aulas = matriz.courses.flatMap(trilha => trilha.lessons);
const topicos = aulas.flatMap(aula => aula.topics);
const marcos = projetos.flatMap(projeto => projeto.milestones);
const catalogo = [];
const fonte = ts.createSourceFile('curriculum.ts', await readFile('src/content/curriculum.ts', 'utf8'), ts.ScriptTarget.ESNext, true);
function visitar(no) {
 if (ts.isCallExpression(no) && ts.isIdentifier(no.expression) && no.expression.text === 'course') {
  const [id, titulo, , , linguagem] = no.arguments, entradas = no.arguments.at(-1);
  if (!ts.isStringLiteral(id) || !ts.isStringLiteral(titulo) || !ts.isStringLiteral(linguagem) || !ts.isArrayLiteralExpression(entradas)) throw new Error('Metadados originais precisam ser explícitos.');
  for (const entrada of entradas.elements) {
   if (!ts.isArrayLiteralExpression(entrada) || !ts.isStringLiteral(entrada.elements[0]) || !ts.isStringLiteral(entrada.elements[1])) throw new Error('Aula original sem id/título explícito.');
   catalogo.push({id:entrada.elements[0].text, titulo:entrada.elements[1].text, trilha:id.text, nomeTrilha:titulo.text, linguagem:id.text==='css'?'css':linguagem.text, nivel:'Original'});
  }
 }
 ts.forEachChild(no, visitar);
}
visitar(fonte);
const indice = ts.createSourceFile('index.ts', await readFile('src/content/deep/index.ts', 'utf8'), ts.ScriptTarget.ESNext, true);
for (const instrucao of indice.statements) if (ts.isVariableStatement(instrucao)) for (const declaracao of instrucao.declarationList.declarations) {
 if (ts.isIdentifier(declaracao.name) && declaracao.name.text === 'expandedLessons' && declaracao.initializer) {
  for (const aula of JSON.parse(declaracao.initializer.getText(indice))) catalogo.push({id:aula.id, titulo:aula.title, trilha:aula.track, nomeTrilha:matriz.courses.find(trilha=>trilha.id===aula.track)?.title??aula.track, linguagem:aula.track.startsWith('css-')?'css':aula.language, nivel:aula.level});
 }
}
const ids = new Set(catalogo.map(aula=>aula.id)), cobertas = new Set(atividades.flatMap(atividade=>atividade.lessonIds));
if (catalogo.length !== matriz.totalLessons || ids.size !== catalogo.length || [...cobertas].some(id=>!ids.has(id))) throw new Error('Catálogo e atividades possuem contagem ou vínculos inválidos.');
const cobertura = Object.fromEntries([...new Set(catalogo.map(aula=>aula.linguagem))].sort().map(linguagem=>{
 const conjunto = catalogo.filter(aula=>aula.linguagem===linguagem), comPausas = conjunto.filter(aula=>cobertas.has(aula.id)).length;
 return [linguagem, {aulas:conjunto.length, comPausas, semPausas:conjunto.length-comPausas}];
}));
const metricas = {
 aulas: matriz.totalLessons, trilhas: matriz.totalCourses, aulasOriginais: matriz.originalLessons,
 aulasAprofundadas: matriz.expandedLessons,
 problemasIndependentes: new Set(aulas.flatMap(aula => (aula.practices ?? []).map(problema => aula.id + ':' + problema.id))).size,
 atividadesCorrigiveis: atividades.length, aulasComPausas: new Set(atividades.flatMap(atividade => atividade.lessonIds)).size,
 aulasSemPausas: catalogo.length-cobertas.size, coberturaPorLinguagem: cobertura,
 linguagens: [...new Set(atividades.map(atividade => atividade.language))].sort(),
 percursosEngenharia: percursos.length, etapasEngenharia: percursos.reduce((total, percurso) => total + percurso.stages.length, 0),
 projetosConclusao: projetos.length, marcosProjeto: marcos.length,
 criteriosManuais: marcos.reduce((total, marco) => total + marco.criteria.length, 0),
 entradasCobertura: topicos.length,
 entradasComPratica: topicos.filter(topico => topico.status === 'praticaIndependente').length,
 entradasIntroduzidas: topicos.filter(topico => topico.status === 'introduzido').length,
 atividadesPorLinguagem: Object.fromEntries([...new Set(atividades.map(atividade => atividade.language))].sort()
  .map(linguagem => [linguagem, atividades.filter(atividade => atividade.language === linguagem).length]))
};
const resumo = `O catálogo tem **${metricas.aulas} aulas em ${metricas.trilhas} trilhas**, **${metricas.problemasIndependentes} problemas independentes** e **${metricas.atividadesCorrigiveis} atividades corrigíveis**. As pausas dessas atividades estão ligadas a **${metricas.aulasComPausas} aulas**. Há **${metricas.percursosEngenharia} percursos de engenharia com ${metricas.etapasEngenharia} etapas** e **${metricas.projetosConclusao} projetos de conclusão com ${metricas.marcosProjeto} marcos e ${metricas.criteriosManuais} critérios manuais**.`;
const inicio = '<!-- metricas:inicio -->', fim = '<!-- metricas:fim -->';
const readme = (await readFile('README.md', 'utf8')).replace(/\r\n/g, '\n');
if (readme.split(inicio).length !== 2 || readme.split(fim).length !== 2 || readme.indexOf(fim) < readme.indexOf(inicio)) {
 throw new Error('README precisa de um único bloco de métricas identificado.');
}
const nomesLinguagens = {html:'HTML', css:'CSS', javascript:'JavaScript', typescript:'TypeScript', python:'Python', csharp:'C#', cpp:'C++', sql:'SQL/PostgreSQL', text:'Integração (transversal)'};
const distribuicao = Object.entries(metricas.atividadesPorLinguagem)
 .map(([linguagem, total]) => '| ' + (nomesLinguagens[linguagem] ?? linguagem) + ' | ' + total + ' |').join('\n');
const prioridades = [
 {titulo:'1. Fundamentos comuns', criterio:'Ordem, dados, decisões, repetição, funções e coleções sustentam os percursos seguintes.'},
 {titulo:'2. Fundamentos e aplicações por linguagem', criterio:'Concluir a prática das aulas originais e dos fundamentos aprofundados antes de cobrar transferência avançada.'},
 {titulo:'3. Integração e consolidação', criterio:'Combinar contratos, estado, erros e testes; exigir diagnóstico e alteração além do caso demonstrado.'},
 {titulo:'4. Engenharia e especialização', criterio:'Aplicar os pré-requisitos em decisões, concorrência, desempenho e projetos; conservar as limitações da correção.'}
];
function prioridade(aula) {
 if (['comecando','logica'].includes(aula.trilha)) return 0;
 if (aula.trilha==='projetos' || ['Avançado','Especialização'].includes(aula.nivel)) return 3;
 if (aula.trilha==='fullstack' || aula.nivel==='Intermediário') return 2;
 return 1;
}
const faltantes = catalogo.filter(aula=>!cobertas.has(aula.id));
const tabelaCobertura = Object.entries(cobertura).map(([linguagem, dado])=>'| '+(nomesLinguagens[linguagem]??linguagem)+' | '+dado.aulas+' | '+dado.comPausas+' | '+dado.semPausas+' |').join('\n');
const lacunas = `# Aulas ainda sem pausas corrigíveis

Gerado por \`npm run content:generate\` a partir do catálogo e das atividades reais. O build rejeita lista desatualizada. Esta é uma fila pedagógica da edição existente, não uma auditoria final.

Há **${metricas.aulasSemPausas} de ${metricas.aulas} aulas sem pausas deste catálogo**. As outras ${metricas.aulasComPausas} têm ao menos uma pausa; isso não significa que estejam concluídas ou que suas linguagens tenham prática suficiente. Missões, experimentos de engenharia, projetos e o percurso próprio de valores continuam existindo e não são contados como essas pausas.

| Linguagem | Aulas | Com pausas | Sem pausas |
| --- | ---: | ---: | ---: |
${tabelaCobertura}

Trabalhar de cima para baixo dentro das dependências de cada trilha. Em cada aula, escolher previsão, diagnóstico e alteração/produção quando fizer sentido; não acrescentar perguntas apenas para retirar uma linha da lista. Conferir também bordas, feedback, assistência, revisão e aplicação. As contagens descrevem o checkout gerado; publicação exige os gates de produção registrados em continuidade.md.

${prioridades.map((grupo, numero)=>{
 const conjunto=faltantes.filter(aula=>prioridade(aula)===numero);
 return '## '+grupo.titulo+'\n\n'+grupo.criterio+'\n\n'+(conjunto.length?'| Aula | Trilha | Linguagem | Nível |\n| --- | --- | --- | --- |\n'+conjunto.map(aula=>'| `'+aula.id+'` — '+aula.titulo+' | '+aula.nomeTrilha+' | '+(nomesLinguagens[aula.linguagem]??aula.linguagem)+' | '+aula.nivel+' |').join('\n'):'Nenhuma aula sem pausa neste grupo. A profundidade das atividades continua sujeita à revisão pedagógica.');
}).join('\n\n')}
`;
const documentacao = `# Métricas do catálogo

Gerado por \`npm run content:generate\` a partir das definições e da matriz do currículo. O build rejeita divergências. A interface usa o mesmo resumo JSON, sem carregar capítulos adicionais.

${resumo}

| Medida | Quantidade |
| --- | ---: |
| Aulas originais | ${metricas.aulasOriginais} |
| Aulas nos percursos aprofundados | ${metricas.aulasAprofundadas} |
| Linguagens com atividades | ${metricas.linguagens.length} |
| Entradas de tópicos na matriz | ${metricas.entradasCobertura} |
| Entradas ligadas a problemas específicos | ${metricas.entradasComPratica} |
| Entradas introduzidas | ${metricas.entradasIntroduzidas} |

## Atividades por linguagem

| Linguagem | Atividades corrigíveis |
| --- | ---: |
${distribuicao}

## Cobertura das aulas

| Linguagem | Aulas | Com pausas | Sem pausas |
| --- | ---: | ---: | ---: |
${tabelaCobertura}

Restam ${metricas.aulasSemPausas} aulas sem pausas deste catálogo. A [fila pedagógica gerada](aulas-sem-pratica.md) lista cada uma e se atualiza junto das métricas.

A aula de valores também possui um percurso próprio passo a passo, preservado separadamente da leitura completa. A contagem de pausas não inclui as etapas desse percurso, missões ou experiências dos percursos de engenharia. Contagem não mede domínio nem esgota os ecossistemas. Um tópico pode aparecer em mais de um contexto; entradas da matriz não são conceitos únicos. Problemas independentes têm critérios e soluções, mas não recebem correção automática universal. Atividades conceituais não comprovam compilação; projetos abertos usam revisão manual. Consulte [o mapa de cobertura](curriculo-completo.md) e [as etapas restantes](etapas-restantes.md).
`;
const arquivos = [
 ['src/content/metricas.json', JSON.stringify(metricas, null, 2) + '\n'],
 ['docs/metricas-catalogo.md', documentacao],
 ['docs/aulas-sem-pratica.md', lacunas],
 ['README.md', readme.slice(0, readme.indexOf(inicio)) + inicio + '\n' + resumo + '\n' + fim + readme.slice(readme.indexOf(fim) + fim.length)]
];
for (const [arquivo, conteudo] of arquivos) {
 if (process.argv.includes('--check')) {
  const anterior = await readFile(arquivo, 'utf8').catch(() => '');
  if (anterior.replace(/\r\n/g, '\n') !== conteudo) throw new Error(arquivo + ' está desatualizado. Execute npm run content:generate.');
 } else await writeFile(arquivo, conteudo);
}
console.log('Métricas ' + (process.argv.includes('--check') ? 'conferidas' : 'geradas') + ': ' + metricas.aulas + ' aulas, ' + metricas.atividadesCorrigiveis + ' atividades.');
