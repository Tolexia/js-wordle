import "../stylesheets/Keyboard.css"
import {ReactComponent as Backspace} from '../Backspace.svg'
import {ReactComponent as Enter} from '../Enter.svg'
import { useEffect, useState } from "react"


const Keyboard =  function (props)
{
    const [isValid, setIsValid] = useState(props.isValid)
    // var currentInput = window.currentInput
    const keyboardValues = [
        ["a", "z", "e", "r", "t", "y", "u", "i", "o", "p"],
        ["q", "s", "d", "f", "g", "h", "j", "k", "l", "m"],
        ["Enter", "w", "x", "c", "v", "b", "n", "Backspace"],
    ]
    function clickKeyboardButton(letter)
    {
        var ev = new CustomEvent('keydown');
        ev.key = letter;
        console.log("letter", letter)
        window.dispatchEvent(ev);
    }
    useEffect(() => {
        setIsValid(props.isValid)
    }, [props.isValid])
    return (
        <div id = "keyboardContainer">
            <div className="keyboard">
            {keyboardValues.map((keyboardRow, i) => 
                <div key={i} className="keyboard-row">
                    {keyboardRow.map((keyboardLetter, j) => {
                        let className = "keyboard-button"
                        let value = (keyboardLetter == "Backspace" ? <Backspace/> : (keyboardLetter == "Enter" ? <Enter/> : keyboardLetter ) )
                        if(keyboardLetter.length > 1)
                            className += " extended"
                        if(props.incorrects.includes(value))
                            className += " incorrect"
                        return (
                        <button key={j} className={className} onClick={() => clickKeyboardButton(keyboardLetter)}>
                            {value}
                        </button>)
                        }
                    )}
                </div>
            )}
            </div>
        </div>
    )
}

export default Keyboard;