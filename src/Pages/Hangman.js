import React, { useEffect, useRef, useState } from "react";
import { faLightbulb } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../Style/Hangman.css';
export default function Hangman() {
    const canvasRef = useRef(null);
    const [word, setWord] = useState("HANGMAN");
    const [selectedLetters, setSelectedLetters] = useState([]);
    const [inCorrectAttempts, setIncorrectAttempts] = useState(0);
    const [hint1Visible, setHint1Visible] = useState(false);
    const [hint2Visible, setHint2Visible] = useState(false);
    const [guess, setGuess] = useState([]);
    const [isGameOver, setIsGameOver] = useState(null);
    const [category, setCategory] = useState('');
    const alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const attempts = 6;
    const hangmanParts = [{
        'attempt': 1,
        'draw': () => drawCircle(),
    }, {
        'attempt': 2,
        'draw': () => drawBody(),
    }, {
        'attempt': 3,
        'draw': () => drawLeftArm()
    }, {
        'attempt': 4,
        'draw': () => drawRightArm()
    }, {
        'attempt': 5,
        'draw': () => drawLeftLeg()
    }, {
        'attempt': 6,
        'draw': () => drawRightLeg()
    }]
    const headRadiusRatio = 0.12;
    const torsoHeightRatio = 0.15;
    const legLengthRatio = 0.6;
    const poleWidthRatio = 0.2;
    const poleHeightRatio = 1;
    const poleTopOffsetRatio = 0.4;
    useEffect(() => {
        getWord();
        drawPole();
    }, [])

    const getWord = () => {
        fetch("https://www.wordgamedb.com/api/v1/words/random")
            .then(response => response.json())
            .then(data => {
                console.log("word", data);
                setWord(data.word.toUpperCase())
                // setHint(data.hint);
                setGuess(Array(data.word.length).fill(""));
            })
    }
    const restartGame = () => {
        getWord();
        drawPole();
        setSelectedLetters([]);
        setIncorrectAttempts(0);
        setGuess([]);
        setIsGameOver(null);
    }

    const drawCircle = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const radius = canvas.height * headRadiusRatio;
        const bodyYStart = canvas.height / 2 + radius / 2;
        let currentAngle = 0;
        let requestIdCircle = null;

        const animateCircle = () => {

            ctx.beginPath();
            ctx.arc(canvas.width / 2.3, bodyYStart - radius, radius, 0, currentAngle);
            ctx.lineWidth = 10;
            ctx.strokeStyle = 'black';
            ctx.stroke();
            ctx.fillStyle = '#D2B48C'
            ctx.fill();
            ctx.font = 'bold 14px Arial';
            ctx.fillStyle = 'black';
            ctx.fillText('O', canvas.width / 2.3 - radius * 0.3, bodyYStart - radius * 1.2);
            ctx.fillText('O', canvas.width / 2.3, bodyYStart - radius * 1.2);
            currentAngle += 0.1;

            if (currentAngle > Math.PI * 2 + 2) {
                cancelAnimationFrame(requestIdCircle);
            } else {
                requestIdCircle = requestAnimationFrame(animateCircle);
            }
        };

        requestIdCircle = requestAnimationFrame(animateCircle);
    };

    const drawBodyPart = (ctx, x1, y1, x2, y2, height) => {
        let currentHeight = 0;
        let requestId = null;

        const drawPart = () => {
            ctx.beginPath();
            ctx.lineWidth = 60;
            ctx.strokeStyle = '#2E4053'
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2 + currentHeight);
            ctx.stroke();
            currentHeight += 1;

            if (currentHeight > height) {
                cancelAnimationFrame(requestId);
            } else {
                requestId = requestAnimationFrame(drawPart);
            }
        };

        requestId = requestAnimationFrame(drawPart);
    };

    const drawLimbs = (ctx, x1, y1, x2, y2, side) => {
        let currentHeight = 0;
        let currentWidth = 0;
        let requestId = null;
        const drawPart = () => {
            ctx.beginPath();
            ctx.lineWidth = 20;
            ctx.strokeStyle = '#D2B48C';
            ctx.moveTo(x1, y1);
            if (side == 'left') {
                ctx.lineTo(x1 - currentHeight, y1);
                ctx.stroke();
                currentHeight += 1;
                if (x1 - currentHeight < x2) {
                    ctx.arc(x2, y2, 10, 0, Math.PI * 2);
                    ctx.stroke();
                    cancelAnimationFrame(requestId);

                } else {
                    requestId = requestAnimationFrame(drawPart);
                }
            }
            else if (side == 'right') {
                ctx.lineTo(x1 + currentHeight, y1);
                ctx.stroke();
                currentHeight += 1;
                if (x1 + currentHeight > x2) {
                    ctx.arc(x2, y2, 10, 0, Math.PI * 2);
                    ctx.stroke();
                    cancelAnimationFrame(requestId);
                } else {
                    requestId = requestAnimationFrame(drawPart);
                }
            }
            else if (side == 'leftLeg') {
                ctx.strokeStyle = '#FFA07A';

                ctx.lineTo(x1, y1 + currentHeight);
                ctx.stroke();
                currentHeight += 1;
                if (y1 + currentHeight > y2) {
                    console.log("Left leg", x2, y2)
                    ctx.arc(x2 - 30, y2 + 24, 12, 0, Math.PI * 2);
                    ctx.stroke();
                    cancelAnimationFrame(requestId);
                } else {
                    requestId = requestAnimationFrame(drawPart);
                }
            }
            else {
                ctx.strokeStyle = '#FFA07A';

                ctx.lineTo(x1, y1 + currentHeight);
                ctx.stroke();
                currentHeight += 1;
                if (y1 + currentHeight > y2 + 10) {
                    console.log("Right leg", x2, y2)
                    ctx.arc(x2 + 9, y2 + 20, 12, 0, Math.PI * 2);
                    ctx.stroke();
                    cancelAnimationFrame(requestId);
                } else {
                    requestId = requestAnimationFrame(drawPart);
                }
            }

        };

        requestId = requestAnimationFrame(drawPart);
    };

    const drawBody = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const bodyYStart = canvas.height / 2 + canvas.height * 0.5 * headRadiusRatio;
        drawBodyPart(ctx, canvas.width / 2.3, bodyYStart, canvas.width / 2.3, bodyYStart + canvas.height / 2 * torsoHeightRatio, 80);
    }

    const drawLeftArm = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const bodyYStart = canvas.height / 2 + canvas.height * headRadiusRatio;
        const armY = bodyYStart + canvas.height * torsoHeightRatio / 4;

        drawLimbs(ctx, canvas.width / 2.8, armY, canvas.height / 3 - canvas.width / 3,
            armY, 'left');
    };

    const drawRightArm = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const bodyYStart = canvas.height / 2 + canvas.height * headRadiusRatio;
        const armY = bodyYStart + canvas.height * torsoHeightRatio / 4;
        drawLimbs(ctx, canvas.width / 1.97, armY, canvas.height / 4 + canvas.width / 3,
            armY, 'right');
    };

    const drawLeftLeg = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const bodyYStart = canvas.height / 2 + canvas.height * headRadiusRatio;
        const legLength = canvas.height / 8 * legLengthRatio;
        drawLimbs(ctx, canvas.width / 2.6, bodyYStart + canvas.height * torsoHeightRatio, canvas.width / 2.3,
            bodyYStart + canvas.height * torsoHeightRatio + legLength, 'leftLeg');
    };

    const drawRightLeg = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const bodyYStart = canvas.height / 2 + canvas.height * headRadiusRatio;
        const legLength = canvas.height / 7.8 * legLengthRatio;
        console.log("Leg", canvas.width / 2.6, bodyYStart + canvas.height / 2 * torsoHeightRatio, legLength)

        drawLimbs(ctx, canvas.width / 2.1, bodyYStart + canvas.height * torsoHeightRatio, canvas.width / 2.1, bodyYStart + canvas.height * torsoHeightRatio + legLength, 'rightLeg');
    };

    const drawPole = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const radius = canvas.height / 8;
        const poleWidth = canvas.width * 3 * poleWidthRatio;
        const poleHeight = canvas.height * poleHeightRatio;
        const poleTopY = canvas.height * poleTopOffsetRatio;
        ctx.lineWidth = 10;
        ctx.strokeStyle = "Sienna";
        // drawBodyPart(ctx, canvas.width / 2 - 3*radius, canvas.height / 4 - 3* radius, canvas.width / 2 - 3*radius, canvas.height / 2 + 3*radius, 100);
        ctx.beginPath();
        console.log("pole", canvas.width / 3 - poleWidth / 2, poleTopY * 0.3, canvas.width / 3 - poleWidth / 2, poleTopY + poleHeight)
        ctx.moveTo(canvas.width / 3 - poleWidth / 2, poleTopY * 0.3);
        ctx.lineTo(canvas.width / 3 - poleWidth / 2, poleTopY + poleHeight);
        ctx.moveTo(canvas.width / 3 - poleWidth / 2, poleHeight - poleTopY * 1.8);
        ctx.lineTo(canvas.width / 8 + poleWidth / 2, poleTopY * 0.3);
        ctx.lineTo(canvas.width / 8 + poleWidth / 2, poleTopY * 0.7);
        ctx.font = 'bold 100px Arial';
        ctx.fillStyle = '#8B4513';
        ctx.fillText('O', canvas.width / 6 + poleWidth / 3.7, poleTopY * 0.99);
        ctx.moveTo(canvas.width / 3 + poleWidth / 2, poleTopY * 0.3);
        ctx.lineTo(canvas.width / 3 - poleWidth / 2, poleTopY * 0.3);
        ctx.stroke();
    }

    const handleAlphaClick = (item) => {
        if (!selectedLetters.includes(item) && inCorrectAttempts < attempts) {
            setSelectedLetters([...selectedLetters, item]);
            if (!word.includes(item)) {
                const icattempts = inCorrectAttempts + 1;
                setIncorrectAttempts(icattempts);
                hangmanParts.find((part) => part.attempt === icattempts).draw();
                if (icattempts == attempts) {
                    setIsGameOver('fail');
                }

            }
            else {
                const tempGuess = guess;
                console.log(tempGuess);
                word.split('').map((letter, index) => letter == item ? tempGuess[index] = letter : null);
                setGuess(tempGuess);
                if (!tempGuess.includes("")) {
                    setIsGameOver('won');
                }
            }
        }
    }

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    }

    const toggleHint1 = () => {
        setHint1Visible(!hint1Visible);
    };

    const toggleHint2 = () => {
        setHint2Visible(!hint2Visible);
    };

    const renderAlphabets = (item, index) => <div key={index}
        className="alphabet" onClick={() => handleAlphaClick(item)}  >
        <p style={{
            color: selectedLetters.includes(item) ? word.includes(item) ? 'red' : 'grey' : 'black',
            textDecoration: selectedLetters.includes(item) && !word.includes(item) ? 'line-through' : 'none',
        }}> {item} </p>
    </div>

    const renderWord = (item, index) => <div key={index} className="letter-container">
        <div className={`underline ${!selectedLetters.includes(item) && 'noItem'}`}> {selectedLetters.includes(item) ? item : '  '}</div>
    </div>

    return (
        <div className="viewContainer">
            <div className='headerContainer' >
                <h1 className='header'>Hangman</h1>
            </div>
            <div>
                <h2 className="instructionTitle">Instructions</h2>
                <p className="instructions">Welcome to Hangman!</p>
                <ul>
                    <li className="instructions">Guess the hidden word by suggesting letters.</li>
                    <li className="instructions">You have a limited number of incorrect guesses before the hangman is fully drawn.</li>
                    <li className="instructions">If you guess the word correctly before the hangman is fully drawn, you win!</li>
                    <li className="instructions">If the hangman is fully drawn before you guess the word, you lose.</li>
                </ul>
                <p className="instructions">Good luck!</p>
                <div style={{ display: 'flex', flexDirection: 'column' }}><input
                    className="categoryIp"
                    placeholder="Please type a category (max length 30)"
                    value={category}
                    onChange={handleCategoryChange}
                    maxLength={30} />
                    <button className="playGame"> Start Game</button>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '95%' }}>
                <div style={{ width: '25%', alignSelf: 'flex-start' }}>
                    <canvas ref={canvasRef} width={400} height={600} />;
                </div>

                <div style={{ width: '50%', justifyContent: 'center', marginTop: '30px' }}>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', paddingInline: '16px', paddingBlock: '80px', justifyContent: 'center' }}>
                        {guess.map((item, index) => renderWord(item, index))}
                    </div>
                    <div className="container">
                        <div className="alphabet-container">
                            {alphabets.map((item, index) => renderAlphabets(item, index))}
                        </div>

                    </div>
                    <div className="restart">
                        {isGameOver && <p className="game-over-animation">{isGameOver == 'won' ? 'Congratulations! You Won!' : 'Game Over! You Lost.'}</p>}
                        <button className='playGame' onClick={() => restartGame()}>Restart</button>
                    </div>

                </div>
                {/* <div className="hintContainer"> */}
                {/* <FontAwesomeIcon icon={faLightbulb} width={30} height={30} color="balck" /> */}
                {/* <p className="clue">Confidential</p> */}
                {/* <p style={{ color: 'black', fontSize: '16px', marginInline: '26px' }}>{hint.toUpperCase()}</p> */}
                {/* </div> */}
                <div className="hintContainer">
                    <div className={`hint-sheet ${hint1Visible ? 'flipped' : ''}`} onClick={toggleHint1}>
                        <div className="front">Clue 1</div>
                        <div className="back">Hint 1: This is the first hint.</div>
                    </div>
                    <div className={`hint-sheet ${hint2Visible ? 'flipped' : ''}`} onClick={toggleHint2}>
                        <div className="front">Clue 2</div>
                        <div className="back">Hint 2: This is the second hint.</div>
                    </div>
                </div>
            </div>
            <div>


            </div>


        </div>
    )
}


