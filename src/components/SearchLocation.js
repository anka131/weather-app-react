import { useWeather } from "../context/WeatherContext";
import styles from "./SearchLocation.module.css"; // Assuming you have a CSS file for styles

function SearchLocation() {
    const {
    loading,
    error,
    searchTerm,
    setSearchTerm,
    handleSearch,
    suggestions,
    setSuggestions,
    fetchCitySuggestions,
  } = useWeather();
  return (
    <div className={styles.search} role="search">
      <input
        type="text"
        value={searchTerm}
         onChange={(e) => {
          const value = e.target.value;
          setSearchTerm(value);
          fetchCitySuggestions(value); 
          
        }}
          onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
        id="searchInput"
        placeholder="Search location..."
        aria-label="Search"
      />

      <button type="button" onClick={() => handleSearch()}>
        <i className="fa-solid fa-magnifying-glass"></i>
      </button>
      {searchTerm.trim() !== "" && suggestions.length > 0 && (
      <ul className={styles.suggestions} role="listbox">
          {suggestions.map((city, idx) => (
            <li
              key={idx}
              onClick={() => {
                const selected = `${city.name}, ${city.country}`;
                setSearchTerm(selected);
                handleSearch(selected);
                setSuggestions([]);
              }}
            >
              {city.name}, {city.state && `${city.state}, `} {city.country}
            </li>
          ))}
        </ul>
      )}

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

     
    </div>
  );
}

export default SearchLocation;

