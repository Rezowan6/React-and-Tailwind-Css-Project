import { useState } from "react";
import Navbar from "./components/Navbar.jsx"; // Correct path
import Home from "./pages/Home.jsx";
import Updates from "./pages/Updates.jsx";
import Expenses from "./pages/Expenses.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { Routes, Route } from "react-router-dom";

function App() {
  const [filter, setFilter] = useState("");

  return (
    <>
      <Navbar filter={filter} setFilter={setFilter} />
      <Routes>
        <Route path="/" element={<Home filter={filter} />} />
        <Route path="/updates" element={<Updates />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;






