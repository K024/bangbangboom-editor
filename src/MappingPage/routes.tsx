import React, { useEffect } from "react"
import { createShared } from "../Common/hooks"

const routes = {
  "#meta": () => <></>,
  "#timimg": () => <></>,
  "#mapping": () => <></>,
  "#settings": () => <></>,
}
export type RoutePath = keyof typeof routes

const { setValue: NavigateTo, useShared } = createShared(window.location.hash as RoutePath)

export const useHashRoutes = (): [RoutePath, React.ComponentType<{}>] => {

  const path = useShared()

  const ContentComponent = routes[path]

  useEffect(() => {
    if (!ContentComponent) {
      NavigateTo("#meta")
    }
  }, [ContentComponent])

  return [path, ContentComponent || (() => null)]
}

export { NavigateTo }

