
export type ImmutableArgs = (number | string | boolean | null | undefined)[]

export type AtomAction<TState, TArgs extends ImmutableArgs> =
  (state: TState, ...args: TArgs) => undefined | ((state: TState) => void)

export const makeAction = <TState, TArgs extends ImmutableArgs>(fn: AtomAction<TState, TArgs>) => fn