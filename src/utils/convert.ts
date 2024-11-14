import { values, suites, Card, Value, Suite, FullHand, IntermediateRankHandResult, ValueCount, Hand, Board } from "../types/type" 
import { isFlush, isStraight } from "./checker";
import { pipe, map, sort } from "./combine";
import { compareCard, compareValueCount } from "./comparator";

const convertNumber = (value: Value): string => {
  if (value == 1) return "A";
  if (value == 11) return "J";
  if (value == 12) return "Q";
  if (value == 13) return "K";
  return value.toString();
}

const unconvertNumber = (value: string): Value => {
  if (value == "A") return 1;
  if (value == "J") return 11;
  if (value == "Q") return 12;
  if (value == "K") return 13;
  return parseInt(value) as Value;
}

const generateDeck = (): Card[] => {
  return suites.flatMap(suite => 
    values.map(value => ({
      value,
      suite
    }))
  );
}

const suiteRank = (suite: Suite): number => {
  const ranking = {
    "Spade": 4,
    "Heart": 3,
    "Diamond": 2,
    "Club": 1,
  };
  return ranking[suite];
};

const formatCard = ({value, suite}: Card): string => {
  return convertNumber(value) + " " + suite;
}

const unformatCard = (card: string): Card => {
  const [cardVal, cardSuite] = card.split(' ');
  return {
    suite: cardSuite as Suite,
    value: unconvertNumber(cardVal)
  }
}

const getValue = (card: Card): Value => card.value

const uniqueValues = <T>(arr: T[]): T[] => arr.filter((value, index, self) => self.indexOf(value) === index);

const sortCards = (cards: FullHand): Card[] => [...cards].sort(compareCard);

const updateValue = (curValue: { count: number, suiteNum: number }, card: Card) => {
  if (!curValue) {
    return { count: 0, suiteNum: suiteRank(card.suite) }
  }

  let { count, suiteNum } = curValue
  count += 1
  suiteNum = Math.max(suiteNum, suiteRank(card.suite))
  return { count, suiteNum } 
}

const getValueCounts = (cards: FullHand): Record<number, { count: number, suiteNum: number }> => {
  const counts: Record<number, { count: number, suiteNum: number }> = {};
  cards.forEach(card => counts[card.value] = updateValue(counts[card.value], card));
  return counts;
};

const getSortedValueCounts = (sortedCards: Card[]) =>
  pipe(
    getValueCounts,
    Object.entries,
    map(([value, count]) => ({ value: parseInt(value), count })),
    sort(compareValueCount)
  )(sortedCards) as ValueCount[];

const processSortedCards = (sortedCards: Card[]): IntermediateRankHandResult => ({
  sortedCards,
  isFlushHand: isFlush(sortedCards),
  isStraightHand: isStraight(sortedCards),
  valueCounts: getSortedValueCounts(sortedCards),
  highCard: sortedCards[0]
});

const getSum = (hand: Card[]): number => hand.map(getValue).reduce((a, b) => a + b, 0);

const handFromArray = (array: [Card, Card]): Hand => {
  const [ card1, card2 ] = array;
  return { card1, card2 };
}

const boardFromArray = (array: [Card, Card, Card, Card, Card]): Board => {
  const [ card1, card2, card3, card4, card5 ] = array;
  return { card1, card2, card3, card4, card5 };
}

export {
  convertNumber,
  generateDeck,
  formatCard,
  unformatCard,
  suiteRank,
  getValue,
  uniqueValues,
  sortCards,
  getValueCounts,
  processSortedCards,
  getSum,
  handFromArray,
  boardFromArray
}
