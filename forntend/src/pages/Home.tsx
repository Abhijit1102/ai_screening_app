import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-blue-700 mb-4">
          🤖 AI-Assisted Mental Health Screening
        </h1>
        <p className="text-center text-gray-600 text-lg sm:text-xl mb-10">
          A smart, age-aware chatbot to conduct adaptive mental health assessments with empathy and precision.
        </p>

        {/* Description */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-blue-600 mb-2 flex items-center gap-2">
            🧠 Description
          </h2>
          <p className="text-gray-700 leading-relaxed">
            This innovative chatbot-based system supports children and adults through dynamic, conversational mental health screenings using Retrieval-Augmented Generation (RAG) and contextual understanding.
          </p>
        </section>

        {/* Key Features */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-blue-600 mb-2 flex items-center gap-2">
            🌟 Key Features
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 pl-4">
            <li>🧒👩 Age-based adaptive chatbot experience</li>
            <li>🧠 Memory-driven RAG pipeline</li>
            <li>⚙️ Plug-in support for any LLM</li>
            <li>📊 Rubric-based, standardized scoring</li>
            <li>🗃️ MongoDB vector knowledge base</li>
            <li>⚡ Smooth React + FastAPI integration</li>
            <li>🎨 Engaging, age-tailored user experience</li>
          </ul>
        </section>

        {/* Goals */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-blue-600 mb-2 flex items-center gap-2">
            🎯 Goals & Milestones
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 pl-4">
            <li>✅ Age-based query routing</li>
            <li>✅ RAG retrieval with MongoDB</li>
            <li>✅ React ↔ FastAPI communication</li>
            <li>✅ MVP chatbot with scoring module</li>
          </ul>
        </section>

        {/* Acceptance Criteria */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-blue-600 mb-2 flex items-center gap-2">
            ✅ Acceptance Criteria
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 pl-4">
            <li>✅ Adaptive chatbot for all age groups</li>
            <li>✅ Integrated rubric scoring with LLM answers</li>
            <li>✅ Multi-model backend architecture</li>
            <li>✅ Full logging and test coverage</li>
            <li>✅ Production-ready backend with CI/CD</li>
          </ul>
        </section>

        {/* Call to Action */}
        <div className="flex justify-center">
          <Link
            to="/user-form"
            className="inline-block bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold px-8 py-3 rounded-full shadow-lg text-lg"
          >
            🚀 Start Screening
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
