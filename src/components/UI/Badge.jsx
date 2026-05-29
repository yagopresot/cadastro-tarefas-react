import { prioridadeLabel } from '../../utils/helpers'

export function Badge({ prioridade, compacto = false }) {
  return (
    <span className={`badge ${compacto ? 'badge--compacto' : ''} prioridade-${prioridade}`}>
      {prioridadeLabel[prioridade] ?? prioridade}
    </span>
  )
}