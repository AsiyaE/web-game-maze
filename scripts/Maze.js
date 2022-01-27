import { Person } from "./Person.js";
import { Coins } from "./Coins.js";
import { Enemies } from "./Enemies.js";

/**
 * Лабиринт
 */
 export class Maze{

	/** @type {Person} */
	person;

	/** @type {HTMLCanvasElement}*/
	canvas;

	/** @type {CanvasRenderingContext2D}*/
	context;

	/** @type {number} */
	lastChange=0;

	/** @type {number} */
	frame=0;

	/** @type {number} */
	time=0;

	/** @type {HTMLImageElement} */
	imgM = new Image();

	/** @type {HTMLImageElement} */
	exit=new Image();

	/** @type {number} */
	exitX=-1;

	/** @type {number} */
	exitY=-1;

	/**
	 * @type {Person} person
	*/
	constructor(person){
		this.person=person;
		this.exit.src="img/diamond.png"; 
		this.handleKeyDown = this.handleKeyDown.bind( this );
	}
	
	/**
	 * Убирает слушатели и перерисовку кадров
	*/
	clean(){
		document.removeEventListener('keydown',this.handleKeyDown);
		window.cancelAnimationFrame(this.time);
	}

	/**
	 * Отображает результат - поражение
	*/
	gameOver(){
		let res=document.getElementById("result");
		res.textContent="Конец игры";
		this.clean();
	}

	/**
	 * Проверяет, пройден ли уровень
	*/
	isLevelPassed(){
		 
		if ((Math.abs(this.person.x-this.exitX)<15)&&(Math.abs(this.person.y-this.exitY)<15)){
			
			this.clean();
			if(this.person.curLevel<3){
				this.person.curLevel++;
				let next=document.getElementById(this.person.curLevel);
				next.disabled=0;
			}
			else{
				let res=document.getElementById("result");
				res.textContent="Победа!";
			}
			return true;
		}
		return false;
	}

	/**
	 * Устанавливает поле и размещение персонажей
	 * @param {string} file URL
	 * @param {number} x координата x персонажа
	 * @param {number} y координата y персонажа
	 * @param {{x: number, y: number }[]} enemLocation расположение врагов
	 * @param {{x: number, y: number }[]} coinsLocation расположение монет
	*/
	setMaze(file,x,y,enemLocation,coinsLocation){

		if (this.canvas===undefined){
			this.canvas=document.createElement("canvas");
			let place=document.querySelector(".content");
			place.appendChild(this.canvas); 
		}
		let block=document.querySelector( 'body' );
		block.style.flexDirection = "row-reverse";

		this.coins=new Coins(this);
		this.enemies=new Enemies(this);

		this.coins.setPlace(coinsLocation);
		this.enemies.setPlace(enemLocation);
		this.person.setLocation(x,y);

		this.context=this.canvas.getContext("2d");
		this.imgM.src = file;
		this.imgM.onload = () =>this.#draw(x,y);

	}

	/**
	 * Рисует начальное положение объектов на поле
	 * @private
	 * @param {number} x координата x персонажа
	 * @param {number} y координата y персонажа
	*/
	#draw(x,y){
		
		this.canvas.width = this.imgM.width; 
		this.canvas.height = this.imgM.height;
		this.context.drawImage(this.imgM, 0,0);
		this.coins.draw();
		this.enemies.draw();

		this.context.drawImage(this.person.pic,x,y);
		this.context.drawImage(this.exit,this.exitX,this.exitY);
		
		document.addEventListener('keydown',this.handleKeyDown); 
		this.drawFrame();
	
	}

	/**
	 * перерисовывает состояние игры
	 * 
	*/
	drawFrame(){
		if((!this.isLevelPassed())&&(this.person.getLifeStatus()>0)){
			if(this.time-this.lastChange>50){
				this.lastChange=this.time;
				this.frame++;
				if(this.frame===6){
					this.frame=0;
				}
			}
			this.time=window.requestAnimationFrame(this.drawFrame.bind(this));

			if (this.person.dx !== 0 || this.person.dy !== 0) { 
				let size=this.person.pic.height;
				this.context.beginPath();
				this.context.fillStyle = "white";
				this.context.rect(this.person.x+1, this.person.y+1, size-2, size-2);
				this.context.fill()
				
				const x = this.person.x + this.person.dx;
				const y = this.person.y + this.person.dy;

				if (this.checkForCollision(x,y)) { 
					this.person.setSpeedToZero();
				}
				else{
					this.person.setLocation(x,y);
				}
			}
			else{
				this.#checkEnemCollision(this.person.x,this.person.y);
			}

			let character;
			if(this.person.wounded){
				character=this.person.picWounded;
			}
			else{
				character=this.person.pic;
			}

			this.context.drawImage(character, this.person.x, this.person.y);
			this.coins.draw();
			this.enemies.draw();
		}
	}

	/**
	 * Проверяет столкновение персонажа со стенами
	 * 
	 * @param {number} x координата персонажа по x
	 * @param {number} y координата персонажа по y
	*/
	checkForCollision(x,y){
		let imgData = this.context.getImageData(x, y, 30, 30);
		let pixels = imgData.data;
	  
		for (let i = 0, n = pixels.length; i < n; i += 4) {
			let red = pixels[i];
			let green = pixels[i+1];
			let blue = pixels[i+2];
	  
			if (red<10 && green < 10 && blue < 10) { 
			return true;
			}
		}
		this.#checkCoinsCollision(x,y); 

		return false;
	}

	/**
	 * Проверяет столкновение c монетами на карте
	 * @private
	 * @param {number} x координата персонажа по x
	 * @param {number} y координата персонажа по y
	*/
	#checkCoinsCollision(x,y){
	 	const sizeC=this.coins.pic.height;
		let coinX,coinY,difX,difY;

	 	for(let i=0;i< this.coins.place.length; i++){
			coinX = this.coins.place[i].x;
			coinY = this.coins.place[i].y;
			difX = Math.abs(x-this.coins.place[i].x);
			difY = Math.abs(y-this.coins.place[i].y);

	 		if((difX < sizeC) && (difY < sizeC)){
	 			this.coins.place.splice(i,1);
				this.context.fillRect(coinX,coinY, sizeC, sizeC);
				this.person.addMoney();
	 		}
	 	}
	}

	/**
	 * Проверяет столкновение c врагами на карте
	 * @private
	 * @param {number} x координата персонажа по x
	 * @param {number} y координата персонажа по y
	*/
	#checkEnemCollision(x,y){ 
		if(!this.person.wounded){	
			const sizeE=this.enemies.pic.height;
			let enemX,enemY,difX,difY;
			for(let i=0;i< this.enemies.place.length; i++){
				enemX = this.enemies.place[i].x;
				enemY = this.enemies.place[i].y;
				difX = Math.abs(x-this.enemies.place[i].x);
				difY = Math.abs(y-this.enemies.place[i].y);

				if((difX < sizeE) && (difY < sizeE)){
					this.person.deleteLife();
				}
			}
		}
	 }

	/**
	 * Обработчик нажатия кнопок клавиатуры
	 * 
	 * @param {Event} event
	 */
	handleKeyDown(event){ 
		
		let direction;
		let value=event.key;
		switch(value){
			case "ArrowDown":{
				direction="down";
				break;
			}
			case "ArrowUp":{
				direction="up";
				break;
			}
			case "ArrowRight":{
				direction="right";
				break;
			}
			case "ArrowLeft":{
				direction="left";
				break;
			}
			default:
				return;
		}

		this.person.setSpeed(direction);
		event.preventDefault();  
	}
	
}