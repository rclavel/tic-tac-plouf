import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={i}
      />
    );
  }

  createToto() {
    return [0, 1, 2].map((i) => {
      const toto2 = [0, 1, 2].map((j) => {
        return this.renderSquare((i * 3 + j))
      })
      return (
        <div className="board-row" key={i}>
          {toto2}
        </div>
      )
    });
  }

  render() {
    return (
      <div>
        { this.createToto() }
      </div>
    );
  }
}

class HistoryLine extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <li>
        <button onClick={() => this.props.onClick(this.props.i)}>
          {`Rollback ${this.props.i} moves`}
        </button>
      </li>
    );
  }
}

function History(props) {
  const historyLines = props.history.slice(1).map((step, index) => {
    return <HistoryLine onClick={props.onClick} i={index + 1} key={index} />
  })

  return <ol>{historyLines}</ol>;
}

class TheGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
    };
  }

  handleClick(i) {
    const squares = this.state.history[0].squares.slice();

    if (findWinner(squares) || squares[i]) return;
    squares[i] = this.state.xIsNext ? 'X' : 'M';
    this.setState({
      history: [{ squares: squares }].concat(this.state.history),
      xIsNext: !this.state.xIsNext,
    });
  }

  timeTravel(i) {
    this.setState({
      history: this.state.history.slice(i),
      xIsNext: i % 2 ? !this.state.xIsNext : this.state.xIsNext,
    });
  }

  render() {
    const winner = findWinner(this.state.history[0].squares);
    const status = winner ? `WHO WON?! >>${winner}<<` : `Next noob: ${this.state.xIsNext ? 'X' : 'M'}`;

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={this.state.history[0].squares}
            xIsNext={this.state.xIsNext}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
          <History history={this.state.history} onClick={(i) => this.timeTravel(i)} />
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <TheGame />,
  document.getElementById('root')
);

function findWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  let playable = squares.some((square) => {
    return square === null
  });
  console.log(playable)
  return playable ? null : 'NO ONE';
}