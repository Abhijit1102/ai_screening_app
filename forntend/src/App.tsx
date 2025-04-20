import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserForm from "./components/Userform.tsx";
import UserChat from "./pages/UserChat.tsx";
import ResultPage from "./pages/Result.tsx";
import Home from "./pages/Home.tsx";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user-form" element={<UserForm />} />
          <Route path="/user/:id" element={<UserChat />} />
          <Route path="/result" element={<ResultPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
