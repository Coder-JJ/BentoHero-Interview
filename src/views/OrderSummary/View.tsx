import styles from './index.less'
import React, { useContext } from 'react'
import { hot } from 'react-hot-loader/root'
import Context from '../../AppContext'
import { getDateTimeString } from '../../components/TimePicker/data'

const OrderSummary: React.FC = function () {
  const { timePickerValue, openTimePicker } = useContext(Context)

  return (
    <div className={styles.wrap}>
      <header>Order Summary</header>
      <main>
        <div className={styles.title}>Delivery Information: </div>
        <section className={styles.card}>
          <div className={styles.content}>
            <div className={styles.title}>Delivery time:</div>
            <div className={styles.time}>{ getDateTimeString(timePickerValue) }</div>
          </div>
          <button onTouchEnd={openTimePicker}>Edit</button>
        </section>
      </main>
    </div>
  )
}

export default hot(React.memo(OrderSummary))
