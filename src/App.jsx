import React, { useState } from 'react';
import Board from './components/Board';
import Home from './components/Home';

function App() {
  const [view, setView] = useState('HOME');
  const [gameMode, setGameMode] = useState('PVC');

  const handleStartGame = (mode) => {
    setGameMode(mode);
    setView('GAME');
  };

  const handleBack = () => {
    setView('HOME');
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 bg-stone-950 font-sans text-stone-200 overflow-hidden">
      {view === 'HOME' ? (
        <Home onStart={handleStartGame} />
      ) : (
        <main className="w-full h-full flex justify-center">
          <Board initialMode={gameMode} onBack={handleBack} />
        </main>
      )}

      {view === 'GAME' && (
        <footer className="mt-8 text-stone-600 text-xs text-center font-mono absolute bottom-4">
          © 2024 Ali Guli Mane • Built by Sohan
        </footer>
      )}
    </div>
  );
}

export default App;
