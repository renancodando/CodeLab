import type {Lesson} from '../curriculum';
export type Section={title:string;text:string[];code?:string};
export type DeepLesson={
 id:string;title:string;level:'Fundamentos'|'Intermediário'|'Avançado'|'Especialização';
 summary:string;topics:string[];sections:Section[];
 code:string;output:string;trace:string[];
 exercise:string;solution:string;bug:string;bugCode:string;repair:string;
 checks:string[];project:string;question:string;answer:string;distractors:[string,string];
};
export type DeepCourse={id:string;title:string;description:string;icon:string;language:string;source:string;environment?:string;lessons:DeepLesson[]};
export function materialize(course:DeepCourse,entry:DeepLesson):Lesson{
 const index=course.lessons.indexOf(entry),correct=index%3,options=[...entry.distractors];
 options.splice(correct,0,entry.answer);
 const before=course.lessons[index-1]?.title,after=course.lessons[index+1]?.title;
 return {id:entry.id,track:course.id,title:entry.title,body:entry.summary,language:course.language,source:course.source,
 level:entry.level,topics:entry.topics,environment:course.environment,code:entry.code,exercise:entry.exercise,solution:entry.solution,error:entry.bug,
 question:entry.question,options,correct,capitulos:[
 {id:'conexao',titulo:'Objetivos e pré-requisitos',subtitulo:entry.level,paragrafos:[entry.summary,
 before?'Antes desta aula, pratique '+before+'. Reconstrua o exemplo anterior e explique suas decisões.':'Comece por esta aula. Instale as ferramentas indicadas na referência oficial e execute um programa mínimo antes de avançar.',
 after?'Depois, conecte estas ideias a '+after+'. Use o projeto ao final como ponte entre os assuntos.':'Esta etapa encerra o percurso principal. Use os critérios de domínio para escolher o próximo projeto e consulte a referência para aprofundar as APIs que seu projeto exigir.'],pontos:entry.topics},
 {id:'contexto',titulo:entry.sections[0].title,subtitulo:'Modelo mental',paragrafos:entry.sections[0].text,codigo:entry.sections[0].code},
 ...entry.sections.slice(1).map((s,i)=>({id:'teoria-'+(i+1),titulo:s.title,subtitulo:'Entenda os mecanismos',paragrafos:s.text,codigo:s.code})),
 {id:'codigo',titulo:'Exemplo completo e rastreamento',subtitulo:'Preveja antes de executar',paragrafos:[
 'Leia o exemplo e escreva sua previsão. Compare valores e efeitos em cada etapa, seguindo o rastreamento abaixo.',
 entry.output,...(course.environment?['Ambiente do exemplo: PostgreSQL. Execute com psql em uma base de estudo; o laboratório atual não oferece esse dialeto como execução local.']:[])],pontos:entry.trace,codigo:entry.code},
 {id:'erro',titulo:'Encontre e explique a falha',subtitulo:'Depuração',paragrafos:[entry.bug,entry.repair],codigo:entry.bugCode},
 {id:'pratica',titulo:'Exercício com critérios verificáveis',subtitulo:'Faça sem copiar',paragrafos:[entry.exercise,
 'Primeiro escreva casos de entrada e a saída esperada. Implemente a menor versão correta, confronte cada caso e registre o que mudou ao corrigir uma falha. Só então consulte a solução.'],pontos:entry.checks},
 {id:'solucao',titulo:'Solução de referência',subtitulo:'Compare decisões',paragrafos:[
 'Esta implementação atende ao exercício proposto. Compare os casos de borda e as escolhas de representação com sua versão. Uma solução diferente pode ser válida quando satisfaz o mesmo contrato.',
 'Altere uma hipótese do problema, feche a solução e reescreva o trecho afetado. Explique por que o código anterior deixou de atender à nova regra.'],codigo:entry.solution},
 {id:'projeto',titulo:'Aplique em um projeto',subtitulo:'Transfira o conhecimento',paragrafos:[entry.project,
 'Defina um resultado observável, uma entrada válida, uma entrada inválida e uma condição de limite. Guarde o código, os resultados e uma explicação da decisão mais difícil. Esses artefatos permitem revisar o projeto depois.']},
 {id:'dominio',titulo:'Critérios de domínio e próxima revisão',subtitulo:'Avance com evidências',paragrafos:[
 'Você deve conseguir prever o exemplo, corrigir a falha e concluir o exercício sem consultar o gabarito. Acertar a pergunta final verifica um conceito; a prática e o projeto verificam sua aplicação.',
 'Volte a esta aula depois de alguns dias. Use dados diferentes e explique o mecanismo em voz alta. Se precisar de ajuda, identifique o conceito específico que ainda exige estudo.'],pontos:entry.checks}
 ]};
}
