import express from 'express';
import { generateDeck, formatCard, unformatCard } from './utils/convert';
import { shuffleDeck } from './utils/generateRandom';
import { generateHand, generateBoard } from "./utils/generateHandAndBoard";
import { compareHandsFactory } from './utils/compareHand';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/generate', (req, res) => {
  res.send(JSON.stringify(generateDeck().map(formatCard)))
});

app.patch('/shuffle', (req, res) => {
  res.send(JSON.stringify(shuffleDeck(JSON.parse(req.body).map(unformatCard)).map(formatCard)))
});

app.post('/generate/hand', (req, res) => {
  const body = JSON.parse(req.body);
  const players = body.players;
  const deck = body.deck.map(unformatCard);
  const [hands, rest] = generateHand(players)(deck);
  res.send(JSON.stringify({hands: hands.map(hand => hand.map(formatCard)), deck: rest.map(formatCard)}));
});

app.post('/generate/board', (req, res) => {
  const body = JSON.parse(req.body);
  const deck = body.deck.map(unformatCard);
  const [board, rest] = generateBoard(deck);
  res.send(JSON.stringify({board: board.map(formatCard), deck: rest.map(formatCard)}));
});

app.post('/compare', (req, res) => {
  const body = JSON.parse(req.body);
  const { hand1, hand2, board } = body;
  res.send(JSON.stringify({hand1: hand1, hand2: hand2, board: board, winner: compareHandsFactory(board)(hand1, hand2)}));
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});