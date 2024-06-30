/* c8 ignore start */

/**
 * Inject styles in the DOM
 * @param string the string to inject, can be a url or a css string
 * @example injectStyles('https://example.com/styles.css')
 * @example injectStyles('body { background-color: red; }')
 */
export function injectStyles (string = '') {
  // eslint-disable-next-line no-console
  if (string.length === 0) { console.log('injectStyles : cannot inject empty styles'); return }
  if (string.includes('://') && !string.includes('\n') && string.includes('.css')) {
    document.querySelector('head')?.insertAdjacentHTML('beforeend', `<link rel="stylesheet" href="${string}" />`)
    return
  }
  document.body.insertAdjacentHTML('beforeend', `<style>${string}</style>`)
}
