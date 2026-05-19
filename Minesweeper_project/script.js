// 1. Tìm cái hộp mang tên 'board' bên file index.html và lưu vào biến boardElement
const boardElement = document.getElementById('board');

// 2. dùng vòng lặp for để chạy 100 lần
for (let i = 0; i < 100; i++) {
    
    // 3. Mỗi lần chạy, tạo ra một cái ô vuông mới bằng cách tạo một thẻ div mới
    const cellElement = document.createElement('div');
    
    // 4. Thêm class 'cell' vào cái ô vuông vừa tạo để nó có thể được định dạng bằng CSS
    cellElement.classList.add('cell');
    
    // 5. Thêm cái ô vuông vừa tạo vào trong cái hộp 'board' để nó hiển thị trên trang web
    boardElement.appendChild(cellElement);
}