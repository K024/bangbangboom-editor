import React from "react"

export const Cross = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 500 500" {...props}>
      <g stroke={props.color || props.style?.color} strokeWidth="20" fill="none">
        <path d="M 0 250 H 500"></path>
        <path d="M 250 0 V 500"></path>
      </g>
    </svg>)
}

export const Rect = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 500 200" {...props}>
      <g stroke={props.color || props.style?.color} strokeWidth="40" fill="none">
        <path d="M 0 0 H 500 V 200 H 0 V 0"></path>
      </g>
    </svg>)
}