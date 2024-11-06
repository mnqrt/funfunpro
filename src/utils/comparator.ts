const isNotEqual = <T>(item: T) => {
  return (value: T) => {
    return item !== value
  }
}

const not = <T>(comparator: ((a: T) => (b: T) => boolean)) => {
  return (val1: T) => {
    return (val2: T): boolean => {
      return !comparator(val1)(val2);
    }
  }
}

const isDiffOne = (a: number) => (b: number) => (a - 1) === b

export {
  isNotEqual,
  isDiffOne,
  not
}