import { Maze } from "./Maze.js";

export class Levels{
	/** @type {Maze} */
	maze;

	/**
	 * Выбор уровня
	 * 
	 * @param {NodeListOf<Element>} buttons Кнопки выбора уровня
	 * @param {Maze} maze объект лабиринт
	 */
	constructor(buttons,maze){
		this.maze = maze;
		this._handleButtonClick = this._handleButtonClick.bind( this );
		for ( const button of buttons )
		{
			button.addEventListener('click', this._handleButtonClick );
			button.disabled=1;
		}
		buttons[0].disabled=0;
	}

	/**
	 * Обработчик нажатия на кнопки уровней
	 * 
	 * @param {Event} event
	 */
	 _handleButtonClick( event )
	{	
		const target = event.target;
		if ( !( target instanceof HTMLButtonElement ) )
		{
			 return;
		}
	
		if((this.maze.person.getLifeStatus()>0)&&(this.maze.person.curLevel>=target.id)){
			
			const level = target.dataset.level|| '';
			let imgL;
			let enemies=[],coins=[];
			let x,y
			switch(level){ 
				case "easy":
					imgL="img/easy.png";
					x=10;
					y=10;

					this.maze.exitX=400;
					this.maze.exitY=400;

					enemies.push({x:150,y:185});
					enemies.push({x:380,y:95});
					coins.push({x:18,y:190});
					coins.push({x:145,y:360});
					break;
				case "medium":
					imgL="img/medium.png";
					x=230;
					y=10;

					this.maze.exitX=270;
					this.maze.exitY=485;

					enemies.push({x:230,y:52});
					enemies.push({x:260,y:402});
					coins.push({x:13,y:20});
					coins.push({x:190,y:320});
					coins.push({x:320,y:230});
					break;

				case "hard":
					imgL="img/hard.png";
					x=10;
					y=10;

					this.maze.exitX=490;
					this.maze.exitY=490;

					enemies.push({x:17,y:140});
					enemies.push({x:50,y:405});
					enemies.push({x:300,y:405});
					coins.push({x:15,y:190});
					coins.push({x:57,y:450});
					break;

				default:
					throw new Error( `Unknown level "${level}"` );
			}
		this.maze.clean();
		this.maze.setMaze(imgL,x,y,enemies,coins);
		}
	}
 }