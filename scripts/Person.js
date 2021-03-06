/**
 * Действия и характеристики персонажа
 */
export class Person{
	
	/** @type {number} */
	#life=3;

	/** @type {number} */
	#money=0;

	/** @type {number} */
	x=0;

	/** @type {number} */
	y=0;

	/** @type {number} */
	dx=0;

	/** @type {number} */
	dy=0;

	/** @type {boolean} */
	wounded=false;

	/** @type {number} */
	curLevel=1;

	/** @type {HTMLImageElement} */
	picWounded=new Image();

	constructor(){
		this.pic=document.getElementById("person");
		this.picWounded.src="img/ghost_wounded.png"; 
		this.setSpeed = this.setSpeed.bind( this );
	}

	/**
	 * Добавляет монеты игроку
	*/
	addMoney(){
		this.#money++;
		let status= document.querySelectorAll( 'div.person span' );
		status[1].textContent=this.#money;
	}

	/**
	 * Забирает жизни игрока
	 */
	deleteLife(){
		const status= document.querySelectorAll( 'div.person span' );
		if(this.#life>1){
			this.wounded=true;
			setTimeout(()=>{this.wounded=false},3000);
			this.#life--;
			status[0].textContent=this.#life;
		}
		else{
			this.#life--;
			status[0].textContent=this.#life;
			this.die();
		}
		
	}

	/**
	 * Выводит статус игрока
	 */
	showPersonStatus(){
		const status= document.querySelectorAll( 'div.person span' );
		status[0].textContent=this.#life;
		status[1].textContent=this.#money;
	}

	/**
	 * Возвращает количество жизней
	 */
	getLifeStatus(){
		return this.#life;
	}


	/**
	 * Задает местоположение игрока в лабиринте
	 * @param {number} x координата x персонажа
	 * @param {number} y координата y персонажа
	 */
	setLocation(x,y){
		this.x=x;
		this.y=y;
	}

	/**
	 * останавливает движение игрока 
	 */
	setSpeedToZero(){
		this.dx = 0;
		this.dy = 0;
	}

	/**
	 * Устанавливает направление
	 * 
	 * @param {string} direction направление движения персонажа
	 */
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