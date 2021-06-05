import React from 'react'
import { Value } from './components/TimePicker'

export interface ContextType {
  timePickerValue: Value
  openTimePicker (): void
}

const Context = React.createContext<ContextType>({
  timePickerValue: [undefined, undefined],
  openTimePicker () {}
})

export default Context
