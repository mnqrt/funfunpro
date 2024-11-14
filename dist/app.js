"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const convert_1 = require("./utils/convert");
const generateRandom_1 = require("./utils/generateRandom");
const generateHandAndBoard_1 = require("./utils/generateHandAndBoard");
const compareHand_1 = require("./utils/compareHand");
const checker_1 = require("./utils/checker");
const app = (0, express_1.default)();
const port = 3000;
app.use(body_parser_1.default.json());
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.post('/generate', (req, res) => {
    res.send(JSON.stringify((0, convert_1.generateDeck)().map(convert_1.formatCard)));
});
app.patch('/shuffle', (req, res) => {
    console.log(req.body);
    res.send(JSON.stringify((0, generateRandom_1.shuffleDeck)(req.body.map(convert_1.unformatCard)).map(convert_1.formatCard)));
});
app.post('/generate/hand', (req, res) => {
    const body = req.body;
    const players = body.players;
    const deck = body.deck.map(convert_1.unformatCard);
    const [hands, rest] = (0, generateHandAndBoard_1.generateHand)(players)(deck);
    res.send(JSON.stringify({ hands: hands.map(hand => hand.map(convert_1.formatCard)), deck: rest.map(convert_1.formatCard) }));
});
app.post('/generate/board', (req, res) => {
    const body = req.body;
    const deck = body.deck.map(convert_1.unformatCard);
    const [board, rest] = (0, generateHandAndBoard_1.generateBoard)(deck);
    res.send(JSON.stringify({ board: board.map(convert_1.formatCard), deck: rest.map(convert_1.formatCard) }));
});
app.post('/compare', (req, res) => {
    const body = req.body;
    const { hand1, hand2, board } = body;
    const unformattedH1 = (0, convert_1.handFromArray)(hand1.map(convert_1.unformatCard));
    const unformattedH2 = (0, convert_1.handFromArray)(hand2.map(convert_1.unformatCard));
    const unformattedBoard = (0, convert_1.boardFromArray)(board.map(convert_1.unformatCard));
    res.send(JSON.stringify({ hand1: hand1, hand2: hand2, board: board, winner: (0, compareHand_1.compareHandsFactory)(unformattedBoard)(unformattedH1, unformattedH2) }));
});
app.post('/hit', (req, res) => {
    const { player, dealer, deck } = req.body;
    const [result, rest] = (0, checker_1.hit)(player.map(convert_1.unformatCard), deck.map(convert_1.unformatCard));
    if ((0, checker_1.isBust)(result)) {
        res.send(JSON.stringify({ player: result.map(convert_1.formatCard), dealer: dealer, deck: rest.map(convert_1.formatCard), result: "Dealer wins" }));
    }
    else {
        res.send(JSON.stringify({ player: result.map(convert_1.formatCard), dealer: dealer, deck: rest.map(convert_1.formatCard), result: "N/A" }));
    }
});
app.post('/stand', (req, res) => {
    const { player, dealer, deck } = req.body;
    const [dealerFinal, rest] = (0, checker_1.stand)(dealer.map(convert_1.unformatCard), deck.map(convert_1.unformatCard));
    const winner = (0, checker_1.determineWinner)(player.map(convert_1.unformatCard), dealerFinal);
    res.send(JSON.stringify({ player: player, dealer: dealerFinal.map(convert_1.formatCard), deck: rest.map(convert_1.formatCard), result: winner }));
});
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map