import { BotaoTema } from './BotaoTema'

export function Cabecalho({ tema, alternarTema }) {
  return (
    <header className="cabecalho">
      <BotaoTema tema={tema} alternarTema={alternarTema} />
      <div className="cabecalho-marca">
        <span className="cabecalho-icone" aria-hidden="true" />
        <h1>Minhas Tarefas</h1>
      </div>
      <p>Organize, acompanhe e conclua suas atividades</p>
    </header>
  )
}