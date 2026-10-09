import {practiceActivities} from '../content/practice';
import {lessons} from '../content/curriculum';
import {legacyConceptIds} from './legacy-concept-ids';
import type {AdaptiveCatalog,LearningActivity,SkillDefinition} from './adaptive';
export const languageLabels:Record<string,string>={html:'HTML',css:'CSS',javascript:'JavaScript',typescript:'TypeScript',python:'Python',csharp:'C#',cpp:'C++',sql:'SQL'};
const terms:Record<string,string>={comparacoes:"Comparações",obrigatoriedade:"Obrigatoriedade",correspondencia:"Correspondência",assincrono:'Assíncrono',cancelamento:'Cancelamento',vagas:'Vagas',propagacao:'Propagação',componentes:'Componentes',contexto:'Contexto',ancestrais:'Ancestrais',objetos:'Objetos',propriedades:'Propriedades',descritores:'Descritores',validacao:'Validação',vector:'Vector',iteracao:'Iteração',remocao:'Remoção',realocacao:'Realocação',variancia:'Variância',resultados:'Resultados',parametros:'Parâmetros',metodos:'Métodos',arrays:'Arrays',reduce:'Acumulação',filter:'Filtragem',limites:'Limites',conversao:'Conversão',formularios:'Formulários',dialogo:'Diálogos',foco:'Foco',grid:'Grid',responsividade:'Responsividade',narrowing:'Refinamento de tipos',ausencia:'Ausência de valores',controle:'Controle',range:'Intervalos',funcoes:'Funções',defaults:'Valores padrão',contratos:'Contratos',tipos:'Tipos',decimal:'Decimal',nullable:'Tipos anuláveis',consumo:'Consumo',lotes:'Lotes',recursos:'Recursos',iteradores:'Iteradores',descarte:'Descarte',raii:'RAII',referencias:'Referências',stl:'STL',null:'NULL',joins:'Junções',cardinalidade:'Cardinalidade',closures:'Closures',instancias:'Instâncias',iteracoes:'Iterações',snapshots:'Snapshots',compilacao:'Compilação',cascata:'Cascata',transacoes:'Transações',atomicidade:'Atomicidade'};
const skills:SkillDefinition[]=[...new Set(practiceActivities.flatMap(a=>a.skillIds))].map(id=>{const parts=id.split('.');return{id,label:terms[parts.at(-1)!]??parts.at(-1)!,path:parts.map((p,i)=>i===0?languageLabels[p]??p:terms[p]??p)};});
function lessonConceptId(id:string):string{
 const l=lessons.find(l=>l.id===id);if(!l)return '';
 const rank=({Fundamentos:'0','Intermediário':'1','Avançado':'2','Especialização':'3'} as Record<string,string>)[l.level??'Fundamentos']??'0';
 return legacyConceptIds[id]??'conceito-'+rank+'-'+id;
}
export const idPreparacao=(aula:string)=>lessonConceptId(aula)+'-pratica-v1';
const activities:LearningActivity[]=practiceActivities.map(a=>({id:a.id,title:a.title,kind:a.afterBlock===5?'challenge':'practice',skillIds:a.skillIds,minutes:a.minutes,lessonId:a.lessonIds[0],...(a.requiresConcept?{requiredConcepts:[idPreparacao(a.lessonIds[0])]}:{})}));
for(const id of [...new Set(practiceActivities.flatMap(a=>a.lessonIds))]){
 const l=lessons.find(l=>l.id===id);if(!l)continue;const related=practiceActivities.filter(a=>a.lessonIds.includes(id));
 activities.push({id:lessonConceptId(id),title:l.title,kind:'concept',skillIds:[...new Set(related.flatMap(a=>a.skillIds))],minutes:3,lessonId:id});
 const preparadas=related.filter(atividade=>atividade.requiresConcept);
 if(preparadas.length){
  const ateBloco=Math.max(...preparadas.map(atividade=>atividade.afterBlock));
  activities.push({id:idPreparacao(id),title:'Preparação: '+l.title,kind:'concept',skillIds:[...new Set(preparadas.flatMap(atividade=>atividade.skillIds))],minutes:Math.max(3,ateBloco*2),lessonId:id,requiredConcepts:[lessonConceptId(id)],preparacaoAteBloco:ateBloco});
 }
}
export const adaptiveCatalog:AdaptiveCatalog={skills,activities};
