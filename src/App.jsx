import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Updates from "./pages/Updates.jsx";
import Expenses from "./pages/Expenses.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import AlertPopup from "./components/AlertPopup.jsx";
import useAlert from "./hooks/useAlert.js";

function App() {
  const [filter, setFilter] = useState("");
  const { alertData, showAlert, showConfirm, closeAlert } = useAlert();

  // ✅ Theme state (light/dark)
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // ✅ Handle theme change and persistence
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div
      className={`min-h-screen transition-colors duration-700 
        bg-light dark:bg-secondary text-secondary dark:text-secondary-text`}
    >
      {/* 🔹 Smooth scroll on route change */}
      <ScrollToTop />

      {/* 🔹 Navbar — global search bar + theme toggle */}
      <Navbar
        filter={filter}
        setFilter={setFilter}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* 🔹 All pages share same filter */}
      <main className="max-w-6xl mx-auto px-4 pb-10 transition-colors duration-700">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                filter={filter}
                showAlert={showAlert}
                showConfirm={showConfirm}
              />
            }
          />
          <Route
            path="/updates"
            element={
              <Updates
                filter={filter}
                showAlert={showAlert}
                showConfirm={showConfirm}
              />
            }
          />
          <Route
            path="/expenses"
            element={
              <Expenses
                filter={filter}
                showAlert={showAlert}
                showConfirm={showConfirm}
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                filter={filter}
                showAlert={showAlert}
                showConfirm={showConfirm}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* 🔹 Global Alert Popup */}
      <AlertPopup
        show={alertData.show}
        onClose={closeAlert}
        title={alertData.title}
        message={alertData.message}
        type={alertData.type}
        onConfirm={alertData.onConfirm}
      />
    </div>
  );
}

export default App;












