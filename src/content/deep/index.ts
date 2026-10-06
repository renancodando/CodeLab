import type {Course,Lesson} from '../curriculum';
import {materialize,type DeepCourse} from './types';
export const expandedCourses:Course[]=[
  {
    "id": "python-completo",
    "title": "Python · do zero ao avançado",
    "description": "Tipos, coleções, funções, objetos, biblioteca padrão, concorrência e engenharia de projetos.",
    "icon": "file-code-2",
    "language": "python",
    "source": "https://docs.python.org/3/",
    "lessonIds": [
      "py-fundamentos",
      "py-colecoes-funcoes",
      "py-objetos-protocolos",
      "py-biblioteca-dados",
      "py-concorrencia",
      "py-engenharia"
    ]
  }
];
export const expandedLessons:Lesson[]=[
  {
    "id": "py-fundamentos",
    "track": "python-completo",
    "title": "Python: execução, tipos e controle",
    "body": "Construa seu primeiro programa Python entendendo a execução do arquivo, a indentação e a relação entre nomes e objetos. Estude números, strings, booleanos, conversões, entrada e saída, decisões, repetição e os casos de limite que distinguem um programa previsível de um exemplo que só funciona com uma entrada.",
    "level": "Fundamentos",
    "topics": [
      "interpretador e REPL",
      "indentação",
      "int float bool None",
      "str e Unicode",
      "conversões e entrada",
      "if elif else",
      "for range while",
      "break continue else",
      "comparação e identidade"
    ],
    "language": "python",
    "source": "https://docs.python.org/3/",
    "capitulos": [],
    "code": "",
    "exercise": "",
    "solution": "",
    "error": "",
    "question": "",
    "options": [],
    "correct": 0
  },
  {
    "id": "py-colecoes-funcoes",
    "track": "python-completo",
    "title": "Python: coleções, funções e iteração",
    "body": "Aprenda a escolher list, tuple, dict e set pelo contrato dos dados, escrever funções com parâmetros claros e percorrer coleções sem modificar acidentalmente seus elementos. Conecte fatiamento, comprehensions, desempacotamento, escopo, closures, iteradores e geradores a problemas de transformação e agregação.",
    "level": "Intermediário",
    "topics": [
      "list tuple dict set",
      "mutabilidade e cópia",
      "slicing e desempacotamento",
      "comprehensions",
      "parâmetros posicionais e nomeados",
      "args kwargs",
      "escopo LEGB closures",
      "iteradores e yield",
      "complexidade"
    ],
    "language": "python",
    "source": "https://docs.python.org/3/",
    "capitulos": [],
    "code": "",
    "exercise": "",
    "solution": "",
    "error": "",
    "question": "",
    "options": [],
    "correct": 0
  },
  {
    "id": "py-objetos-protocolos",
    "track": "python-completo",
    "title": "Python: classes, protocolos e metaprogramação",
    "body": "Modele objetos por responsabilidades e contratos, usando classes, dataclasses, propriedades e composição. Entenda o sistema de atributos, métodos especiais, herança, super, protocolos, decoradores e context managers para criar APIs previsíveis, sem recorrer a mecanismos avançados quando uma função simples resolve o problema.",
    "level": "Avançado",
    "topics": [
      "classes instâncias self",
      "dataclasses",
      "herança composição MRO super",
      "property descritores",
      "dunder repr eq hash",
      "duck typing protocolos",
      "decoradores functools.wraps",
      "context managers",
      "slots metaclasses"
    ],
    "language": "python",
    "source": "https://docs.python.org/3/",
    "capitulos": [],
    "code": "",
    "exercise": "",
    "solution": "",
    "error": "",
    "question": "",
    "options": [],
    "correct": 0
  },
  {
    "id": "py-biblioteca-dados",
    "track": "python-completo",
    "title": "Python: arquivos, exceções e biblioteca padrão",
    "body": "Aprenda a trabalhar com recursos reais usando pathlib, arquivos Unicode, JSON, CSV, datas, expressões regulares e coleções especializadas. Estabeleça fronteiras de validação, trate exceções específicas e escreva arquivos com uma estratégia que não deixe resultados parciais silenciosamente.",
    "level": "Intermediário",
    "topics": [
      "pathlib arquivos encoding",
      "with e exceções",
      "JSON CSV validação",
      "datetime zoneinfo",
      "decimal fractions",
      "collections itertools functools",
      "re Unicode",
      "logging argparse",
      "os subprocess segurança"
    ],
    "language": "python",
    "source": "https://docs.python.org/3/",
    "capitulos": [],
    "code": "",
    "exercise": "",
    "solution": "",
    "error": "",
    "question": "",
    "options": [],
    "correct": 0
  },
  {
    "id": "py-concorrencia",
    "track": "python-completo",
    "title": "Python: concorrência, async e paralelismo",
    "body": "Distinga concorrência de paralelismo e escolha entre asyncio, threads e processos pelo tipo de trabalho. Estude corrotinas, tarefas, cancelamento, limites, filas, sincronização, tratamento de falhas e o impacto do runtime, evitando supor que escrever async torna uma operação bloqueante automaticamente assíncrona.",
    "level": "Avançado",
    "topics": [
      "concorrência versus paralelismo",
      "async await corrotinas",
      "TaskGroup cancelamento",
      "timeouts semáforos filas",
      "threads locks",
      "ProcessPoolExecutor",
      "GIL builds free-threaded",
      "backpressure",
      "falhas e recursos"
    ],
    "language": "python",
    "source": "https://docs.python.org/3/",
    "capitulos": [],
    "code": "",
    "exercise": "",
    "solution": "",
    "error": "",
    "question": "",
    "options": [],
    "correct": 0
  },
  {
    "id": "py-engenharia",
    "track": "python-completo",
    "title": "Python: tipagem, testes, pacotes e desempenho",
    "body": "Transforme scripts em projetos reproduzíveis, com ambientes isolados, módulos bem delimitados, anotação de tipos, testes úteis e medição de desempenho. Aprenda a documentar contratos e distribuir pacotes, relacionando ferramentas de engenharia às falhas que elas realmente conseguem detectar.",
    "level": "Especialização",
    "topics": [
      "módulos imports __main__",
      "venv pip pyproject.toml",
      "typing Protocol Generic",
      "testes unittest mocks",
      "propriedades casos de borda",
      "profiling timeit tracemalloc",
      "algoritmos complexidade",
      "distribuição wheels",
      "documentação e evolução"
    ],
    "language": "python",
    "source": "https://docs.python.org/3/",
    "capitulos": [],
    "code": "",
    "exercise": "",
    "solution": "",
    "error": "",
    "question": "",
    "options": [],
    "correct": 0
  }
];
const loaders:Record<string,()=>Promise<{default:DeepCourse}>>={"python-completo":()=>import('./python')};
const pending=new Map<string,Promise<DeepCourse>>();
export async function resolveExpandedLesson(id:string):Promise<Lesson|undefined>{
 const metadata=expandedLessons.find(l=>l.id===id);if(!metadata)return;
 let promise=pending.get(metadata.track);
 if(!promise){promise=loaders[metadata.track]().then(module=>module.default);pending.set(metadata.track,promise);promise.catch(()=>pending.delete(metadata.track));}
 const course=await promise,entry=course.lessons.find(l=>l.id===id);
 return entry?materialize(course,entry):undefined;
}
