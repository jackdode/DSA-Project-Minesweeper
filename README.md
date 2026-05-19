# 💣 DSA PROJECT: MINESWEEPER GAME

A web-based Minesweeper game implementing fundamental data structures and algorithms (DSA), developed as a project for the Data Structures and Algorithms course.

## 👤 Developer
This is a solo project developed, managed, and version-controlled via GitHub by:
* **Đỗ Tuấn Huy** - Computer Science Undergraduate at International University (VNU-HCM).

---

## 🛠️ Technologies Used
* **Core Language:** JavaScript (ES6+)
* **Frontend:** HTML5 & CSS3 (Utilizing **CSS Grid** layout)
* **Version Control:** Git & GitHub

---

## 🧠 Data Structures & Algorithms Applied (DSA)

The core mechanics of the game are optimized using foundational DSA concepts:

### 1. 2D Array (Matrix)
* **Application:** The $10 \times 10$ game board is represented and managed as a 2D array in the background memory.
* **Optimization:** Allows direct access and state updates for any cell at coordinate $(r, c)$ with an optimal time complexity of $O(1)$.

### 2. Flood Fill Algorithm (DFS / Recursion)
* **Application:** When a user clicks on an empty cell (with 0 neighboring mines), a recursive algorithm is triggered to automatically clear the surrounding safe zone until it hits cells with adjacent numbers.
* **Mechanism:** Traverses and validates the boundaries of the 8 neighboring cells of the current cell.

### 3. Stack Data Structure (LIFO)
* **Application:** To implement the **Undo** mechanism (a core project requirement), a Stack data structure is utilized to store the board's state history before every valid move.
* **Mechanism:** * `Push`: Clones and saves the current board state into the stack before a click event occurs.
  * `Pop`: Restores the most recent historical state from the stack when the user triggers the Undo action.

---

## 🚀 Key Features
* [x] Automated and randomized mine placement upon initialization.
* [x] Left-click interaction to reveal cell states and adjacent mine counts.
* [x] Right-click interaction to place/remove flags `🚩` for marking suspected mines.
* [x] Smooth grid expansion using the recursive flood-fill algorithm.
* [x] **Undo feature ⏪** to roll back accidental or incorrect moves.
* [x] Instant win/loss condition tracking and handling.

---

## 🎮 How to Run the Project
1. Clone the repository to your local machine:
   ```bash
   git clone [https://github.com/jackdode/DSA-Project-Minesweeper.git](https://github.com/jackdode/DSA-Project-Minesweeper.git)
