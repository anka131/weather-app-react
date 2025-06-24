import { useWeather } from "../context/WeatherContext";
import styles from "./TodayForecast.module.css";

function TodayForecast() {
  const { weather } = useWeather();

  if (!weather) return null;

  return (
    <div className={styles.table}>
      <h3 className={styles.tableTitle}>
        {weather?.currentConditions.conditions}
      </h3>
      <table className={styles.tableContainer}>
        <tbody>
          <tr>
            <td>Temp max</td>
            <td>
              {parseInt((5 / 9) * (weather?.days[0].tempmax - 32))}°{" "}
              <i className="text-danger bi bi-thermometer-half"></i>
            </td>
          </tr>
          <tr>
            <td>Temp min</td>
            <td>
              {parseInt((5 / 9) * (weather?.days[0].tempmin - 32))}°{" "}
              <i className="text-danger bi bi-thermometer-half"></i>
            </td>
          </tr>
          <tr>
            <td>Humidity</td>
            <td>
              {weather?.currentConditions.humidity}%{" "}
              <i className="bi bi-droplet"></i>
            </td>
          </tr>
          <tr>
            <td>Cloudy</td>
            <td>
              {weather?.currentConditions.cloudcover}%{" "}
              <i className="bi bi-clouds"></i>
            </td>
          </tr>
          <tr>
            <td>Wind</td>
            <td>
              {weather?.currentConditions.windspeed}km/h{" "}
              <i className="bi bi-wind"></i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default TodayForecast;
