import AppLayout from "./components/AppLayout";
import { WeatherProvider } from "./context/WeatherContext";
function App() {
  
  return (
    <div className="App">
      <WeatherProvider>
      <AppLayout />
    </WeatherProvider>
    </div>
  );
}

export default App;





 
  
  
  
    
 







