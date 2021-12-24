export class Person{
	#life=3;
	#money=0;
	x=0;
	y=0;
	dx=0;
	dy=0;
	constructor(){
		this.pic=document.getElementById("person");
		this.setSpeed = this.setSpeed.bind( this );
	}
	addMoney(){
		this.#money++;
	}
	deleteLife(){
		if(this.#life>1){
		this.#life--;
		}
		console.log(this.#life);
	}
	getPersonStatus(){
		let status= document.querySelectorAll( 'div.person span' );
		console.log()
		status[0].textContent=this.#life;
		status[1].textContent=this.#money;
	}
	
	setLocation(x,y){
		this.x=x;
		this.y=y;
	}
	setSpeedToZero(){
		this.dx = 0;
		this.dy = 0;
	}
	setSpeed(direction){ 

		switch(direction){
			case "down":
				this.dy=1;
				break;
			case "up":
				this.dy=-1;
				break;
			case "left":
				this.dx=-1;
				break;
			case "right":
				this.dx=1;
				break;
			default:
				throw new Error(`incorrect direction ${direction}`);
		}

	}



}