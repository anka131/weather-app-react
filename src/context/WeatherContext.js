// WeatherContext.js (Refactored)
import { createContext, useContext, useState, useCallback } from "react";

const WeatherContext = createContext();

export function WeatherProvider({ children }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const API_KEY = "AY8ARGU6JCGAMR6ASKCBSZQ7H";
  const GEO_API_KEY = "66ed3b80d326f482083849rtke61975";


  const fetchWeather = useCallback(async (location) => {
    if (!location) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${API_KEY}`
      );
      const data = await res.json();
      setWeather(data);
      setSuggestions([]);
      setError(null); // Clear previous error if any
    } catch (err) {
      setError("Failed to fetch weather data.");
    } finally {
      setLoading(false);
    }
  }, []);


  const fetchUserWeather = useCallback(async () => {
    setLoading(true);
    try {
      const coords = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos.coords),
          reject
        );
      });
      

      const locRes = await fetch(
        `https://geocode.maps.co/reverse?lat=${coords.latitude}&lon=${coords.longitude}&api_key=${GEO_API_KEY}`
      );
      const locData = await locRes.json();
      const city = locData.address.city || locData.address.town || locData.address.village;
      const country = locData.address.country;
      await fetchWeather(`${city},${country}`);
    } catch (err) {
      setError("Unable to get your location.");
    } finally {
      setLoading(false);
    }
  }, [fetchWeather]);

  const fetchCitySuggestions = useCallback(async (query) => {
    if (!query.trim()) return;
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${query}`);
      const data = await res.json();
      setSuggestions(data.results || []);
    } catch (err) {
      setSuggestions([]);
    }
  }, []);

const handleSearch = useCallback((value = searchTerm) => {
  if (!String(value).trim()) {
    alert("Please enter a location.");
    return;
  }
  fetchWeather(value);
}, [searchTerm, fetchWeather]);

  return (
    <WeatherContext.Provider
      value={{
        weather,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        suggestions,
        setSuggestions,
        fetchUserWeather,
        fetchWeather,
        fetchCitySuggestions,
        handleSearch,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  return useContext(WeatherContext);
}
