import { ImmutableArgs, AtomAction } from "./AtomActions/types"
import { neverHappen } from "../../Common/utils"

type WithArgsAction<TState> =
  (state: TState) => undefined | ((state: TState) => void)

export class AtomHistory<TState> {
  constructor(private state: TState) { }

  private act_done: WithArgsAction<TState>[] = []
  private act_todo: WithArgsAction<TState>[] = []
  private act_undo: ((state: TState) => void)[] = []

  get canRedo() { return this.act_todo.length > 0 }
  get canUndo() { return this.act_undo.length > 0 }

  callAtom<TArgs extends ImmutableArgs>(fn: AtomAction<TState, TArgs>, ...args: TArgs) {
    const act = (state: TState) => fn(state, ...args)
    const res = act(this.state)
    if (res) {
      this.act_done.push(act)
      this.act_undo.push(res)
      return true
    }
    return false
  }

  undoAtom() {
    const un = this.act_undo.pop()
    const act = this.act_done.pop()
    if (!un || !act) {
      if (!un && !act) return false
      neverHappen("Undo list and done list length not equal")
    }
    un(this.state)
    this.act_todo.push(act)
    return true
  }

  redoAtom() {
    const act = this.act_todo.pop()
    if (!act) return false
    const res = act(this.state)
    if (res) {
      this.act_done.push(act)
      this.act_undo.push(res)
      return true
    }
    neverHappen("Can not redo an action.")
  }

  doTransaction(fn: () => boolean) {
    const startLen = this.act_done.length
    const res = fn()
    if (res) {
      return this.act_done.length - startLen
    }
    while (this.act_done.length > startLen) this.undoAtom()
    return 0
  }

  doParallel(fn: () => any) {
    const startLen = this.act_done.length
    fn()
    const done = this.act_done.length - startLen
    return done
  }
}
