import { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export default function CropRecommendation({ weather }) {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!weather) return;

    setLoading(true);
    setError("");
    setCrops([]);

    const season =
      weather.temperature >= 25
        ? "summer"
        : weather.temperature <= 15
        ? "winter"
        : "monsoon";

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are an agriculture expert in Nepal.

Based on the following data, recommend suitable crops.
Respond with ONLY a valid JSON array of crop names.
Do NOT include explanations, markdown, or extra text.

Location: ${weather.location}
Season: ${season}
Temperature: ${weather.temperature} °C
Humidity: ${weather.humidity} %
Weather Condition: ${weather.condition}

Example response:
["Rice", "Maize", "Wheat"]
`;

    model
      .generateContent(prompt)
      .then((res) => {
        const text = res.response.text().trim();

        // Ensure valid JSON
        const parsed = JSON.parse(text);

        if (!Array.isArray(parsed)) {
          throw new Error("Response is not an array");
        }

        setCrops(parsed);
      })
      .catch((err) => {
        console.error("Gemini error:", err);
        setError("Unable to fetch crop recommendations at the moment.");
      })
      .finally(() => setLoading(false));
  }, [weather]);

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <p className="text-blue-600">Loading crop recommendations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border-l-4 border-red-500 rounded-lg shadow bg-red-50">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 border-l-4 border-green-600 rounded-lg shadow bg-green-50">
      <h2 className="font-semibold text-green-700">
        Recommended Crops (AI-Based)
      </h2>

      <div className="flex flex-wrap gap-2 mt-3">
        {crops.map((crop) => (
          <span
            key={crop}
            className="px-3 py-1 text-sm font-medium text-green-800 bg-green-200 rounded-full"
          >
            {crop}
          </span>
        ))}
      </div>
    </div>
  );
}
