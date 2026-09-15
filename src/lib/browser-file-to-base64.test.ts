import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { fileToBase64 } from './browser-file-to-base64'
import { Result } from './result'

if (!GlobalRegistrator.isRegistered) GlobalRegistrator.register()

describe(fileToBase64, () => {
  it('should convert successfully', async () => {
    const base64 = await fileToBase64(new File(['some data'], 'file.jpg')),
      result = Result.unwrap(base64)
    expect(result.value).toMatchInlineSnapshot(`"data:application/octet-stream;base64,c29tZSBkYXRh"`)
  })
})
