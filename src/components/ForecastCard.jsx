export default function ForecastCard({ forecast, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center p-4 transition bg-white border border-gray-200 shadow-md cursor-pointer rounded-xl hover:bg-blue-100"
    >
      <p className="mb-2 font-semibold text-gray-800">{forecast.day}</p>

      <img
        src={forecast.icon}
        alt={forecast.condition}
        className="w-20 h-20 mb-2"
      />

      <p className="mb-1 text-xl font-bold text-blue-600">{forecast.temp}°C</p>

      <p className="text-sm text-gray-500 capitalize">{forecast.condition}</p>
    </div>
  );
}
