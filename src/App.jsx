import { useState } from 'react'
import './App.css'
import { useTema } from './hooks/useTema'
import { useTarefas } from './hooks/useTarefas'
import { Cabecalho } from './components/Cabecalho/Cabecalho'
import { FormularioTarefa } from './components/FormularioTarefa/FormularioTarefa'
import { ListaTarefas } from './components/ListaTarefas/ListaTarefas'
import { ListaConcluidas } from './components/ListaConcluidas/ListaConcluidas'
import { estaConcluida } from './utils/helpers'

function App() {
  const { tema, alternarTema } = useTema()
  const { 
    tarefas, 
    carregando, 
    erro,
    atualizandoStatusId,
    excluindoId,
    atualizarStatus,
    excluirTarefa,
    criarTarefa
  } = useTarefas()
  
  const [enviando, setEnviando] = useState(false)

  const tarefasConcluidas = tarefas.filter(estaConcluida)
  const tarefasAtivas = tarefas.filter((tarefa) => !estaConcluida(tarefa))

  const handleCriarTarefa = async (dados) => {
    setEnviando(true)
    const sucesso = await criarTarefa(dados)
    setEnviando(false)
    return sucesso
  }

  return (
    <div className="app">
      <Cabecalho tema={tema} alternarTema={alternarTema} />

      <main className="conteudo">
        <section className="painel formulario-painel">
          <div className="painel-cabecalho">
            <h2>
              Nova tarefa
              <span className="painel-subtitulo">Adicione à sua lista</span>
            </h2>
          </div>
          <div className="painel-corpo">
            <FormularioTarefa 
              aoSalvar={handleCriarTarefa} 
              enviando={enviando} 
              erro={erro}
            />
          </div>
        </section>

        <section className="painel lista-painel">
          <div className="painel-cabecalho lista-cabecalho">
            <h2>
              Em andamento
              <span className="painel-subtitulo">Tarefas ativas</span>
            </h2>
            <span className="contador">{tarefasAtivas.length}</span>
          </div>

          <div className="painel-corpo">
            <ListaTarefas
              tarefas={tarefasAtivas}
              carregando={carregando}
              erro={erro}
              atualizandoStatusId={atualizandoStatusId}
              excluindoId={excluindoId}
              aoAtualizarStatus={atualizarStatus}
              aoExcluir={excluirTarefa}
            />
          </div>
        </section>

        <section className="painel concluidas-painel">
          <div className="painel-cabecalho lista-cabecalho">
            <h2 className="titulo-coluna">
              Concluídas
              <span className="painel-subtitulo">Tarefas finalizadas</span>
            </h2>
            <span className="contador-concluidas">
              {tarefasConcluidas.length}
            </span>
          </div>

          <div className="painel-corpo">
            <ListaConcluidas
              tarefas={tarefasConcluidas}
              carregando={carregando}
              atualizandoStatusId={atualizandoStatusId}
              excluindoId={excluindoId}
              aoAtualizarStatus={atualizarStatus}
              aoExcluir={excluirTarefa}
            />
          </div>
        </section>
      </main>
    </div>
  )
}

export default App