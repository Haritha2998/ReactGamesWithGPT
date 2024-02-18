import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import TicTacToe from './Pages/TicTacToe';
import Hangman from './Pages/Hangman';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
    <Route path="/" element={<App />} />
        <Route path="/tictactoe" element={<TicTacToe />} />
        <Route path="/hangman" element={<Hangman/>} />
    </Routes>
  </BrowserRouter>

);

