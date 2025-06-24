import { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { useWeather } from "../context/WeatherContext";
import Spinner from "./Spinner";
import styles from "./LocationForecast.module.css";

function LocationForecast() {
  const { weather, loading } = useWeather();
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = DateTime.now().setZone(weather?.timezone);
      setTime(now.toFormat("HH:mm:ss"));
      setDate(now.toFormat("cccc, dd LLL yyyy"));
    };

    updateClock();
    const intervalId = setInterval(updateClock, 1000);
    return () => clearInterval(intervalId);
  }, [weather?.timezone]);

  if (loading || !weather) return <Spinner />;

  return (
    <div className={styles.forecast}>
      <h1>{parseInt((5 / 9) * (weather?.currentConditions.temp - 32))}°</h1>
      <div className={styles.txt}>
        <h2>{weather?.address}</h2>
        <h3>{time} - {date}</h3>
      </div>
      <i className="bi bi-clouds"></i>
    </div>
  );
}

export default LocationForecast;
