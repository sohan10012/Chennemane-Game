import React, { useState, useEffect } from 'react';
import { useGameState } from '../hooks/useGameState';
import Pit from './Pit';
import { PLAYERS, DIRECTIONS } from '../logic/gameRules';
import { motion } from 'framer-motion';

const Board = ({ initialMode = 'PVC', onBack }) => {
    const { state, initGame, makeMove, setupRematch } = useGameState();
    const [selectedDirection, setSelectedDirection] = useState(DIRECTIONS.CLOCKWISE);
    const [hasInitialized, setHasInitialized] = useState(false);

    useEffect(() => {
        if (!hasInitialized) {
            initGame({ seeds: 4, mode: initialMode });
            setHasInitialized(true);
        }
    }, [initialMode, initGame, hasInitialized]);

    const handlePitClick = (index) => {
        const isP1Hole = index >= 0 && index <= 6;
        const isP2Hole = index >= 7 && index <= 13;

        if (state.currentPlayer === PLAYERS.P1 && !isP1Hole) return;
        if (state.currentPlayer === PLAYERS.P2 && !isP2Hole) return;
        if (state.board[index] === 0) return;

        makeMove(index, selectedDirection);
    };

    if (!state.board.length) return <div className="text-white">Loading...</div>;

    const bottomRow = state.board.slice(0, 7);
    const topRow = state.board.slice(7, 14).reverse();

    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-5xl px-2">
            {/* CONTROLS HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-center w-full px-4 md:px-8 py-4 bg-stone-900/80 rounded-2xl backdrop-blur-md border border-amber-900/30 shadow-2xl gap-4 sticky top-4 z-50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
                        title="Back to Home"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent font-serif tracking-wider">
                            ALI GULI MANE
                        </h1>
                        <p className="text-[10px] text-stone-500 font-mono tracking-widest uppercase">
                            {state.gameMode === 'PVC' ? 'VS COMPUTER' : '2 PLAYER MODE'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* "New Game" goes back Home as requested */}
                    <button
                        onClick={onBack}
                        className="px-5 py-2 bg-stone-700 hover:bg-stone-600 active:scale-95 text-amber-100 rounded-lg font-bold transition-all shadow-lg border border-stone-600 uppercase text-xs tracking-wider"
                    >
                        New Game
                    </button>

                    {/* Direction Toggle */}
                    <div className="flex items-center gap-1 bg-black/40 p-1.5 rounded-lg border border-stone-700/50">
                        <button
                            onClick={() => setSelectedDirection(DIRECTIONS.CLOCKWISE)}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${selectedDirection === DIRECTIONS.CLOCKWISE ? 'bg-amber-600 text-white shadow-lg' : 'text-stone-500 hover:text-stone-300'}`}
                            title="Clockwise"
                        >
                            ↻ CW
                        </button>
                        <button
                            onClick={() => setSelectedDirection(DIRECTIONS.ANTI_CLOCKWISE)}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${selectedDirection === DIRECTIONS.ANTI_CLOCKWISE ? 'bg-amber-600 text-white shadow-lg' : 'text-stone-500 hover:text-stone-300'}`}
                            title="Anti-Clockwise"
                        >
                            ↺ ACW
                        </button>
                    </div>
                </div>
            </div>

            {/* SCORE HUD */}
            <div className="flex justify-between w-full max-w-4xl px-4 md:px-12 mt-2">
                <div className={`relative group flex flex-col items-center p-3 md:p-5 rounded-2xl transition-all duration-300 ${state.currentPlayer === PLAYERS.P2 ? 'bg-stone-800/80 border-2 border-amber-500/30' : 'opacity-50 grayscale'}`}>
                    {state.currentPlayer === PLAYERS.P2 && <div className="absolute -top-3 px-3 py-1 bg-amber-600 text-[10px] font-bold text-white rounded-full shadow-lg">PLAYING</div>}
                    <span className="text-[10px] md:text-xs font-bold text-amber-200/40 tracking-widest mb-1">{state.gameMode === 'PVP' ? 'PLAYER 2' : 'COMPUTER'}</span>
                    <span className="text-4xl md:text-6xl font-black text-stone-200 font-mono">{state.scores[PLAYERS.P2]}</span>
                </div>

                <div className="flex flex-col items-center justify-center">
                    {state.gameStatus === 'ENDED' && (
                        // Modal Overlay for Game End
                        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                className="bg-stone-900 border border-stone-700/50 p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-6 max-w-sm w-full relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />

                                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-600">GAME OVER</h2>

                                <div className="text-xl font-bold text-stone-200 text-center font-serif">
                                    {state.scores[PLAYERS.P1] > state.scores[PLAYERS.P2] ? '🏆 YOU WIN!' : (state.scores[PLAYERS.P2] > state.scores[PLAYERS.P1] ? '💀 YOU LOST!' : '🤝 DRAW!')}
                                </div>

                                <div className="flex gap-8 w-full justify-center py-4 border-y border-white/5">
                                    <div className="flex flex-col items-center">
                                        <span className="text-[10px] text-stone-500 uppercase tracking-widest">You</span>
                                        <span className="font-bold text-3xl text-amber-400">{state.scores[PLAYERS.P1]}</span>
                                    </div>
                                    <div className="h-full w-[1px] bg-white/10" />
                                    <div className="flex flex-col items-center">
                                        <span className="text-[10px] text-stone-500 uppercase tracking-widest">Opponent</span>
                                        <span className="font-bold text-3xl text-stone-400">{state.scores[PLAYERS.P2]}</span>
                                    </div>
                                </div>

                                <div className="flex gap-3 w-full">
                                    <button
                                        onClick={onBack}
                                        className="flex-1 py-3 rounded-xl bg-stone-800 text-stone-400 font-bold hover:bg-stone-700 hover:text-white transition-all uppercase text-xs tracking-wider border border-stone-700"
                                    >
                                        Home
                                    </button>
                                    <button
                                        onClick={setupRematch}
                                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-700 to-yellow-600 text-white font-bold hover:scale-105 transition-transform shadow-lg uppercase text-xs tracking-wider"
                                    >
                                        Rematch
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    <div className="hidden md:flex flex-col items-center gap-2">
                        <div className="w-[1px] h-12 bg-white/10" />
                        <span className="text-[10px] text-stone-600 font-mono">VS</span>
                        <div className="w-[1px] h-12 bg-white/10" />
                    </div>
                </div>

                <div className={`relative group flex flex-col items-center p-3 md:p-5 rounded-2xl transition-all duration-300 ${state.currentPlayer === PLAYERS.P1 ? 'bg-stone-800/80 border-2 border-amber-500/30' : 'opacity-50 grayscale'}`}>
                    {state.currentPlayer === PLAYERS.P1 && <div className="absolute -top-3 px-3 py-1 bg-amber-600 text-[10px] font-bold text-white rounded-full shadow-lg">YOUR TURN</div>}
                    <span className="text-[10px] md:text-xs font-bold text-amber-200/40 tracking-widest mb-1">{state.gameMode === 'PVP' ? 'PLAYER 1' : 'YOU'}</span>
                    <span className="text-4xl md:text-6xl font-black text-amber-400 font-mono">{state.scores[PLAYERS.P1]}</span>
                </div>
            </div>

            {/* INTERACTION HINT */}
            {state.currentPlayer === PLAYERS.P1 && state.gameStatus === 'PLAYING' && !state.isAnimating && (
                <motion.div
                    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-amber-500/80 text-xs font-bold animate-pulse"
                >
                    <span>👇</span> Choose a pit from the bottom row
                </motion.div>
            )}

            {/* GAME BOARD */}
            <div className="relative p-6 md:p-10 rounded-[3rem] shadow-2xl bg-[#3E2723] border-[8px] border-[#251613] shadow-[0_20px_50px_rgba(0,0,0,0.5)] mx-4">
                {/* Wood Texture Overlay */}
                <div className="absolute inset-0 rounded-[2.5rem] opacity-30 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] bg-repeat mix-blend-soft-light"></div>
                <div className="absolute inset-0 rounded-[2.5rem] shadow-[inset_0_0_80px_rgba(0,0,0,0.6)] pointer-events-none" />

                <div className="gap-6 flex flex-col relative z-10 w-full overflow-x-auto pb-6 md:pb-0 px-4 scrollbar-hide">
                    {/* TOP ROW (P2) */}
                    <div className="flex gap-3 md:gap-5 justify-center min-w-max">
                        {topRow.map((seeds, i) => {
                            const originalIndex = 13 - i;
                            return (
                                <Pit
                                    key={originalIndex}
                                    index={originalIndex}
                                    seeds={seeds}
                                    owner={PLAYERS.P2}
                                    isPlayable={state.gameMode === 'PVP' ? (state.currentPlayer === PLAYERS.P2 && state.gameStatus === 'PLAYING') : false}
                                    onClick={() => handlePitClick(originalIndex)}
                                    justSown={state.lastSownIndex === originalIndex}
                                    isHighlighted={state.currentPlayer === PLAYERS.P2 && state.gameMode === 'PVP'}
                                />
                            );
                        })}
                    </div>

                    {/* MIDDLE GUTTER */}
                    <div className="h-4 md:h-6 bg-black/40 rounded-full mx-4 md:mx-12 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] flex items-center justify-center">
                        <div className="w-1/3 h-[1px] bg-white/5"></div>
                    </div>

                    {/* BOTTOM ROW (P1) */}
                    <div className="flex gap-3 md:gap-5 justify-center min-w-max">
                        {bottomRow.map((seeds, originalIndex) => (
                            <Pit
                                key={originalIndex}
                                index={originalIndex}
                                seeds={seeds}
                                owner={PLAYERS.P1}
                                isPlayable={state.currentPlayer === PLAYERS.P1 && state.gameStatus === 'PLAYING'}
                                onClick={() => handlePitClick(originalIndex)}
                                isHighlighted={state.currentPlayer === PLAYERS.P1 && seeds > 0}
                                justSown={state.lastSownIndex === originalIndex}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Board;
