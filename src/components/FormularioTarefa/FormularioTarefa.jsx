import { useState } from 'react'
import { statusOpcoes } from '../../utils/helpers'

export function FormularioTarefa({ aoSalvar, enviando, erro }) {
  const [formulario, setFormulario] = useState({
    titulo: '',
    descricao: '',
    prioridade: 'media',
    prazo: '',
    status: '',
  })

  function handleChange(evento) {
    const { name, value } = evento.target
    setFormulario((estadoAnterior) => ({
      ...estadoAnterior,
      [name]: value,
    }))
  }

  async function handleSubmit(evento) {
    evento.preventDefault()
    
    const sucesso = await aoSalvar({
      titulo: formulario.titulo,
      descricao: formulario.descricao,
      prioridade: formulario.prioridade,
      ...(formulario.prazo && { prazo: formulario.prazo }),
      ...(formulario.status && {
        status: formulario.status,
        concluida: formulario.status === 'concluida',
      }),
    })

    if (sucesso) {
      setFormulario({
        titulo: '',
        descricao: '',
        prioridade: 'media',
        prazo: '',
        status: '',
      })
    }
  }

  return (
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
  )
}