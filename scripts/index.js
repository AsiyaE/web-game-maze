import { Maze } from "./Maze.js";
import { Person } from "./Person.js";
import { Levels } from './Levels.js';

main();

function main()
{
	const player = new Person();
	player.getPersonStatus();
	const buttons = document.querySelectorAll( 'div.buttons>button' );
	const maze = new Maze(player);
	player.die=maze.gameOver;
	const level = new Levels(buttons,maze);
}