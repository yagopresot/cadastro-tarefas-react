import { CardTarefa } from './CardTarefa'

export function ListaTarefas({ 
  tarefas, 
  carregando, 
  erro,
  atualizandoStatusId, 
  excluindoId, 
  aoAtualizarStatus, 
  aoExcluir 
}) {
  if (carregando) {
    return <p className="mensagem">Carregando tarefas...</p>
  }

  if (erro) {
    return <p className="mensagem erro">{erro}</p>
  }

  if (tarefas.length === 0) {
    return (
      <div className="lista-vazia">
        <span className="lista-vazia-titulo">Nenhuma tarefa ativa</span>
        <p className="lista-vazia-texto">
          Crie uma nova tarefa ou conclua as pendentes.
        </p>
      </div>
    )
  }

  return (
    <ul className="lista-tarefas">
      {tarefas.map((tarefa) => (
        <CardTarefa
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