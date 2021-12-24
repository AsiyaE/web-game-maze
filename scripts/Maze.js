import { Person } from "./Person.js";


/**
 * Лабиринт создание карты
 */
 export class Maze{
	/** @type {Person} */
	person;
	lastCoinChange=0;
	coinFrame=0;
	canvas;
	context;

	constructor(person){
		this.person=person;
		this.handleKeyDown = this.handleKeyDown.bind( this );
	}

	clean(){
		document.removeEventListener('keydown',this.handleKeyDown);
	}

	setMaze(file,x,y){
	
		if (this.canvas===undefined){
			this.canvas=document.createElement("canvas");
			let place=document.querySelector(".content");
			place.appendChild(this.canvas); //removechild
		}
	
		this.context=this.canvas.getContext("2d");
		  // Загружаем изображение лабиринта
		let imgM = new Image();
		imgM.src = file;
		imgM.onload = () =>this.#draw(imgM,x,y);
	}

	#draw(imgM,x,y){
		this.canvas.width = imgM.width; //размер канваса = размеру изображения
		this.canvas.height = imgM.height;
		
		this.context.drawImage(imgM, 0,0);		
		this.context.drawImage(this.person.pic,x,y);
		this.context.stroke();
		
		document.addEventListener('keydown',this.handleKeyDown); 
		this.person.setLocation(x,y);
		this.drawFrame(0);
	}

	drawFrame(time){
		if(time-this.lastCoinChange>1000){
			this.lastCoinChange=time;
			this.coinFrame++;
			if(this.coinFrame===6){
				this.coinFrame=0;
			}
		}
		if (this.person.dx !== 0 || this.person.dy !== 0) { // Обновляем кадр только если значок движется
			// Закрашиваем перемещение значка 
			this.context.beginPath();
			this.context.fillStyle = "rgb(254,244,207)";
			this.context.rect(this.person.x, this.person.y, 29, 29);
			this.context.fill()
		
			// Обновляем координаты значка, создавая перемещение

			const x = this.person.x+this.person.dx;
			const y = this.person.y +this.person.dy;
			console.log(x,y);

			if (this.checkForCollision(x,y)) { 
				this.person.setSpeedToZero();
			}
			else{
				this.person.setLocation(x,y);
			}
			//рисуем сначала монетку

			
			var imgPer = document.getElementById("person");
			this.context.drawImage(imgPer, this.person.x, this.person.y);
			
			
		}
		window.requestAnimationFrame(this.drawFrame.bind(this));		
	}

	checkForCollision(x,y){
		let imgData = this.context.getImageData(x, y, 30, 30);
		let pixels = imgData.data;
	  
		for (let i = 0, n = pixels.length; i < n; i += 4) {
			let red = pixels[i];
			let green = pixels[i+1];
			let blue = pixels[i+2];
	  
			if (red<10 && green < 10 && blue < 10) { // наличие черного цвета - столкновение со стеной
			return true;
			}

			// Столкновение с монетами из массива - удалять монеткуиз массива

		}

		return false;
	}

	handleKeyDown(event){ //направление
		
		let direction;
		console.log("handleKeyDown");
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
		event.preventDefault();  //отключает обработку события по умолчанию
	}
}