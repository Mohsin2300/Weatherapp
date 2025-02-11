import react, {useState, useEffect} from "react"
import process from 'process'
import clearDayRain from "./assets/backgroundpictures/clear-day-rain.jpg"
import clearDaySnow from "./assets/backgroundpictures/clear-day-snow.jpg"
import clearDay from "./assets/backgroundpictures/clear-day.jpg"
import clearNightRain from "./assets/backgroundpictures/clear-night-rain.jpg"
import clearNightSnow from "./assets/backgroundpictures/clear-night-snow.jpg"
import clearNight from "./assets/backgroundpictures/clear-night.jpg"
import cloudyDayRain from "./assets/backgroundpictures/cloudy-day-rain.jpg"
import cloudyDaySnow from "./assets/backgroundpictures/cloudy-day-snow.jpg"
import cloudyDay from "./assets/backgroundpictures/cloudy-day.jpg"
import cloudyNightRain from "./assets/backgroundpictures/cloudy-night-rain.jpg"
import cloudyNightSnow from "./assets/backgroundpictures/cloudy-night-snow.jpg"
import cloudyNight from "./assets/backgroundpictures/cloudy-night.jpg"


function WeatherApp(){

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [location, setLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [tempToggle, setTempToggle] = useState(true);
    const [speedToggle, setSpeedToggle] = useState(true)

    useEffect(()=>{
        const fetchLocation = async() => {
            try{
                const res = await fetch("http://ip-api.com/json/");
                const data = await res.json();

                if(data.status === "success"){
                    setLocation(data.city);
                }
                else{
                    throw new Error("failed to fetch location")
                }
            } catch (err) {
                setLocationError("Error fetching IP address or location");
            }
        }
        fetchLocation();
    },[])


    useEffect(()=>{

        const fetchData = async ()=>{
            try{
                setLoading(true);

                const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
                const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=10&aqi=no&alerts=yes`)
                

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
           
    },[location]);

    useEffect(()=> {
        if (data){
            if(data.current.precip_mm === 0){
                if(data.current.is_day == 0 && data.current.cloud > 50){
                    document.body.style.backgroundImage = `url(${cloudyNight})` // cloudy night
                }
                else if (data.current.is_day == true && data.current.cloud > 50) {
                    document.body.style.backgroundImage = `url(${cloudyDay})`  // cloudy day
                }
                else if(data.current.is_day == 0 && data.current.cloud <= 50){
                    document.body.style.backgroundImage = `url(${clearNight})`  // clear night
                }
                else if (data.current.is_day == true && data.current.cloud <= 50){
                    document.body.style.backgroundImage = `url(${clearDay})`  // clear day
                }
            }
            else if(data.current.precip_mm != 0){
                if(data.current.is_day == 0 && data.current.cloud > 50 && data.current.temp_c <= 0){
                    document.body.style.backgroundImage = `url(${cloudyNightSnow})`  // cloudy night snow
                }
                else if (data.current.is_day == 0 && data.current.cloud > 50 && data.current.temp_c > 0) {
                    document.body.style.backgroundImage = `url(${cloudyNightRain})`  // cloudy night rain
                }
                else if(data.current.is_day == 0 && data.current.cloud <= 50 && data.current.temp_c <= 0){
                    document.body.style.backgroundImage = `url(${clearNightSnow})` // clear night snow
                }
                else if (data.current.is_day == 0 && data.current.cloud <= 50 && data.current.temp_c > 0){
                    document.body.style.backgroundImage = `url(${clearNightRain})`// clear night rain
                }
                else if (data.current.is_day == true && data.current.cloud > 50 && data.current.temp_c <= 0){
                    document.body.style.backgroundImage = `url(${cloudyDaySnow})`// cloudy day snow
                }
                else if (data.current.is_day == true && data.current.cloud > 50 && data.current.temp_c > 0){
                    document.body.style.backgroundImage = `url(${cloudyDayRain})`// cloudy day rain
                }
                else if (data.current.is_day == true && data.current.cloud <= 50 && data.current.temp_c <= 0){
                    document.body.style.backgroundImage = `url(${clearDaySnow})` // clear day snow
                }
                else if (data.current.is_day == true && data.current.cloud <= 50 && data.current.temp_c > 0){
                    document.body.style.backgroundImage = `url(${clearDayRain})` // clear day rain
                }
            }
        }
        else {
            console.log(error);
        }

    },[data]);

    const handleTempToggle = () => {
        setTempToggle((prevState) => !prevState);
    }

    const handleSpeedToggle = () => {
        setSpeedToggle((prevState) => !prevState);
    }

    console.log(data);
    if(loading) return <p>Loading...</p>
    if(error) return <p>Error: {error}</p>
    if(locationError) return <p>Location Error: {locationError}</p>
   

    return(
        <div>
            <button className="temp-toggle" onClick={handleTempToggle}>{tempToggle ? "Celsius": "Farenheit"}</button>
            <button className="speed-toggle" onClick={handleSpeedToggle}>{speedToggle ? "kph" : "mph"}</button>
            <div className="container">
                <div className="current-weather">
                   <h1>Current Weather</h1>
                    <p>Location: {location}</p>
                    <p>temprature: {tempToggle ? `${data.current.temp_c}°C` : `${data.current.temp_f}F` }</p>
                    <p>wind speed: {speedToggle ? `${data.current.wind_kph}kph` : `${data.current.wind_mph}mph` }</p>
                    <p>Feels like: {tempToggle ? `${data.current.feelslike_c}°C` : `${data.current.feelslike_f}F` }</p>
                    <p>humidity: {data.current.humidity}</p>
                    <p>Rain: {data.current.precip_mm} mm</p>
                    <p>cloud: {data.current.cloud}%</p>
                </div>
                <div className="current-weather">
                    <h1>Weather forcast</h1>
                    <p>avg. temp: {tempToggle ? `${data.forecast.forecastday[0].day.avgtemp_c}°C` : `${data.forecast.forecastday[0].day.avgtemp_f}F` } </p>
                    <p>min. temp: {tempToggle ? `${data.forecast.forecastday[0].day.mintemp_c}°C` : `${data.forecast.forecastday[0].day.mintemp_f}F` } </p>
                    <p>max. temp: {tempToggle ? `${data.forecast.forecastday[0].day.maxtemp_c}°C` : `${data.forecast.forecastday[0].day.maxtemp_f}F` }</p>
                    <p>avg. humidity: {data.forecast.forecastday[0].day.avghumidity}%</p>
                    <p>max wind: {speedToggle ? `${data.forecast.forecastday[0].day.maxwind_kph}kph` : `${data.forecast.forecastday[0].day.maxwind_mph}mph` }</p>
                </div>
                <div>
                    <h1>Weather Forecast (Hourly)</h1>
                    <div className="weather-hourly">
                        {data.forecast.forecastday[0].hour.map((hourData, index) => (
                        <div key={index} className="hourly">
                            <p>{hourData.time.substring(11)}</p>
                            <p>{tempToggle ? `${hourData.temp_c}°C` : `${hourData.temp_f}F` }</p>
                            <p>{hourData.cloud}%</p>
                            <p>{speedToggle ? `${hourData.wind_kph}kph` : `${hourData.wind_mph}mph` }</p>
                            <p>{hourData.is_day === 1 ? 'Day' : 'Night'}</p>
                            <p>{hourData.will_it_rain ? 'raining' : 'No raining'}</p>
                        </div>
                        ))}
                    </div>
                    
                </div>
                <div className="warnings">
                    <h1>Alerts</h1>
                    {data.alerts && data.alerts.alert.length > 0 ? (
                        data.alerts.alert.map((weatherAlert, index) => (
                            <div key={index} className="alerts">
                                <p>Alert: {weatherAlert.desc}</p>
                                <p>Severity: {weatherAlert.severity}</p>
                                <p>Urgency: {weatherAlert.urgency}</p>
                            </div>
                        ))
                    ) : (
                        <p>No alerts today.</p>
                    )}
                </div>
                <h1>Day-cycle</h1>
                <div className="day-cycle">
                    <p> sunrise: {data.forecast.forecastday[0].astro.sunrise}</p>
                    <p> sunset: {data.forecast.forecastday[0].astro.sunset}</p>
                    <p> moonrise: {data.forecast.forecastday[0].astro.moonrise}</p>
                    <p> moonset: {data.forecast.forecastday[0].astro.moonset}</p>
                    <p> Moon Phase: {data.forecast.forecastday[0].astro.moon_phase}</p>
                </div>
                <div>
                    <h1>Weather Forecast (Daily)</h1>
                    <div className="weather-hourly">
                        {data.forecast.forecastday.map((dailyData, index) => (
                        <div key={index} className="hourly">
                            <p>{dailyData.date}</p>
                            <p>{tempToggle ? `${dailyData.day.avgtemp_c}°C` : `${dailyData.day.avgtemp_c}F` }</p>
                            <p>{dailyData.day.daily_chance_of_rain}%</p>
                            <p>{speedToggle ? `${dailyData.day.maxwind_kph}kph` : `${dailyData.day.maxwind_mph}mph` }</p>
                            <p>{dailyData.day.avghumidity}</p>
                        </div>
                        ))}
                    </div>
                </div>
            

            </div>
        </div>
           
    )

}

export default WeatherApp