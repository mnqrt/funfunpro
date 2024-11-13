import { Card, FullHand, ValueCount } from "../types/type"
import { suiteRank } from "./convert"

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

const compareValueCount = <T extends ValueCount>(a: T, b: T) =>  b.count - a.count || b.value - a.value;

const compareCard = (a: Card, b: Card) => b.value - a.value || suiteRank(b.suite) - suiteRank(a.suite);

const isDiffOne = (a: number) => (b: number) => (a - 1) === b

export {
  isNotEqual,
  isDiffOne,
  not,
  compareValueCount,
  compareCard
}