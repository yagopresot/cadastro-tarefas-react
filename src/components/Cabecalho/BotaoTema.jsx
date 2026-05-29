import { IconeLua, IconeSol } from '../Tema/Icones'

export function BotaoTema({ tema, alternarTema }) {
  return (
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
  )
}