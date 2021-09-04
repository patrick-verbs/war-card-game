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
        AICardCount = this.GetCardCount(this.state.AIDeck);

        if (PlayerCount < 4) {
          this.setState({ AppMode: 'AIWin' });
        }
        if (AICardCount < 4) {
          this.setState({ AppMode: 'PlayerWin' });
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

  EndMove = () => {
    // Decides whether there is a winner or a loser or a tie
    let BankCardCount = this.GetCardCount(this.state.PlayerBank);
    let PlayerCard = this.state.PlayerBank[BankCardCount - 1] % 13;
    let AICard = this.state.AIBank[BankCardCount - 1] % 13;
    let count;
    let PlayerCardCount;
    let AICardCount;

    if (PlayerCard == AICard) {
      // Do nothing
    } else {
      if (PlayerCard > AICard) {
        // Player wins
        // Move both cards to the player's deck
        console.log('Player wins!');
        PlayerCardCount = this.GetCardCount(this.state.PlayerDeck);
        for (count = 0; count < BankCardCount; count++) {
          this.state.PlayerDeck[PlayerCardCount] = this.state.PlayerBank[count];
          this.state.PlayerBank[count] = null;
          PlayerCardCount++;// This 3rd line prevents the 1st from overwriting the same entry
        }
        for (count = 0; count < BankCardCount; count++) {
          this.state.PlayerDeck[PlayerCardCount] = this.state.AIBank[count];
          this.state.AIBank[count] = null;
          PlayerCardCount++;
        }
        // Check AI deck
        AICardCount = this.GetCardCount(this.state.AIDeck);
        if (AICardCount == 0) {
          this.setState({AppMode: 'PlayerWin'});
        }
      } else {
        // AI wins!
        // Move both cards to the AI's deck
        console.log('AI wins!');
        AICardCount = this.GetCardCount(this.state.AIDeck);
        for (count = 0; count < BankCardCount; count++) {
          this.state.AIDeck[AICardCount] = this.state.AIBank[count];
          this.state.AIBank[count] = null;
          AICardCount++;// This 3rd line prevents the 1st from overwriting the same entry
        }
        for (count = 0; count < BankCardCount; count++) {
          this.state.AIDeck[AICardCount] = this.state.PlayerBank[count];
          this.state.PlayerBank[count] = null;
          AICardCount++;
        }
        // Check player deck
        AICardCount = this.GetCardCount(this.state.PlayerDeck);
        if (AICardCount == 0) {
          this.setState({AppMode: 'AIWin'});
        }
      }
    }
  }

  componentDidUpdate() {
    // Updates the canvas and makes it render card images
    let TableCtx = this.refs.TableCanvas.getContext("2d");
    let count;

    TableCtx.fillStyle = "green";
    TableCtx.fillRect(0, 0, 500, 500);

    // Draw current scene
    // 1) Player and AI decks
    let CardsInDeck = Math.floor(this.GetCardCount(this.state.AIDeck) / 13);
    TableCtx.drawImage(this.refs.CardCover, CardsInDeck * 70, 0, 70, 96, 50, 30, 70, 96);

    // 2) Banks
    let CardsInBank = this.GetCardCount(this.state.PlayerBank);
    console.log('Cards in player bank: ' + CardsInBank);

    // Player's bank
    let bc_x = 300;
    let bc_y = 200;

    for (count = 0; count < CardsInBank; count++) {
      if (count % 4 == 0) {
        this.draw_card(this.state.PlayerBank[count], bc_x, bc_y);
        this.draw_card(this.state.AIBank[count], bc_x - 200, bc_y);
      } else {
        this.draw_card(-1, bc_x, bc_y);
        this.draw_card(-1, bc_x - 200, bc_y);
      }
      bc_x += 16;
      bc_y += 16;
    }
  }

  draw_card(CardNumber, DestinationX, DestinationY) {
    let TableCtx = this.refs.TableCanvas.getContext("2d");

    if (CardNumber == -1) {
      TableCtx.drawImage(this.refs.CardCover, 6, 0, 64, 96, DestinationX, DestinationY, 64, 96);
    } else {
      // Size of a single card image: 64 * 96
      let SourceX = (CardNumber % 13) * 64;
      let SourceY = Math.floor(CardNumber / 13) * 96;

      TableCtx.drawImage(this.refs.CardDeckImage, SourceX, SourceY, 64, 96, DestinationX, DestinationY, 64, 96);
    }
  }

  BtnOnMoveClick = event => {
    // Anonymous function for the MoveCount state's event handling
    this.DoOneMove();
    this.setState({MoveCount: this.state.MoveCount + 1});
  }

  render = () => {
    let BtnText = "Move";
    switch (this.state.MoveState) {
      case "EndMove":
        // Someone will win; find out who
        let BankCardCount = this.GetCardCount(this.state.PlayerBank);
        let PlayerCard = this.state.PlayerBank[BankCardCount - 1] % 13;
        let AICard = this.state.AIBank[BankCardCount - 1] % 13;
        if (PlayerCard > AICard) {
          BtnText = "PLAYER WINS!";
        } else {
          BtnText = "AI WINS!";
        }
        break;
      case "Equality":
        BtnText = "WAR! - next step";
        break;
      default:
        BtnText = "Move";
        break;
    }

    let AICardCount = this.GetCardCount(this.state.AIDeck);
    let PlayerCardCount = this.GetCardCount(this.state.PlayerDeck);

    return (
      <div className="CardTable">
        <div className="CardTableHeader">
          <div className="HeaderText"> AI ({AICardCount}) </div>

          <button
            className="WarGameButton HeaderText"
            onClick={this.StartNewGame}
          >
            {" "}
            New game{" "}
          </button>

          <div className="HeaderText"> Player ({PlayerCardCount}) </div>
        </div>
        <div className="CardTableMainArea">
          <canvas
            ref="TableCanvas"
            className="TableCanvas"
            width={500}
            height={500}
          />
        </div>
        <div className="CardTableFooter">
          {this.state.AppMode = "Game"
            ? (
              <button className="WarGameButton" onClick={this.BtnOnMoveClick.bind(this)}>
                {" "}
                {BtnText}{" "}
              </button>
            )
            : (
              this.state.AppMode
            )
          }
        </div>

        <img
          ref="CardDeckImage"
          className="HiddenImage"
          src={CardDeckImage}
          alt="deck"
        />
        <img
          ref="CardCover"
          className="HiddenImage"
          src={CardCover}
          alt="deck"
        />
      </div>
    );
  }
}

export default WarGame;