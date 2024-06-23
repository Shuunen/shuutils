/* c8 ignore start */

/**
 * Hides the toast element by applying a transform and removing it after a delay.
 * @param element - The toast element to hide.
 * @param delay - The delay in milliseconds before removing the element.
 */
function toastHide (element: HTMLElement, delay = 200) {
  element.style.transform = 'translateX(300px)' // eslint-disable-line no-param-reassign
  setTimeout(() => { element.remove() }, delay)
}

/**
 * Shows a toast element with a specified delay.
 * @param element - The toast element to be shown.
 * @param delay - The delay in milliseconds before showing the toast.
 */
function toastShow (element: HTMLElement, delay = 100) {
  document.body.append(element)
  setTimeout(() => { element.style.transform = 'translateX(0)' }, delay) // eslint-disable-line no-param-reassign
}

/**
 * Adds a toast notification to the document body.
 * @param type - The type of the toast notification.
 * @param message - The message to be displayed in the toast notification.
 * @param delay - The delay in milliseconds before the toast notification is removed.
 * @param padding - The padding in pixels for the toast notification.
 */
// eslint-disable-next-line @typescript-eslint/max-params
function toastAdd (type: 'error' | 'success', message = '', delay = 0, padding = 20) {
  const element = document.createElement('div')
  element.setAttribute('class', 'shu-toast')
  const last = document.querySelector('.shu-toast:nth-last-child(1 of .shu-toast)')?.getBoundingClientRect().top
  const bottom = last === undefined ? 0 : window.innerHeight - last
  const background = type === 'success' ? 'forestgreen' : 'firebrick'
  const icon = type === 'success' ? '✔' : '✖' // @ts-expect-error it works (๑◕ܫ◕๑)
  element.style = `position: fixed; display: flex; align-items: center; gap: 8px; bottom: ${bottom + padding}px; right: 20px; z-index: 99999; padding: 5px 14px 6px 10px; background-color: ${background}; color: white; border-radius: 7px; box-shadow: 0 0 1rem rgba(0, 0, 0, 0.5); font-size: 18px; transition: transform 0.2s ease-in-out; transform: translateX(300px);`
  // eslint-disable-next-line no-unsanitized/property
  element.innerHTML = `<span style="border-radius: 50%; border: 1px solid #ffffff90; width: 20px; height: 20px; text-align: center; font-size: 12px;">${icon}</span><span style="margin-top: -1px;">${message}</span>`
  toastShow(element)
  if (delay > 0) setTimeout(() => { toastHide(element) }, delay)
}

/**
 * Displays an error toast message.
 * @param message - The error message to display.
 * @param delay - The delay in milliseconds before the toast disappears. Default is 4000ms.
 * @example utils.toastError('hello world')
 */
export function toastError (message: string, delay = 4000) { toastAdd('error', message, delay) }

/**
 * Displays a success toast message.
 * @param message - The success message to display.
 * @param delay - The delay in milliseconds before the toast disappears. Default is 2000ms.
 * @example utils.toastSuccess('hello world')
 */
export function toastSuccess (message: string, delay = 2000) { toastAdd('success', message, delay) }
