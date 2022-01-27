import { Maze } from "./Maze.js";

/**
 * Действия и характеристики врагов
 */
export class Enemies{
	
	/** @type {Maze} */
	maze;

	/** @type {{x: number, y: number }[]} */
	place=[];

	/** @type {{dx: number, dy: number }[]} */
	direction=[];

	/** @type {HTMLImageElement} */
	pic=new Image();

	/**
	 * @param {Maze} maze объект лабиринт
	 */
	constructor(maze){
		this.maze=maze;
		this.pic.src="img/snake.png";
	}

	/**
	 * Задает положение и направление движения врагов
	 * @param {{x: number, y: number }[]} enemLocation координаты
	 */
	setPlace(enemLocation){ 

		this.place = JSON.parse(JSON.stringify(enemLocation));
		for(let i=0;i<this.place.length;i++){
			this.direction[i]={dx:1,dy:0};
		}
	}

	/**
	 * Отрисовывает врагов на поле
	 */
	draw(){  
		const size=this.pic.height;
		this.maze.context.fillStyle = "white";
		for(let i=0,n = this.place.length; i < n; i++){ 
			this.maze.context.fillRect(this.place[i].x, this.place[i].y, size, size);
			const x = this.place[i].x+this.direction[i].dx;
			const y = this.place[i].y+this.direction[i].dy;

			if (this.#checkForCollisionWithWall(x,y)) { 
				this.#changeDirection(i);
				this.place[i].x+=this.direction[i].dx;
			}
			else{
				this.place[i].x=x;
			}
			this.maze.context.drawImage(this.pic,this.place[i].x,this.place[i].y);
		}
	}

	/**
	 * проверяет столкновение врагов со стенками лабиринта
	 * 
	 * @private
	 * @param {number} x координата персонажа по x
	 * @param {number} y координата персонажа по y
	 */
	#checkForCollisionWithWall(x,y){
		const size=this.pic.height;
		let imgData = this.maze.context.getImageData(x, y, size+1, size);
		let pixels = imgData.data;
	  
		for (let i = 0, n = pixels.length; i < n; i += 4) {
			let red = pixels[i];
			let green = pixels[i+1];
			let blue = pixels[i+2];
	  
			if (red<10 && green < 10 && blue < 10) { // наличие черного цвета - столкновение со стеной
			return true;
			}
		}
		return false;
	}

	/**
	 * Изменяет направление движения врага на противоположное
	 * @param {number} i порядковый номер врага
	 */
	#changeDirection(i){
		this.direction[i].dx*=-1;
	}
}