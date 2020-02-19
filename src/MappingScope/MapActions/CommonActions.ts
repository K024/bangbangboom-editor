import { AtomHistory } from "./AtomHistory"

export class CommonActions<T> {
  protected history: AtomHistory<T>

  private act_done: number[] = []
  private act_todo: number[] = []

  get canUndo() { return this.act_done.length > 0 }
  get canRedo() { return this.act_todo.length > 0 }

  constructor(protected state: T) {
    this.history = new AtomHistory(state)
  }

  readonly changeListeners = new Set<() => void>()

  private changed() {
    for (const listener of this.changeListeners) {
      listener()
    }
  }

  ResetState = (state: T) => {
    this.history = new AtomHistory(state)
    this.act_done = []
    this.act_todo = []
    this.changed()
  }

  protected done(step: number) {
    if (step > 0) {
      this.act_done.push(step)
      this.changed()
      return true
    }
    return false
  }

  Undo = () => {
    const step = this.act_done.pop()
    if (step === undefined) return
    this.act_todo.push(step)

    for (let i = 0; i < step; i++)
      this.history.undoAtom()

    this.changed()
  }

  Redo = () => {
    const step = this.act_todo.pop()
    if (step === undefined) return
    this.act_done.push(step)

    for (let i = 0; i < step; i++)
      this.history.redoAtom()

    this.changed()
  }

}