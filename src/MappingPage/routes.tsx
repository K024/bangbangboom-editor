import React, { useState, useEffect } from "react"

const routes = {
  "#meta": () => <></>,
  "#timimg": () => <></>,
  "#mapping": () => <></>,
  "#settings": () => <></>,
}
export type RoutePath = keyof typeof routes

export const useHashRoutes = () => {

  const [path, navigateTo] = useState(() => window.location.hash as RoutePath)

  const ContentComponent = routes[path]

  useEffect(() => {
    if (!ContentComponent) {
      navigateTo("#meta")
    }
  }, [ContentComponent])

  return [path, ContentComponent, navigateTo]
}
