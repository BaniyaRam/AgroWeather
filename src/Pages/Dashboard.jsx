import { useState, useEffect } from "react";
import Header from "../components/Header";
import CurrentWeatherCard from "../components/CurrentWeatherCard";
import ForecastCard from "../components/ForecastCard";
import WeatherChart from "../components/WeatherChart";
import CropRecommendation from "../components/CropRecommendation";

export default function Dashboard() {
  const [city, setCity] = useState("Pokhara");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [lastAlert, setLastAlert] = useState("");

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  const offlineDevMode = false;
  const isOffline = offlineDevMode || !navigator.onLine;

  useEffect(() => {
    if ("serviceWorker" in navigator)
      navigator.serviceWorker.register("/sw.js");
  }, []);

  const getFarmingAlert = (data = weatherData) => {
    if (!data) return "No data available";
    const temp = data.temperature ?? data.temp;
    const humidity = data.humidity ?? 0;
    const condition = data.condition?.toLowerCase() ?? "";
    if (condition.includes("rain"))
      return "Rain expected – delay harvesting and avoid pesticide spraying";
    if (condition.includes("thunderstorm"))
      return "Thunderstorm likely – secure tools and protect livestock";
    if (temp > 35)
      return "High temperature – irrigate crops and avoid fertilizer application";
    if (humidity > 80)
      return "High humidity – fungal disease risk, monitor crops closely";
    return "Weather normal – good day for regular field activities";
  };

  const speakAlert = (message) => {
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setNotificationsEnabled(true);
      setLastAlert("");
      alert("Notifications enabled!");
    }
  };

  const disableNotifications = () => {
    setNotificationsEnabled(false);
    setLastAlert("");
    alert("Notifications disabled!");
  };

  const sendNotification = (title, body, day) => {
    if (!notificationsEnabled) return;
    if (body !== lastAlert) {
      speakAlert(body);
      setLastAlert(body);
    }
    if ("serviceWorker" in navigator && Notification.permission === "granted") {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification(title, {
          body,
          icon: "/favicon.ico",
          data: { url: `/dashboard?day=${day}` },
        });
      });
    }
  };

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      const cachedWeather = JSON.parse(localStorage.getItem("lastWeather"));
      const cachedForecast = JSON.parse(localStorage.getItem("lastForecast"));

      if (isOffline) {
        if (cachedWeather) setWeatherData(cachedWeather);
        if (cachedForecast) setForecastData(cachedForecast);
        setLoading(false);
        return;
      }

      try {
        // Current Weather
        const weatherRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city},NP&appid=${apiKey}&units=metric`
        );
        if (!weatherRes.ok) throw new Error("City not found");
        const weather = await weatherRes.json();
        const currentWeather = {
          location: weather.name,
          temperature: Math.round(weather.main.temp),
          humidity: weather.main.humidity,
          windSpeed: Math.round(weather.wind.speed),
          windDeg: weather.wind.deg,
          condition: weather.weather[0].main,
          icon: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
        };
        setWeatherData(currentWeather);
        localStorage.setItem("lastWeather", JSON.stringify(currentWeather));
        sendNotification("Farming Alert", getFarmingAlert(currentWeather));

        // Forecast
        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city},NP&appid=${apiKey}&units=metric`
        );
        if (!forecastRes.ok) throw new Error("Failed to fetch forecast");
        const forecastJson = await forecastRes.json();
        const dailyForecast = forecastJson.list
          .filter((item) => item.dt_txt.includes("12:00:00"))
          .map((item) => {
            const dateObj = new Date(item.dt_txt);
            const dayName = dateObj.toLocaleDateString("en-US", {
              weekday: "long",
            });
            return {
              day: dayName,
              temp: Math.round(item.main.temp),
              feelsLike: Math.round(item.main.feels_like),
              tempMin: Math.round(item.main.temp_min),
              tempMax: Math.round(item.main.temp_max),
              humidity: item.main.humidity,
              windSpeed: Math.round(item.wind.speed),
              windDeg: item.wind.deg,
              condition: item.weather[0].main,
              icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
              rain: item.rain?.["3h"] || 0,
              clouds: item.clouds.all,
            };
          });
        setForecastData(dailyForecast);
        localStorage.setItem("lastForecast", JSON.stringify(dailyForecast));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 1000 * 60 * 2); // update every 2 min
    return () => clearInterval(interval);
  }, [city, notificationsEnabled, isOffline]);

  useEffect(() => {
    setSelectedDay(null);
  }, [city]);

  return (
    <>
      <Header />
      <div className="min-h-screen p-5 bg-blue-50">
        {isOffline && (
          <div className="p-2 mb-3 text-center text-white bg-red-500 rounded">
            You are offline — showing last saved data
          </div>
        )}

        <div className="flex items-center gap-3 mb-5">
          <label className="font-medium text-blue-700">Select City:</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="px-3 py-2 text-blue-800 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="Janakpur">Janakpur</option>
            <option value="Birgunj">Birgunj</option>
            <option value="Kathmandu">Kathmandu</option>
            <option value="Pokhara">Pokhara</option>
          </select>
          {!notificationsEnabled ? (
            <button
              onClick={requestNotificationPermission}
              className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              Enable Notifications
            </button>
          ) : (
            <button
              onClick={disableNotifications}
              className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Disable Notifications
            </button>
          )}
        </div>

        {loading && (
          <p className="font-medium text-blue-600">Loading weather data...</p>
        )}
        {error && <p className="font-medium text-red-500">Error: {error}</p>}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            {weatherData && <CurrentWeatherCard data={weatherData} />}

            {weatherData && (
              <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded-lg shadow">
                <h2 className="font-semibold text-yellow-700">Farming Alert</h2>
                <p className="mt-1 text-yellow-800">{getFarmingAlert()}</p>
              </div>
            )}

            {/* Crop Recommendation */}
            {weatherData && <CropRecommendation weather={weatherData} />}

            {/* <CropCalendar /> */}
          </div>

          <div className="space-y-6 lg:col-span-2">
            {forecastData.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                {forecastData.map((day, index) => (
                  <ForecastCard
                    key={index}
                    forecast={day}
                    onClick={() => setSelectedDay(day)}
                  />
                ))}
              </div>
            )}

            {forecastData.length > 0 && (
              <div className="p-6 bg-white shadow rounded-xl h-96">
                <WeatherChart forecastData={forecastData} />
              </div>
            )}
          </div>
        </div>

        {selectedDay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-11/12 max-w-md p-6 bg-white shadow-lg rounded-xl">
              <button
                onClick={() => setSelectedDay(null)}
                className="absolute text-xl font-bold text-gray-500 top-3 right-3 hover:text-gray-800"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold text-blue-700">
                {selectedDay.day} – Detailed Forecast
              </h2>
              <div className="flex items-center gap-6 mt-4">
                <img
                  src={selectedDay.icon}
                  alt={selectedDay.condition}
                  className="w-24 h-24"
                />
                <div>
                  <p className="text-2xl font-semibold text-blue-600">
                    {selectedDay.temp}°C
                  </p>
                  <p className="text-gray-700">
                    Feels Like: {selectedDay.feelsLike}°C
                  </p>
                  <p className="text-gray-700">
                    Min / Max: {selectedDay.tempMin}°C / {selectedDay.tempMax}°C
                  </p>
                  <p className="text-gray-700">
                    Humidity: {selectedDay.humidity}%
                  </p>
                  <p className="text-gray-700">
                    Wind: {selectedDay.windSpeed} m/s ({selectedDay.windDeg}°)
                  </p>
                  <p className="text-gray-700">Rain: {selectedDay.rain} mm</p>
                  <p className="text-gray-700">Clouds: {selectedDay.clouds}%</p>
                  <p className="font-medium text-yellow-700">
                    {getFarmingAlert(selectedDay)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
