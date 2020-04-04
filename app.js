
 class Board{
   constructor(){
     this.container = document.querySelector('.container');
     this.addListeners();
   }

   init(){
     this.board = this.generateBoard();
     this.addToDom();
   }

   setCallBack(fn){
     this.callBack = fn;
   }

   isVisited(x, y){
     if(this.board[x][y]){
       return true;
     }
     return false;
   }

   onClick(e){
    if(Array.from(e.target.classList).includes('cell')){
      const x = e.target.getAttribute('data-x');
      const y = e.target.getAttribute('data-y');
      if(!this.isVisited(x, y)) {
        this.callBack(x, y);
      }
    }
   }

   addListeners(){
     this.container.addEventListener('click', this.onClick.bind(this));
   }

   generateBoard(){
     return [
       ['', '', ''],
       ['', '', ''],
       ['', '', '']
     ];
   }

   renderBoard(){
      const tableData = this.board.map((a, k) => {
        const rowData = a.map((b, i) => {
          return `<td data-x=${k} data-y=${i} class="cell">${b}</td>`
        }).join('');
        return `<tr>${rowData}</tr>`
      }).join('');

      return `<table>${tableData}</table>`
   }

   addToDom(){
     const table = this.renderBoard();
     this.container.innerHTML = table;
   }

   setPiece(x, y, sign){
     this.board[x][y] = sign;
     this.findEmptyPlaces();
     this.addToDom();
   }

   findEmptyPlaces(){
      this.emptyPlaces = [];
      this.board.map((a, i) => {
       a.map((_, k) => {
         if(this.board[i][k] === ''){
          this.emptyPlaces.push(new Point(i,k));
         }
       })
     })
   }
 }

 class Winner{
   constructor(x,y,z){
     this.a = x;
     this.b = y;
     this.c = z;
   }
 }

 class Point{
   constructor(x, y){
     this.x = x;
     this.y = y;
   }
 }

 class Player{
   constructor(sign){
     this.sign = sign;
   }

   getSign(){
     return this.sign;
   }
 }

 class Manager{
   constructor(){
     this.board = new Board();
     this.winners = this.winSituations();
     this.playerA = new Player('X');
     this.playerB = new Player('O');
     this.currentPlayer = [this.playerA, this.playerB][this.getRandomNumber(2)];
     this.resetButton = document.querySelector('.reset');
     this.resultArea = document.querySelector('.result');
     this.addMenuListeners();
   }

   addMenuListeners(){
     this.resetButton.addEventListener('click', this.resetGame.bind(this));
   }

   init(){
     this.board.init();
     this.board.setCallBack(this.callBackListener);
   }

   nextTurn(){
    this.currentPlayer = (this.currentPlayer.getSign() == 'X') ? this.playerB : this.playerA;
    return this.currentPlayer;
   }

   callBackListener = function(x, y){
    this.board.setPiece(x, y, this.nextTurn().getSign());
    this.letComputerPlay();
   }.bind(this)

   letComputerPlay(){
    const length = this.board.emptyPlaces.length;
    const randomPoint = this.board.emptyPlaces[this.getRandomNumber(length)];

    if(length)
       this.board.setPiece(randomPoint.x, randomPoint.y, this.nextTurn().getSign());

    this.isGameFinished();
   }

   resetGame(){
     this.board.init();
     this.resultArea.innerHTML = '';
     this.init();
   }

   isGameFinished(){
    this.winners.forEach(item => {
        if(this.board.board[item.a.x][item.a.y] != "" &&
           this.board.board[item.a.x][item.a.y] == this.board.board[item.b.x][item.b.y] &&
           this.board.board[item.b.x][item.b.y] == this.board.board[item.c.x][item.c.y]
          ){
            this.resultArea.innerHTML = `${this.board.board[item.b.x][item.b.y]} has won!`;
        }
      });
   }

   winSituations(){
    const winners = [
      new Winner(new Point(0, 0), new Point(0, 1), new Point(0, 2)),
      new Winner(new Point(1, 0), new Point(1, 1), new Point(1, 2)),
      new Winner(new Point(2, 0), new Point(2, 1), new Point(2, 2)),
      new Winner(new Point(0, 0), new Point(1, 0), new Point(2, 0)),
      new Winner(new Point(0, 1), new Point(1, 1), new Point(2, 1)),
      new Winner(new Point(0, 2), new Point(1, 2), new Point(2, 2)),
      new Winner(new Point(0, 0), new Point(1, 1), new Point(2, 2)),
      new Winner(new Point(0, 2), new Point(1, 1), new Point(2, 0))
    ];
    return winners;
   }

   getRandomNumber(length = 3){
     return Math.floor(Math.random() * length);
   }
 }

const game = new Manager();
game.init();

