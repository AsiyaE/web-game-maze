import { Maze } from "./Maze.js";

export class Levels{
		/** @type {Maze} */
		maze;

	constructor(buttons,maze){
		this.maze = maze;
		this._handleButtonClick = this._handleButtonClick.bind( this );
		for ( const button of buttons )
		{
			button.addEventListener('click', this._handleButtonClick );
		}
	}

/**
	 * Обработчик нажатия на кнопки
	 * 
	 * @private
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
		switch(level){
			case "easy":
				imgL="img/easy_maze.png";
				x=194;
				y=0;
				break;
			case "medium":
				imgL="img/maze10.png";
				x=165;
				y=0;
				break;
			case "hard":
				imgL="img/easy_maze.png";
				break;
			 default:
				throw new Error( `Unknown level "${level}"` );
		}
		this.maze.clean();
		this.maze.setMaze(imgL,x,y);
	}

 }