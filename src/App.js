import { useEffect } from 'react';
import words from './data/data.json'
import './App.css';
import { createRoot , Root} from 'react-dom/client';

function App() 
{
	var currentInput, currentRow
	var word = localStorage.getItem("currentWord")
	console.log("init", word)
	if(word == null)
	{
		console.log("null")
		word = getNewWord()
	}

	function getNewWord()
	{
		console.log("getNewWord")
		const newWord = words[Math.floor(Math.random()*words.length)];
		localStorage.setItem("currentWord", newWord)

		return newWord;
	}
	function newGame()
	{
		word = getNewWord()
		for(let key in localStorage)
		{
			if(key.includes('wordle-input') || key.includes('wordle-attemptCount'))
			{
				localStorage.removeItem(key)
			}
		}
		// document.querySelectorAll('.row input').forEach(input => input.value = "")
		const tbody = document.querySelector('.grid tbody')
		const cloneTbody = tbody.cloneNode()
		tbody.replaceWith(cloneTbody)
		createRoot(cloneTbody).render(generateGrid())
	}
	console.log("word", word)
	const handleTyping = function (e){
		console.log("e.key", e.key)
		if(e.key == "Enter")
		{
			validateSelection()
		}
		else if(e.key.length == 1 && e.key.match(/[a-zA-Z]/))
		{
			if(currentInput == null)
			{
				currentInput = getTargetInput()
			}
			if(currentInput != null)
			{
				currentInput.value = e.key;
				currentInput.classList.add('typed')
				localStorage.setItem("wordle-input-"+currentInput.id, currentInput.value)
				currentInput = getTargetInput()
			}
			
		}
		else{
			e.preventDefault()
		}
	}
	function getTargetInput(forceNewRow = false)
	{
		if(currentRow == null || forceNewRow)
		{
			currentRow = document.querySelector('.row:not(.over)')
		}
		if(currentRow != null)
		{
			const inputEmpty = currentRow.querySelector('input:not(.typed)')
			if(inputEmpty != null)
			{
				return inputEmpty;
			}
		}
	}
	function validateSelection()
	{
		if(currentRow == null)
		{
			currentRow = (document.querySelector('.row:not(.over)'))
		}
		console.log("currentRow", currentRow)
		if(currentRow != null)
		{
			let selection = "";
			const inputsInRow = currentRow.querySelectorAll('input')
			inputsInRow.forEach(input => selection += input.value)
			if(selection == word)
			{
				alert('won')
			}
			else
			{
				console.log("selection", selection)
				console.log("word", word)
				console.log("selection.length < word.length", selection.length < word.length)
				console.log("!words.includes(selection)", !words.includes(selection))
				if(selection.length < word.length || !words.includes(selection))
				{
					resetRow(currentRow)
				}
				else
				{
					currentRow.classList.add('over')
					currentInput = getTargetInput(true)
				}
			}
		}
	}
	function resetRow(row)
	{
		console.log("resetRow")
		row.querySelectorAll('input').forEach(input => resetInput(input))
		currentInput = getTargetInput()
		console.log('currentInput', currentInput)
	}
	function resetInput(input)
	{
		input.value = ""
		localStorage.removeItem("wordle-input-"+input.id)
		input.classList.remove('typed')
	}
	function generateGrid()
	{
		return ([...Array(6)].map((x, i) =>
			<tr className='row' key={i}>
				{[...Array(word.length)].map((y, j) =>
					<td key={j}>
						<input id={i+'-'+j} maxLength={1} pattern='[a-zA-Z]' type='text' defaultValue={localStorage.getItem(i+'-'+j) != null ? localStorage.getItem(i+'-'+j) : ""} />
					</td>
				)}
			</tr>
		))
	}
	useEffect(()=>{
		window.addEventListener('keydown', handleTyping)
	}, [])
	return (
		<div className="App">
			<table className='grid'>
				<tbody>
				{generateGrid()}
				</tbody>
			</table>
			<button type="button" onClick={() => newGame()}>Restart</button>
		</div>
	);
}

export default App;
