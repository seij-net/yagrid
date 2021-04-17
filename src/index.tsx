import React from "react"
import { mult } from "./test/mult"
import { TestComponent } from "./test/TestComponent"

const test = ""
export const cp: React.FC<{text:string}> = ({text}) => (<div>{text}</div>)
export const other:React.FC<{}> = (props) =><div><TestComponent title="hello"/></div>
console.log(mult(10,20))