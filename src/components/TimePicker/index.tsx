import styles from './index.less'
import React, { useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { CSSTransition } from 'react-transition-group'
import { CSSTransitionClassNames } from 'react-transition-group/CSSTransition'
import classNames from 'classnames'
import { useControlledModeHelper, useTouchEvent } from '../../hooks'
import { TimePickerDate, TimePickerTime, TimePickerData, DateTimeValue, defaultValue } from './data'

export type Value = DateTimeValue | [undefined, undefined]

export interface Props {
  visible?: boolean
  data: TimePickerData
  value?: Value
  onChange? (value: DateTimeValue): void
  onClose? (): void
}

const getFirstEnableTime = (times: TimePickerTime[]): TimePickerTime | undefined => {
  return times.find(({ disabled }) => !disabled)
}

const cmpClassNames: CSSTransitionClassNames = {
  enter: styles['wrap-enter'],
  enterActive: styles['wrap-enter-active'],
  enterDone: styles['wrap-enter-done'],
  exit: styles['wrap-exit'],
  exitActive: styles['wrap-exit-active'],
  exitDone: styles['wrap-exit-done']
}

const maskClassNames: CSSTransitionClassNames = {
  enter: styles['mask-enter'],
  enterActive: styles['mask-enter-active'],
  enterDone: styles['mask-enter-done'],
  exit: styles['mask-exit'],
  exitActive: styles['mask-exit-active'],
  exitDone: styles['mask-exit-done']
}

const pickerClassNames: CSSTransitionClassNames = {
  enter: styles['picker-enter'],
  enterActive: styles['picker-enter-active'],
  enterDone: styles['picker-enter-done'],
  exit: styles['picker-exit'],
  exitActive: styles['picker-exit-active'],
  exitDone: styles['picker-exit-done']
}

const addEndListener = (node: HTMLElement, done: () => void): void => {
  // use the css transitionend event to mark the finish of a transition
  node.addEventListener('transitionend', done, false)
}

/**
 * @TimePicker - Support both controlled and uncontrolled mpde
 * @param {boolean} visible - To open or close TimePicker
 * @param {TimePickerData} data - Data of TimePicker, usually fetched from back-end
 * @param {Value} value - Selected Date-Time values
 * @param {(value: DateTimeValue) => void} onChange - Trigger when date or time is selected
 * @param {() => void} onClose - Trigger when mask is touched
 */
const TimePicker: React.FC<Props> = function (props) {
  const { visible, data, onChange, onClose } = props

  // controlled mode helper
  const [isControlled, [dateId, timeId], setValue] = useControlledModeHelper<Value>(props, 'value', defaultValue)

  // toolbar dragging events start
  const picker = useRef<HTMLDivElement>(null)
  const clientY = useRef<number>(0)
  const onDragStart: React.TouchEventHandler<HTMLDivElement> = useCallback(e => {
    e.preventDefault()
    clientY.current = e.targetTouches[0].clientY
  }, [])
  const onDragging: React.TouchEventHandler<HTMLDivElement> = useCallback(e => {
    e.preventDefault()
    const offsetY = e.changedTouches[0].clientY - clientY.current
    if (offsetY < 0) {
      return
    }
    requestAnimationFrame(() => {
      if (picker.current) {
        picker.current.style.transform = `translate3d(0, ${offsetY}px, 0)`
      }
    })
  }, [])
  const onDragEnd: React.TouchEventHandler<HTMLDivElement> = useCallback(e => {
    e.preventDefault()
    const offsetY = e.changedTouches[0].clientY - clientY.current
    requestAnimationFrame(() => {
      if (picker.current) {
        const transitionEnd = (): void => {
          if (picker.current) {
            picker.current.style.transition = ''
            picker.current.removeEventListener('transitionend', transitionEnd)
          }
        }
        picker.current.addEventListener('transitionend', transitionEnd)
        picker.current.style.transition = '0.1s'
        picker.current.style.transform = ''
      }
    })
    if (offsetY > 50) {
      onClose && onClose()
    }
  }, [onClose])
  // toolbar dragging events end

  // date touch events start
  const onTouchDate = useCallback((dateId: number | undefined, date: TimePickerDate) => {
    if (date.id === dateId) {
      return
    }
    const nextValue: Value = [date.id, (date.times && getFirstEnableTime(date.times) || data.defaultTimes[0]).id]
    if (onChange) {
      onChange(nextValue)
    }
    if (!isControlled) {
      setValue(nextValue)
    }
  }, [isControlled, data.defaultTimes, setValue, onChange])
  const { onTouchEnd: onTouchDateEnd, ...dateTouchEvents } = useTouchEvent(onTouchDate)
  // date touch events end

  // time touch events start
  const onTouchTime = useCallback((dateId: number, timeId: number | undefined, time: TimePickerTime) => {
    if (time.disabled || time.id === timeId) {
      return
    }
    const nextValue: Value = [dateId, time.id]
    if (onChange) {
      onChange(nextValue)
    }
    if (!isControlled) {
      setValue(nextValue)
    }
  }, [isControlled, setValue, onChange])
  const { onTouchEnd: onTouchTimeEnd, ...timeTouchEvents } = useTouchEvent(onTouchTime)
  // time touch events end

  return createPortal(
    (
      <CSSTransition classNames={cmpClassNames} in={visible} addEndListener={addEndListener}>
        <div className={classNames(styles.wrap, { [styles.hidden]: !visible })}>
          <CSSTransition classNames={maskClassNames} in={visible} addEndListener={addEndListener}>
            <div className={styles.mask} onTouchEnd={onClose} />
          </CSSTransition>
          <CSSTransition classNames={pickerClassNames} in={visible} addEndListener={addEndListener}>
            <div className={styles.picker} ref={picker}>
              <div className={styles.toolbar} onTouchStart={onDragStart} onTouchMove={onDragging} onTouchEnd={onDragEnd} />
              <div className={styles.title}>Schedule a Delivery Time</div>
              <div className={styles.content}>
                <div className={styles.dates}>
                  {
                    data.dates.map(date => {
                      const { id, value } = date
                      return (
                        <div
                          key={id}
                          className={classNames(styles.date, { [styles.active]: id === dateId })}
                          {...dateTouchEvents}
                          onTouchEnd={() => onTouchDateEnd(dateId, date)}
                        >
                          { value }
                        </div>
                      )
                    })
                  }
                </div>
                <div className={styles.times}>
                  {
                    typeof dateId === 'number' && (
                      (data.dates.find(({ id }) => id === dateId)?.times || data.defaultTimes).map(time => {
                        const { id, value, disabled } = time
                        return (
                          <div
                            key={id}
                            className={classNames(styles.time, { [styles.disabled]: disabled, [styles.active]: !disabled && id === timeId })}
                            {...timeTouchEvents}
                            onTouchEnd={() => onTouchTimeEnd(dateId, timeId, time)}
                          >
                            <div className={styles.radio} />
                            <div className={styles.text}>{ value }</div>
                          </div>
                        )
                      })
                    )
                  }
                </div>
              </div>
            </div>
          </CSSTransition>
        </div>
      </CSSTransition>
    ),
    document.body
  )
}

export default React.memo(TimePicker)
