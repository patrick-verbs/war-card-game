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