import { useEffect } from 'react';
import words from './data/data.json'
import './App.css';
import { createRoot , Root} from 'react-dom/client';

function App() 
{
	var currentInput, currentRow
	var word = localStorage.getItem("currentWord")
	var attemptCount = localStorage.getItem("wordle-attemptCount") != null ? localStorage.getItem("wordle-attemptCount") : 0
	
	if(word == null)
	{
		word = getNewWord()
	}

	function getNewWord()
	{
		const newWord = words[Math.floor(Math.random()*words.length)];
		localStorage.setItem("currentWord", newWord)
		console.log("newWord", newWord)
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
		else if(e.key == "Backspace")
		{
			const typedInputs = document.querySelectorAll('.grid .row:not(.over) input.typed')
			if(typedInputs.length > 0)
			{
				const lastTypedInput = typedInputs[typedInputs.length-1]
				resetInput(lastTypedInput)
				currentInput = lastTypedInput
			}
		}
		else if(e.key.length == 1 && e.key.match(/[a-zA-Z]/))
		{
			if(currentInput == null)
			{
				currentInput = getTargetInput()
			}
			console.log("currentInput", currentInput)
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
					attemptCount += 1
					const attemptsContainer = document.getElementById('attemptsContainer')
					const cloneAttemptsContainer = attemptsContainer.cloneNode()
					attemptsContainer.replaceWith(cloneAttemptsContainer)
					createRoot(cloneAttemptsContainer).render(updateAttempCount())
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
		return ([...Array(6)].map((x, i) => {
			const rowValues = [];
			for (let rowKey = 0; rowKey < word.length; rowKey++) {
				let value = localStorage.getItem('wordle-input-'+i+'-'+rowKey);
				if(value != null)
					rowValues.push(value)
			}
			const rowClassname = rowValues.length == word.length ? "row over" : "row"
			return (
			<tr className={rowClassname} key={i}>
				{[...Array(word.length)].map((y, j) => {
					let value = localStorage.getItem('wordle-input-'+i+'-'+j);
					return (<td key={j}>
						<input id={i+'-'+j} 
							maxLength={1} pattern='[a-zA-Z]' type='text' 
							className={value != null ? "typed" : ""}
							value={value != null ? value : ""} 
							onChange={()=>{}}
						/>
					</td>)
				}
				)}
			</tr>
			)
		}
		))
	}
	function updateAttempCount()
	{
		return (<h4>
			Attempts: <span>{attemptCount}</span>
			</h4>
		);
	}
	useEffect(()=>{
		window.addEventListener('keydown', handleTyping)
	}, [])
	return (
		<div className="App">
			<div id='attemptsContainer'>
				{updateAttempCount()}
			</div>
			<table className='grid'>
				<tbody>
				{generateGrid()}
				</tbody>
			</table>
			<button  className="restart" type="button" onClick={() => newGame()}>
				<svg width="3em" height="3em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M18.364 8.05026L17.6569 7.34315C14.5327 4.21896 9.46734 4.21896 6.34315 7.34315C3.21895 10.4673 3.21895 15.5327 6.34315 18.6569C9.46734 21.7811 14.5327 21.7811 17.6569 18.6569C19.4737 16.84 20.234 14.3668 19.9377 12.0005M18.364 8.05026H14.1213M18.364 8.05026V3.80762" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
				</svg>
			</button>
		</div>
	);
}

export default App;
