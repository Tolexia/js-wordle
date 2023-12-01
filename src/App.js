import { useState, useEffect } from 'react';
import words from './data/data.json'
import './App.css';

function App() 
{
	let word = localStorage.getItem("currentWord")
	if(word == null)
	{
		word = words[Math.floor(Math.random()*words.length)];
		localStorage.setItem("currentWord", word)
	}
	console.log("word", word)
	return (
		<div className="App">
			<table className='grid'>
			{[...Array(6)].map((x, i) =>
				<tr className='row' key={i}>
					{[...Array(word.length)].map((y, j) =>
						<td key={j}>
							<input type='text' />
						</td>
					)}
				</tr>
			)}
			</table>
		</div>
	);
}

export default App;
