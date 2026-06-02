import { ItemConcluida } from './ItemConcluida'

export function ListaConcluidas({ 
  tarefas, 
  carregando, 
  atualizandoStatusId, 
  excluindoId, 
  aoAtualizarStatus, 
  aoExcluir 
}) {
  if (carregando) {
    return <p className="mensagem">Carregando...</p>
  }

  if (tarefas.length === 0) {
    return (
      <div className="lista-vazia">
        <span className="lista-vazia-titulo">Nenhuma concluída</span>
        <p className="lista-vazia-texto">
          Marque tarefas como concluídas para vê-las aqui.
        </p>
      </div>
    )
  }

  return (
    <ul className="lista-concluidas">
      {tarefas.map((tarefa) => (
        <ItemConcluida
          key={tarefa.id}
          tarefa={tarefa}
          atualizandoStatusId={atualizandoStatusId}
          excluindoId={excluindoId}
          aoAtualizarStatus={aoAtualizarStatus}
          aoExcluir={aoExcluir}
        />
      ))}
    </ul>
  )
}