/* v8 ignore start */
/**
 * Download a file from a `Blob`, `File` or `MediaSource` instance.
 * @param file the file-like instance.
 * @param fileName optional custom file name for the download.
 */
export function downloadFile(file: Blob | MediaSource, fileName?: string) {
  const url = URL.createObjectURL(file),
    link = document.createElement('a'),
    resolvedFileName = fileName ?? (file instanceof File ? file.name : 'download')
  link.href = url
  link.download = resolvedFileName
  document.body.append(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
