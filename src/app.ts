import express from 'express';
import bodyParser from 'body-parser';
import { generateDeck, formatCard, unformatCard, getSum, handFromArray, boardFromArray } from './utils/convert';
import { shuffleDeck } from './utils/generateRandom';
import { generateHand, generateBoard } from "./utils/generateHandAndBoard";
import { compareHandsFactory } from './utils/compareHand';
import { determineWinner, hit, isBust, stand } from './utils/checker';

const app = express();
const port = 3000;

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/generate', (req, res) => {
  res.send(JSON.stringify(generateDeck().map(formatCard)))
});

app.patch('/shuffle', (req, res) => {
  console.log(req.body)
  res.send(JSON.stringify(shuffleDeck(req.body.map(unformatCard)).map(formatCard)))
});

app.post('/generate/hand', (req, res) => {
  const body = req.body;
  const players = body.players;
  const deck = body.deck.map(unformatCard);
  const [hands, rest] = generateHand(players)(deck);
  res.send(JSON.stringify({hands: hands.map(hand => hand.map(formatCard)), deck: rest.map(formatCard)}));
});

app.post('/generate/board', (req, res) => {
  const body = req.body;
  const deck = body.deck.map(unformatCard);
  const [board, rest] = generateBoard(deck);
  res.send(JSON.stringify({board: board.map(formatCard), deck: rest.map(formatCard)}));
});

app.post('/compare', (req, res) => {
  const body = req.body;
  const { hand1, hand2, board } = body;
  const unformattedH1 = handFromArray(hand1.map(unformatCard));
  const unformattedH2 = handFromArray(hand2.map(unformatCard));
  const unformattedBoard = boardFromArray(board.map(unformatCard));
  res.send(JSON.stringify({hand1: hand1, hand2: hand2, board: board, winner: compareHandsFactory(unformattedBoard)(unformattedH1, unformattedH2)}));
});

app.post('/hit', (req, res) => {
  const { player, dealer, deck } = req.body;
  const [result, rest] = hit(player.map(unformatCard), deck.map(unformatCard));
  if (isBust(result)) {
    res.send(JSON.stringify({player: result.map(formatCard), dealer: dealer, deck: rest.map(formatCard), result: "Dealer wins"}));
  } else {
    res.send(JSON.stringify({player: result.map(formatCard), dealer: dealer, deck: rest.map(formatCard), result: "N/A"}));
  }
});

app.post('/stand', (req, res) => {
  const { player, dealer, deck } = req.body;
  const [dealerFinal, rest] = stand(dealer.map(unformatCard), deck.map(unformatCard));
  const winner = determineWinner(player.map(unformatCard), dealerFinal);
  res.send(JSON.stringify({player: player, dealer: dealerFinal.map(formatCard), deck: rest.map(formatCard), result: winner}));
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});