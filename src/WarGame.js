import React, { Component } from 'react';
import './WarGame.css';
import CardDeckImage from './images/deck.png';
import CardCover from './images/cover.png';

class WarGame extends Component {
  constructor(props)
  {
    // 'super' refers to the constructor...
    // ...and needs to be called to enable the 'this' keyword.
    super(props);
    this.state = {
      AppMode: 'NoAction',// NoAction, Game, PlayerWin, AIWin
      MoveState: 'NoState',
      CardsDeck: new Array(52),
      PlayerDeck: new Array(52),
      AIDeck: new Array(52),
      PlayerBank: new Array(52),
      AIBank: new Array(52),
      MoveCount: 0,
    };
    this.TableCanvas = React.createRef();

    // bindings for setting 'this'
    this.StartNewGame.bind(this);
    this.DoOneMove.bind(this);
    this.EndMove.bind(this);
    this.GetOneCardFromDeck.bind(this);
    this.componentDidUpdate.bind(this);
    this.render.bind(this);
    this.draw_card.bind(this);    
  }
}

GetOneCardFromDeck = () => {
  // Get a card from the deck
  // Set its value to '0' to 'remove' it from the deck
  let rnd = Math.round(Math.random() * 52);
  if (this.state.CardsDeck[rnd] != 0) {
    this.state.CardsDeck[rnd] = 0;
    return rnd;
  }

  // This card is absent; we need to get the next one
  for (let count = rnd + 1; count < 52; count++) {
    if (this.state.CardsDeck[count] != 0) {
      this.state.CardsDeck[count] = 0;
      return count;
    }
  }

  // If the card and all those after it are missing (set to 0)...
  // ...then we try looking at all the cards before it.
  for (let count = rnd - 1; count >= 0; count--) {
    if (this.state.CardsDeck[count] != 0) {
      this.state.CardsDeck[count] = 0;
      return count;
    }
  }

  // If we are here, there are no cards in the deck.
  return -1;
}

MoveDeck = (deck) => {
  // Remove one card from the deck
  for (let count = 0; count < 51; count++) {
    deck[count] = deck[count + 1];
  }
  deck[51] = null;
}

GetCardCount = (deck) => {
  let count;
  for (count = 0; count < 52; count++) {
    if (deck[count] == null) { break };
  }
  return count == 52 ? 0 : count++;
}

StartNewGame = () => {
  // Init new game
  // Fill deck of cards and clear AI and player decks
  for (let count = 0; count < 52; count++) {
    this.state.CardsDeck[count] = 1;
    this.state.PlayerDeck[count] = null;
    this.state.AIDeck[count] = null;
    this.state.PlayerBank[count] = null;
    this.state.AIBank[count] = null;
  }

  // Now divvy up the deck to build the AI and player decks
  for (let count = 0; count < 26; count++) {
    this.state.PlayerDeck[count] = this.GetOneCardFromDeck();
    this.state.AIDeck[count] = this.GetOneCardFromDeck();
  }

  this.setState({MoveState: 'NoState'});
  this.setState({AppMode: 'Game'});
}

DoOneMove = () => {
  // There are two options:
  // 1) Bank is empty. Need to put 1 card in.
  // 2) Bank is not empty. Need to put 3 cards + 1.
  let PlayerCard = -1;
  let AICard = -1;
  let BankCardCount;
  let PlayerCount = 0;
  let AICardCount = 0;

  switch (this.state.MoveState) {
    case 'Equality':
      // 2nd option
      // Here we need to check if there are enough cards
      PlayerCount = this.GetCardCount(this.state.PlayerDeck);
      AICount = this.GetCardCount(this.state.AIDeck);

      if (PlayerCount < 4) {
        this.state({AppMode: 'AIWin'});
      }
      if (AICardCount < 4) {
        this.state({AppMode: 'PlayerWin'});
      }

      // Put 3 cards + 1 into the bank
      BankCardCount = this.GetCardCount(this.state.PlayerBank);
      for (let count = 0; count < 4; count++) {
        PlayerCard = this.state.PlayerDeck[0];
        AICard = this.state.AIDeck[0];
        this.MoveDeck(this.state.PlayerDeck);
        this.MoveDeck(this.state.AIDeck);
        this.state.PlayerBank[BankCardCount] = PlayerCard;
        this.state.AIBank[BankCardCount] = AICard;

        BankCardCount++;
      }

      if ((PlayerCard % 13) == (AICard % 13)) {
        this.setState({MoveState: 'Equality'});
      } else {
        this.setState({MoveState: 'EndMove'});
      }
      break;

    case 'EndMove':
      this.EndMove();
      this.setState({MoveState: 'NoState'});
      break;
    case 'NoState':
    default:
      // 1st option
      PlayerCard = this.state.PlayerDeck[0];
      AICard = this.state.AIDeck[0];
      this.MoveDeck(this.state.PlayerDeck);
      this.MoveDeck(this.state.AIDeck);

      BankCardCount = this.GetCardCount(this.state.PlayerBank);
      console.log(BankCardCount);
      this.state.PlayerBank[BankCardCount] = PlayerCard;
      this.state.AIBank[BankCardCount] = AICard;

      if ((PlayerCard % 13) == (AICard % 13)) {
        this.setState({MoveState: 'Equality'});
      } else {
        this.setState({MoveState: 'EndMove'});
      }
      break;
  }
}