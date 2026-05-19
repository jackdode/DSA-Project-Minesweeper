const ROWS = 10;
const COLS = 10;
const MINE_COUNT = 10;

let board = [];
const boardElement = document.getElementById('board');

function initGame() {
    board = [];
    boardElement.innerHTML = '';

    // Tạo mảng 2 chiều ngầm
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

function renderBoardUI() {
    boardElement.innerHTML = '';
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = board[r][c];
            const cellElement = document.createElement('button');
            cellElement.classList.add('cell');
            cellElement.dataset.row = r;
            cellElement.dataset.col = c;

            // 1. Click chuột trái để mở ô
            cellElement.addEventListener('click', () => handleCellClick(r, c));

            // 2. Click chuột phải để cắm cờ 🚩
            cellElement.addEventListener('contextmenu', (e) => {
                e.preventDefault(); // Chặn không cho hiện bảng menu mặc định của trình duyệt
                handleCellRightClick(r, c);
            });

            boardElement.appendChild(cellElement);
        }
    }
}

// Hàm xử lý Chuột trái (Mở ô)
function handleCellClick(r, c) {
    let cell = board[r][c];
    // Nếu ô đã mở hoặc đang cắm cờ thì không cho bấm chuột trái
    if (cell.isRevealed || cell.isFlagged) return; 

    // Gọi thuật toán loang đệ quy để mở ô
    revealCell(r, c);
}

// DSA: THUẬT TOÁN LOANG BẰNG ĐỆ QUY (Flood Fill / DFS)
function revealCell(r, c) {
    // Điều kiện dừng đệ quy: Nếu lọt ra ngoài biên, hoặc ô đã mở, hoặc ô đang cắm cờ
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
    if (board[r][c].isRevealed || board[r][c].isFlagged) return;

    // Đánh dấu ô đã mở
    board[r][c].isRevealed = true;
    updateSingleCellUI(r, c);

    // Nếu ô này trúng mìn hoặc ô này có số (> 0) thì DỪNG LOANG
    if (board[r][c].isMine || board[r][c].neighborMines > 0) return;

    // Nếu trúng ô trống (0 mìn xung quanh), tự động loang sang 8 ô hàng xóm
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            revealCell(r + i, c + j); // Đệ quy gọi lại chính nó
        }
    }
}

// Hàm xử lý Chuột phải (Cắm cờ / Bỏ cắm cờ)
function handleCellRightClick(r, c) {
    let cell = board[r][c];
    if (cell.isRevealed) return; // Ô mở rồi thì không cắm cờ được nữa

    cell.isFlagged = !cell.isFlagged; // Đảo trạng thái cắm cờ (true thành false, false thành true)
    updateSingleCellUI(r, c);
}

// Hàm cập nhật hình ảnh cho duy nhất một ô cờ tại tọa độ (r, c)
function updateSingleCellUI(r, c) {
    let cell = board[r][c];
    const cellElement = boardElement.querySelector(`[data-row="${r}"][data-col="${c}"]`);
    
    if (cell.isRevealed) {
        cellElement.classList.add('revealed');
        if (cell.isMine) {
            cellElement.classList.add('mine');
            cellElement.innerText = '💣';
        } else if (cell.neighborMines > 0) {
            cellElement.innerText = cell.neighborMines;
        } else {
            cellElement.innerText = '';
        }
    } else {
        // Nếu chưa mở thì hiển thị Cờ hoặc để trống
        cellElement.classList.remove('revealed');
        cellElement.innerText = cell.isFlagged ? '🚩' : '';
    }
}

initGame();