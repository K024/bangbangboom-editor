import { MapActions } from "./MapActions/MapActions"
import { EditMap } from "./EditMap"


const StorageNames = {
  name: "editor:name",
  mapcontent: "editor:mapcontent"
}

class Scope {
  constructor() {
    this._displayname = localStorage.getItem(StorageNames.name) || ""
    const map = localStorage.getItem(StorageNames.mapcontent)
    let editmap: EditMap | null = null
    if (map) {
      try {
        editmap = EditMap.fromJson(map)
      } catch (error) {
        localStorage.removeItem(StorageNames.mapcontent)
      }
    }
    if (!editmap) {
      editmap = EditMap.create()
    }
    this.actions = new MapActions(editmap)
  }

  private _displayname: string
  get displayname() { return this._displayname }
  set displayname(v) {
    this._displayname = v
    localStorage.setItem(StorageNames.name, v)
  }

  actions: MapActions

  get map() { return this.actions.map }

  save() {
    const json = EditMap.toJsonString(this.actions.map)
    localStorage.setItem(StorageNames.mapcontent, json)
  }

  reset() {
    localStorage.removeItem(StorageNames.name)
    localStorage.removeItem(StorageNames.mapcontent)
    this._displayname = ""
    this.actions = new MapActions(EditMap.create())
  }
}


export const scope = new Scope()
