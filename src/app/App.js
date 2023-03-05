import Game from '../features/Game/Game';
import Timer from '../features/Timer.js/Timer';

import './app.scss';

function App() {
	return (
		<div className="App">
			<Timer />
			<Game />
		</div>
	);
}

export default App;
