
export const TOTAL_HOLES = 14;
export const PLAYER_1_RANGE = [0, 6];
export const PLAYER_2_RANGE = [7, 13];

export const PLAYERS = {
    P1: 'P1',
    P2: 'P2',
};

export const DIRECTIONS = {
    CLOCKWISE: 'CW',
    ANTI_CLOCKWISE: 'ACW',
};

export const initializeBoard = (seedsPerHole = 4) => {
    return Array(TOTAL_HOLES).fill(seedsPerHole);
};

export const getNextIndex = (currentIndex, direction) => {
    if (direction === DIRECTIONS.CLOCKWISE) {
        return (currentIndex + 1) % TOTAL_HOLES;
    } else {
        return (currentIndex - 1 + TOTAL_HOLES) % TOTAL_HOLES;
    }
};

export const getOppositeIndex = (index) => {
    return 13 - index;
};

export const isHoleBelongsToPlayer = (index, player) => {
    if (player === PLAYERS.P1) {
        return index >= 0 && index <= 6;
    } else {
        return index >= 7 && index <= 13;
    }
};


export const executeMove = (board, startIndex, direction, currentPlayer, saadasCount = 0) => {
    // We need to support "simulation" for AI AND "step-generation" for Animation.
    // This logic runs INSTANTLY. UI will use 'sowPath' to animate.

    let newBoard = [...board];
    let captured = 0;
    let hand = newBoard[startIndex];

    if (hand === 0) {
        throw new Error("Cannot sow from empty hole");
    }

    newBoard[startIndex] = 0;
    let currentIndex = startIndex;
    let sowPath = []; // List of { index, count } snapshots? Or just sequence of drops?
    // Animation needs: 
    // 1. Pick up from Start.
    // 2. Drop at Next.
    // 3. Drop at Next...
    // 4. Hand empty? Pick up from Next... (This is a multi-lap move)

    // To animate properly, we should return a SEQUENCE of state changes.
    // But for now, let's keep logic simple and just return the FINAL state + Path.
    // Path can include "PICK_UP" events.

    sowPath.push({ type: 'PICK_UP', index: startIndex });

    while (hand > 0) {
        currentIndex = getNextIndex(currentIndex, direction);
        newBoard[currentIndex]++;
        hand--;
        sowPath.push({ type: 'DROP', index: currentIndex });

        // If hand is empty
        if (hand === 0) {
            const nextHoleIndex = getNextIndex(currentIndex, direction);
            const nextHoleSeeds = newBoard[nextHoleIndex];

            if (nextHoleSeeds > 0) {
                // CONTINUE SOWING
                sowPath.push({ type: 'PICK_UP', index: nextHoleIndex });
                hand = nextHoleSeeds;
                newBoard[nextHoleIndex] = 0;
                currentIndex = nextHoleIndex;
            } else {
                // SAADA / CAPTURE
                const captureTargetIndex = getNextIndex(nextHoleIndex, direction);
                const oppositeIndex = getOppositeIndex(captureTargetIndex);

                const capturedFromTarget = newBoard[captureTargetIndex];
                const capturedFromOpposite = newBoard[oppositeIndex];

                if (capturedFromTarget > 0 || capturedFromOpposite > 0) {
                    newBoard[captureTargetIndex] = 0;
                    newBoard[oppositeIndex] = 0;
                    captured = capturedFromTarget + capturedFromOpposite;
                    sowPath.push({ type: 'CAPTURE', indices: [captureTargetIndex, oppositeIndex] });
                } else {
                    captured = 0;
                    sowPath.push({ type: 'STOP', index: currentIndex });
                }

                const canPlayAgain = (captured > 0 && saadasCount < 1);

                return {
                    board: newBoard,
                    capturedSeeds: captured,
                    endedIndex: currentIndex,
                    sowPath,
                    turnEnded: !canPlayAgain,
                    saadaTriggered: true,
                    nextTurn: canPlayAgain ? currentPlayer : (currentPlayer === PLAYERS.P1 ? PLAYERS.P2 : PLAYERS.P1)
                };
            }
        }
    }
};

// Check if a specific player has legal moves
export const hasLegalMoves = (board, player) => {
    const range = player === PLAYERS.P1 ? PLAYER_1_RANGE : PLAYER_2_RANGE;
    for (let i = range[0]; i <= range[1]; i++) {
        if (board[i] > 0) return true;
    }
    return false;
};

export const checkWin = (board, currentPlayer) => {
    // Game ends if the current player cannot make any move.
    // In traditional rules, if you can't move, the game ends.
    // The remaining seeds of the OTHER player belong to them.
    // The remaining seeds of the CURRENT player (0) are 0.

    if (!hasLegalMoves(board, currentPlayer)) {
        return true;
    }

    // Also check practically if board is empty (redundant but safe)
    const allSeeds = board.reduce((a, b) => a + b, 0);
    if (allSeeds === 0) return true;

    return false;
};

export const getLegalMoves = (board, currentPlayer) => {
    const range = currentPlayer === PLAYERS.P1 ? PLAYER_1_RANGE : PLAYER_2_RANGE;
    const moves = [];
    for (let i = range[0]; i <= range[1]; i++) {
        if (board[i] > 0) {
            moves.push(i); // Valid move
        }
    }
    return moves;
};

export const setupRematch = (currentScores) => {
    // Players refill holes with 4 seeds each.
    // P1 holes: 0-6. P2 holes: 7-13.
    const seedsPerHole = 4;
    const newBoard = Array(TOTAL_HOLES).fill(0);
    let p1Remaining = currentScores.P1;
    let p2Remaining = currentScores.P2;

    for (let i = 0; i <= 6; i++) {
        if (p1Remaining >= seedsPerHole) {
            newBoard[i] = seedsPerHole;
            p1Remaining -= seedsPerHole;
        } else {
            newBoard[i] = 0;
        }
    }

    for (let i = 7; i <= 13; i++) {
        if (p2Remaining >= seedsPerHole) {
            newBoard[i] = seedsPerHole;
            p2Remaining -= seedsPerHole;
        } else {
            newBoard[i] = 0;
        }
    }

    return {
        board: newBoard,
        p1Stored: p1Remaining,
        p2Stored: p2Remaining
    };
};
