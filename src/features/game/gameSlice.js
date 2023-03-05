import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";

export const openEmptyCells = createAsyncThunk(
	"game/openEmptyCells",
	async (cell, { dispatch, getState }) => {

		if (!cell || cell.isOpen) {
			return;
		}

		dispatch(updateCell({ id: `${cell.x}-${cell.y}`, changes: { isOpen: true, flags: 'none' } }));

		if (cell.bombsAround === 0) {
			const neighbors = getNeighbors(cell, getState);
			neighbors.forEach((c) => dispatch(openEmptyCells(c)));
		}
	}
);

export const resetGame = createAsyncThunk(
	"game/resetGame",
	async (cell, { dispatch }) => {

		const cells = createCells(cell);
		dispatch(setGameStatus('waiting'));
		dispatch(updateAll(cells));
	}
);

const getNeighbors = (cell, getState) => {

	if (!cell) {
		return [];
	}

	const { x, y } = cell;
	const neighbors = [];

	for (let r = x - 1; r <= x + 1; r++) {
		for (let c = y - 1; c <= y + 1; c++) {
			if (r === x && c === y) {
				continue;
			}

			const neighborCell = `${r}-${c}`;

			if (selectIds(getState()).includes(neighborCell)) {
				neighbors.push(selectEntities(getState())[neighborCell]);
			}
		}
	}
	return neighbors;
};

function createCells(c) {
	const cells = []

	//Создаем игровую доску
	for (let i = 0; i < 16; i++) {
		for (let j = 0; j < 16; j++) {
			cells.push({
				x: i,
				y: j,
				hasBomb: false,
				isOpen: false,
				bombsAround: 0,
				flags: 'none'
			})
		}
	}

	// Добавляем бомбы в случайные клетки
	let bombsPlaced = 0;
	while (bombsPlaced < 40) {
		const randRow = Math.floor(Math.random() * 16);
		const randCol = Math.floor(Math.random() * 16);
		const cell = cells[randRow * 16 + randCol];
		if (!c) {
			if (!cell.hasBomb) {
				cell.hasBomb = true;
				bombsPlaced++;
			}
		} else {
			if (!cell.hasBomb && !(`${c.x}-${c.y}` === `${cell.x}-${cell.y}`)) {
				cell.hasBomb = true;
				bombsPlaced++;
			}
		}
	}

	// // Определяем количество бомб возле каждой ячейки
	for (let row = 0; row < 16; row++) {
		for (let col = 0; col < 16; col++) {
			const cel = cells[row * 16 + col];
			if (cel.hasBomb) {
				const surroundingCells = getSurroundingCells(cel, cells);
				surroundingCells.forEach(c => { c.bombsAround++ });
			}
		}
	}

	function getSurroundingCells(cell, board) {
		const cells = [];
		for (let row = cell.x - 1; row <= cell.x + 1; row++) {
			for (let col = cell.y - 1; col <= cell.y + 1; col++) {
				if (row >= 0 && row < 16 && col >= 0 && col < 16 && !(row === cell.x && col === cell.y)) {
					cells.push(board[row * 16 + col]);
				}
			}
		}
		return cells;
	}

	return cells;
};

const gameAdapter = createEntityAdapter({
	selectId: cell => `${cell.x}-${cell.y}`
});

const initialState = gameAdapter.getInitialState({
	gameStatus: 'waiting',
	smileStatus: ''
});

const gameSlice = createSlice({
	name: 'game',
	initialState: gameAdapter.setAll(initialState, createCells()),
	reducers: {
		setGameStatus: (state, action) => { state.gameStatus = action.payload },
		setSmileStatus: (state, action) => { state.smileStatus = action.payload },
		updateCell: gameAdapter.updateOne,
		updateAll: gameAdapter.setAll
	}
})

const { reducer, actions } = gameSlice;

export default reducer;

export const {
	selectIds,
	selectEntities,
	selectAll: selectAllCels
} = gameAdapter.getSelectors(state => state.game);

export const {
	setGameStatus,
	setSmileStatus,
	updateCell,
	updateAll
} = actions;