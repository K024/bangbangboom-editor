import React, { useEffect } from 'react'
import MappingPage from './MappingPage'


const App = () => {

  useEffect(() => {
    document.getElementById("loader")?.remove()
    document.getElementById("loader-style")?.remove()
  }, [])

  return <MappingPage />
}

export default App
