import { hot } from 'react-hot-loader/root'
import React, { useCallback, useMemo, useState } from 'react'
import Views from './views'
import { TimePicker } from './components'
import data, { DateTimeValue, defaultValue } from './components/TimePicker/data'
import Context, { ContextType } from './AppContext'

function App (): React.ReactElement {
  const [timePickerVisible, setTimePickerVisible] = useState<boolean>(false)
  const [timePickerValue, setTimePickerValue] = useState<DateTimeValue>(defaultValue)
  const contextValue = useMemo<ContextType>(() => ({
    timePickerValue,
    openTimePicker: () => setTimePickerVisible(true)
  }), [timePickerValue])

  const closeTimePicker = useCallback(() => setTimePickerVisible(false), [])
  const onTimePickerChange = useCallback((value: DateTimeValue) => setTimePickerValue(value), [])

  return (
    <div>
      <Context.Provider value={contextValue}>
        { /* View Component should not have passed in props */ }
        <Views.OrderSummary />
      </Context.Provider>
      <TimePicker visible={timePickerVisible} data={data} value={timePickerValue} onChange={onTimePickerChange} onClose={closeTimePicker} />
    </div>
  )
}

export default hot(App)
