import { useCallback, useRef } from 'react'

export interface TouchEvents {
  onTouchStart (): void
  onTouchMove (): void
  onTouchEnd (...args: any): void
}

// hack touch event, avoid trigger touch-end when touch-move
const useTouchEvent = (touchEndCallback: (...args: any) => void): TouchEvents => {
  const isScroll = useRef<boolean>(false)
  const onTouchStart = useCallback(() => {
    isScroll.current = false
  }, [])
  const onTouchMove = useCallback(() => {
    isScroll.current = true
  }, [])
  const onTouchEnd = useCallback((...args: any) => {
    if (isScroll.current) {
      return
    }
    touchEndCallback(...args)
  }, [touchEndCallback])

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  }
}

export default useTouchEvent
