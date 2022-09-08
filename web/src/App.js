import { useEffect, useState } from 'react';
import './App.css';
import useGameStateSocket from './hooks/useGameStateSocket';
import Empty from './views/Empty';
import GameState from './views/Game';


function App() {
  const hostname = window.location.hostname;
  const gameState = useGameStateSocket(`ws://${hostname}:8080`);
  const view = gameState != null ? <GameState gameState={gameState} /> : <Empty />;

  return (
    <div className="App">
      {view}
    </div>
  );
}

export default App;
