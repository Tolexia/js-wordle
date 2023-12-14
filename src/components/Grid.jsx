import '../stylesheets/Grid.css'
import { useEffect, useState } from 'react'
const Grid = function(props)
{
    const [word, setWord] = useState(props.word)
    const [isValid, setIsValid] = useState(props.isValid)
    // const [currentRow, setCurrentRow] = useState(props.currentRow)
    const correctLetters = props.correctLetters
    const incorrectLetters = props.incorrectLetters
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
                    props.setCorrectLetters(correctLetters)
					// localStorage.setItem('wordle-correctLetters', JSON.stringify(correctLetters))
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
                    props.setIncorrectLetters(incorrectLetters)
					// localStorage.setItem('wordle-incorrectLetters', JSON.stringify(incorrectLetters))
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
    useEffect(() => {
        setWord(props.word)
        setIsValid(props.isValid)
        const rows = document.querySelectorAll('.grid .row.over')
		rows.forEach(row => setRowColors(row))
    }, [props.word, props.isValid])
    return (
        <div id = 'grid' className='grid'>
            {[...Array(5)].map((x, i) => {
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
            )}
        </div>
    )
}

export default Grid;