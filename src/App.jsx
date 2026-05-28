import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'http://localhost:3000/tarefas'

const prioridadeLabel = {
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa',
}

const statusOpcoes = [
  { valor: 'nao_iniciada', label: 'Não iniciada' },
  { valor: 'pendente', label: 'Pendente' },
  { valor: 'em_execucao', label: 'Em execução' },
  { valor: 'concluida', label: 'Concluída' },
]

function IconeExcluir() {
  return (
    <svg
      className="icone-excluir"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

function IconeSol() {
  return (
    <svg
      className="icone-tema"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function IconeLua() {
  return (
    <svg
      className="icone-tema"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function obterStatus(tarefa) {
  if (tarefa.status) return tarefa.status
  if (tarefa.concluida) return 'concluida'
  return null
}

function estaConcluida(tarefa) {
  return obterStatus(tarefa) === 'concluida'
}

function formatarPrazo(dataIso) {
  if (!dataIso) return ''
  const [ano, mes, dia] = dataIso.split('-')
  if (!ano || !mes || !dia) return dataIso
  return `${dia}/${mes}/${ano}`
}

function App() {
  const [tema, setTema] = useState(() => {
    const temaSalvo = localStorage.getItem('tema') || 'claro'
    document.documentElement.setAttribute('data-theme', temaSalvo)
    return temaSalvo
  })
  const [tarefas, setTarefas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [atualizandoStatusId, setAtualizandoStatusId] = useState(null)
  const [excluindoId, setExcluindoId] = useState(null)
  const [editandoStatusId, setEditandoStatusId] = useState(null)
  const [formulario, setFormulario] = useState({
    titulo: '',
    descricao: '',
    prioridade: 'media',
    prazo: '',
    status: '',
  })

  async function carregarTarefas() {
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
  }

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

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema)
    localStorage.setItem('tema', tema)
  }, [tema])

  function alternarTema() {
    setTema((temaAtual) => (temaAtual === 'claro' ? 'escuro' : 'claro'))
  }

  function handleChange(evento) {
    const { name, value } = evento.target
    setFormulario((estadoAnterior) => ({
      ...estadoAnterior,
      [name]: value,
    }))
  }

  async function handleSubmit(evento) {
    evento.preventDefault()
    setEnviando(true)
    setErro('')

    try {
      const resposta = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titulo: formulario.titulo,
          descricao: formulario.descricao,
          prioridade: formulario.prioridade,
          ...(formulario.prazo && { prazo: formulario.prazo }),
          ...(formulario.status && {
            status: formulario.status,
            concluida: formulario.status === 'concluida',
          }),
        }),
      })

      if (!resposta.ok) {
        throw new Error('Não foi possível cadastrar a tarefa.')
      }

      setFormulario({
        titulo: '',
        descricao: '',
        prioridade: 'media',
        prazo: '',
        status: '',
      })

      await carregarTarefas()
    } catch {
      setErro('Erro ao cadastrar a tarefa. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  async function handleStatusChange(id, novoStatus) {
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
  }

  async function handleExcluir(id) {
    const confirmar = window.confirm('Deseja excluir esta tarefa?')
    if (!confirmar) return

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
      if (editandoStatusId === id) {
        setEditandoStatusId(null)
      }
    } catch {
      setErro('Erro ao excluir a tarefa. Tente novamente.')
    } finally {
      setExcluindoId(null)
    }
  }

  const tarefasConcluidas = tarefas.filter(estaConcluida)
  const tarefasAtivas = tarefas.filter((tarefa) => !estaConcluida(tarefa))

  return (
    <div className="app">
      <header className="cabecalho">
        <button
          type="button"
          className={`botao-tema ${tema === 'escuro' ? 'botao-tema--ativo' : ''}`}
          onClick={alternarTema}
          aria-label={
            tema === 'claro' ? 'Ativar tema escuro' : 'Ativar tema claro'
          }
          title={tema === 'claro' ? 'Modo escuro' : 'Modo claro'}
        >
          {tema === 'claro' ? <IconeLua /> : <IconeSol />}
        </button>
        <div className="cabecalho-marca">
          <span className="cabecalho-icone" aria-hidden="true" />
          <h1>Minhas Tarefas</h1>
        </div>
        <p>Organize, acompanhe e conclua suas atividades</p>
      </header>

      <main className="conteudo">
        <section className="painel formulario-painel">
          <div className="painel-cabecalho">
            <h2>
              Nova tarefa
              <span className="painel-subtitulo">Adicione à sua lista</span>
            </h2>
          </div>
          <div className="painel-corpo">
          <form className="formulario" onSubmit={handleSubmit}>
            <div className="campo">
              <label htmlFor="titulo">
                Título <span className="asterisco">*</span>
              </label>
              <input
                id="titulo"
                name="titulo"
                type="text"
                placeholder="Ex: Entregar trabalho"
                value={formulario.titulo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="campo">
              <label htmlFor="descricao">
                Descrição <span className="asterisco">*</span>
              </label>
              <textarea
                id="descricao"
                name="descricao"
                placeholder="Descreva a tarefa..."
                value={formulario.descricao}
                onChange={handleChange}
                rows={3}
                required
              />
            </div>

            <div className="campo">
              <label htmlFor="prioridade">
                Prioridade <span className="asterisco">*</span>
              </label>
              <select
                id="prioridade"
                name="prioridade"
                value={formulario.prioridade}
                onChange={handleChange}
                required
              >
                <option value="alta">Alta</option>
                <option value="media">Média</option>
                <option value="baixa">Baixa</option>
              </select>
            </div>

            <div className="campo">
              <label htmlFor="prazo">Prazo</label>
              <input
                id="prazo"
                name="prazo"
                type="date"
                value={formulario.prazo}
                onChange={handleChange}
              />
            </div>

            <div className="campo">
              <label htmlFor="status-form">Status</label>
              <select
                id="status-form"
                name="status"
                className={formulario.status ? `select-status status-${formulario.status}` : ''}
                value={formulario.status}
                onChange={handleChange}
              >
                <option value="">Sem status</option>
                {statusOpcoes.map((opcao) => (
                  <option key={opcao.valor} value={opcao.valor}>
                    {opcao.label}
                  </option>
                ))}
              </select>
            </div>

            <p className="formulario-legenda">
              <span className="asterisco">*</span> Campos obrigatórios para a
              criação da tarefa.
            </p>

            <button type="submit" className="botao" disabled={enviando}>
              {enviando ? 'Cadastrando...' : '+ Adicionar tarefa'}
            </button>
          </form>
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
          {erro && <p className="mensagem erro">{erro}</p>}

          {carregando ? (
            <p className="mensagem">Carregando tarefas...</p>
          ) : tarefasAtivas.length === 0 ? (
            <div className="lista-vazia">
              <span className="lista-vazia-titulo">Nenhuma tarefa ativa</span>
              <p className="lista-vazia-texto">
                Crie uma nova tarefa ou conclua as pendentes.
              </p>
            </div>
          ) : (
            <ul className="lista-tarefas">
              {tarefasAtivas.map((tarefa) => {
                const temStatus = Boolean(tarefa.status)
                const exibirStatus =
                  temStatus || editandoStatusId === tarefa.id

                return (
                  <li
                    key={tarefa.id}
                    className={`card-tarefa card-tarefa--prioridade-${tarefa.prioridade}`}
                  >
                    <div className="card-topo">
                      <h3>{tarefa.titulo}</h3>
                      <div className="card-topo-acoes">
                        <button
                          type="button"
                          className="botao-excluir"
                          onClick={() => handleExcluir(tarefa.id)}
                          disabled={
                            excluindoId === tarefa.id ||
                            atualizandoStatusId === tarefa.id
                          }
                          aria-label={`Excluir tarefa ${tarefa.titulo}`}
                          title="Excluir tarefa"
                        >
                          <IconeExcluir />
                        </button>
                        <span
                          className={`badge prioridade-${tarefa.prioridade}`}
                        >
                          {prioridadeLabel[tarefa.prioridade] ??
                            tarefa.prioridade}
                        </span>
                      </div>
                    </div>
                    <div className="card-corpo">
                      <p className="descricao">{tarefa.descricao}</p>
                      {tarefa.prazo && (
                        <div className="card-meta">
                          <span className="tag-prazo">
                            {formatarPrazo(tarefa.prazo)}
                          </span>
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
                              handleStatusChange(tarefa.id, e.target.value)
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
              })}
            </ul>
          )}
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
          {carregando ? (
            <p className="mensagem">Carregando...</p>
          ) : tarefasConcluidas.length === 0 ? (
            <div className="lista-vazia">
              <span className="lista-vazia-titulo">Nenhuma concluída</span>
              <p className="lista-vazia-texto">
                Marque tarefas como concluídas para vê-las aqui.
              </p>
            </div>
          ) : (
            <ul className="lista-concluidas">
              {tarefasConcluidas.map((tarefa) => (
                <li key={tarefa.id} className="item-concluida">
                  <div className="item-concluida-cabecalho">
                    <label className="item-concluida-linha">
                      <span className="checkbox-concluida-caixa">
                        <input
                          type="checkbox"
                          className="checkbox-concluida-input"
                          checked
                          onChange={(e) => {
                            if (!e.target.checked) {
                              handleStatusChange(tarefa.id, '')
                            }
                          }}
                          disabled={
                            atualizandoStatusId === tarefa.id ||
                            excluindoId === tarefa.id
                          }
                        />
                        <span
                          className="checkbox-concluida-marca"
                          aria-hidden="true"
                        >
                          ✓
                        </span>
                      </span>
                      <span className="item-concluida-titulo">
                        {tarefa.titulo}
                      </span>
                    </label>
                    <div className="card-topo-acoes">
                      <button
                        type="button"
                        className="botao-excluir"
                        onClick={() => handleExcluir(tarefa.id)}
                        disabled={
                          excluindoId === tarefa.id ||
                          atualizandoStatusId === tarefa.id
                        }
                        aria-label={`Excluir tarefa ${tarefa.titulo}`}
                        title="Excluir tarefa"
                      >
                        <IconeExcluir />
                      </button>
                      <span
                        className={`badge badge--compacto prioridade-${tarefa.prioridade}`}
                      >
                        {prioridadeLabel[tarefa.prioridade] ??
                          tarefa.prioridade}
                      </span>
                    </div>
                  </div>
                  {tarefa.prazo && (
                    <span className="tag-prazo item-concluida-prazo">
                      {formatarPrazo(tarefa.prazo)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
