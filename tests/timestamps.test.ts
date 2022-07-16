import { test } from 'uvu'
import { getTimestamp, getTimestampMs } from '../src'
import { check } from './utils'

check('specific date', getTimestamp(new Date('1989-05-14')), 611_107_200)

check('give positive number', getTimestamp() > 0, true)

check('give date before year 3003', getTimestamp() < 32_603_558_400_000, true)

check('ms of a specific date', getTimestampMs(new Date('1989-05-14')), 611_107_200_000)

const sizeMs = getTimestampMs().toString().length
const sizeS = getTimestamp().toString().length
check('ms is a 1000 times bigger', (sizeMs - sizeS) === 3, true)

test.run()
