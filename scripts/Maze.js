import { Person } from "./Person.js";
import { Coins } from "./Coins.js";
import { Enemies } from "./Enemies.js";

/**
 * Составляющие лабиринта
 */
 export class Maze{
	/** @type {Person} */
	person;
	canvas;
	context;
	/** @type {number} */
	lastChange=0;
	/** @type {number} */
	frame=0;

	imgM = new Image();
	exit=new Image();
	exitX=-1;exitY=-1;

	constructor(person){
		this.person=person;
		this.exit.src="img/diamond.png"; 
		this.handleKeyDown = this.handleKeyDown.bind( this );
	}

	/**
	 * Блокирует движение игрока по полю
	*/
	clean(){
		document.removeEventListener('keydown',this.handleKeyDown);
	}

	// gameOver(){
	// }

	/**
	 * Проверяет, пройден ли уровень
	*/
	isLevelPassed(){
		 
		if ((Math.abs(this.person.x-this.exitX)<10)&&(Math.abs(this.person.y-this.exitY)<10)){
			alert("Win!!!");
			return true;
		}
		return false;
	}

	/**
	 * Устанавливает поле 
	*/
	setMaze(file,x,y){

		if (this.canvas===undefined){
			this.canvas=document.createElement("canvas");
			let place=document.querySelector(".content");
			place.appendChild(this.canvas); 
		}
	
		this.context=this.canvas.getContext("2d");
		this.imgM.src = file;
		this.imgM.onload = () =>this.#draw(x,y);
	}

	/**
	 * Рисует начальное положение объектов на поле
	 * @private
	*/
	#draw(x,y){
		this.canvas.width = this.imgM.width; 
		this.canvas.height = this.imgM.height;
		
		this.coins=new Coins(this);
		this.enemies=new Enemies(this);
		this.coins.setPlace();
		this.enemies.setPlace();

		this.context.drawImage(this.imgM, 0,0);
		this.coins.draw();
		this.enemies.draw();

		this.context.drawImage(this.person.pic,x,y);
		this.context.drawImage(this.exit,this.exitX,this.exitY);
		
		document.addEventListener('keydown',this.handleKeyDown); 
		this.person.setLocation(x,y);
		this.drawFrame(0);
	
	}

	/**
	 * перерисовывает состояние игры
	 * 
	 *  @param {number} time начальное время
	*/
	drawFrame(time){
		if(!this.isLevelPassed()){
			if(time-this.lastChange>1000){
				this.lastChange=time;
				this.frame++;
				if(this.frame===6){
					this.frame=0;
				}
			}
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
				this.#checkObjCollision(this.person.x,this.person.y);
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
			time=window.requestAnimationFrame(this.drawFrame.bind(this));
	}
	}

	/**
	 * Проверяет столкновение 
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
		this.#checkObjCollision(x,y); 

		return false;
	}

	/**
	 * Проверяет столкновение c объектами на карте
	 * @private
	 * @param {number} x координата персонажа по x
	 * @param {number} y координата персонажа по y
	*/
	#checkObjCollision(x,y){
	 	let sizeC=this.coins.pic.height;
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
		
		if(!this.person.wounded){	
			let sizeE=this.enemies.pic.height;
			let enemX,enemY;
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