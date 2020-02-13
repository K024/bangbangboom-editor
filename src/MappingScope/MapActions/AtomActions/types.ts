
export type Immutable = (number | string | boolean | null | undefined | bigint | symbol)

type Extra = {
  [key: string]: Immutable
}

export type ImmutableArgs = (Immutable | Extra)[]

export type AtomAction<TState, TArgs extends ImmutableArgs> =
  (state: TState, ...args: TArgs) => undefined | ((state: TState) => void)

export const makeAction = <TState, TArgs extends ImmutableArgs>(fn: AtomAction<TState, TArgs>) => fn