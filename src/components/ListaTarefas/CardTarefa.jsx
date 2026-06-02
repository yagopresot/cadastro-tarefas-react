import { useState } from 'react'
import { IconeExcluir } from '../Tema/Icones'
import { Badge } from '../UI/Badge'
import { statusOpcoes, formatarPrazo } from '../../utils/helpers'

export function CardTarefa({ 
  tarefa, 
  atualizandoStatusId, 
  excluindoId, 
  aoAtualizarStatus, 
  aoExcluir 
}) {
  const [editandoStatusId, setEditandoStatusId] = useState(null)
  const temStatus = Boolean(tarefa.status)
  const exibirStatus = temStatus || editandoStatusId === tarefa.id

  return (
    <li className={`card-tarefa card-tarefa--prioridade-${tarefa.prioridade}`}>
      <div className="card-topo">
        <h3>{tarefa.titulo}</h3>
        <div className="card-topo-acoes">
          <button
            type="button"
            className="botao-excluir"
            onClick={() => aoExcluir(tarefa.id)}
            disabled={excluindoId === tarefa.id || atualizandoStatusId === tarefa.id}
            aria-label={`Excluir tarefa ${tarefa.titulo}`}
            title="Excluir tarefa"
          >
            <IconeExcluir />
          </button>
          <Badge prioridade={tarefa.prioridade} />
        </div>
      </div>
      <div className="card-corpo">
        <p className="descricao">{tarefa.descricao}</p>
        {tarefa.prazo && (
          <div className="card-meta">
            <span className="tag-prazo">{formatarPrazo(tarefa.prazo)}</span>
          </div>
        )}
      </div>
      <div className="card-rodape">
        {exibirStatus ? (
          <div className="campo-status">
            <label htmlFor={`status-${tarefa.id}`}>Status</label>
            <select
              id={`status-${tarefa.id}`}
              className={`select-status ${tarefa.status ? `status-${tarefa.status}` : ''}`}
              value={tarefa.status || ''}
              onChange={(e) => {
                aoAtualizarStatus(tarefa.id, e.target.value)
                if (!e.target.value) {
                  setEditandoStatusId(null)
                }
              }}
              disabled={atualizandoStatusId === tarefa.id}
            >
              <option value="">Sem status</option>
              {statusOpcoes.map((opcao) => (
                <option key={opcao.valor} value={opcao.valor}>
                  {opcao.label}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <button
            type="button"
            className="botao-definir-status"
            onClick={() => setEditandoStatusId(tarefa.id)}
          >
            + Definir status
          </button>
        )}
      </div>
    </li>
  )
}
