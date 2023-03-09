import { getType, isNumber } from './basics'
import type { EmployeeType, UserType } from '~~/types'

/**
 * Returns true if `value` is an array.
 *
 * @param value any
 * @returns `true` || `false`
 */
export function isArray(value: any): value is any[] {
  return getType(value) === 'Array'
}

export function alphabetical<T extends UserType[] | EmployeeType[]>(entityArray: T): T {
  return entityArray.sort((a, b) => {
    const lastNameA = a.lastName.toLowerCase()
    const lastNameB = b.lastName.toLowerCase()
    if (lastNameA < lastNameB) {
      return -1
    }
    if (lastNameA > lastNameB) {
      return 1
    }
    return 0
  }) as T
}

/**
 * Returns true if `value` is an array of numbers.
 *
 * @param value any
 * @returns `true` || `false`
 */
export function isArrayOfNumbers(value: any): boolean {
  if (!isArray(value) || !value.length)
    return false
  return value.every(i => isNumber(i))
}
