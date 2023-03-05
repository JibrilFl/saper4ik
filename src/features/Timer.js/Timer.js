import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetGame, setGameStatus, setSmileStatus } from "../Game/gameSlice";

import sprite from '../../media/minesweeper-sprites.png';
import './timer.scss';

const Timer = () => {
	const [seconds, setSeconds] = useState();

	const dispatch = useDispatch();

	const { gameStatus, smileStatus } = useSelector(state => state.game);

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

	}, [seconds, gameStatus]);

	function createSmileStyle() {
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

		return <button style={styleSmile} onMouseDown={() => dispatch(setSmileStatus('reset'))} onMouseUp={() => dispatch(setSmileStatus(''))} onClick={() => dispatch(resetGame())} ></button>
	};

	function createNumStyle(numFunc) {
		const styleNum = {
			width: '13px',
			height: '23px',
			backgroundImage: `url(${sprite})`,
		}

		switch (numFunc) {
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
	};

	const zero = createNumStyle(0);
	const one = createNumStyle(Math.floor(seconds / 60 / 10));
	const two = createNumStyle(Math.floor(seconds / 60 % 10));
	const three = createNumStyle(Math.floor(seconds % 60 / 10));
	const four = createNumStyle(Math.floor(seconds % 60 % 10));

	const smile = createSmileStyle();

	return (
		<div className="timer">
			<div className="timer__minute">
				{zero}
				{one}
				{two}
			</div>
			{smile}
			<div className="timer__seconds">
				{zero}
				{three}
				{four}
			</div>
		</div>
	)
};

export default Timer;