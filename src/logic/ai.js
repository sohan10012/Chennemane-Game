import { getLegalMoves, executeMove, checkWin, DIRECTIONS, PLAYERS, getNextIndex, getOppositeIndex, TOTAL_HOLES, PLAYER_2_RANGE } from './gameRules';

export const DIFFICULTY = {
    EASY: 'EASY',
    MEDIUM: 'MEDIUM',
    HARD: 'HARD',
};

// Helper: Simulate a move and return the heuristic score
const evaluateMove = (board, startIndex, direction, player) => {
    try {
        const result = executeMove(board, startIndex, direction, player, 0);
        let score = result.capturedSeeds * 10;

        // Bonus for staying in turn (Double Saada possible)
        if (!result.turnEnded) score += 20;

        // Penalty if next turn leaves us vulnerable? (Keep it simple for proper 'Medium')

        return score;
    } catch (e) {
        return -1000;
    }
};

export const getBestMove = (board, difficulty = DIFFICULTY.MEDIUM) => {
    const legalMoves = getLegalMoves(board, PLAYERS.P2);
    if (legalMoves.length === 0) return null;

    // EASY: Random
    if (difficulty === DIFFICULTY.EASY) {
        const randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
        const randomDir = Math.random() > 0.5 ? DIRECTIONS.CLOCKWISE : DIRECTIONS.ANTI_CLOCKWISE;
        return { index: randomMove, direction: randomDir };
    }

    // MEDIUM: Greedy (Maximize seeds captured in immediate turn)
    let bestMove = null;
    let maxScore = -Infinity;

    // Check both directions for all holes
    legalMoves.forEach(index => {
        [DIRECTIONS.CLOCKWISE, DIRECTIONS.ANTI_CLOCKWISE].forEach(dir => {
            const score = evaluateMove(board, index, dir, PLAYERS.P2);
            // Add small random tie-breaker to avoid repetitive patterns
            const finalScore = score + Math.random();

            if (finalScore > maxScore) {
                maxScore = finalScore;
                bestMove = { index, direction: dir };
            }
        });
    });

    return bestMove || { index: legalMoves[0], direction: DIRECTIONS.CLOCKWISE };
};
