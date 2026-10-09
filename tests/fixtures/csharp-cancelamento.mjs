import {strict as assert} from 'node:assert';

export function montarCasosCancelamento(atividades, obterSolucao) {
 const cabecalho = 'using System;\nusing System.Threading;\nusing System.Threading.Tasks;\n';
 const atividade = id => atividades.find(atividade => atividade.id === id);
 const vinculado = atividade('cs-token-vinculado').code.replace('____', obterSolucao('cs-token-vinculado'));
 const vagas = obterSolucao('cs-vaga-sem-posse') + `
using var vagas = new SemaphoreSlim(1, 1);
await vagas.WaitAsync();
using (var fonte = new CancellationTokenSource()) {
    fonte.Cancel();
    try {
        await UsarVagaAsync(vagas, _ => throw new Exception("não deve entrar"), fonte.Token);
        throw new Exception("cancelamento ignorado");
    } catch (OperationCanceledException) when (fonte.IsCancellationRequested) { }
    if (vagas.CurrentCount != 0) throw new Exception("liberou sem adquirir");
}
vagas.Release();
int chamadas = 0;
await UsarVagaAsync(vagas, _ => {
    if (vagas.CurrentCount != 0) throw new Exception("não adquiriu");
    chamadas++;
    return Task.CompletedTask;
}, CancellationToken.None);
if (chamadas != 1 || vagas.CurrentCount != 1) throw new Exception("sucesso perdeu vaga");
try {
    await UsarVagaAsync(vagas, _ => throw new InvalidOperationException("estudo"), CancellationToken.None);
    throw new Exception("falha suprimida");
} catch (InvalidOperationException erro) when (erro.Message == "estudo") { }
if (vagas.CurrentCount != 1) throw new Exception("erro perdeu vaga");
using (var fonte = new CancellationTokenSource()) {
    var tarefa = UsarVagaAsync(vagas, token => Task.Delay(Timeout.Infinite, token), fonte.Token);
    if (vagas.CurrentCount != 0) throw new Exception("trabalho não começou");
    fonte.Cancel();
    try { await tarefa; throw new Exception("cancelamento suprimido"); }
    catch (OperationCanceledException) when (fonte.IsCancellationRequested) { }
    if (vagas.CurrentCount != 1) throw new Exception("cancelamento perdeu vaga");
}
Console.WriteLine("vagas conferidas");
`;
 assert(!vinculado.includes('____'));
 return [
  {id:'cs-prever-cancelamento',key:'csharp',source:cabecalho+atividade('cs-prever-cancelamento').code,expected:['cancelado','1']},
  {id:'cs-vaga-sem-posse-quebrado',key:'csharp',source:cabecalho+atividade('cs-vaga-sem-posse').code,expected:['1']},
  {id:'cs-vaga-sem-posse-corrigido',key:'csharp',source:cabecalho+vagas,expected:['vagas conferidas']},
  {id:'cs-token-vinculado-aplicacao',key:'csharp',source:cabecalho+vinculado,expected:['cancelado','False']},
  {id:'cs-token-vinculado-usuario',key:'csharp',source:cabecalho+vinculado.replace('aplicacao.Cancel();','usuario.Cancel();').replace('Console.WriteLine(usuario.IsCancellationRequested);','Console.WriteLine(aplicacao.IsCancellationRequested);'),expected:['cancelado','False']}
 ];
}
