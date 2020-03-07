import React, { useEffect } from 'react'
import MappingPage from './MappingPage'
import { useGameState } from './GamePage/gamestate'
import GamePage from './GamePage'


const App = () => {

  useEffect(() => {
    document.getElementById("loader")?.remove()
    document.getElementById("loader-style")?.remove()

    gtag('event', 'timing_complete', {
      'name' : 'app_load',
      'value' : performance.now(),
    })
  }, [])

  const inGame = useGameState()

  if (inGame) return <GamePage />

  return <MappingPage />
}

export default App
