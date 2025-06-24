import { useEffect } from "react";
import LocationForecast from "./LocationForecast";
import SearchLocation from "./SearchLocation";
import TodayForecast from "./TodayForecast";
import FutureForecast from "./FutureForecast";
import { useWeather } from "../context/WeatherContext";
import Spinner from "./Spinner";
import styles from "./AppLayout.module.css";

function AppLayout() {
  const {
    weather,
    loading,
    fetchUserWeather,
  } = useWeather();

  useEffect(() => {
    fetchUserWeather();
  }, [fetchUserWeather]);

  // Determine class based on weather condition
  const getBackgroundClass = () => {
    const cond = weather?.currentConditions;
    if (cond?.snow > 0) return styles.snowy;
    if (cond?.conditions?.toLowerCase().includes("rain")) return styles.rainy;
    if (cond?.cloudcover > 60) return styles.cloudy;
    return styles.sunny;
  };

  return (
    <div className={`${styles.banner} ${getBackgroundClass()}`}>
      <nav className={styles.navbar}>
        <img className={styles.logo} src="/img/logo.png" alt="logo" />
      </nav>

      {loading ? (
        <div className={styles.spinnerWrapper}><Spinner /></div>
      ) : (
        <>
          <LocationForecast />
          <div className={styles.sidebar}>
            <SearchLocation />
            <h4>Weather details...</h4>
            <TodayForecast />
            <FutureForecast />
          </div>
        </>
      )}
    </div>
  );
}

export default AppLayout;
