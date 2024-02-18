import React, { useEffect, useState } from 'react';
import '../Style/TicTacToe.css';

const TicTacToe = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXturn, setIsXTurn] = useState(null);
    const [winnerSquares, setWinnerSquares] = useState([]);

    useEffect(() => {
        const winner = calculateWinner(board);
        if (winner) {
          setWinnerSquares(winner);
        }
      }, [board]);

    const renderSquare = (index) => (
        <div key={index} className="square" onClick={() => handleClick(index)}>
            <p className={`boxText ${winnerSquares.includes(index) ? 'boxTextHighlight' :''}`}> {board[index]} </p>
        </div>
    );


    const calculateWinner = (squares) => {
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
        let hasMoreTurns = false;
        for (const [a, b, c] of lines) {
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return [a, b, c];
            }
            if (squares[a] == null || squares[b] == null || squares[c] == null) hasMoreTurns = true;
        }
        if (!hasMoreTurns) return [-1];
    
        return null;
    };

    const handleClick = (index) => {
        if (isXturn == null || board[index] || calculateWinner(board)) {
            return;
        }

        const newBoard = board.slice();
        newBoard[index] = isXturn ? 'X' : 'O';

        setBoard(newBoard);
        setIsXTurn(!isXturn);
    };

    const winner = calculateWinner(board);
    const status = winner ? `Game Over!! ${winner[0] == -1 ? `It's a draw.` : `Player ${board[winner[0]]} wins.`} `  : isXturn == null ? 'First player choose X or O' : `Player ${isXturn ? 'X' : 'O'}'s turn`;
    
    const restartGame = () => {
        setBoard(Array(9).fill(null));
        setIsXTurn(null);
        setWinnerSquares([]);
    }
    return (
        <div className='viewContainer'>
            <div className='headerContainer' >
                <div className='logo'>
                    <div className='vertical'>
                        <div className="vertical-line"></div>
                        <div className="vertical-line"></div>
                    </div>
                    <div className="horizontal">
                        <div className="horizontal-line"></div>
                        <div className="horizontal-line"></div>
                    </div>
                </div>
                <h2 className='header'>Tic Tac Toe</h2>
            </div>

            {/* <p className='description'>Please select a button to start first.</p> */}
            <div className='buttonContainer'>
                <button className={`XOButton ${isXturn == true ? 'selected' : ''}`}
                    onClick={() => setIsXTurn(true)} disabled={isXturn != null}
                > X
                </button>
                <button className={`XOButton ${isXturn == false ? 'selected' : ''}`}
                    onClick={() => setIsXTurn(false) } disabled={isXturn != null}
                > O
                </button>
            </div>
            <div>
                <p className={`status ${calculateWinner(board) && 'winnerText'}`}>{status}</p>
                <div className="board">
                    {Array.from({ length: 9 }).map((_, index) => renderSquare(index))}
                </div>
            </div>
            <button className = 'XOButton restart'  onClick={() => restartGame()}>Restart</button>
        </div>
    )
}





export default TicTacToe;