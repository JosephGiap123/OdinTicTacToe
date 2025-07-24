function createPlayer(name, tick){

	let score = 0;
	const incrementScore = () => ++score;
	const getScore = () => score;
	const getName  = () => name;
	const getTick = () => tick;

	return {incrementScore, getScore, getName, getTick}
}

const gameBoard = (function(){
	let boardState = Array.from(Array(3), () => new Array(3).fill('.'));

	const clearBoard = () =>{
		boardState = Array.from(Array(3), () => new Array(3).fill('.'));
	}

	const placeOnBoard = (tick, x, y) => {
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

	return {placeOnBoard, getBoard, clearBoard, checkForWin, checkFull}
})();

const GameManager = (function(gameBoard){ //game logic here!
	const prompt = require('prompt-sync')({sigint: true});
	const _promptLocation = () =>{
		const x = prompt("X LOCATION?");
		const y = prompt("Y LOCATION?");
		return {x, y};
	}

	const logBoard = () =>{
		gameBoard.getBoard().forEach((row) =>{
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
		if(gameBoard.checkForWin()){
			return 'WIN';
		}
		else if(gameBoard.checkFull()){
			return 'TIE';
		}
		else return 'N/A';
	}

	const manageGame = (curPlayer, status) => {
			switch(status){
				case 'WIN':
					curPlayer.incrementScore();
					console.log(`${curPlayer.getName()} has won this Tic Tac Toe game.`)
					gameBoard.clearBoard();
					printScores(); //later to be replaced.
					break;
				case 'TIE':
					console.log('This game results in a TIE');
					gameBoard.clearBoard();
					break;
			}
	}

	let player1 = createPlayer("Player1", "X");
	let player2 = createPlayer("Player2", "O");
	const maxScore = 10;
	let curPlayer = player1;

	logBoard();
	while(player1.getScore() < maxScore && player2.getScore() < maxScore){
		console.log(`${curPlayer.getName()}'s turn'`);
		let madeMove = false;
		while(!madeMove){
			const tick = curPlayer.getTick();
			let location = _promptLocation();
			if(gameBoard.placeOnBoard(tick, location.x, location.y)){ // made move
				madeMove = true;
				const gameStatus = checkGameStatus();
				console.log(gameStatus);
				manageGame(curPlayer, gameStatus);
				curPlayer = otherPlayer(curPlayer);
			}
		}
		logBoard();
	}

})(gameBoard);
