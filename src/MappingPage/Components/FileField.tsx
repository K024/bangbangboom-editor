import React, { forwardRef, useState, useCallback, useMemo } from "react"
import TextField, { TextFieldProps } from "@material-ui/core/TextField"

export type FileInputProps = { accept?: string, onFileSelected?: (f: File[]) => any } & TextFieldProps

export default forwardRef<HTMLDivElement, FileInputProps>((props, ref) => {

  const {
    onFileSelected,
    inputProps,
    accept,
    ...others
  } = props

  const [display, setDisplay] = useState("")

  const handleChange = useCallback((input: HTMLInputElement, onSelected?: (f: File[]) => any) => {
    if (input.files && input.files.length) {
      const fs = Array.from(input.files)
      setDisplay(fs.map(f => f.name).join(", "))
      if (onSelected) onSelected(fs)
    }
  }, [setDisplay])

  const input = useMemo(() => {
    const i = document.createElement("input")
    i.type = "file"
    return i
  }, [])

  const handleClick = () => {
    input.accept = accept || "*"
    input.onchange = () => handleChange(input, onFileSelected)
    input.click()
  }
  return (
    <TextField {...others} ref={ref}
      inputProps={{
        ...inputProps,
        onClick: handleClick,
      }}
      value={display} />)
})