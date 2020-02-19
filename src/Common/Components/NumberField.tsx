import React, { useState, forwardRef } from "react"
import TextField, { TextFieldProps } from "@material-ui/core/TextField"

export type NumberFieldProps = TextFieldProps & {
  number: number,
  validator?: (s: string) => number | boolean,
  numberDisplay?: (v: number) => string,
  onNumberChange?: (e: React.ChangeEvent, v: number) => void
}

export default forwardRef<HTMLDivElement, NumberFieldProps>((props, ref) => {

  const {
    number,
    validator = (s: string) => /^-?([0-9]+(\.[0-9]+)?)$/.test(s) && parseFloat(s),
    numberDisplay = (v: number) => v.toString(),
    onNumberChange,
    onBlur: userBlur,
    onChange: userChange,
    ...others
  } = props

  const propNumberDisplay = numberDisplay(number)

  const [display, setDisplay] = useState(propNumberDisplay)
  const [valid, setValid] = useState(true)

  // received new number, should update to new display
  if (valid && validator(propNumberDisplay) !== validator(display))
    setDisplay(propNumberDisplay)

  const onChange: typeof userChange = e => {
    setDisplay(e.target.value)
    if (userChange) userChange(e)

    const v = validator(e.target.value)
    if (typeof v === "number" && !isNaN(v)) {
      setValid(true)
      if (v !== number && onNumberChange)   // the number is valid and changed
        onNumberChange(e, v)
    } else {
      setValid(false)
    }
  }

  const onBlur: typeof userBlur = e => {
    if (userBlur) userBlur(e)
    if (!valid) {
      setDisplay(propNumberDisplay)
      setValid(true)
    }
  }

  return (
    <TextField {...others} ref={ref}
      value={display} onChange={onChange} onBlur={onBlur}
      color={valid ? "primary" : "secondary"}>
    </TextField>
  )
})
