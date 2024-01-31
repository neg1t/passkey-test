import React, { useEffect } from 'react'

const useComponentWillUnmount = (cleanupCallback: VoidFunction) => {
  const callbackRef = React.useRef(cleanupCallback)

  callbackRef.current = cleanupCallback

  useEffect(() => {
    return () => callbackRef.current()
  }, [])
}

export default useComponentWillUnmount
