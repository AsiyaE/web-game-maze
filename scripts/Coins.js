import { Maze } from "./Maze.js";

export class Coins{
	/** @type {Maze} */
	maze;

	/** @type {{x: number, y: number }[]} */
	place=[];

	/** @type {HTMLImageElement} */
	pic=new Image();

	/**
	 * @param {Maze} maze объект лабиринт
	 */
	constructor(maze){
		this.maze=maze;
		this.pic.src="img/coins.png"; 		// this.pic= document.getElementById("coin");
	}

	/**
	 * Задает положение монет в лабиринте
	 * @param {{x: number, y: number }[]} enemLocation координаты
	 */
	setPlace(coinsLocation){
		this.place = JSON.parse(JSON.stringify(coinsLocation));
	}

	/**
	 * Рисует разный ракурс монет в зависимости от кадра 
	 */
	draw(){
		const size=this.pic.height;
		let offset = size*this.maze.frame;

		let x, y;
		this.maze.context.fillStyle = "white";
		for(let i=0,n = this.place.length; i < n; i++){
			x=this.place[i].x;
			y=this.place[i].y;
			this.maze.context.fillRect(x, y, size, size);
			this.maze.context.drawImage(this.pic,offset,0,size,size,x,y,size,size);
		}	
	}

}