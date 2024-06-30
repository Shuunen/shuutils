import { round } from './number-round'

/**
 * Get a ranged score
 * @param rules the rules to apply
 * @param rules.isHigherBetter if true, the higher the value, the higher the score
 * @param rules.scoreMax the maximum score
 * @param rules.scoreMin the minimum score
 * @param rules.valueMax the maximum value
 * @param rules.valueMin the minimum value
 * @param value the value to score
 * @returns the ranged score
 */
export function rangedScore(
  { isHigherBetter, scoreMax, scoreMin, valueMax, valueMin }: Readonly<{ isHigherBetter: boolean; scoreMax: number; scoreMin: number; valueMax: number; valueMin: number }>,
  value: number,
) {
  const lineA = (scoreMin - scoreMax) / (valueMin - valueMax)
  const lineB = scoreMax - valueMax * lineA
  const score = value * lineA + lineB
  if (score < scoreMin) return isHigherBetter ? scoreMin : scoreMax
  if (score > scoreMax) return isHigherBetter ? scoreMax : scoreMin
  const nbDecimals = scoreMax - scoreMin > 10 ? 0 : 2 // eslint-disable-line @typescript-eslint/no-magic-numbers
  const finalScore = isHigherBetter ? score : scoreMax - score
  return round(finalScore, nbDecimals)
}
