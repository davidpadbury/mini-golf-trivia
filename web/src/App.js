import { useEffect, useState } from 'react';
import './App.css';
import useGameStateSocket from './hooks/useGameStateSocket';
import Empty from './views/Empty';
import GameState from './views/Game';


function App() {
  const gameState = useGameStateSocket('ws://localhost:8080');
  const view = gameState != null ? <GameState gameState={gameState} /> : <Empty />;

  return (
    <div className="App">
      {view}
    </div>
  );
}

export default App;
