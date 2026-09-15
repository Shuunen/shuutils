import { nbAscending, nbDescending } from './constants'
import { isNil } from './is-nil'

/**
 * Sort an array of objects by a specific property of theses objects, example :
 * ```js
 * persons.sort(byProperty('name'))
 * ```
 * @param property the property to sort by
 * @param order the order to sort, default is ascending
 * @returns the sorted array
 */
export function byProperty<Type extends Record<string, unknown>>(property: string, order: '' | 'asc' | 'desc' = '') {
  if (order === '') return () => 0

  const sortOrder = order === 'asc' ? nbAscending : nbDescending
  return (recordA: Type, recordB: Type) => {
    const valueA = recordA[property] as number,
      valueB = recordB[property] as number,
      isValueAMissing = isNil(valueA),
      isValueBMissing = isNil(valueB)
    if (isValueAMissing && !isValueBMissing) return sortOrder

    if (!isValueAMissing && isValueBMissing) return -sortOrder

    if (valueA === valueB) return 0

    const result = valueA < valueB ? nbDescending : nbAscending
    return result * sortOrder
  }
}
