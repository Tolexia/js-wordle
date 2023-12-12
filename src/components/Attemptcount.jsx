import '../stylesheets/Attemptcount.css'

const Attemptcount = function(props)
{
    const attemptCount = props.attemptCount
    const [hasWon, setHasWon] = useState(props.hasWon)
    useEffect( () => {
        setHasWon(props.hasWon);
    }, [props.hasWon]); 
    function getCount()
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
    return <div id='attemptsContainer'>
                {getCount()}
            </div>
}

export default Attemptcount;