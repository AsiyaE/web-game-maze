import { Maze } from "./Maze.js";
import { Person } from "./Person.js";
import { Levels } from './Levels.js';

main();

function main()
{
	const player = new Person();
	player.showPersonStatus();
	
	const buttons = document.querySelectorAll( 'div.buttons>button' );

	const maze = new Maze(player);
	player.die=(()=>maze.gameOver());
	new Levels(buttons,maze);
}