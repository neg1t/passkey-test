import { createEvent, createStore } from 'effector'
import { RefObject, useCallback, useEffect, useState } from 'react'

export const setInfiniteScrollFetching = createEvent<boolean>()

export const $isInfiniteScrollFetching = createStore<boolean>(false).on(
  setInfiniteScrollFetching,
  (_, value) => value
)

interface UseInfiniteScrollOptions {
  nodeRef?: RefObject<HTMLDivElement | HTMLTableSectionElement>
  distanceToEnd?: number
}

export const useInfiniteScroll = (
  callback: VoidFunction,
  options?: UseInfiniteScrollOptions
) => {
  const [lastScrollTop, setLastScrollTop] = useState(0)

  const handleScroll = useCallback(
    (event: Event) => {
      const isFetching = $isInfiniteScrollFetching.getState()

      const target = event.target as HTMLDivElement
      const distance = options?.distanceToEnd || 100

      const height = target.scrollHeight - target.clientHeight
      const scroll = target.scrollTop

      const diff = height - scroll

      const isScrollDown = scroll > lastScrollTop

      if (diff <= distance && !isFetching && isScrollDown) {
        setInfiniteScrollFetching(true)
        callback()
      }

      setLastScrollTop(scroll)
    },
    [callback, options, lastScrollTop]
  )

  useEffect(() => {
    const scrollableContainer =
      options?.nodeRef?.current ||
      document.getElementsByClassName('layout__content')[0]

    scrollableContainer?.addEventListener('scroll', handleScroll)

    return () => {
      scrollableContainer?.removeEventListener('scroll', handleScroll)
    }
  }, [options, handleScroll])
}
