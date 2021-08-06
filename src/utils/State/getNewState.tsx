export function getNewState<T>(value: React.SetStateAction<T>, prev: T): T {
  return typeof value === 'function'
    ? (value as (prevValue: T) => T)(prev)
    : value;
}
