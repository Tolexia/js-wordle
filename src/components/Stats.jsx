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
        <div className='stats-container'>
            {
                [...Array(5)].map((x, i) => 
                {
                    const value = (typeof data[x] != "undefined" ? data[x] : 0)
                    return (
                    <div className='stats-row' key={i} style={{width:`calc( 100% * ${value} / ${maxStat} )`}}>
                        <span className='stat-key'>{x}</span>
                        <span className='stat-value'>{value}</span>
                    </div>
                    )
                }
                )
            }
        </div>
    );
}

export default Stats;