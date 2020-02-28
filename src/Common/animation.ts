import { observable } from "mobx"

export type AssignableCSSProps = Exclude<keyof CSSStyleDeclaration, "length" | "parentRule">

const Calibration = observable({
  counter: 1
})

setInterval(() => {
  Calibration.counter++
}, 500)

export function stopAnimation(el: HTMLElement, prop: AssignableCSSProps, value: number, unit: string | ((value: number) => string)) {
  el.style[prop] = unit instanceof Function ? unit(value) : value + unit
  el.style.transition = "none"
  if (getComputedStyle(el)[prop]) {
    // trigger computation
  }
}

export function startAnimation(el: HTMLElement, prop: AssignableCSSProps, from: number, to: number, unit: string | ((value: number) => string), duration: number) {
  el.style[prop] = unit instanceof Function ? unit(from) : from + unit
  el.style.transition = "none"
  if (getComputedStyle(el)[prop] && Calibration.counter) {
    // trigger computation, auto collect calibration dependency
  }
  el.style[prop] = unit instanceof Function ? unit(to) : to + unit
  el.style.transition = prop + " " + duration + "s linear"
}

