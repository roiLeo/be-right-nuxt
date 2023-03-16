/**
 * Returns the object type of the given value.
 *
 * @param value
 * @returns string
 */
export function getType<T>(value: T): string {
  return Object.prototype.toString.call(value).slice(8, -1)
}

/**
 * Returns true if `value` is a number.
 *
 * @param value any
 * @returns `true` || `false`
 */
export function isNumber(value: any): value is number {
  return getType(value) === 'Number'
}

/**
 * Type guard to filter out null values
 *
 * @category Guards
 * @example array.filter(noNull)
 */
export function noNull<T>(v: T | null): v is Exclude<T, null> {
  return v !== null
}

/**
 * Type guard to filter out undefined values
 *
 * @category Guards
 * @example array.filter(noUndefined)
 */
export function noUndefined<T>(v: T | undefined): v is Exclude<T, undefined> {
  return v !== undefined
}

export function isTruthy<T>(v: T) {
  return noNull(v) && noNull(v) && v !== ''
}
