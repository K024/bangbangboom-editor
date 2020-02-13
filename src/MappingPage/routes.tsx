import React, { useEffect } from "react"
import { createSharedState } from "../Common/hooks"

const routes = {
  "#meta": () => <></>,
  "#timimg": () => <></>,
  "#mapping": () => <></>,
  "#settings": () => <></>,
}
export type RoutePath = keyof typeof routes

const useRoutes = createSharedState(window.location.hash as RoutePath)

export const useHashRoutes = (): [string, React.ComponentType<{}>, React.Dispatch<React.SetStateAction<keyof typeof routes>>] => {

  const [path, navigateTo] = useRoutes()

  const ContentComponent = routes[path]

  useEffect(() => {
    if (!ContentComponent) {
      navigateTo("#meta")
    }
  }, [ContentComponent, navigateTo])

  return [path, ContentComponent || (() => null), navigateTo]
}

