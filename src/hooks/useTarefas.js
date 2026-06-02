import { useState, useEffect, useCallback } from 'react'
import { API_URL } from '../utils/helpers'

export function useTarefas() {
  const [tarefas, setTarefas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [atualizandoStatusId, setAtualizandoStatusId] = useState(null)
  const [excluindoId, setExcluindoId] = useState(null)

  const carregarTarefas = useCallback(async () => {
    setCarregando(true)
    setErro('')

    try {
      const resposta = await fetch(API_URL)
      if (!resposta.ok) {
        throw new Error('Não foi possível carregar as tarefas.')
      }
      const dados = await resposta.json()
      setTarefas(dados)
    } catch {
      setErro(
        'Erro ao conectar com a API. Verifique se o JSON Server está rodando (npm run api).'
      )
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    let cancelado = false

    async function buscarTarefasIniciais() {
      setCarregando(true)
      setErro('')

      try {
        const resposta = await fetch(API_URL)
        if (!resposta.ok) {
          throw new Error('Não foi possível carregar as tarefas.')
        }
        const dados = await resposta.json()
        if (!cancelado) {
          setTarefas(dados)
        }
      } catch {
        if (!cancelado) {
          setErro(
            'Erro ao conectar com a API. Verifique se o JSON Server está rodando (npm run api).'
          )
        }
      } finally {
        if (!cancelado) {
          setCarregando(false)
        }
      }
    }

    buscarTarefasIniciais()

    return () => {
      cancelado = true
    }
  }, [])

  const atualizarStatus = useCallback(async (id, novoStatus) => {
    const tarefaAtual = tarefas.find((t) => t.id === id)
    const statusAtual = tarefaAtual?.status ?? null
    const statusNormalizado = novoStatus || null

    if (!tarefaAtual || statusAtual === statusNormalizado) return

    setAtualizandoStatusId(id)
    setErro('')

    try {
      const resposta = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: statusNormalizado,
          concluida: statusNormalizado === 'concluida',
        }),
      })

      if (!resposta.ok) {
        throw new Error('Não foi possível atualizar o status.')
      }

      const tarefaAtualizada = await resposta.json()
      setTarefas((lista) =>
        lista.map((t) => (t.id === id ? tarefaAtualizada : t))
      )
    } catch {
      setErro('Erro ao atualizar o status da tarefa.')
    } finally {
      setAtualizandoStatusId(null)
    }
  }, [tarefas])

  const excluirTarefa = useCallback(async (id) => {
    const confirmar = window.confirm('Deseja excluir esta tarefa?')
    if (!confirmar) return false

    setExcluindoId(id)
    setErro('')

    try {
      const resposta = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      })

      if (!resposta.ok) {
        throw new Error('Não foi possível excluir a tarefa.')
      }

      setTarefas((lista) => lista.filter((t) => t.id !== id))
      return true
    } catch {
      setErro('Erro ao excluir a tarefa. Tente novamente.')
      return false
    } finally {
      setExcluindoId(null)
    }
  }, [])

  const criarTarefa = useCallback(async (dadosTarefa) => {
    setErro('')

    try {
      const resposta = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosTarefa),
      })

      if (!resposta.ok) {
        throw new Error('Não foi possível cadastrar a tarefa.')
      }

      await carregarTarefas()
      return true
    } catch {
      setErro('Erro ao cadastrar a tarefa. Tente novamente.')
      return false
    }
  }, [carregarTarefas])

  return {
    tarefas,
    carregando,
    erro,
    atualizandoStatusId,
    excluindoId,
    carregarTarefas,
    atualizarStatus,
    excluirTarefa,
    criarTarefa,
  }
}