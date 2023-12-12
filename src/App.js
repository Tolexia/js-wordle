import { useState, useEffect } from 'react';
import wordsForGen from './data/data.json'
import './App.css';
import { createRoot , Root} from 'react-dom/client';
import  Keyboard  from "./components/Keyboard";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Stats from './components/Stats';
import storeState from './hooks/storeState';
import Grid from './components/Grid';
import Attemptcount from './components/Attemptcount';
import Restart from './components/Restart';

function App() 
{
	var prefix = 'wordle-'
	const [nb_min, setNb_min] = storeState(prefix+"nb_min", 4) 
	const [nb_max, setNb_max] =  storeState(prefix+"nb_max", 10)
	var wordsForTest = []
	const [currentInput, setCurrentInput] = useState(null)
	const [currentRow, setCurrentRow] = useState(null)
	const [word, setWord] = storeState(prefix+"word", null) 
	const [attemptCount, setAttemptCount] =  storeState(prefix+"attemptCount", 1)
	const [incorrectLetters, setIncorrectLetters] =  storeState(prefix+"incorrectLetters", [])
	const [correctLetters, setCorrectLetters] =  storeState(prefix+"correctLetters", {})
	const [hasWon, setHasWon] =  storeState(prefix+"hasWon", false)
	const [hasInit, sethasInit] =  storeState(prefix+"hasInit", false)
	console.log("correctLetters", correctLetters)
	console.log("hasWon", hasWon)
	
	async function genWordsData(genNewWord = false)
	{
		wordsForTest = []
		const importWords = async (number) => {
			const data = await require(`./data/francais_${number}.json`);
			// console.log("data", data)
			wordsForTest = wordsForTest.concat(data)
			// console.log("wordsForTest", wordsForTest)

		};
		for (let i = nb_min; i <= nb_max; i++) {
			
			await importWords(i);
		}
		if(genNewWord)
			setWord(getNewWord())

		sethasInit(true)
	}
	const mustGenNewWord = word == null
	if(hasInit != true)
		genWordsData(mustGenNewWord)
	
	function getNewWord()
	{
		const randomValue = Math.floor(Math.random()*wordsForGen.length)
		let newWord = wordsForGen[randomValue];
		if(!(newWord.length >= nb_min && newWord.length <= nb_max && wordsForTest.includes(newWord)))
		{
			newWord = null
			const newRandomValue = (randomValue < (0.8*wordsForGen.length) ? randomValue : Math.floor(Math.random()* (0.8*wordsForGen.length)))
			for (let index = newRandomValue; index < wordsForGen.length; index++) {
				const wordTmp = wordsForGen[index];
				if(wordTmp.length >= nb_min && wordTmp.length <= nb_max && wordsForTest.includes(wordTmp))
				{
					newWord = wordTmp
					break
				}
			}
		}
		if(newWord == null)
			newWord = getNewWord()
		console.log("newWord", newWord)
		document.getElementById("App").style = `--wordlength:${newWord.length}`
		return newWord;
	}
	async function newGame()
	{
		await genWordsData(true)
		for(let key in localStorage)
		{
			if(key.includes('wordle-input') || key.includes('wordle-attemptCount') || key.includes('wordle-incorrectLetters') || key.includes('wordle-correctLetters'))
			{
				localStorage.removeItem(key)
			}
		}
		setHasWon(false)
		setAttemptCount(1)
		setIncorrectLetters([])
		setCorrectLetters({})
		// refreshComponent('attemptsContainer', genAttempCount)
		// refreshComponent('grid', generateGrid)
		// refreshComponent('keyboardContainer', genKeyboard)
		document.querySelector('.restart').blur()
		setCurrentInput(getTargetInput(true))
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
				setCurrentInput(lastTypedInput)
			}
		}
		else if(e.key.length == 1 && e.key.match(/[a-zA-Z]/))
		{
			if(currentInput == null)
			{
				setCurrentInput(getTargetInput())
			}

			if(currentInput != null)
			{
				currentInput.value = e.key;
				currentInput.classList.add('typed')
				localStorage.setItem("wordle-input-"+currentInput.id, currentInput.value)
				setCurrentInput(getTargetInput())
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
			setCurrentRow(document.querySelector('.row:not(.over)'))
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
			setCurrentRow((document.querySelector('.row:not(.over)')))
		}
		console.log("wordsForTest", wordsForTest)
		if(currentRow != null)
		{
			let selection = "";
			const inputsInRow = currentRow.querySelectorAll('input')
			inputsInRow.forEach(input => selection += input.value)
			if(selection.length < word.length || !wordsForTest.includes(selection))
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
					setAttemptCount(attemptCount + 1)
					// refreshComponent('attemptsContainer', genAttempCount)
					setCurrentInput(getTargetInput(true))
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
		if(result == "win"){
			typeof previousGames[attemptCount] != "undefined" ? previousGames[attemptCount] += 1 : previousGames[attemptCount] = 1;
			setHasWon(true)
			// refreshComponent('attemptsContainer', genAttempCount)
		}
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
		// refreshComponent('keyboardContainer', genKeyboard)
		setPlaceholders()
	}
	function setPlaceholders(){
		document.querySelectorAll('.grid .row.over + .row:not(.over)').forEach(row => {
			const inputs = row.getElementsByTagName("input")
			for (let index = 0; index < inputs.length; index++) {
				const input = inputs[index];
				if(typeof correctLetters[index] != "undefined")
					input.placeholder = correctLetters[index]
			}
		})
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
					correctLetters[index] = input.value
					localStorage.setItem('wordle-correctLetters', JSON.stringify(correctLetters))
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
		setCurrentInput(getTargetInput())
	}
	function resetInput(input)
	{
		input.value = ""
		localStorage.removeItem("wordle-input-"+input.id)
		input.classList.remove('typed')
	}
	const generateGrid = function ()
	{
		// console.log("correctLetters", correctLetters);
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
							placeholder={value == null && typeof correctLetters[j] != "undefined" && correctLetters[j] == word[j] ? word[j] : ""}
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
		if(hasWon == true){
			return (<h4>Gagné</h4>)
		}
		else if(attemptCount <= 5)
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
		window.removeEventListener('keydown', handleTyping)
		window.addEventListener('keydown', handleTyping)
		const rows = document.querySelectorAll('.grid .row.over')
		rows.forEach(row => setRowColors(row))
	}, [])
	return (
		<div id='App' className="App" style={{'--wordlength': word.length}}>
				<Restart nbmin={nb_min} setNb_min={setNb_min} setNb_max={setNb_max} nbmax={nb_max} newGame={newGame}/>
				<Grid word={word} correctLetters={correctLetters} />
				<Attemptcount />
				<Keyboard incorrects={incorrectLetters}/>
		</div>
	);
}

export default App;
