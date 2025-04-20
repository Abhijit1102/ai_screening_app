import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

type MentalHealthResult = {
  scores: {
    [category: string]: number;
  };
  explanations: {
    [category: string]: string;
  };
  average_score: number;
  summary: string;
};

const ResultPage = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user_id");
  const sessionId = searchParams.get("session_id");

  const [result, setResult] = useState<MentalHealthResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId && sessionId) {
      fetch(
        `http://localhost:8000/api/v1/screening/result?user_id=${userId}&session_id=${sessionId}`
      )
        .then((res) => res.json())
        .then((data) => {
          setResult(data);
        })
        .catch((err) => console.error("Error fetching result:", err))
        .finally(() => setLoading(false));
    }
  }, [userId, sessionId]);

  if (loading)
    return <p className="text-center text-blue-500 text-lg">Loading result...</p>;

  if (!result)
    return (
      <p className="text-center text-red-500 text-lg">
        No data found for this session.
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        🧠 Mental Health Assessment Result
      </h1>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Scores & Explanations</h2>
        <div className="space-y-4">
          {Object.entries(result.scores).map(([category, score]) => (
            <div
              key={category}
              className="bg-gray-100 p-4 rounded border border-gray-200"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-lg">{category}</span>
                <span className="text-blue-600 font-semibold">{score} / 10</span>
              </div>
              <div className="bg-blue-50 p-3 rounded border border-blue-200">
                <p className="font-semibold text-blue-800 mb-1">{category} Explanation</p>
                <p className="text-gray-700">{result.explanations[category]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-1">Average Score</h2>
        <p className="text-green-600 text-xl font-bold">
          {result.average_score.toFixed(2)} / 10
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-1">Final Summary</h2>
        <p className="text-gray-800 bg-yellow-50 p-4 rounded border border-yellow-200">
          {result.summary}
        </p>
      </div>
    </div>
  );
};

export default ResultPage;
