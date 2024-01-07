import '../stylesheets/Stats.css'

const Stats = function(props)
{
    const data = props.data
    let maxStat = 0
    Object.keys(data).forEach(key => {
        if(data[key] > maxStat)
            maxStat = data[key]
    });
    
    return (
        <div>
            <p>Mot : {props.word[0].toUpperCase()+props.word.slice(1)}</p>
            <div className='stats-container'>
                {
                    [...Array(5)].map((x, i) => 
                    {
                        let index = i+1
                        const value = (typeof data[index] != "undefined" ? data[index] : 0)
                        return (
                        <div className='stats-row' key={index} style={{width:`calc( 100% * ${value} / ${maxStat} )`}}>
                            <span className='stat-key'>{index}</span>
                            <span className='stat-value'>{value}</span>
                        </div>
                        )
                    }
                    )
                }
                <div className='stats-row' key={"loss"} style={{width:`calc( 100% * ${!isNaN(parseInt(data["loss"])) ?data["loss"] : 0 } / ${maxStat} )`}}>
                    <span className='stat-key' style={{left:"-1.5em"}}>&#128128;</span>
                    <span className='stat-value'>{data["loss"]}</span>
                </div>
            </div>
        </div>
    );
}

export default Stats;