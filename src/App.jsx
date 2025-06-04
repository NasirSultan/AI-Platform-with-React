import { Routes, Route, Link } from 'react-router-dom';
import LinkedinPostGenerator from './LinkedinPostGenerator';
import OpenAi from './OpenAi';
import BackButton from './BackButton';

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4 py-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              Welcome to the AI Platform
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-8">
              Choose a tool below to get started
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 w-full max-w-md">
              <Link to="/AiAgent" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition">
                  LinkedIn Post Generator AiAgent
                </button>
              </Link>
              <Link to="/OpenAi" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition">
                  OpenAI Assistant
                </button>
              </Link>
            </div>
          </div>
        }
      />
      <Route
        path="/AiAgent"
        element={
          <>
            <LinkedinPostGenerator />
            <BackButton />
          </>
        }
      />
      <Route
        path="/OpenAi"
        element={
          <>
            <OpenAi />
            <BackButton />
          </>
        }
      />
    </Routes>
  );
}
