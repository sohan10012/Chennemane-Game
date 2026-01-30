import { useReducer, useCallback, useEffect, useState } from 'react';
import { initializeBoard, executeMove, checkWin, setupRematch, PLAYERS } from '../logic/gameRules';
import { getBestMove } from '../logic/ai';

const initialState = {
    board: [],
    currentPlayer: PLAYERS.P1,
    scores: { [PLAYERS.P1]: 0, [PLAYERS.P2]: 0 },
    gameStatus: 'IDLE',
    gameMode: 'PVC', // 'PVC' (Player vs Computer) or 'PVP' (Player vs Player)
    winner: null,
    lastSownIndex: null, // For highlighting
    isAnimating: false,
};

const gameReducer = (state, action) => {
    switch (action.type) {
        case 'INIT_GAME':
            return {
                ...initialState,
                board: initializeBoard(action.payload?.seeds || 4),
                gameStatus: 'PLAYING',
                gameMode: action.payload?.mode || 'PVC',
            };

        case 'SET_MODE':
            return {
                ...state,
                gameMode: action.payload
            };

        case 'UPDATE_STATE':
            return { ...state, ...action.payload };

        case 'SETUP_REMATCH': {
            const { board, p1Stored, p2Stored } = setupRematch(state.scores);
            return {
                ...initialState,
                board: board,
                scores: { [PLAYERS.P1]: p1Stored, [PLAYERS.P2]: p2Stored },
                gameStatus: 'PLAYING',
            };
        }

        default:
            return state;
    }
};

export const useGameState = () => {
    const [state, dispatch] = useReducer(gameReducer, initialState);
    const [saadasInTurn, setSaadasInTurn] = useState(0);

    const initGame = useCallback((seeds) => {
        dispatch({ type: 'INIT_GAME', payload: seeds });
        setSaadasInTurn(0);
    }, []);

    const makeMove = useCallback(async (index, direction) => {
        // Prevent moves during animation
        if (state.isAnimating) return;

        try {
            // Calculate result immediately
            const result = executeMove(state.board, index, direction, state.currentPlayer, saadasInTurn);

            // TRIGGER ANIMATION SEQUENCE
            dispatch({ type: 'UPDATE_STATE', payload: { isAnimating: true } });

            const tempBoard = [...state.board];
            const path = result.sowPath;
            const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

            for (let step of path) {
                if (step.type === 'PICK_UP') {
                    dispatch({ type: 'UPDATE_STATE', payload: { lastSownIndex: step.index } });
                    await wait(300);
                    tempBoard[step.index] = 0;
                    dispatch({ type: 'UPDATE_STATE', payload: { board: [...tempBoard] } });
                    await wait(200);
                }
                else if (step.type === 'DROP') {
                    dispatch({ type: 'UPDATE_STATE', payload: { lastSownIndex: step.index } });
                    await wait(200);
                    tempBoard[step.index] += 1;
                    dispatch({ type: 'UPDATE_STATE', payload: { board: [...tempBoard] } });
                    await wait(100);
                }
                else if (step.type === 'CAPTURE') {
                    await wait(400);
                    step.indices.forEach(idx => tempBoard[idx] = 0);
                    dispatch({ type: 'UPDATE_STATE', payload: { board: [...tempBoard] } });
                    await wait(400);
                }
                else if (step.type === 'STOP') {
                    dispatch({ type: 'UPDATE_STATE', payload: { lastSownIndex: step.index } });
                    await wait(300);
                }
            }

            const isWin = checkWin(result.board, result.nextTurn);
            let nextStatus = state.gameStatus;

            let finalScores = { ...state.scores };
            if (result.capturedSeeds > 0) {
                finalScores[state.currentPlayer] += result.capturedSeeds;
            }

            if (isWin) {
                nextStatus = 'ENDED';
                const p1Remaining = result.board.slice(0, 7).reduce((a, b) => a + b, 0);
                const p2Remaining = result.board.slice(7, 14).reduce((a, b) => a + b, 0);
                finalScores[PLAYERS.P1] += p1Remaining;
                finalScores[PLAYERS.P2] += p2Remaining;
            }

            let nextSaadas = result.saadaTriggered ? saadasInTurn + 1 : 0;
            if (result.turnEnded) nextSaadas = 0;
            setSaadasInTurn(nextSaadas);

            dispatch({
                type: 'UPDATE_STATE',
                payload: {
                    board: result.board,
                    scores: finalScores,
                    currentPlayer: result.nextTurn,
                    gameStatus: nextStatus,
                    lastSownIndex: result.endedIndex,
                    isAnimating: false
                }
            });

        } catch (e) {
            console.error(e);
            dispatch({ type: 'UPDATE_STATE', payload: { isAnimating: false } });
        }
    }, [state.board, state.currentPlayer, state.gameStatus, state.isAnimating, saadasInTurn]);

    const setupRematchAction = useCallback(() => {
        dispatch({ type: 'SETUP_REMATCH' });
        setSaadasInTurn(0);
    }, []);

    // AI
    useEffect(() => {
        if (state.gameMode === 'PVC' && state.currentPlayer === PLAYERS.P2 && state.gameStatus === 'PLAYING' && !state.isAnimating) {
            const timer = setTimeout(() => {
                const aiMove = getBestMove(state.board);
                if (aiMove) {
                    makeMove(aiMove.index, aiMove.direction);
                }
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [state.currentPlayer, state.gameStatus, state.board, makeMove, state.isAnimating, state.gameMode]);

    return {
        state,
        initGame,
        makeMove,
        setupRematch: setupRematchAction,
    };
};
