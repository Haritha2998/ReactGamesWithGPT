import { useEffect, useRef } from 'react';
import './App.css';
import { Link } from 'react-router-dom';

function App() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.beginPath();
    context.lineWidth = 2;
    context.strokeStyle = 'white';
    context.moveTo(210, 40);
    context.lineTo(210, 100);
    context.moveTo(210, 40);
    context.lineTo(250, 40);
    context.lineTo(250, 60);
    context.stroke();

    // Draw a red-filled circle
    context.beginPath();
    context.arc(250, 80, 25, 0, 2 * Math.PI);
    context.fillStyle = 'red';
    context.fill();
    context.stroke();

    // Draw 'x' as eyes
    context.font = 'bold 14px Arial';
    context.fillStyle = 'white';
    context.fillText('X', 255, 80);
    context.fillText('X', 235, 80);

    // Draw an inverted curve for the mouth
    context.beginPath();
    context.arc(250, 95, 10, 0, Math.PI, true); // Clockwise arc
    context.stroke();

  }, []);
  const handleClick = (e) => {

  };

  return (
    <div className="App">
      <Link to="/tictactoe" onClick={handleClick} className='link'>
        <div className='headerContainer'>
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
      </Link>
      <Link to="/hangman" onClick={handleClick} className='link'>
        <div className='headerContainer'>
            <canvas ref={canvasRef} width={300} height={300} />;
            <h2 className='header'>Hangman</h2>
        </div>
      </Link>
    </div>
  );
}

export default App;
