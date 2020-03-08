import { AtomHistory } from "./AtomHistory"
import { action, observable, computed } from "mobx"

export class CommonActions<T> {
  protected history: AtomHistory<T>
  @observable protected state: T

  @observable private act_done: number[] = []
  @observable private act_todo: number[] = []

  @computed get canUndo() { return this.act_done.length > 0 }
  @computed get canRedo() { return this.act_todo.length > 0 }
  
  constructor(state: T) {
    this.history = new AtomHistory(state)
    this.state = state
  }

  readonly changeListeners = new Set<() => void>()

  private changed() {
    for (const listener of this.changeListeners) {
      listener()
    }
  }

  @action
  ResetState = (state: T) => {
    this.state = state
    this.history = new AtomHistory(state)
    this.act_done = []
    this.act_todo = []
    this.changed()
  }

  protected done(step: number) {
    if (step > 0) {
      this.act_todo.length = 0
      this.act_done.push(step)
      this.changed()
      return true
    }
    return false
  }

  @action
  Undo = () => {
    const step = this.act_done.pop()
    if (step === undefined) return
    this.act_todo.push(step)

    for (let i = 0; i < step; i++)
      this.history.undoAtom()

    this.changed()
  }

  @action.bound
  Redo = () => {
    const step = this.act_todo.pop()
    if (step === undefined) return
    this.act_done.push(step)

    for (let i = 0; i < step; i++)
      this.history.redoAtom()

    this.changed()
  }

}