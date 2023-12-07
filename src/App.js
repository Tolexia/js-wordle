import { useEffect } from 'react';
// import words from './data/data.json'
import './App.css';
import { createRoot , Root} from 'react-dom/client';
import  Keyboard  from "./components/Keyboard";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Stats from './components/Stats';

function App() 
{
	var nb_min = localStorage.getItem('wordle-nb_min') ? parseInt(localStorage.getItem('wordle-nb_min')) : 4
	var nb_max = localStorage.getItem('wordle-nb_max') ? parseInt(localStorage.getItem('wordle-nb_max')) : 10
	var words = []
	var currentInput, currentRow
	var word = localStorage.getItem("currentWord")
	var attemptCount = localStorage.getItem("wordle-attemptCount") != null ? parseInt(localStorage.getItem("wordle-attemptCount")) : 1
	var incorrectLetters = localStorage.getItem("wordle-incorrectLetters") != null ? JSON.parse(localStorage.getItem("wordle-incorrectLetters")) : []
	
	function genWordsData()
	{
		words = []
		const importWords = async (number) => {
			const data = await import(`./data/francais_${number}.json`);
			words = words.concat(data)
		};
		for (let i = nb_min; i < (nb_max - nb_min); i++) {
			
			importWords(i);
		}
	}
	genWordsData()
	if(word == null)
	{
		word = getNewWord()
	}
	
	function getNewWord()
	{
		const newWord = words[Math.floor(Math.random()*words.length)];
		localStorage.setItem("currentWord", newWord)
		document.getElementById("App").style = `--wordlength:${newWord.length}`
		return newWord;
	}
	function newGame()
	{
		genWordsData()
		word = getNewWord()
		for(let key in localStorage)
		{
			if(key.includes('wordle-input') || key.includes('wordle-attemptCount') || key.includes('wordle-incorrectLetters'))
			{
				localStorage.removeItem(key)
			}
		}
		// document.querySelectorAll('.row input').forEach(input => input.value = "")
		attemptCount = 1
		incorrectLetters = []
		refreshComponent('attemptsContainer', genAttempCount)
		refreshComponent('grid', generateGrid)
		refreshComponent('keyboardContainer', genKeyboard)
		document.querySelector('.restart').blur()
		currentInput = getTargetInput(true)
	}

	const handleTyping = function (e){
		if(e.key == "Enter")
		{
			e.preventDefault()
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
		else{
			return null;
		}
		
	}
	function validateSelection()
	{
		if(currentRow == null)
		{
			currentRow = (document.querySelector('.row:not(.over)'))
		}
		
		if(currentRow != null)
		{
			let selection = "";
			const inputsInRow = currentRow.querySelectorAll('input')
			inputsInRow.forEach(input => selection += input.value)
			if(selection.length < word.length || !words.includes(selection))
			{
				resetRow(currentRow)
			}
			else
			{
				currentRow.classList.add('over')
				setRowColors(currentRow)
				if(selection == word)
				{
					gameOver('win')
				}
				else
				{
					attemptCount += 1
					localStorage.setItem("wordle-attemptCount", attemptCount)
					refreshComponent('attemptsContainer', genAttempCount)
					currentInput = getTargetInput(true)
					if(!currentInput)
					{
						gameOver('lose')
					}
				}
			}
		}
	}
	function gameOver(result)
	{
		document.querySelectorAll('.grid input:not(.typed)').forEach(input => {
			input.classList.add('typed')
			localStorage.setItem('wordle-input-'+input.id, "")
		})
		const previousGames = (localStorage.getItem('wordle-stats') != null ? JSON.parse(localStorage.getItem('wordle-stats')) : {})
		if(result == "win")
			typeof previousGames[attemptCount] != "undefined" ? previousGames[attemptCount] += 1 : previousGames[attemptCount] = 1;
		else
			typeof previousGames["loss"] != "undefined" ? previousGames["loss"] += 1 : previousGames["loss"] = 1;

		localStorage.setItem('wordle-stats', JSON.stringify(previousGames))
		
		const MySwal = withReactContent(Swal)
		MySwal.fire({
			title: "Stats",
			html: <Stats data = {previousGames} word={word}/>
		})
	}
	function setRowColors(row)
	{
		setCorrects(row)
		setAlmosts(row)
		setIncorrects(row)
		refreshComponent('keyboardContainer', genKeyboard)
	}
	function setCorrects(row)
	{
		const rowInputs = row.getElementsByTagName('input')
		for (let index = 0; index < rowInputs.length; index++) {
			const input = rowInputs[index];
			if(input.value != "")
			{
				if(input.value == word[index] && !input.classList.contains("correct"))
				{
					input.className += " correct"
				}
			}
		}
	}
	function setIncorrects(row)
	{
		const rowInputs = row.getElementsByTagName('input')
		for (let index = 0; index < rowInputs.length; index++) {
			const input = rowInputs[index];
			if(input.value != "")
			{
				if(!word.includes(input.value) && !incorrectLetters.includes(input.value))
				{
					incorrectLetters.push(input.value)
					localStorage.setItem('wordle-incorrectLetters', JSON.stringify(incorrectLetters))
				}
			}
		}
	}
	function setAlmosts(row)
	{
		const rowInputs = row.getElementsByTagName('input')
		for (let index = 0; index < rowInputs.length; index++) {
			const input = rowInputs[index];
			if(input.value != "")
			{
				if(word.includes(input.value))
				{
					let corrects = row.querySelectorAll(`.correct`)
					let almosts = row.querySelectorAll(`.almost`)
					let countThisLetter = 0
					let countCorrects = 0
					let countAlmosts = 0
					for (let index = 0; index < corrects.length; index++) 
					{
						const correct = corrects[index];
						if(input.value == correct.value)
							countCorrects++
						
					}
					for (let index = 0; index < almosts.length; index++) 
					{
						const almost = almosts[index];
						if(input.value == almost.value)
							countAlmosts++
						
					}
					for (let wordIndex = 0; wordIndex < word.length; wordIndex++) 
					{
						const wordLetter = word[wordIndex];
						if(input.value == wordLetter)
							countThisLetter++
						
					}
					if((countCorrects + countAlmosts) < countThisLetter && !input.classList.contains("correct") && !input.classList.contains("almost"))
					{
						input.className += " almost"
					}
				}
			}
		}
	}
	// console.log("word", word)

	function resetRow(row)
	{
		row.querySelectorAll('input').forEach(input => resetInput(input))
		currentInput = getTargetInput()
	}
	function resetInput(input)
	{
		input.value = ""
		localStorage.removeItem("wordle-input-"+input.id)
		input.classList.remove('typed')
	}
	const generateGrid = function ()
	{
		return ([...Array(5)].map((x, i) => {
			const rowValues = [];
			for (let rowKey = 0; rowKey < word.length; rowKey++) {
				let value = localStorage.getItem('wordle-input-'+i+'-'+rowKey);
				if(value != null)
					rowValues.push(value)
			}
			const rowClassname = rowValues.length == word.length ? "row over" : "row"
			return (
			<div className={rowClassname} key={i}>
				{[...Array(word.length)].map((y, j) => {
					let value = localStorage.getItem('wordle-input-'+i+'-'+j);
					const className = (value != null ? "typed" : "")
					return (
						<input key={j} id={i+'-'+j} 
							maxLength={1} pattern='[a-zA-Z]' type='text' 
							className={className}
							value={value != null ? value : ""} 
							onChange={()=>{}}
						/>
					)
				}
				)}
			</div>
			)
		}
		))
	}
	
	const genAttempCount = function ()
	{
		if(attemptCount <= 5)
		{
			return (<h4>
				Essai: <span>{attemptCount}</span>
				</h4>
			);
		}
		else{
			return (<h4>Perdu</h4>)
		}
	}
	const genKeyboard = function ()
	{
		return <Keyboard incorrects={incorrectLetters}/>
	}
	function refreshComponent(id, callback)
	{
		const container = document.getElementById(id)
		const clonecontainer = container.cloneNode()
		container.replaceWith(clonecontainer)
		createRoot(clonecontainer).render(callback())
	}
	useEffect(()=>{
		window.addEventListener('keydown', handleTyping)
		const rows = document.querySelectorAll('.grid .row.over')
		rows.forEach(row => setRowColors(row))
	}, [])
	return (
		<div id='App' className="App" style={{'--wordlength': word.length}}>
			<div style={{display:"flex"}}>
				<button  className="restart" type="button" onClick={() => newGame()}>
					<svg width="3em" height="3em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M18.364 8.05026L17.6569 7.34315C14.5327 4.21896 9.46734 4.21896 6.34315 7.34315C3.21895 10.4673 3.21895 15.5327 6.34315 18.6569C9.46734 21.7811 14.5327 21.7811 17.6569 18.6569C19.4737 16.84 20.234 14.3668 19.9377 12.0005M18.364 8.05026H14.1213M18.364 8.05026V3.80762" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
					</svg>
				</button>
				<div>
					<div className='range-container'>
						<label style={{display:"block"}} htmlFor="range_min">Nb min. de lettres</label>
						<input  id='range_min' type='range' min={4} max={10} defaultValue={nb_min} step={1} onChange={(event) => event.target.parentNode.getElementsByTagName("span")[0].innerText = event.target.value}/>
						<span className='range_value'></span>
					</div>
					<div className='range-container'>
						<label style={{display:"block"}} htmlFor="range_max">Nb max. de lettres</label>
						<input  id='range_max' type='range' min={4} max={10} defaultValue={nb_max} step={1} onChange={(event) => event.target.parentNode.getElementsByTagName("span")[0].innerText = event.target.value}/>
						<span className='range_value'></span>
					</div>
				</div>
			</div>
			<div id = 'grid' className='grid'>
				{generateGrid()}
			</div>
			<div id='attemptsContainer'>
				{genAttempCount()}
			</div>
			<div id = "keyboardContainer">
				{genKeyboard()}
			</div>
		</div>
	);
}

export default App;
