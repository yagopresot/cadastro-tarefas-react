export const prioridadeLabel = {
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa',
}

export const statusOpcoes = [
  { valor: 'nao_iniciada', label: 'Não iniciada' },
  { valor: 'pendente', label: 'Pendente' },
  { valor: 'em_execucao', label: 'Em execução' },
  { valor: 'concluida', label: 'Concluída' },
]

export function obterStatus(tarefa) {
  if (tarefa.status) return tarefa.status
  if (tarefa.concluida) return 'concluida'
  return null
}

export function estaConcluida(tarefa) {
  return obterStatus(tarefa) === 'concluida'
}

export function formatarPrazo(dataIso) {
  if (!dataIso) return ''
  const [ano, mes, dia] = dataIso.split('-')
  if (!ano || !mes || !dia) return dataIso
  return `${dia}/${mes}/${ano}`
}

export const API_URL = 'http://localhost:3000/tarefas'