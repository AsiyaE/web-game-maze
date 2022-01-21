import { Maze } from "./Maze.js";

export class Coins{
	/** @type {Maze} */
	maze;
	place=[];
	pic=new Image();

	constructor(maze){
		this.maze=maze;
		this.pic.src="img/coins.png"; 		// this.pic= document.getElementById("coin");
	}

	setPlace(){
		this.place[0]={x:18,y:200};
		this.place[1]={x:18,y:20};
		this.place[2]={x:262,y:250};
		this.place[3]={x:70,y:415};
	}
	draw(){
		let size=this.pic.height;
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