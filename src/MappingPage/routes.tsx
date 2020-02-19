import React, { useEffect } from "react"
import { observable, reaction } from "mobx"
import { useObserver } from "mobx-react-lite"
import MetaPage from "./Pages/MetaPage"
import TimingPage from "./Pages/TimingPage"
import SettingsPage from "./Pages/SettingsPage"

const routes = {
  "#meta": MetaPage,
  "#timing": TimingPage,
  "#mapping": () => <>Mapping page</>,
  "#settings": SettingsPage,
}
export type RoutePath = keyof typeof routes

const router = observable({
  path: window.location.hash as RoutePath || "#meta"
})

reaction(() => router.path, p => window.location.hash = p)

export const useHashRoutes = (): [RoutePath, React.ComponentType<{}>] => {

  const path = useObserver(() => router.path)

  const ContentComponent = routes[path]

  useEffect(() => {
    if (!ContentComponent) {
      router.path = "#meta"
    }
  }, [ContentComponent])

  return [path, ContentComponent || (() => null)]
}

export const NavigateTo = (path: RoutePath) => router.path = path

