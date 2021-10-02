/* eslint-disable @typescript-eslint/no-explicit-any */
import { ellipsis } from './strings'

/**
 * Debounce any function
 * @param func the function to debounce
 * @param waitFor time before executing function
 * @returns promise with a resolve type of the original function's return type
 */
export function debounce<F extends (...parameters: any[]) => ReturnType<F>> (function_: F, waitFor: number): (...parameters: Parameters<F>) => Promise<ReturnType<F>> {
  let timeout: NodeJS.Timeout
  return (...parameters: Parameters<F>) => new Promise(resolve => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      resolve(function_(...parameters))
    }, waitFor)
  })
}

// inspiration from https://www.matthewgerstman.com/tech/throttle-and-debounce/
export function throttle<F extends (...parameters: any[]) => ReturnType<F>> (function_: F, timeout: number): (...parameters: Parameters<F>) => void {
  let ready = true
  return (...parameters: Parameters<F>) => {
    if (!ready) return
    ready = false
    function_(...parameters)
    setTimeout(() => {
      ready = true
    }, timeout)
  }
}

/* istanbul ignore next */
/**
 * Sleep let you "pause" or delay processes
 * @param ms the time to wait in milliseconds, default 1000ms / 1 sec
 * @returns promise that resolve in the provided time
 */
export async function sleep (ms = 1000): Promise<number> {
  return new Promise(resolve => setTimeout(() => resolve(ms), ms))
}

/* istanbul ignore next */
export function copyToClipboard (stuff: string | number | Record<string, any>): void {
  const element = document.createElement('textarea')
  const text = typeof stuff === 'string' ? stuff : JSON.stringify(stuff)
  console.log(`copying to clipboard : ${ellipsis(text)}`)
  element.value = text
  document.body.append(element)
  element.select()
  document.execCommand('copy')
  element.remove()
}
