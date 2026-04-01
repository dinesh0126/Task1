import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import FeedPage from "./pages/FeedPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";

function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="page-shell">
        <Routes>
          <Route path="/" element={<Navigate replace to="/feed" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/feed"
            element={
              <ProtectedRoute>
                <FeedPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}




export default App;
