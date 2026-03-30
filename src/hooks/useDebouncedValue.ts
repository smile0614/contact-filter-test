import debounce from 'lodash.debounce'
import { useEffect, useMemo, useState } from 'react'

export const useDebouncedValue = <T,>(value: T, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  const debouncedSetter = useMemo(
    () =>
      debounce((nextValue: T) => {
        setDebouncedValue(nextValue)
      }, delay),
    [delay],
  )

  useEffect(() => {
    debouncedSetter(value)

    return () => {
      debouncedSetter.cancel()
    }
  }, [value, debouncedSetter])

  return debouncedValue
}
