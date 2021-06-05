import { useEffect, useRef, useState } from 'react'

interface Props {
  [key: string]: any
}

export type TupleParams<T> = [
  boolean,
  T,
  React.Dispatch<React.SetStateAction<T>>
]

// controlled mode helper hook
const useControlledModeHelper = <T>(props: Props, valueKey: string, defaultValue: T): TupleParams<T> => {
  const isControlled = Object.prototype.hasOwnProperty.call(props, valueKey)
  const propValue: T | undefined = props[valueKey]
  const [value, setValue] = useState<T>(propValue || defaultValue)
  const prevValue = useRef<T | undefined>(propValue)
  useEffect(() => {
    if (propValue !== prevValue.current) {
      prevValue.current = propValue
      if (propValue !== undefined) {
        setValue(propValue)
      }
    }
  }, [propValue])
  return [
    isControlled,
    value,
    setValue
  ]
}

export default useControlledModeHelper
