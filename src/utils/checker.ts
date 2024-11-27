import { Card, FullHand, IntermediateRankHandResult, RankResult } from "../types/type"
import { isDiffOne, isNotEqual, not } from "./comparator"
import { getSum, getValue, suiteRank, uniqueValues } from "./convert"

const consecutiveFactory = (base: number) => <T>(numConsecutive: number) => {
  return (checker: ((a: T) => (b: T) => boolean)) => {
    return (values: T[]): boolean => {
      if (numConsecutive <= 0) {
        return true
      }
      if (values.length < 2) {
        return false
      }
      
      const [cur, next, ...rest] = values;
      if (checker(cur)(next)) {
        return consecutiveFactory(base)(numConsecutive - 1)(checker)([next, ...rest]);
      }
  
      return consecutiveFactory(base)(base)(checker)([next, ...rest])
    }
  }
}

const consecutiveWithBase = (n: number) => consecutiveFactory(n)(n)

const isFlush = (cards: FullHand): boolean => {
  const sortedSuites = cards.map(card => card.suite).sort((a, b) => suiteRank(b) - suiteRank(a));
  return consecutiveWithBase(4)(not(isNotEqual))(sortedSuites);
}

const isStraight = (cards: FullHand): boolean => {
  const sortedValues = uniqueValues(cards.map(getValue));
  return consecutiveWithBase(4)(isDiffOne)(sortedValues);
}

const isNKind = (n: number) => (cards: FullHand): boolean => {
  const sortedValues = cards.map(card => card.value);
  return consecutiveWithBase(n - 1)(not(isNotEqual))(sortedValues);
}

const determineRank = ({ isFlushHand, isStraightHand, valueCounts, highCard }: IntermediateRankHandResult): RankResult => {
  const rankConditions = [
    { rank: 10, condition: () => isFlushHand && isStraightHand && highCard.value === 13 },
    { rank: 9, condition: () => isFlushHand && isStraightHand },
    { rank: 8, condition: () => valueCounts[0].count === 4 },
    { rank: 7, condition: () => valueCounts[0].count === 3 && valueCounts[1]?.count === 2 },
    { rank: 6, condition: () => isFlushHand },
    { rank: 5, condition: () => isStraightHand },
    { rank: 4, condition: () => valueCounts[0].count === 3 },
    { rank: 3, condition: () => valueCounts[0].count === 2 && valueCounts[1]?.count === 2 },
    { rank: 2, condition: () => valueCounts[0].count === 2 },
    { rank: 1, condition: () => true }
  ];

  return { rank: rankConditions.find(({ condition }) => condition()).rank, highCard };
};

const hit = (hand: Card[], deck: Card[]): [Card[], Card[]] => {
  const [first, ...rest] = deck;
  const result = [...hand, first];
  return [result, rest];
}

const hitUntil = (stop: number) => (hand: Card[], deck: Card[]): [Card[], Card[]] => {
  const [result, rest] = hit(hand, deck);
  if (getSum(result) < stop) {
    return hitUntil(stop)(result, rest);
  }
  return [result, rest];
}

const stand = (dealer: Card[], deck: Card[]): [Card[], Card[]] => {
  return hitUntil(17)(dealer, deck);
}

const isBust = (hand: Card[]): boolean => getSum(hand) > 21;

const compareBlackJackCard = (a: number, b: number) => a - b;

export {
  isFlush,
  isStraight,
  isNKind,
  determineRank,
  hit,
  stand,
  isBust,
  compareBlackJackCard
}