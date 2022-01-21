import { Maze } from "./Maze.js";

export class Levels{
		/** @type {Maze} */
		maze;

	/**
	 * Выбор уровня
	 * 
	 * @param {NodeListOf<Element>} buttons Кнопки выбора уровня
	 * @param {Maze} maze Связанный калькулятор
	 */
	constructor(buttons,maze){
		this.maze = maze;
		this._handleButtonClick = this._handleButtonClick.bind( this );
		for ( const button of buttons )
		{
			button.addEventListener('click', this._handleButtonClick );
		}
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
		 
		const level = target.dataset.level|| '';
		let imgL;
		let x,y
		switch(level){ /*временно*/ 
			case "easy":
				imgL="img/medium_level.png";
				x=210;
				y=0;
				this.maze.exitX=260;
				this.maze.exitY=460;
				break;
			case "medium":
				imgL="img/medium_level.png";
				x=210;
				y=0;
				this.maze.exitX=260;
				this.maze.exitY=460;
				break;
			case "hard":
				imgL="img/medium_level.png";
				x=210;
				y=0;
				this.maze.exitX=260;
				this.maze.exitY=460;
				break;
			 default:
				throw new Error( `Unknown level "${level}"` );
		}
		this.maze.clean();
		this.maze.setMaze(imgL,x,y);
	}

 }