import '../stylesheets/Restart.css'

const Restart = function(props)
{
    let nb_min = props.nbmin
    let nb_max = props.nbmax
    const setNb_min = props.setNb_min
    const setNb_max = props.setNb_max
    const newGame = props.newGame
    function handleChangeRangeInput(event, refName)
	{
		let refValue = parseInt(event.target.value)
		if((refName === "nb_min" && refValue > nb_max) || (refName === "nb_max" && refValue < nb_min))
		{
			event.preventDefault()
			event.target.value = nb_min = nb_max 
			refValue = parseInt(event.target.value)
		}
		else if(refName == "nb_min")
			setNb_min(refValue) 
		else if(refName == "nb_max")
			setNb_max(refValue)

		event.target.parentNode.getElementsByTagName("span")[0].innerText = refValue;
		// localStorage.setItem("wordle-"+refName, refValue)
	}
    return (
        <div className='restart-container'>
            <div className='range-container'>
                <div className='range-item'>
                    <label style={{}} htmlFor="range_min">Nb min. de lettres</label>
                    <input  id='range_min' type='range' min={4} max={10} defaultValue={nb_min} step={1} onChange={(event) => handleChangeRangeInput(event, 'nb_min')}/>
                    <span className='range_value'>{nb_min}</span>
                </div>
                <div className='range-item'>
                    <label style={{}} htmlFor="range_max">Nb max. de lettres</label>
                    <input  id='range_max' type='range' min={4} max={10} defaultValue={nb_max} step={1} onChange={(event) => handleChangeRangeInput(event, 'nb_max')}/>
                    <span className='range_value'>{nb_max}</span>
                </div>
            </div>
            <button  className="restart" type="button" onClick={() => newGame()}>
				<svg width="3em" height="3em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M18.364 8.05026L17.6569 7.34315C14.5327 4.21896 9.46734 4.21896 6.34315 7.34315C3.21895 10.4673 3.21895 15.5327 6.34315 18.6569C9.46734 21.7811 14.5327 21.7811 17.6569 18.6569C19.4737 16.84 20.234 14.3668 19.9377 12.0005M18.364 8.05026H14.1213M18.364 8.05026V3.80762" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
				</svg>
			</button>
        </div>
    )
}

export default Restart;