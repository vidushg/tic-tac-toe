import React from "react";
import ReactDOM from 'react-dom';
import './index.css';

function Square (props) {
    //console.log("call");
    return (
      <button
        className="square"
        onClick={props.onClick}>
        {props.value}
      </button>
    );

}

class Board extends React.Component {

  renderSquare(i){
    return (<Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    /> );
  }

  render(){
  return(

<div>
      <div className="board-row">
        {this.renderSquare(0)}
        {this.renderSquare(1)}
        {this.renderSquare(2)}
      </div>
      <div className="board-row">
        {this.renderSquare(3)}
        {this.renderSquare(4)}
        {this.renderSquare(5)}
      </div>
      <div className="board-row">
        {this.renderSquare(6)}
        {this.renderSquare(7)}
        {this.renderSquare(8)}
        </div>
    </div>
  )
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
      stepMap: new Map(),
      buttonClicked: '',
    };
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step%2)===0,
      buttonClicked: step,
    })
  }
  //i goes 0-8, 01,1,2 first row, 3,4,5 second,, 678 third

  handleClick(i){
    const history = this.state.history.slice(0,this.state.stepNumber+1);
    const current = history[history.length-1];
    const squares = current.squares.slice();
    if(calcWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext?'X':'O';
    this.setState({history:history.concat([{squares: squares,}]),
                    xIsNext: !this.state.xIsNext,
                    stepNumber: history.length,
                    stepMap: this.state.stepMap.set(this.state.stepNumber+1,{col:i%3+1, row:(Math.floor(i/3)+1)}),
                  });
    //console.log(this.state.stepMap.get(this.state.stepNumber+1).row+"at number "+this.state.stepNumber+" at size"+this.state.stepMap.size);
  }

  render(){
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calcWinner(current.squares);
    let status;
    if(winner){
      status = "winner: "+winner;
    }
    else {
      status = "Next player: "+(this.state.xIsNext?"X":"O");
    }

    const moves = history.map((step,move) => {
      console.log("loop stepmap  = "+this.state.stepMap.get(move+1));

      const str = move? "row = "+this.state.stepMap.get(move).row+" col = "+this.state.stepMap.get(move).col:"";
      const desc = move?"Move to "+move+" at "+str : "Go to start";
      return (

        <li key={move}>
          <button className={move===this.state.buttonClicked?"buttonClick":""} onClick={()=> this.jumpTo(move)}>{desc}</button>
        </li>
      );
    })

    return(
      <div className="game">
        <div className="game-info">
          <div>{status}</div>
          <div>{moves}</div>
        </div>
        <div className="game-board">
          <Board squares={current.squares}
          onClick={(i) => this.handleClick(i)}/>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calcWinner(squares){
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
  ];
  var count=0;

  for(var line of lines){
    var [a,b,c] = line;
    //console.log(++count);
    if(squares[a] && squares[a]===squares[b] && squares[a]===squares[c]){
      return squares[a];
    }

  }
}
