import {it,expect} from 'vitest';
import {emptyPracticeAnswer,normalizePracticeAnswers,preparePracticeAnswers} from '../../src/learning/activity-state';
it('restaura respostas ordenadas sem perder tentativas e assistência',()=>{const a={...emptyPracticeAnswer(),value:['b','a'],attempts:2,assisted:true};expect(preparePracticeAnswers({ordem:a}).ordem).toEqual(a);});
it('preserva backups antigos e rejeita truncamento de respostas',()=>{expect(preparePracticeAnswers(undefined)).toEqual({});expect(()=>preparePracticeAnswers({a:{...emptyPracticeAnswer(),value:'x'.repeat(30001)}})).toThrow('preservada');expect(()=>preparePracticeAnswers({a:{...emptyPracticeAnswer(),attempts:1.2}})).toThrow();expect(()=>preparePracticeAnswers(JSON.parse('{"__proto__":{}}'))).toThrow();});
it('normaliza corrupção sem fabricar evidências',()=>{expect(normalizePracticeAnswers({a:{passed:'true',value:[],attempts:-2},constructor:{}})).toEqual({a:{...emptyPracticeAnswer(),value:[]}});});
