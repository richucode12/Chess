// Initialize Chessboard.js
var board = Chessboard('board1', {
    draggable: true,
    dropOffBoard: 'trash',
    sparePieces: true
});

// Initialize Stockfish
var stockfish = new Worker('https://unpkg.com/stockfish-js@10.0.0/stockfish.js');

// Load Stockfish
stockfish.onmessage = function (event) {
    console.log(event.data);
};

stockfish.postMessage('uci');
stockfish.postMessage('ucinewgame');
stockfish.postMessage('isready');

// Handle moves made by the player
board.on('dragEnd', function (source, target) {
    var move = { from: source, to: target, promotion: 'q' }; // You can handle promotions as needed
    makeMove(move);
});

// Function to make a move
function makeMove(move) {
    var legalMoves = getLegalMoves();

    // Check if the move is legal
    if (legalMoves.some(function (m) { return moveEqual(move, m); })) {
        board.position(board.fen());
        stockfish.postMessage('position fen ' + board.fen());
        stockfish.postMessage('go depth 10');
    } else {
        return 'snapback';
    }
}

// Function to get legal moves
function getLegalMoves() {
    var moves = [];
    var game = new Chess(board.fen());
    var legalMoves = game.legalMoves();

    legalMoves.forEach(function (move) {
        moves.push({
            from: move.from,
            to: move.to,
            promotion: move.promotion
        });
    });

    return moves;
}

// Function to check if two moves are equal
function moveEqual(move1, move2) {
    return move1.from === move2.from && move1.to === move2.to && move1.promotion === move2.promotion;
}
