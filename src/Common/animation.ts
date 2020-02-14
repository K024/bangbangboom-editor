
export type AssignableCSSProps = Exclude<keyof CSSStyleDeclaration, "length" | "parentRule">

export function stopAnimation(el: HTMLElement, prop: AssignableCSSProps, value: number, unit: string) {
  el.style[prop] = value + unit
  el.style.transition = "none"
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  getComputedStyle(el)[prop]  // trigger computation
}

export function startAnimation(el: HTMLElement, prop: AssignableCSSProps, from: number, to: number, unit: string, duration: number) {
  el.style[prop] = from + unit
  el.style.transition = "none"
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  getComputedStyle(el)[prop]  // trigger computation
  el.style[prop] = to + unit
  el.style.transition = prop + " " + duration + "s linear"
}

