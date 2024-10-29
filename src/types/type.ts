const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] as const
const suites = ["Spade", "Heart", "Diamond", "Club"] as const

type Value = (typeof values)[number]
type Suite = (typeof suites)[number]

type Card = {
  value: Value,
  suite: Suite
}

type Hand = {
  card1: Card,
  card2: Card
}

type Board = {
  card1: Card,
  card2: Card,
  card3: Card,
  card4: Card,
  card5: Card
}

export {
  values,
  Value,
  suites,
  Suite,
  Card,
  Hand,
  Board
}
