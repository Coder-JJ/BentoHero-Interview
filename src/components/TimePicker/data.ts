export type TimeValue = number
export type DateValue = number
export type DateTimeValue = [DateValue, TimeValue]

export interface TimePickerTime {
  id: TimeValue
  value: string
  disabled?: boolean
}

export interface TimePickerDate {
  id: DateValue
  value: string
  times?: TimePickerTime[]
}

export interface TimePickerData {
  defaultTimes: TimePickerTime[]
  dates: TimePickerDate[]
}

const defaultTimes: TimePickerTime[] = [
  { id: 0, value: '11:30 AM - 12:00 PM' },
  { id: 1, value: '12:00 AM - 12:30 PM', disabled: true },
  { id: 2, value: '12:30 AM - 1:30 PM', disabled: true },
  { id: 3, value: '1:30 PM - 2:00 PM' },
  { id: 4, value: '2:00 PM - 2:30 PM' },
  { id: 5, value: '2:30 PM - 3:00 PM' },
  { id: 6, value: '3:00 PM - 3:30 PM' },
  { id: 7, value: '3:30 PM - 4:00 PM' },
  { id: 8, value: '4:00 PM - 4:30 PM' },
  { id: 9, value: '4:30 PM - 5:00 PM' },
  { id: 10, value: '5:00 PM - 5:30 PM' },
  { id: 11, value: '5:30 PM - 6:00 PM' },
  { id: 12, value: '6:00 PM - 6:30 PM' },
  { id: 13, value: '6:30 PM - 7:00 PM' },
  { id: 14, value: '7:00 PM - 7:30 PM' },
  { id: 15, value: '7:30 PM - 8:00 PM' }
]

const data: TimePickerData = {
  defaultTimes,
  dates: [
    { id: 0, value: 'Today 2/12' },
    { id: 1, value: 'Tomorrow 2/13', times: defaultTimes.slice(3, 8) },
    { id: 2, value: 'Wednesday 2/14' },
    { id: 3, value: 'Thursday 2/15', times: defaultTimes.slice(5, 10) },
    { id: 4, value: 'Friday 2/16' },
    { id: 5, value: 'Saturday 2/17', times: defaultTimes.slice(7, 12) },
    { id: 6, value: 'Sunday 2/17' }
  ]
}

export const defaultValue: DateTimeValue = [0, 0]

export const getDateTimeString = (value: DateTimeValue | [undefined, undefined]): string => {
  const [dateId, timeId] = value
  if (typeof dateId !== 'number' || typeof timeId !== 'number') {
    return ''
  }
  const date = data.dates.find(({ id }) => id === dateId)
  if (!date) {
    return ''
  }
  const time = date.times && date.times.find(({ id }) => id === timeId) || data.defaultTimes.find(({ id }) => id === timeId)
  if (!time) {
    return ''
  }
  return `${time.value} on ${date.value.split(' ')[1]}`
}

export default data
