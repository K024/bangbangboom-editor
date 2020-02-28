import { MapActions } from "./MapActions/MapActions"
import { EditMap } from "./EditMap"
import { observable, autorun } from "mobx"
import { Meta, DefaultMeta } from "./Meta"
import { Settings, DefaultSettings } from "./Settings"
import { deepPatch } from "../Common/utils"


const StorageNames = {
  meta: "editor:meta",
  mapcontent: "editor:mapcontent",
  settings: "editor:settings"
}

class Scope {
  constructor() {
    const map = localStorage.getItem(StorageNames.mapcontent)
    let editmap: EditMap | null = null
    if (map) {
      try {
        editmap = EditMap.fromJson(map)
      } catch (error) {
        localStorage.removeItem(StorageNames.mapcontent)
        console.error(error)
      }
    }
    if (!editmap) {
      editmap = EditMap.create()
    }
    this.map = new MapActions(editmap)

    const meta = localStorage.getItem(StorageNames.meta)
    this.meta = observable(DefaultMeta)
    if (meta) deepPatch(this.meta, JSON.parse(meta))

    autorun(() => {
      const json = JSON.stringify(this.meta)
      localStorage.setItem(StorageNames.meta, json)
    })

    const settings = localStorage.getItem(StorageNames.settings)
    this.settings = observable(DefaultSettings)
    if (settings) deepPatch(this.settings, JSON.parse(settings))

    autorun(() => {
      const json = JSON.stringify(this.settings)
      localStorage.setItem(StorageNames.settings, json)
    })
  }

  map: MapActions

  save = () => {
    const json = EditMap.toJsonString((this.map as any).state)
    localStorage.setItem(StorageNames.mapcontent, json)
  }

  reset = (map?: EditMap) => {
    this.map.ResetState(map || EditMap.create())
  }

  @observable meta: Meta
  @observable settings: Settings
}


export const scope = new Scope()
