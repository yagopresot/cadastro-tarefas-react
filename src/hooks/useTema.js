import { useState, useEffect } from 'react'

export function useTema() {
  const [tema, setTema] = useState(() => {
    const temaSalvo = localStorage.getItem('tema') || 'claro'
    return temaSalvo
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema)
    localStorage.setItem('tema', tema)
  }, [tema])

  function alternarTema() {
    setTema((temaAtual) => (temaAtual === 'claro' ? 'escuro' : 'claro'))
  }

  return { tema, alternarTema }
}