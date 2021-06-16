import { ok } from 'assert'
import { getTimestamp, getTimestampMs } from '../src'

describe('timestamp', function () {
  it('specific date', function () { return ok(getTimestamp(new Date('1989-05-14')) === 611_107_200) })

  it('give positive number', function () { return ok(getTimestamp() > 0) })

  it('give date before year 3003', function () { return ok(getTimestamp() < 32_603_558_400_000) })

  it('ms of a specific date', function () { return ok(getTimestampMs(new Date('1989-05-14')) === 611_107_200_000) })

  it('ms is a 1000 times bigger', function () {
    const sizeMs = getTimestampMs().toString().length
    const sizeS = getTimestamp().toString().length
    ok((sizeMs - sizeS) === 3)
  })
})
