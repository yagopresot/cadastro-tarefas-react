import { IconeExcluir } from '../Tema/Icones'
import { Badge } from '../UI/Badge'
import { formatarPrazo } from '../../utils/helpers'

export function ItemConcluida({ tarefa, atualizandoStatusId, excluindoId, aoAtualizarStatus, aoExcluir }) {
  return (
    <li className="item-concluida">
      <div className="item-concluida-cabecalho">
        <label className="item-concluida-linha">
          <span className="checkbox-concluida-caixa">
            <input
              type="checkbox"
              className="checkbox-concluida-input"
              checked
              onChange={(e) => {
                if (!e.target.checked) {
                  aoAtualizarStatus(tarefa.id, '')
                }
              }}
              disabled={atualizandoStatusId === tarefa.id || excluindoId === tarefa.id}
            />
            <span className="checkbox-concluida-marca" aria-hidden="true">
              ✓
            </span>
          </span>
          <span className="item-concluida-titulo">{tarefa.titulo}</span>
        </label>
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
          <Badge prioridade={tarefa.prioridade} compacto />
        </div>
      </div>
      {tarefa.prazo && (
        <span className="tag-prazo item-concluida-prazo">
          {formatarPrazo(tarefa.prazo)}
        </span>
      )}
    </li>
  )
}