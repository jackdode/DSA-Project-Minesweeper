const ROWS = 10;
const COLS = 10;
const MINE_COUNT = 10;

let board = [];
let gameOver = false;
let historyStack = []; // DSA: Cấu trúc dữ liệu Stack để lưu lịch sử làm nút Undo

const boardElement = document.getElementById('board');
const scoreElement = document.getElementById('score');
const messageElement = document.getElementById('message');

// 1. Khởi tạo ván game mới
function initGame() {
    board = [];
    gameOver = false;
    historyStack = []; // Reset bộ nhớ Stack
    messageElement.innerText = '';
    scoreElement.innerText = '0';

    // Tạo ma trận 10x10 ngầm
    for (let r = 0; r < ROWS; r++) {
        let row = [];
        for (let c = 0; c < COLS; c++) {
            row.push({
                r: r, c: c,
                isMine: false,
                neighborMines: 0,
                isRevealed: false,
                isFlagged: false
            });
        }
        board.push(row);
    }

    // Rải mìn ngẫu nhiên
    let minesPlanted = 0;
    while (minesPlanted < MINE_COUNT) {
        let r = Math.floor(Math.random() * ROWS);
        let c = Math.floor(Math.random() * COLS);
        if (!board[r][c].isMine) {
            board[r][c].isMine = true;
            minesPlanted++;
        }
    }

    calculateNeighbors();
    renderBoardUI();
}

// Tính số lượng mìn xung quanh 8 ô lân cận
function calculateNeighbors() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c].isMine) continue;
            let count = 0;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    let newR = r + i;
                    let newC = c + j;
                    if (newR >= 0 && newR < ROWS && newC >= 0 && newC < COLS) {
                        if (board[newR][newC].isMine) count++;
                    }
                }
            }
            board[r][c].neighborMines = count;
        }
    }
}

// DSA: Lưu trạng thái hiện tại vào Stack trước khi player thực hiện bước đi mới (Push)
function saveHistory() {
    historyStack.push(JSON.parse(JSON.stringify(board)));
}

// Vẽ giao diện bàn cờ dựa trên mảng dữ liệu ngầm
function renderBoardUI() {
    boardElement.innerHTML = '';
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = board[r][c];
            const cellElement = document.createElement('button');
            cellElement.classList.add('cell');
            
            // Đồng bộ trạng thái từ mảng dữ liệu lên giao diện ( tính năng Undo )
            if (cell.isRevealed) {
                cellElement.classList.add('revealed');
                if (cell.isMine) {
                    cellElement.classList.add('mine');
                    cellElement.innerText = '💣';
                } else if (cell.neighborMines > 0) {
                    cellElement.innerText = cell.neighborMines;
                }
            } else if (cell.isFlagged) {
                cellElement.innerText = '🚩';
            }

            cellElement.addEventListener('click', () => handleCellClick(r, c));
            cellElement.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                handleCellRightClick(r, c);
            });

            boardElement.appendChild(cellElement);
        }
    }
}

// Xử lý khi người chơi click chuột trái mở ô
function handleCellClick(r, c) {
    if (gameOver || board[r][c].isRevealed || board[r][c].isFlagged) return;

    saveHistory(); // Nhét trạng thái cũ vào Stack trước khi thay đổi dữ liệu

    if (board[r][c].isMine) {
        triggerGameOver(false); // Bốc trúng mìn -> Thua
        return;
    }

    revealCell(r, c); // Gọi hàm loang đệ quy
    checkWinCondition(); // Kiểm tra xem thắng chưa
    renderBoardUI(); // Vẽ lại giao diện mới
}

// Thuật toán Loang Đệ quy (DFS)
function revealCell(r, c) {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
    if (board[r][c].isRevealed || board[r][c].isFlagged || board[r][c].isMine) return;

    board[r][c].isRevealed = true;

    if (board[r][c].neighborMines > 0) return;

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            revealCell(r + i, c + j);
        }
    }
}

// Xử lý khi người chơi click chuột phải cắm cờ
function handleCellRightClick(r, c) {
    if (gameOver || board[r][c].isRevealed) return;

    saveHistory(); // Nhét trạng thái cũ vào Stack trước khi cắm cờ

    board[r][c].isFlagged = !board[r][c].isFlagged;
    renderBoardUI();
}

// Xử lý kết thúc game (Thắng hoặc Thua)
function triggerGameOver(isWin) {
    gameOver = true;
    if (isWin) {
        messageElement.innerText = 'YOU WIN! 🎉';
        messageElement.style.color = '#4caf50'; // Chữ màu xanh lá
    } else {
        messageElement.innerText = 'GAME OVER! 💥';
        messageElement.style.color = '#f44336'; // Chữ màu đỏ
        // Hiển thị vị trí của toàn bộ quả mìn trên bàn cờ cho người chơi thấy
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (board[r][c].isMine) board[r][c].isRevealed = true;
            }
        }
        renderBoardUI();
    }
}

// Kiểm tra điều kiện thắng
function checkWinCondition() {
    let revealedCount = 0;
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c].isRevealed && !board[r][c].isMine) revealedCount++;
        }
    }
    scoreElement.innerText = revealedCount;

    // Tổng số 100 ô trừ 10 quả mìn = 90 ô an toàn cần mở để thắng
    if (revealedCount === (ROWS * COLS) - MINE_COUNT) {
        triggerGameOver(true);
    }
}

// DSA:  Undo (Pop từ Stack ra)
function handleUndo() {
    if (historyStack.length === 0) return; // Nếu Stack rỗng thì không làm gì cả

    board = historyStack.pop(); // Lấy trạng thái gần nhất ra khỏi Stack và đè lại lên bàn cờ hiện tại
    gameOver = false;           // Mở khóa lại trạng thái game phòng khi đang bị Game Over
    messageElement.innerText = '';
    
    // Tính toán lại điểm số sau khi quay ngược thời gian
    let revealedCount = 0;
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c].isRevealed && !board[r][c].isMine) revealedCount++;
        }
    }
    scoreElement.innerText = revealedCount;

    renderBoardUI(); // Vẽ lại giao diện bàn cờ cũ
}

// Chạy khởi tạo game
initGame();

// Lắng nghe sự kiện cho 2 nút điều khiển trên thanh trạng thái
document.getElementById('btn-reset').addEventListener('click', initGame);
document.getElementById('btn-undo').addEventListener('click', handleUndo);