import { EditMap } from "./EditMap"
import { AtomHistory } from "./MapActions/AtomHistory"



export class EditMapState {
  constructor(map: EditMap) {
    this._initMap = map
    this._map = JSON.parse(JSON.stringify(this._initMap))
    this.history = new AtomHistory(map)
  }

  private _initMap: DeepReadonly<EditMap>

  private _map: EditMap

  get map() {
    return this._map as DeepReadonly<EditMap>
  }

  private history: AtomHistory<EditMap>
}

