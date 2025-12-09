import { useState } from "react";

export default function CropCalendar() {
  const cropCalendar = {
    January: ["Potato", "Cauliflower", "Carrot", "Pea"],
    February: ["Tomato (nursery)", "Chili (nursery)", "Cabbage"],
    March: ["Rice (nursery)", "Maize", "Cucumber", "Pumpkin"],
    April: ["Rice transplant", "Beans", "Bitter Gourd"],
    May: ["Rice", "Okra", "Sweet Potato"],
    June: ["Rice", "Millet", "Soybean"],
    July: ["Rice", "Corn (late)", "Green leafy vegetables"],
    August: ["Radish", "Spinach", "Broccoli"],
    September: ["Wheat (prepare land)", "Mustard", "Garlic"],
    October: ["Wheat", "Barley", "Pea"],
    November: ["Chickpea", "Lentil", "Onion"],
    December: ["Potato", "Garlic", "Cabbage", "Cauliflower"],
  };

  const months = Object.keys(cropCalendar);
  const currentMonth = months[new Date().getMonth()];
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  return (
    <div className="p-6 mt-8 border-l-4 border-green-600 rounded-lg shadow bg-green-50">
      <h2 className="mb-4 text-2xl font-bold text-green-700">Crop Calendar</h2>

      <div className="mb-4">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-3 py-2 text-green-700 border border-green-300 rounded focus:ring-2 focus:ring-green-400"
        >
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <div className="p-4 bg-white rounded shadow">
        <h3 className="mb-2 text-lg font-semibold text-green-700">
          {selectedMonth}
        </h3>
        <ul className="ml-5 text-gray-700 list-disc">
          {cropCalendar[selectedMonth].map((crop, index) => (
            <li key={index}>{crop}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
