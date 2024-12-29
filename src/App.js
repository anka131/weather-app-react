import { useState, useEffect, useMemo } from "react";
import { DateTime } from 'luxon';

function App() {
  
  return (
    <div className="App">
      <Banner />
    </div>
  );
}

export default App;


function Banner(){
  const [weather, setWeather] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState([]);

  const handleSearch = async (e) => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const res = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${searchTerm}?key=${apikey} `
      );
      if (!res.ok) throw new Error("Failed to fetch data");

      const data = await res.json();
      console.log("API Response:", data);
      setWeather(data); 
      setLoading(false);

      // Update search results based on the API's actual response structure
      // const results = Array.isArray(data) ? data : [data];
      // console.log(results);
      
      // setSearchResults(results);
      setSearchTerm(""); 
      setLoading(false);
    } catch (err) {
      setError(err.message || "Error searching for location");
      setLoading(false);
    }
  };

  const resSearch = useMemo(() => {
    return location.filter((loc) => loc.resolvedAddress.toUpperCase().includes(searchTerm.toUpperCase()));
  },[searchTerm, location]);

  console.log(resSearch);
  


 const geoApiKey = '66ed3b80d326f482083849rtke61975';
  const apikey='AY8ARGU6JCGAMR6ASKCBSZQ7H';

  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  };
  
  const getWeather = async (setWeather) => {
    try {
      const coords = await getUserLocation();
      const location = await fetch(`https://geocode.maps.co/reverse?lat=${coords.latitude}&lon=${coords.longitude}&api_key=${geoApiKey}`);
      if (!location.ok) throw new Error("Failed to fetch location data");
  
      const locationData = await location.json();
      // console.log(locationData);
      
  
      const city = locationData.address.city || locationData.town || locationData.village;
      const country = locationData.address.country;
  
      if (!city || !country) throw new Error("City or country not found in location data");
  
      
      const weatherResponse = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city},${country}?key=${apikey} `);
  
      if (!weatherResponse.ok) throw new Error("Failed to fetch weather data");
  
      const weatherData = await weatherResponse.json();
      console.log("Weather Data:", weatherData);
  
      setWeather(weatherData); // Update state once
    } catch (error) {
      console.error("Error fetching weather data:", error.message);
    }
  };
  
  // getWeather();
  useEffect(() => {
    let isMounted = true;
  
    const fetchWeather = async () => {
      if (isMounted) {
        await getWeather(setWeather);
        setLoading(false);
      }
    };
  
    fetchWeather();
  
    return () => {
      isMounted = false;
    };
  }, []);
  // console.log(weather.address);
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!weather) {
    return <div>Error loading weather data.</div>;
  }
  
  

  
  // url(${weather?.getCurrentConditions.snow > 0 ? '/img/banner.png' : weather?.getCurrentConditions.conditions === 'rain' ? '/img/rain.jpg' : weather?getCurrentConditions.cloudCover > 60 ? '/img/cloudy.jpg' : '/img/sunny-day.jpg'})
  
 
  return (
    <div className="banner"  style={{ backgroundImage: `url(${weather?.currentConditions.snow > 0 ? '/img/banner.png' : weather?.currentConditions.conditions === 'rain' ? '/img/rain.jpg' : weather?.currentConditions.cloudcover > 60 ? '/img/cloudy.jpg' : '/img/sunny-day.jpg'})`, width:"100%", height: "100vh",backgroundSize: "cover", backgroundRepeat:"no-repeat" }}>
      <nav className="navbar container">
        <div>
          <img className="logo" src="img/logo.png" alt="" />
        </div>
      </nav> 

  <LocationForecast weather={weather}/>

<div className="sidebar">    
<SearchLocation resSearch={resSearch} apikey={apikey} onHandleSearch={handleSearch} searchTerm={searchTerm} setSearchTerm={setSearchTerm} error={error} />
  <h4>Weather details...</h4>  
  <TodayForecast  weather={weather}/>
  <FutureForecast weather={weather}/>
</div>

   </div>
  )
}

function SearchLocation({ resSearch, loading, onHandleSearch, searchTerm, setSearchTerm, error }) {


  return (
    <div className="search d-flex">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        // onKeyDown={onHandleSearch}
        id="searchInput"
        placeholder="Search location..."
        aria-label="Search"
      />
      <button onClick={onHandleSearch}>
        <i className="fa-solid fa-magnifying-glass"></i>
      </button>

     {loading ? (
     <h3>Loading...</h3>
     ):(
      <ul id="searchList">{resSearch.map((loc, idx) => {
    return (
      <li key={idx}>{loc.resolvedAddress}</li>
    )
  }) }</ul>
     )}
     

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}


function LocationForecast({ weather }) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  // Update the time and date based on location's time zone
  useEffect(() => {
    const updateClock = () => {
      // Get the current time in the specified location's time zone
      const now = DateTime.now().setZone(weather?.timezone);

      // Format the current time and date
      const formattedTime = now.toFormat('HH:mm:ss');
      const formattedDate = now.toFormat('cccc, dd LLL yyyy');

      setTime(formattedTime);
      setDate(formattedDate);
    };

    // Call updateClock immediately to show the current time and date without delay
    updateClock();

    // Set an interval to update the time and date every second
    const intervalId = setInterval(updateClock, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [weather?.timezone]); // Rerun whenever the locationTimeZone changes

  return (
    <div className="forecast">
      <h1>{parseInt((5/9) *(weather?.currentConditions.temp - 32))}°</h1>
      <div className="txt">
        <h2>{weather?.address}</h2>
        <h3>
          {time} - {date}
        </h3>
      </div>
      <i className="bi bi-clouds"></i>
    </div>
  );
} 


function TodayForecast({weather}){
  return (
    <div className="table">
          <h3>{weather?.currentConditions.conditions}
    </h3>
      <table>
        <tbody>
          <tr>
            <td>Temp max</td>
            <td>{parseInt((5/9) *(weather?.days[0].tempmax - 32))}° <i className="text-danger bi bi-thermometer-half"></i></td>
          </tr>
          <tr>
            <td>Temp min</td>
            <td>{parseInt((5/9) *(weather?.days[0].tempmin - 32))}° <i className="text-danger bi bi-thermometer-half"></i></td>
          </tr>
          <tr>
            <td>Humidity</td>
            <td>{weather?.currentConditions.humidity}% <i className="bi bi-droplet"></i></td>
          </tr>
          <tr>
            <td>Cloudy</td>
            <td>{weather?.currentConditions.cloudcover}% <i className="bi bi-clouds"></i></td>
          </tr>
          <tr>
            <td>Wind</td>
            <td>{weather?.currentConditions.windspeed}km/h <i className="bi bi-wind"></i></td>
          </tr>
        </tbody>
      </table>
      </div>
  )
}



function FutureForecast({weather}){
  return (
    <div className="future">
<h3>Daily forecast</h3>
        <div className="forecast-list">
{weather?.days.slice(1, 5).map(day =>
  <div className="forecast-item">
  <span className="forecast-icon">
    
  {day.snow > 0  ? '❄️'  : day.cloudcover > 60 ? '🌥️' : '🌞'}

  </span>
  <span className="forecast-time">{day.datetime}</span>
  <span className="forecast-temperature">{parseInt((5/9) *(weather?.days[0].tempmin - 32))}°</span> 
  <span className="forecast-temperature">{parseInt((5/9) *(weather?.days[0].tempmax - 32))}°</span>
  
</div>
)}
   
   

</div>
    </div>
  

  )
}

