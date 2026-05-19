const ROWS = 10;
const COLS = 10;
const MINE_COUNT = 10;

let board = [];
const boardElement = document.getElementById('board');

// 1. Hàm khởi tạo game (Chạy ngay khi mở trang web)
function initGame() {
    board = [];
    boardElement.innerHTML = '';

    // DSA: Tạo mảng 2 chiều (Matrix) để quản lý 100 ô vuông ngầm trong bộ nhớ
    for (let r = 0; r < ROWS; r++) {
        let row = [];
        for (let c = 0; c < COLS; c++) {
            row.push({
                r: r, c: c,
                isMine: false,         // Có mìn hay không?
                neighborMines: 0,      // Số mìn xung quanh ô này
                isRevealed: false,     // Ô này đã được mở chưa?
                isFlagged: false       // Có cắm cờ không?
            });
        }
        board.push(row);
    }

    // 2. Rải 10 quả mìn ngẫu nhiên vào mảng ngầm
    let minesPlanted = 0;
    while (minesPlanted < MINE_COUNT) {
        let r = Math.floor(Math.random() * ROWS);
        let c = Math.floor(Math.random() * COLS);
        
        if (!board[r][c].isMine) {
            board[r][c].isMine = true;
            minesPlanted++;
        }
    }

    // 3. Tính số mìn lân cận cho từng ô
    calculateNeighbors();
    
    // 4. Vẽ các ô cờ (biến thành các nút Button) lên màn hình
    renderBoardUI();
}

// Hàm quét 8 ô xung quanh để đếm mìn (Thuật toán duyệt cơ bản)
function calculateNeighbors() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c].isMine) continue;
            
            let count = 0;
            // Vòng lặp quét các ô hàng xóm chung quanh từ -1 đến +1
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    let newR = r + i;
                    let newC = c + j;
                    // Điều kiện đảm bảo không quét lọt ra ngoài biên bàn cờ
                    if (newR >= 0 && newR < ROWS && newC >= 0 && newC < COLS) {
                        if (board[newR][newC].isMine) count++;
                    }
                }
            }
            board[r][c].neighborMines = count;
        }
    }
}

// Hàm tạo các nút bấm (Button) thay vì thẻ div để người chơi tương tác được
function renderBoardUI() {
    boardElement.innerHTML = '';
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = board[r][c];
            const cellElement = document.createElement('button');
            cellElement.classList.add('cell');
            
            // Lưu tọa độ ngầm vào nút để lát nữa biết chính xác ô nào được click
            cellElement.dataset.row = r;
            cellElement.dataset.col = c;

            // Lắng nghe sự kiện click chuột trái của người chơi
            cellElement.addEventListener('click', () => handleCellClick(r, c));

            boardElement.appendChild(cellElement);
        }
    }
}

// 5. Hàm xử lý khi người chơi Click chuột trái
function handleCellClick(r, c) {
    let cell = board[r][c];
    if (cell.isRevealed) return; // Nếu ô đã mở rồi thì bỏ qua không xử lý

    cell.isRevealed = true; // Đánh dấu ô này đã mở ngầm trong bộ nhớ

    // Cập nhật giao diện hình ảnh của ô đó ngay lập tức
    updateUIAfterClick(r, c);
}

// Hàm phụ trách thay đổi giao diện của ô trên màn hình dựa vào trạng thái ẩn
function updateUIAfterClick(r, c) {
    let cell = board[r][c];
    // Tìm đúng cái nút bấm trên giao diện có tọa độ tương ứng (r, c)
    const cellElement = boardElement.querySelector(`[data-row="${r}"][data-col="${c}"]`);
    
    cellElement.classList.add('revealed'); // Đổi màu nền sang phẳng (đã mở)

    if (cell.isMine) {
        cellElement.classList.add('mine'); // Tô nền đỏ cho ô chứa mìn
        cellElement.innerText = '💣';
    } else if (cell.neighborMines > 0) {
        cellElement.innerText = cell.neighborMines; // Hiện con số mìn xung quanh
    } else {
        cellElement.innerText = ''; // Nếu xung quanh có 0 quả mìn thì để trống
    }
}

// Chạy khởi tạo game ngay khi load trang
initGame();