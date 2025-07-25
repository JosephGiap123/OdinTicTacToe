function createPlayer(name, tick){

	let score = 0;
	const incrementScore = () => ++score;
	const getScore = () => score;
	const getName  = () => name;
	const getTick = () => tick;

	return {incrementScore, getScore, getName, getTick}
}

const GameBoard = (function(){
	let boardState = Array.from(Array(3), () => new Array(3).fill('.'));

	const clearBoard = () =>{
		boardState = Array.from(Array(3), () => new Array(3).fill('.'));
	}

	const placeOnBoard = (tick, x, y) => {
		console.log(boardState);
		console.log("trying to place");
		if(boardState[y][x] != '.'){
			console.log('Position is taken.');
			return false; //not placed
		}
		boardState[y][x] = tick;
		return true; //placed
	}

	const checkFull = () => {
		return boardState.every(row => !row.includes("."));
	}

	const checkForWin = () => {
		//rows
		let win = false;
		//columns and rows
		for(let i = 0; i < 3; i++){
			let col = [boardState[0][i], boardState[1][i], boardState[2][i]];
			let row = [boardState[i][0], boardState[i][1], boardState[i][2]];
			win = win || _checkThreeSlots(col) || _checkThreeSlots(row);
		}
		//2 diagonals
		const diag1 = [boardState[0][0], boardState[1][1], boardState[2][2]];
		const diag2 = [boardState[2][0], boardState[1][1], boardState[0][2]];
		win = win || _checkThreeSlots(diag1) || _checkThreeSlots(diag2);
		return win;
	}

	const _checkThreeSlots = (arrayElem) => { //helper for checkWin
		return arrayElem.every(slot => slot === arrayElem[0] && arrayElem[0] != '.');
	}

	const getBoard = () => boardState;

	const getTile = (x,y) => boardState[y][x];

	return {placeOnBoard, getBoard, getTile, clearBoard, checkForWin, checkFull}
})();

const GameManager = (function(GameBoard){ //game logic here!
	const logBoard = () =>{ 
		GameBoard.getBoard().forEach((row) =>{
			console.log(`${row[0]} ${row[1]} ${row[2]}`);
		})
	}

	const printScores = () =>{
		console.log(`${player1.getName()} has ${player1.getScore()} points`);
		console.log(`${player2.getName()} has ${player2.getScore()} points`);
	}

	const otherPlayer = (curPlayer) => {
		if(curPlayer == player1) return player2;
		else return player1;
	}

	const checkGameStatus = () => {
		if(GameBoard.checkForWin()){
			return 'WIN';
		}
		else if(GameBoard.checkFull()){
			return 'TIE';
		}
		else return 'N/A';
	}

	const manageGame = (curPlayer, status) => {
			switch(status){
				case 'WIN':
					curPlayer.incrementScore();
					GameBoard.clearBoard();
					break;
				case 'TIE':
					GameBoard.clearBoard();
					break;
			}
	}

	const clickedButton = (x,y) =>{
		const tick = curPlayer.getTick();
		if(GameBoard.placeOnBoard(tick, x, y)){ //successfully placed
			const gameStatus = checkGameStatus();
			manageGame(curPlayer, gameStatus);
			curPlayer = otherPlayer(curPlayer);
			_renderBoard();
			_renderPoints();
			_renderActivePlayer();
		}
		else console.log("ERROR IN CLICKING");
	}

	const _renderBoard = () => { 
		const cards = document.querySelectorAll('.ttt-card');
		cards.forEach((card)=>{ //set each cards content
			const cardX = parseInt(card.dataset.col);
			const cardY = parseInt(card.dataset.row);
			if(GameBoard.getTile(cardX,cardY) != ".")
				card.textContent = GameBoard.getTile(cardX, cardY);
			else
				card.textContent = "";
		});	
	}

	const _renderPoints = () =>{
		const player1Card = document.querySelector('.player1');
		const player2Card = document.querySelector('.player2');
		player1Card.innerHTML = `${player1.getName()}:<br>${player1.getScore()}`;
		player2Card.innerHTML = `${player2.getName()}:<br>${player2.getScore()}`;
	}

	const _renderActivePlayer = () =>{
		const player1Card = document.querySelector('.player1');
		const player2Card = document.querySelector('.player2');
		player1Card.classList.remove('curPlayer')
		player2Card.classList.remove('curPlayer')
		if(curPlayer === player1) player1Card.classList.add('curPlayer');
		else player2Card.classList.add('curPlayer');
	}

	let player1 = createPlayer("Player 1", "X");
	let player2 = createPlayer("Player 2", "O");
	let curPlayer = player1;
	_renderBoard();
	_renderPoints();
	_renderActivePlayer();

	return {player1, player2, curPlayer, clickedButton, printScores};
})(GameBoard);

document.querySelectorAll('.ttt-card').forEach((card)=>{
	card.addEventListener('click', ()=>{
		console.log("hi");
		const x = parseInt(card.dataset.col);
		const y = parseInt(card.dataset.row);
		GameManager.clickedButton(x,y);
	});
});
