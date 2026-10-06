export type Capability = 'reconhecimento' | 'leitura' | 'alteracao' | 'producao' | 'depuracao' | 'aplicacao';
export type CodeCheck = { label: string; expression: string; expected: unknown };
export type Step = { id: string; title: string; prompt: string; type: 'explanation' | 'choice' | 'fill' | 'code'; capability?: Capability; code?: string; options?: {text:string;feedback:string}[]; correct?: number; accepted?: string[]; success: string; failure?: string; hints?: string[]; solution?: string; checks?: CodeCheck[]; };
export type StepAnswer = { value: string; attempts: number; hints: number; passed: boolean; assisted: boolean; firstTry: boolean };
export type LessonSession = { revision: number; currentStep: string; answers: Record<string, StepAnswer>; completedAt?: string };
export type InteractiveLesson = { id: string; revision: number; steps: Step[] };
