import React from "react";
import { WiHumidity, WiStrongWind, WiCloud } from "react-icons/wi";

export default function CurrentWeatherCard({ data }) {
  if (!data) return null;

  const { temperature, humidity, windspeed, condition, icon, location } = data;

  return (
    <div className="w-full max-w-md p-6 text-white border border-blue-600 shadow-xl bg-gradient-to-r from-blue-500 to-blue-700 rounded-3xl">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold">{location}</h2>
        <span className="text-sm text-blue-200">{condition}</span>
      </div>

      <div className="flex items-center gap-5">
        <img
          src={icon}
          alt="weather icon"
          className="object-contain w-24 h-24"
        />
        <div>
          <h1 className="text-6xl font-bold">{temperature}°C</h1>
          <p className="text-sm text-blue-200">Feels like {temperature}°C</p>
        </div>
      </div>

      <div className="grid grid-cols-3 text-center mt-7">
        <div className="flex flex-col items-center">
          <WiHumidity size={36} className="text-blue-300" />
          <p className="mt-1 text-sm">{humidity}%</p>
          <span className="text-xs text-blue-200">Humidity</span>
        </div>

        <div className="flex flex-col items-center">
          <WiStrongWind size={36} className="text-blue-300" />
          <p className="mt-1 text-sm">{windspeed} km/h</p>
          <span className="text-xs text-blue-200">Wind</span>
        </div>

        <div className="flex flex-col items-center">
          <WiCloud size={36} className="text-blue-300" />
          <p className="mt-1 text-sm">{condition}</p>
          <span className="text-xs text-blue-200">Status</span>
        </div>
      </div>
    </div>
  );
}
