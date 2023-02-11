import { getRandomNumber } from '../src'
import { check } from './utils'

check('getRandomNumber 0 min by default', getRandomNumber() >= 0, true)
check('getRandomNumber 100 max by default', getRandomNumber() <= 100, true)
check('getRandomNumber between 22 & 122', getRandomNumber(22, 122) <= 122, true)
check('getRandomNumber between 42 & 42', getRandomNumber(42, 42), 42)

