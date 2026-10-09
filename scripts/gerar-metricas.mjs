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
const metricas = {
 aulas: matriz.totalLessons, trilhas: matriz.totalCourses, aulasOriginais: matriz.originalLessons,
 aulasAprofundadas: matriz.expandedLessons,
 problemasIndependentes: new Set(aulas.flatMap(aula => (aula.practices ?? []).map(problema => aula.id + ':' + problema.id))).size,
 atividadesCorrigiveis: atividades.length, aulasComPausas: new Set(atividades.flatMap(atividade => atividade.lessonIds)).size,
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
const documentacao = `# Métricas do catálogo\n\nGerado por \`npm run content:generate\` a partir das definições e da matriz do currículo. O build rejeita divergências. A interface usa o mesmo resumo JSON, sem carregar capítulos adicionais.\n\n${resumo}\n\n| Medida | Quantidade |\n| --- | ---: |\n| Aulas originais | ${metricas.aulasOriginais} |\n| Aulas nos percursos aprofundados | ${metricas.aulasAprofundadas} |\n| Linguagens com atividades | ${metricas.linguagens.length} |\n| Entradas de tópicos na matriz | ${metricas.entradasCobertura} |\n| Entradas ligadas a problemas específicos | ${metricas.entradasComPratica} |\n| Entradas introduzidas | ${metricas.entradasIntroduzidas} |\n\n## Atividades por linguagem\n\n| Linguagem | Atividades corrigíveis |\n| --- | ---: |\n${Object.entries(metricas.atividadesPorLinguagem).map(([linguagem, total]) => '| ' + ({html:'HTML',css:'CSS',javascript:'JavaScript',typescript:'TypeScript',python:'Python',csharp:'C#',cpp:'C++',sql:'SQL/PostgreSQL'}[linguagem] ?? linguagem) + ' | ' + total + ' |').join('\n')}\n\nContagem não mede domínio nem esgota os ecossistemas. Um tópico pode aparecer em mais de um contexto; entradas da matriz não são conceitos únicos. Problemas independentes têm critérios e soluções, mas não recebem correção automática universal. Atividades conceituais não comprovam compilação; projetos abertos usam revisão manual. Consulte [o mapa de cobertura](curriculo-completo.md) e [as etapas restantes](etapas-restantes.md).\n`;
const arquivos = [
 ['src/content/metricas.json', JSON.stringify(metricas, null, 2) + '\n'],
 ['docs/metricas-catalogo.md', documentacao],
 ['README.md', readme.slice(0, readme.indexOf(inicio)) + inicio + '\n' + resumo + '\n' + fim + readme.slice(readme.indexOf(fim) + fim.length)]
];
for (const [arquivo, conteudo] of arquivos) {
 if (process.argv.includes('--check')) {
  const anterior = await readFile(arquivo, 'utf8').catch(() => '');
  if (anterior.replace(/\r\n/g, '\n') !== conteudo) throw new Error(arquivo + ' está desatualizado. Execute npm run content:generate.');
 } else await writeFile(arquivo, conteudo);
}
console.log('Métricas ' + (process.argv.includes('--check') ? 'conferidas' : 'geradas') + ': ' + metricas.aulas + ' aulas, ' + metricas.atividadesCorrigiveis + ' atividades.');
