import { useWeather } from "../context/WeatherContext";
import styles from "./FutureForecast.module.css";

function FutureForecast() {
  const { weather } = useWeather();

  return (
    <div className={styles.future}>
      <h3>Daily forecast</h3>
      <div className={styles.forecastList}>
        {weather?.days.slice(1, 5).map((day) => (
          <div className={styles.forecastItem} key={day.datetime}>
            <span className={styles.forecastIcon}>
              {day.snow > 0 ? "❄️" : day.cloudcover > 60 ? "🌥️" : "🌞"}
            </span>
            <span className={styles.forecastTime}>{day.datetime}</span>
            <span className={styles.forecastTemperature}>
              {parseInt((5 / 9) * (day.tempmin - 32))}°
            </span>
            <span className={styles.forecastTemperature}>
              {parseInt((5 / 9) * (day.tempmax - 32))}°
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FutureForecast;
