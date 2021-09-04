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

    // binding for setting 'this'
    this.StartNewGame.bind(this);
    this.DoOneMove.bind(this);
    this.EndMove.bind(this);
    this.GetOneCardFromDeck.bind(this);
    this.componentDidUpdate.bind(this);
    this.render.bind(this);
    this.draw_card.bind(this);    
  }
}

// Get a card from the deck.
GetOneCardFromDeck = () => {
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

// Remove one card from the deck.
MoveDeck = (deck) => {
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