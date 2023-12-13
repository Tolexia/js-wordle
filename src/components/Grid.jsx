import '../stylesheets/Grid.css'
import { useEffect, useState } from 'react'
const Grid = function(props)
{
    const [word, setWord] = useState(props.word)
    const correctLetters = props.correctLetters
    useEffect(() => {
        setWord(props.word)
    }, [props.word])
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