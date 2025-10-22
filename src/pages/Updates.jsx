import { useState, useEffect } from "react";
import Button from "../components/Button.jsx";
import ReusableCard from "../components/ReusableCard.jsx";
import AlertPopup from "../components/AlertPopup.jsx";
import useAlert from "../hooks/useAlert.js";

export default function Updates({ filter, darkMode }) {
  const [students, setStudents] = useState([]);
  const [selectedName, setSelectedName] = useState("");
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customInput, setCustomInput] = useState("");
  const [extraRows, setExtraRows] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [viewStudent, setViewStudent] = useState(null);

  const { alertData, showAlert, showConfirm, closeAlert } = useAlert();

  const bgClass = darkMode
    ? "bg-[#121212] text-white"
    : "bg-gradient-to-r from-green-600/80 to-pink-600/80 text-black";
  const cardBg = darkMode ? "bg-[#1E1E2F]/90" : "bg-white/10";
  const inputBorder = darkMode
    ? "border-white text-white placeholder-white"
    : "border-white text-black placeholder-white";

  // Load students and mill data
  useEffect(() => {
    const savedStudents = JSON.parse(localStorage.getItem("studentsData")) || [];
    setStudents(savedStudents.map(({ name }) => ({ name })));

    const savedMillData = JSON.parse(localStorage.getItem("millData")) || [];
    setExtraRows(savedMillData);
  }, []);

  useEffect(() => {
    localStorage.setItem("millData", JSON.stringify(extraRows));
  }, [extraRows]);

  // Add to monthly data
  const addToMonthlyData = (name, millValue) => {
    const today = new Date().toLocaleDateString("en-GB");
    const monthlyData = JSON.parse(localStorage.getItem("monthlyMillData")) || {};
    if (!monthlyData[name]) monthlyData[name] = [];

    const todayEntry = monthlyData[name].find((entry) => entry.date === today);
    if (todayEntry) {
      showAlert("⚠️ Warning", `A mill entry for ${name} has already been added today! You can only edit it.`);
      return false;
    }

    monthlyData[name].push({ date: today, mill: millValue });
    localStorage.setItem("monthlyMillData", JSON.stringify(monthlyData));
    return true;
  };

  // checkbox
  const handleCheckbox = (value) => {
    if (selectedAmount === value) {
      setSelectedAmount(null);
      setCustomInput("");
    } else {
      setSelectedAmount(value);
      setCustomInput(String(value));
    }
  };

  // Add or Edit Mill
  const handleAdd = () => {
    if (!selectedName) return showAlert("❌ Error", "Please select a student!");
    if (!customInput) return showAlert("❌ Error", "Please enter or select a mill value!");

    const millValue = Number(customInput);

    setExtraRows((prevRows) => {
      if (editIndex !== null) {
        const updated = [...prevRows];
        updated[editIndex] = {
          ...updated[editIndex],
          mill: millValue,
          edited: true,
        };
        setEditIndex(null);

        // Update monthly
        const monthlyData = JSON.parse(localStorage.getItem("monthlyMillData")) || {};
        const today = new Date().toLocaleDateString("en-GB");
        if (!monthlyData[selectedName]) monthlyData[selectedName] = [];
        const todayEntryIndex = monthlyData[selectedName].findIndex(
          (entry) => entry.date === today
        );
        if (todayEntryIndex !== -1) {
          monthlyData[selectedName][todayEntryIndex].mill = millValue;
          monthlyData[selectedName][todayEntryIndex].edited = true;
        }
        localStorage.setItem("monthlyMillData", JSON.stringify(monthlyData));
        showAlert("✅ Updated", `${selectedName} এর মিল এন্ট্রি আপডেট হয়েছে`);
        return updated;
      }

      const success = addToMonthlyData(selectedName, millValue);
      if (!success) return prevRows;

      const rowIndex = prevRows.findIndex((r) => r.name === selectedName);
      if (rowIndex !== -1) {
        const updatedRows = [...prevRows];
        updatedRows[rowIndex] = {
          ...updatedRows[rowIndex],
          mill: updatedRows[rowIndex].mill + millValue,
        };
        showAlert("✅ Added", `Mill entry for ${selectedName} has been added successfully!`);

        return updatedRows;
      } else {
        showAlert("✅ Added", `Mill entry for ${selectedName} has been added successfully!`);

        return [...prevRows, { name: selectedName, mill: millValue }];
      }
    });

    setSelectedName("");
    setSelectedAmount(null);
    setCustomInput("");
  };

  const handleEdit = (index) => {
    const row = extraRows[index];
    setSelectedName(row.name);
    setCustomInput(String(row.mill));
    setSelectedAmount(null);
    setEditIndex(index);
  };

  const handleViewMonthly = (name) => {
    const monthlyData = JSON.parse(localStorage.getItem("monthlyMillData")) || {};
    setViewStudent({ name, data: monthlyData[name] || [] });
  };

  const closeMonthlyView = () => setViewStudent(null);

  // Delete last
  const deleteLast = () => {
    if (!extraRows.length) return showAlert("❌ Error", "No student left to delete!");
    showConfirm("🗑 Delete Last", "Are you sure you want to delete the last student?", () => {
      const updatedRows = extraRows.slice(0, -1);
      setExtraRows(updatedRows);

      const allStudents = JSON.parse(localStorage.getItem("studentsData")) || [];
      const newStudents = allStudents.slice(0, -1);
      localStorage.setItem("studentsData", JSON.stringify(newStudents));
      showAlert("✅ Deleted", "Last student deleted successfully!");
    });
  };

  // Restart all
  const restartAll = () => {
    if (!extraRows.length) return showAlert("❌ Error", "No student data to restart!");
    showConfirm("⚠️ Restart All", "Are you sure you want to delete all students and data?", () => {
      setExtraRows([]);
      setStudents([]);
      localStorage.removeItem("studentsData");
      localStorage.removeItem("millData");
      localStorage.removeItem("monthlyMillData");
      showAlert("✅ Cleared", "All student data cleared!");
    });
  };

  const filteredRows = extraRows.filter((row) =>
    row.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className={`min-h-screen p-5 font-[Times_New_Roman] transition-colors duration-500 ${bgClass}`}>
      <div className="max-w-6xl mx-auto space-y-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-center">Every Day Mill Updates</h2>

        {/* Form */}
        <div className={`backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-lg space-y-6 transition-colors duration-500 ${cardBg}`}>
          <h3 className={`text-2xl font-semibold flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
            ⚙️ {editIndex !== null ? "Edit Mill Entry" : "Add Mill Entry"}
          </h3>

          <div className="flex flex-col gap-4 md:flex-row md:items-end justify-center">
            <select
              value={selectedName}
              onChange={(e) => setSelectedName(e.target.value)}
              className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 bg-transparent ${inputBorder}`}
            >
              <option value="">Select Name</option>
              {students.map((s, i) => (
                <option key={i} value={s.name}>{s.name}</option>
              ))}
            </select>

            <input
              type="number"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Enter Mill"
              className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 bg-transparent ${inputBorder}`}
            />

            <button
              onClick={handleAdd}
              className={`${
                editIndex !== null ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"
              } text-white px-6 py-2 rounded-lg shadow-md transition-transform duration-300 hover:scale-105`}
            >
              {editIndex !== null ? "Update Mill" : "Add Mill"}
            </button>
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-3 justify-center mt-3">
            {[1, 2, 3, 4, 5, 6].map((val) => (
              <label
                key={val}
                className={`flex items-center justify-center gap-2 border rounded-lg px-3 py-2 cursor-pointer font-medium transition-all duration-300 ${
                  selectedAmount === val
                    ? "bg-teal-600 text-white border-teal-600 scale-[1.03]"
                    : darkMode
                    ? "border-gray-600 text-white hover:bg-gray-700"
                    : "border-gray-300 text-gray-800 hover:bg-gray-100"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedAmount === val}
                  onChange={() => handleCheckbox(val)}
                  className="accent-teal-500"
                />
                {val}
              </label>
            ))}
          </div>
        </div>

        {/* Table + Buttons */}
        <div className={`backdrop-blur-sm p-5 rounded-md transition-colors duration-500 ${cardBg}`}>
          <h2 className="text-xl font-semibold mb-4">📊 Every Day Mill Data</h2>
          <table className={`w-full border-collapse text-center border transition-colors duration-500 ${darkMode ? "border-gray-600 text-white" : "border-gray-300 text-black"}`}>
            <thead className={darkMode ? "bg-gray-700/30" : "bg-white/20"}>
              <tr>
                <th className="border py-2">ID</th>
                <th className="border py-2">Name</th>
                <th className="border py-2">Total Mill</th>
                <th className="border py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, i) => (
                <tr key={i} className={`transition-all duration-300 cursor-pointer ${darkMode ? "hover:bg-gradient-to-r hover:from-teal-500/30 hover:to-purple-500/30" : "hover:bg-gradient-to-r hover:from-teal-400/20 hover:to-pink-400/20"}`}>
                  <td className="border py-2">{i + 1}</td>
                  <td className="border py-2">{row.name}</td>
                  <td className="border py-2">{row.mill} {row.edited && <span className="text-xs text-yellow-300">✎</span>}</td>
                  <td className="border py-2 space-x-2">
                    <button
                      onClick={() => handleEdit(i)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded-md font-semibold transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleViewMonthly(row.name)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md font-semibold transition"
                    >
                      View Monthly
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-3 text-gray-400 text-sm">No data found</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex flex-col md:flex-row justify-center gap-4 mt-6">
            <Button type="delete" onClick={deleteLast} />
            <Button type="restart" onClick={restartAll} />
          </div>
        </div>

        {/* Monthly View Modal */}
        {viewStudent && (
          <div className="fixed inset-0 bg-black/90 flex justify-center items-center z-50 p-5">
            <div className={`relative p-6 rounded-2xl w-full max-w-96 backdrop-blur-md border border-teal-400 shadow-[0_0_25px_rgba(20,184,166,0.4)] transition-all duration-500 ${cardBg}`}>
              <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-purple-500 to-pink-500 text-center">
                📅 {viewStudent.name}'s Monthly Mill Data
              </h3>

              {viewStudent.data.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-white text-sm border-collapse">
                    <thead className="bg-gray-700/30">
                      <tr>
                        <th className="border px-2 py-2">#</th>
                        <th className="border px-2 py-2">Date</th>
                        <th className="border px-2 py-2">Mill</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewStudent.data.map((d, idx) => (
                        <tr key={idx} className="hover:bg-teal-600/30 transition-colors text-center">
                          <td className="border py-2">{idx + 1}</td>
                          <td className="border py-2">{d.date}</td>
                          <td className="border py-2">{d.mill} {d.edited && <span className="text-sm text-yellow-300">✎</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-400">No monthly data found</p>
              )}

              <button
                onClick={closeMonthlyView}
                className="mt-5 w-full py-2 rounded-md font-medium text-white bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 hover:opacity-90 shadow-[0_0_15px_rgba(244,114,182,0.4)] transition"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {/* Alert Popup */}
        {alertData.show && (
          <AlertPopup
            show={alertData.show}
            onClose={closeAlert}
            title={alertData.title}
            message={alertData.message}
            type={alertData.type}
            onConfirm={alertData.onConfirm}
          />
        )}
      </div>
    </div>
  );
}








