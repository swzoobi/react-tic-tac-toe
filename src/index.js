import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/*
    //对于只有render函数的组件，也不包含state，可改写成函数组件

class Square extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            value: null
        }
    }

    render() {
      return (
        <button className="square" 
            onClick={() => {this.props.onClick()}}>
          {this.props.value}
        </button>
      );
    }
  } */

  function Square(props){
    
      return (
        <button className="square" 
            onClick={props.onClick}>
            {props.value}
        </button>
      )
  }
  
  class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square key={i}
              value={this.props.squares[i]}
              onClick={() => this.props.onClick(i)}
            />
          );
    }
  
    render() {

      let position = this.props.position;
      let squares = position.map( (p,i) =>{
        let square  = p.map((item,j) => {
          return(
            this.renderSquare(3*i+j)
          )
        })

        return (
          <div className="board-row" key={i}>
            {square}
          </div>
        )
      })

  
      return (
        <div>
          {squares}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        position:[
          [0,1,2],
          [3,4,5],
          [6,7,8]
        ],
        history:[
          {
            squares:new Array(9).fill(null),
            row: null,
            col: null
          }
        ],
        xIsNext:true,
        stepNumber: 0,
      }
    }

    handleClick(i){
      const position = this.state.position;
      let curRow,curCol;
      for(let r = 0;r < position.length;r++){
        let col = position[r];
        for(let c = 0;c < col.length; c++){
          if(i === col[c]){
            curRow = r;
            curCol = c;
          }
        }
      }

      const history = this.state.history.slice(0,this.state.stepNumber+1);//历史记录
      const current = history[history.length - 1];
      const squares = current.squares.slice()

      if(this.getWinner(squares) || squares[i] ) return; //有获胜方 或者 当前格子已经落子

      squares[i] = this.state.xIsNext? 'X' : "O";

      this.setState({
          history:history.concat([{
            squares:squares,
            row: curRow,
            col: curCol
          }]),
          stepNumber: history.length,
          xIsNext: !this.state.xIsNext
      })

    }


    getWinner(squares){
      let winLine = [
          [0,1,2],// 第一行
          [3,4,5],// 第二行
          [6,7,8],// 第三行
          [0,3,6],// 第一列
          [1,4,7],// 第二列
          [2,5,8],// 第三列
          [0,4,8],// 左上到右下
          [2,4,6] // 右上到左下
      ]
      for(let l = 0; l < winLine.length; l++){
          let [a,b,c] = winLine[l];
          if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
              return squares[a];
          }
          
      }
      return null;

    }

    jumpTo(step){
      this.setState({
        stepNumber: step,
        xIsNext: (step%2) === 0
      })
    }



    render() {
      const {history,stepNumber} = this.state;
      const current = history[this.state.stepNumber] //当前步骤
      const winner = this.getWinner(current.squares);

      // 历史记录按钮

      const moves = history.map( (step, move) => {
        let desc = move === 0?
                  'move to start' :
                  'move to #' + move + ' (' + step.row + ',' + step.col + ')';
        let btnStyle = move === stepNumber? 'active' : ''

        return (
          <li key={move}>
            <button className={btnStyle} onClick={ () => {this.jumpTo(move)}}>{desc}</button>
          </li>
        )
      })
      
      let status ;
      if(winner){
        status =  'Winner is: ' + winner;
      }else if(stepNumber !== 9){
        status = 'Next player is: ' + (this.state.xIsNext?'X':'O')
      }else{
        status = 'No Winner'
      }
      
      return (
        <div className="game">
          <div className="game-board">
            <Board 
              position={this.state.position}
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  