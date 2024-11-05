import { Card, Hand, Board, Suite, Value } from "../types/type";

type FullHand = Card[];

const getValue = (card: Card): Value => card.value
const uniqueValues = <T>(arr: T[]): T[] => arr.filter((value, index, self) => self.indexOf(value) === index);

const sortCards = (cards: FullHand): Card[] => {
  return [...cards].sort((a, b) => b.value - a.value || suiteRank(b.suite) - suiteRank(a.suite));
};

const suiteRank = (suite: Suite): number => {
  const ranking = {
    "Spade": 4,
    "Heart": 3,
    "Diamond": 2,
    "Club": 1,
  };
  return ranking[suite];
};

const isFlush = (cards: FullHand): boolean => {
  if (cards.length < 5) {
    return false
  }

  const firstSuite = cards[0].suite;
  const sameSuite = cards.filter(card => card.suite === firstSuite);
  if (sameSuite.length >= 5) {
    return true
  }

  return isFlush(cards.slice(1))
};

const consecutiveFactory = (numConsecutive: number) => {
  return (values: Value[]): boolean => {
    if (numConsecutive <= 0) {
      return true
    }
    if (values.length < 2) {
      return false
    }
    
    if (values[0] - 1 === values[1]) {
      return consecutiveFactory(numConsecutive - 1)(values.slice(1))
    }

    return consecutiveFactory(4)(values.slice(1))
  }
}

const isStraight = (cards: FullHand): boolean => {
  const sortedValues = uniqueValues(cards.map(getValue));
  return consecutiveFactory(4)(sortedValues);
};

const getValueCounts = (cards: FullHand): Record<number, number> => {
  const counts: Record<number, number> = {};
  cards.forEach(card => {
    counts[card.value] = (counts[card.value] || 0) + 1;
  });
  return counts;
};

const rankHand = (cards: FullHand): { rank: number, highCards: Card[] } => {
  const sortedCards = sortCards(cards);
  const isFlushHand = isFlush(sortedCards);
  const isStraightHand = isStraight(sortedCards);
  const valueCounts = Object.entries(getValueCounts(sortedCards))
    .map(([value, count]) => ({ value: parseInt(value), count }))
    .sort((a, b) => b.count - a.count || b.value - a.value);

  const counts = valueCounts.map(vc => vc.count);
  const highestValues = valueCounts.map(vc => vc.value);

  if (isFlushHand && isStraightHand && sortedCards[0].value === 13) {
    return { rank: 10, highCards: sortedCards }; // Royal Flush
  } else if (isFlushHand && isStraightHand) {
    return { rank: 9, highCards: sortedCards }; // Straight Flush
  } else if (counts[0] === 4) {
    return { rank: 8, highCards: sortedCards.filter(card => card.value === highestValues[0]) }; // Four of a Kind
  } else if (counts[0] === 3 && counts[1] === 2) {
    return { rank: 7, highCards: sortedCards.filter(card => card.value === highestValues[0] || card.value === highestValues[1]) }; // Full House
  } else if (isFlushHand) {
    return { rank: 6, highCards: sortedCards }; // Flush
  } else if (isStraightHand) {
    return { rank: 5, highCards: sortedCards }; // Straight
  } else if (counts[0] === 3) {
    return { rank: 4, highCards: sortedCards.filter(card => card.value === highestValues[0]) }; // Three of a Kind
  } else if (counts[0] === 2 && counts[1] === 2) {
    return { rank: 3, highCards: sortedCards.filter(card => card.value === highestValues[0] || card.value === highestValues[1]) }; // Two Pair
  } else if (counts[0] === 2) {
    return { rank: 2, highCards: sortedCards.filter(card => card.value === highestValues[0]) }; // One Pair
  } else {
    return { rank: 1, highCards: sortedCards }; // High Card
  }
};

const compareHands = (hand1: Hand, hand2: Hand, board: Board): "Hand1" | "Hand2" | "Tie" => {
  const fullHand1: FullHand = [hand1.card1, hand1.card2, board.card1, board.card2, board.card3, board.card4, board.card5];
  const fullHand2: FullHand = [hand2.card1, hand2.card2, board.card1, board.card2, board.card3, board.card4, board.card5];

  const rank1 = rankHand(fullHand1);
  const rank2 = rankHand(fullHand2);

  if (rank1.rank > rank2.rank) {
    return "Hand1";
  } else if (rank2.rank > rank1.rank) {
    return "Hand2";
  } else {
    for (let i = 0; i < rank1.highCards.length; i++) {
      if (rank1.highCards[i].value > rank2.highCards[i].value) {
        return "Hand1";
      } else if (rank2.highCards[i].value > rank1.highCards[i].value) {
        return "Hand2";
      } else if (rank1.highCards[i].value === rank2.highCards[i].value) {
        const rank1Suite = suiteRank(rank1.highCards[i].suite);
        const rank2Suite = suiteRank(rank2.highCards[i].suite);
        if (rank1Suite > rank2Suite) {
          return "Hand1";
        } else if (rank2Suite > rank1Suite) {
          return "Hand2";
        }
      }
    }
    return "Tie";
  }
};

const hand1: Hand = {
  card1: { value: 10, suite: "Heart" },
  card2: { value: 11, suite: "Heart" }
};

const hand2: Hand = {
  card1: { value: 10, suite: "Spade" },
  card2: { value: 11, suite: "Spade" }
};

const board: Board = {
  card1: { value: 9, suite: "Heart" },
  card2: { value: 12, suite: "Heart" },
  card3: { value: 13, suite: "Heart" },
  card4: { value: 2, suite: "Spade" },
  card5: { value: 5, suite: "Club" }
};

const notStraight: FullHand = [
  { value: 9, suite: "Heart" },
  { value: 13, suite: "Heart" },
  { value: 6, suite: "Heart" },
  { value: 2, suite: "Spade" },
  { value: 5, suite: "Club" },
  { value: 13, suite: "Spade" },
  { value: 1, suite: "Club" },
]


const straight: FullHand = [
  { value: 12, suite: "Heart" },
  { value: 11, suite: "Heart" },
  { value: 11, suite: "Heart" },
  { value: 10, suite: "Spade" },
  { value: 9, suite: "Club" },
  { value: 13, suite: "Spade" },
  { value: 1, suite: "Club" },
]

console.log(isStraight(sortCards(straight)))
console.log(isStraight(sortCards(notStraight)))

const result = compareHands(hand1, hand2, board);
console.log("Winner:", result);
