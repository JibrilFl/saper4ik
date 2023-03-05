import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAllCels, updateCell, resetGame, setGameStatus, setSmileStatus, openEmptyCells } from "./gameSlice";
import './game.scss';

import sprite from '../../media/minesweeper-sprites.png';

const Game = () => {

	const dispatch = useDispatch();

	const { gameStatus, smileStatus } = useSelector(state => state.game)

	const [seconds, setSeconds] = useState();

	const board = useSelector(selectAllCels);

	useEffect(() => {
		const cell = board.filter(item => item.isOpen).length;
		if (cell === 216) {
			dispatch(setGameStatus('win'));
		}

	}, [board]);

	useEffect(() => {
		if (gameStatus === 'waiting') {
			setSeconds(2400)
		}

	}, [gameStatus])

	useEffect(() => {
		let timer;

		if (seconds > 0 && gameStatus === 'start') {
			timer = setTimeout(setSeconds, 1000, seconds - 1);
		} else if (seconds === 0 && gameStatus !== 'waiting') {
			dispatch(setGameStatus('lose'))
		}

		return () => clearTimeout(timer)

	}, [seconds, gameStatus])



	const handleCellClick = (cell) => {
		if (!cell.isOpen && gameStatus !== 'lose' && gameStatus !== 'win') {
			if (gameStatus === 'waiting') {
				dispatch(setGameStatus('start'));
			}

			if (cell.hasBomb) {
				// Игрок попал на мину - обработать проигрыш
				dispatch(setGameStatus('lose'))
				dispatch(updateCell({ id: `${cell.x}-${cell.y}`, changes: { flags: 'bomb' } }));
			} else if (cell.bombsAround === 0) {
				// Ячейка пуста - открыть все соседние пустые ячейки
				dispatch(openEmptyCells(cell));
			} else {
				// Ячейка не пуста - отобразить количество мин вокруг ячейки
				dispatch(updateCell({ id: `${cell.x}-${cell.y}`, changes: { isOpen: true, flags: 'none' } }));
			}
		}
	};

	const handleContextMenu = (e, cell) => {
		e.preventDefault();
		if (!cell.isOpen && gameStatus !== 'lose' && gameStatus !== 'win') {
			if (gameStatus === 'waiting') {
				dispatch(setGameStatus('start'));
			}

			switch (cell.flags) {
				case 'none':
					dispatch(updateCell({ id: `${cell.x}-${cell.y}`, changes: { flags: 'flag' } }));
					break;
				case 'flag':
					dispatch(updateCell({ id: `${cell.x}-${cell.y}`, changes: { flags: 'quest' } }));
					break;
				case 'quest':
					dispatch(updateCell({ id: `${cell.x}-${cell.y}`, changes: { flags: 'none' } }));
					break;
				default:
					break;
			}
		}
	};

	const handledownUp = (e, cell, str) => {
		if (e.button !== 2) {
			if (!cell.isOpen && gameStatus !== 'lose' && gameStatus !== 'win') {

				dispatch(setSmileStatus(str));
			}
		}
	};

	function r(e, cell) {
		if (e.button === 0 && cell.hasBomb && gameStatus === 'waiting') {
			dispatch(resetGame(cell));
		}
	}

	const createBoard = (arr) => {

		if (arr.length === 0) {
			return <h1>Доска не создана</h1>
		};

		return arr.map((cell, i) => {

			let style = {
				border: 'none',
				width: '17px',
				height: '16px',
				backgroundImage: `url(${sprite})`,
				backgroundPosition: '0 -51px'
			};

			if (cell.isOpen && cell.bombsAround > 0) {
				switch (cell.bombsAround) {
					case 1:
						style.backgroundPosition = '0 -67px';
						break
					case 2:
						style.backgroundPosition = '-17px -67px';
						break
					case 3:
						style.backgroundPosition = '-34px -67px';
						break
					case 4:
						style.backgroundPosition = '-50px -67px';
						break
					case 5:
						style.backgroundPosition = '-68px -67px';
						break
					case 6:
						style.backgroundPosition = '-84px -67px';
						break
					case 7:
						style.backgroundPosition = '-102px -67px';
						break
					case 8:
						style.backgroundPosition = '-119px -67px';
						break
					default:
						break
				}
			} else if (cell.isOpen && cell.bombsAround === 0) {
				style.backgroundPosition = '-17px -50px';
			} else if (cell.isOpen && cell.hasBomb) {
				style.backgroundPosition = '-85px -50px';
			} else if (!cell.open) {
				switch (cell.flags) {
					case 'flag':
						style.backgroundPosition = '-34px -51px';
						break;
					case 'quest':
						style.backgroundPosition = '-51px -51px';
						break;
					default:
						break;
				}
			}

			if (gameStatus === 'lose') {
				if (cell.flags === 'bomb') {
					style.backgroundPosition = '-102px -51px';
				} else if (cell.flags === 'flag' && !cell.hasBomb) {
					style.backgroundPosition = '-119px -51px';
				} else if (cell.flags === 'flag' && cell.hasBomb) {
					style.backgroundPosition = '-34px -51px';
				} else if (cell.hasBomb) {
					style.backgroundPosition = '-85px -51px';
				}
			}

			return <button
				key={`${cell.x}-${cell.y}`}
				style={style}
				onContextMenu={(e) => handleContextMenu(e, cell)}
				onMouseDown={(e) => {
					handledownUp(e, cell, 'wow');
					r(e, cell);
				}}
				onMouseUp={(e) => handledownUp(e, cell, '')}
				onClick={() => handleCellClick(cell)}>{cell.hasBomb ? 'b' : ''}</button>
		});
	};

	const styleSmile = {
		border: 'none',
		width: '26px',
		height: '26px',
		backgroundImage: `url(${sprite})`,
		backgroundPosition: '0 -24px'
	}

	if (gameStatus === 'lose') {
		styleSmile.backgroundPosition = '-108px -24px';
	} else if (gameStatus === 'win') {
		styleSmile.backgroundPosition = '-81px -24px';
	} else if (smileStatus === 'wow' && (gameStatus === 'start' || gameStatus === 'waiting')) {
		styleSmile.backgroundPosition = '-54px -24px';
	} else if (smileStatus === 'reset') {
		styleSmile.backgroundPosition = '-27px -24px';
	}

	function t(d) {
		const styleNum = {
			width: '13px',
			height: '23px',
			backgroundImage: `url(${sprite})`,
		}

		switch (d) {
			case 0:
				styleNum.backgroundPosition = '-126px 0';
				break;
			case 1:
				styleNum.backgroundPosition = '0 0';
				break;
			case 2:
				styleNum.backgroundPosition = '-14px 0';
				break;
			case 3:
				styleNum.backgroundPosition = '-28px 0';
				break;
			case 4:
				styleNum.backgroundPosition = '-42px 0';
				break;
			case 5:
				styleNum.backgroundPosition = '-56px 0';
				break;
			case 6:
				styleNum.backgroundPosition = '-70px 0';
				break;
			case 7:
				styleNum.backgroundPosition = '-84px 0';
				break;
			case 8:
				styleNum.backgroundPosition = '-98px 0';
				break;
			case 9:
				styleNum.backgroundPosition = '-112px 0';
				break;
			default:
				break;
		}

		return (
			<div style={styleNum}></div>
		)
	}

	const zero = t(0);
	const one = t(Math.floor(seconds / 60 / 10));
	const two = t(Math.floor(seconds / 60 % 10));
	const three = t(Math.floor(seconds % 60 / 10));
	const four = t(Math.floor(seconds % 60 % 10));

	return (
		<>
			<div className="timer">
				<div className="time">
					{zero}
					{one}
					{two}
				</div>
				<button style={styleSmile} onMouseDown={() => dispatch(setSmileStatus('reset'))} onMouseUp={() => dispatch(setSmileStatus(''))} onClick={() => dispatch(resetGame())} ></button>
				<div className="time">
					{zero}
					{three}
					{four}
				</div>
			</div>
			<div className="grid">{createBoard(board)}</div>
		</>
	)
};

export default Game;