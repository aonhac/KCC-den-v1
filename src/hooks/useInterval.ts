import React, { useState, useEffect, useRef } from 'react'
export function useInterval(callback: any, delay: number) {
  const savedCallback: any = useRef()

  // save callback
  useEffect(() => {
    savedCallback.current = callback
  })

  // create interval
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}
