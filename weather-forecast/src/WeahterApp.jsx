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

                const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
                const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=London&aqi=no`)
                

                if(!response.ok){
                    throw new Error(`HTTP error! status: ${response.Status}`)
                }

                const result = await response.json();

                setData(result);
                console.log(data);

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
            <div className="current-weather">
                <h1>Current Weather</h1>
                <p>temprature:{data.current.temp_c}c/{data.current.temp_f}f</p>
                <p>wind speed:{data.current.wind_kph}</p>
                <p>Feels like:{data.current.feelslike_c}</p>
                <p>humidity:{data.current.humidity}</p>
            </div>
           
        </div>
    )

}

export default WeatherApp