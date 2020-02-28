import { useEffect, useState } from "react"

let statelistener = () => { }

export function useGameState() {

  const [hash, setHash] = useState("")

  useEffect(() => {
    const listener = () => {
      setHash(window.location.hash)
    }
    statelistener = listener
    window.addEventListener("popstate", listener)
    return () => window.addEventListener("popstate", listener)
  }, [])

  return hash === "#game"
}

export function startGame() {
  window.history.pushState({}, "", "#game")
  statelistener()
}
