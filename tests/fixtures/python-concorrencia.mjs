import {strict as assert} from 'node:assert';

export function montarCasosConcorrencia(atividades,obterSolucao){
 const atividade=id=>{const encontrada=atividades.find(item=>item.id===id);assert(encontrada,id);return encontrada;};
 const cancelamento=atividade('py-propagar-cancelamento').code;
 const corrigido=cancelamento.replace('return "ok"',obterSolucao('py-propagar-cancelamento'));
 const envio=atividade('py-esperar-vaga-fila').code;
 const funcaoEnvio=envio.slice(0,envio.indexOf('async def principal():'));
 return [
  {id:'py-concorrencia-inicio',key:'python',source:atividade('py-prever-corrotina').code,expected:['[]','4',"['executou']"]},
  {id:'py-concorrencia-cancelamento-suprimido',key:'python',source:cancelamento,expected:['ok','True']},
  {id:'py-concorrencia-cancelamento-propagado',key:'python',source:corrigido,expected:['cancelado','True']},
  {id:'py-concorrencia-pass-suprime',key:'python',source:cancelamento.replace('return "ok"','pass'),expected:['None','True']},
  {id:'py-concorrencia-fila-capacidade',key:'python',source:envio.replace('____',obterSolucao('py-esperar-vaga-fila')),expected:['False','a b']},
  {id:'py-concorrencia-envio-sem-espera',key:'python',source:funcaoEnvio.replace('____','fila.put_nowait(item)')+`
async def principal():
    fila = asyncio.Queue(maxsize=1)
    await enviar(fila, "a")
    try:
        await enviar(fila, "b")
    except asyncio.QueueFull:
        pass
    else:
        raise AssertionError("envio sem espera não recusou a fila cheia")
    assert fila.qsize() == 1 and await fila.get() == "a"
    fila.task_done()
    await fila.join()
    print("QueueFull não espera uma vaga")

asyncio.run(principal())
`,expected:['QueueFull não espera uma vaga']},
  {id:'py-concorrencia-cancelar-produtor',key:'python',source:funcaoEnvio.replace('____',obterSolucao('py-esperar-vaga-fila'))+`
async def principal():
    fila = asyncio.Queue(maxsize=1)
    await enviar(fila, "a")
    pendente = asyncio.create_task(enviar(fila, "b"))
    await asyncio.sleep(0)
    assert not pendente.done() and fila.qsize() == 1
    pendente.cancel()
    try:
        await pendente
    except asyncio.CancelledError:
        pass
    else:
        raise AssertionError("cancelamento do produtor foi perdido")
    assert pendente.cancelled() and fila.qsize() == 1
    assert await fila.get() == "a"
    fila.task_done()
    await fila.join()
    assert fila.empty()
    await enviar(fila, 0)
    assert await fila.get() == 0
    fila.task_done()
    await fila.join()
    print("produtor cancelado conserva a fila e libera a espera")

asyncio.run(principal())
`,expected:['produtor cancelado conserva a fila e libera a espera']},
  {id:'py-concorrencia-grupo-limpeza',key:'python',source:corrigido.slice(0,corrigido.indexOf('async def principal():'))+`
async def falhar(iniciou):
    await iniciou.wait()
    raise RuntimeError("serviço indisponível")

async def principal():
    iniciou, fechou = asyncio.Event(), asyncio.Event()
    erros = []
    try:
        async with asyncio.TaskGroup() as grupo:
            atendendo = grupo.create_task(atender(iniciou, fechou))
            grupo.create_task(falhar(iniciou))
    except* RuntimeError as grupo_erros:
        erros.extend(str(erro) for erro in grupo_erros.exceptions)
    assert erros == ["serviço indisponível"]
    assert atendendo.cancelled() and fechou.is_set()
    print("falha do grupo cancela a irmã e conclui a limpeza")

asyncio.run(principal())
`,expected:['falha do grupo cancela a irmã e conclui a limpeza']}
 ].map(caso=>{assert(!caso.source.includes('____'),caso.id);return caso;});
}
