import react, {useState, useEffect} from "react"
import process from 'process'


function WeatherApp(){

    const [data,setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)

    useEffect(()=>{

        const fetchData = async ()=>{
            try{
                setLoading(true);

                const apiKey = process.env.WEATHER-API-KEY;
                const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=London&aqi=no`)

                if(!response.ok){
                    throw new Error(`HTTP error! status: ${response.CDN-Status}`)
                }

                const result = await response.json();

                setData(result);

            }
            catch(err){

                setError(err.message);

            }
            finally{
                setLoading(false);
            }
        }
        fetchData();


    },[]);

    if(loading) return <p>Loading...</p>
    if(error) return <p>Error: {error}</p>

    return(
        <div className="container">
            <ul>
                {data.map((item) => (
                    <li key={item.id}>{item.title}</li>
                ))}
            </ul>
        </div>
    )

}

export default WeatherApp