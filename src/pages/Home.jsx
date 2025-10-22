/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Button from "../components/Button.jsx";
import ReusableCard from "../components/ReusableCard.jsx";
import AlertPopup from "../components/AlertPopup.jsx";
import useAlert from "../hooks/useAlert.js";

export default function Home({ filter, darkMode }) {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [studentTk, setStudentTk] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [showHistoryIndex, setShowHistoryIndex] = useState(null);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const { alertData, showAlert, showConfirm, closeAlert } = useAlert();

  // Load students from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("studentsData")) || [];
    setStudents(saved);
  }, []);

  // Save students to localStorage
  useEffect(() => {
    localStorage.setItem("studentsData", JSON.stringify(students));
  }, [students]);

  // Load total expenses
  useEffect(() => {
    const expenses = JSON.parse(localStorage.getItem("expensesData")) || [];
    const totalExp = expenses.reduce((acc, e) => acc + e.expencesTk, 0);
    setTotalExpenses(totalExp);
  }, []);

  // Add or Edit student
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !studentTk) return showAlert("❌ Error", "Please fill all fields!");

    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB");
    const monthKey = `${now.getMonth() + 1}-${now.getFullYear()}`;
    const todayKey = formattedDate;
    // new student object
    const newStudent = {
      name,
      studentTk: Number(studentTk),
      date: formattedDate,
      editCount: 0,
      editHistory: [],
    };

    const isDuplicate = students.some(
      (s) => s.name.toLowerCase() === name.toLowerCase() && editIndex === null
    );
    if (isDuplicate) return showAlert("❌ Error", "Same name already exists!");

    if (editIndex === null) {
      setStudents([...students, newStudent]);
      showAlert("✅ Added", "Student added successfully!");
    } else {
      const updated = [...students];
      const student = updated[editIndex];

      const monthEdits = student.editHistory.filter((d) => {
        const [day, month, year] = d.split("/");
        return `${month}-${year}` === monthKey;
      }).length;

      const alreadyEditedToday = student.editHistory.includes(todayKey);

      if (alreadyEditedToday)
        return showAlert("⚠️ Warning", "You already edited this student today!");
      if (monthEdits >= 4)
        return showAlert("⚠️ Limit Reached", "You can edit only 4 times per month.");

      const newHistory = [...student.editHistory];
      if (!newHistory.includes(todayKey)) newHistory.push(todayKey);

      updated[editIndex] = {
        ...student,
        studentTk: Number(studentTk),
        date: formattedDate,
        editCount: newHistory.length,
        editHistory: newHistory,
      };
      setStudents(updated);
      setEditIndex(null);
      showAlert("✅ Updated", "Student updated successfully!");
    }

    setName("");
    setStudentTk("");
    setSelectedAmount(null);
  };

  // Delete last student
  const deleteLast = () => {
    if (!students.length) return showAlert("❌ Error", "No student data found to delete!");

    showConfirm("🗑 Delete Last", "Are you sure you want to delete the last student?", () => {
      setStudents(students.slice(0, -1));
      showAlert("✅ Deleted", "Last student deleted successfully!");
    });
  };
  // restart button
  const restartAll = () => {
    if (!students.length) return showAlert("❌ Error", "No student data to restart!");

    showConfirm("⚠️ Restart All", "Are you sure you want to delete all students?", () => {
      setStudents([]);
      localStorage.removeItem("studentsData");
      showAlert("✅ Cleared", "All students deleted successfully!");
    });
  };

  // Filtered list
  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(filter.toLowerCase())
  );

  const totalMoney = filtered.reduce((acc, s) => acc + s.studentTk, 0);
  const remainingMoney = totalMoney - totalExpenses;

  // Checkbox selection
  const handleCheckbox = (value) => {
    if (selectedAmount === value) {
      setSelectedAmount(null);
      setStudentTk("");
    } else {
      setSelectedAmount(value);
      setStudentTk(value);
    }
  };
  // create a darkMode color
  const bgClass = darkMode ? "bg-[#121212] text-white" : "bg-gradient-to-r from-green-600/80 to-pink-600/80 text-black";
  const cardBg = darkMode ? "bg-[#1E1E2F]/90" : "bg-white/10";
  const inputBorder = darkMode ? "border-white text-white placeholder-white" : "border-white text-black placeholder-white";

  return (
    <div className={`min-h-screen p-5 font-[Times_New_Roman] transition-colors duration-500 ${bgClass}`}>
      <div className="max-w-6xl mx-auto space-y-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-center">{`Students Mill Management`}</h2>

        {/* Add Student Form */}
        <div className={`backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-lg space-y-6 transition-colors duration-500 ${cardBg}`}>
          <h3
            className={`text-2xl font-semibold flex items-center gap-2 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            📅 Add First Data
          </h3>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 w-full max-w-3xl mx-auto"
          >
            {/* Name Input */}
            <div className="flex flex-col gap-2">
              <label className="font-medium">Name:</label>
              <input
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))
                }
                required
                className={`w-full md:w-2/3 lg:w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 bg-transparent ${inputBorder}`}
              />
            </div>

            {/* Money Options */}
            <div className="flex flex-col gap-3">
              <label className="font-medium">Select Money:</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
                {[500, 1000, 1500, 2000, 2500, 3000].map((val) => (
                  <label
                    key={val}
                    className={`flex items-center justify-center gap-2 border rounded-lg px-3 py-2 cursor-pointer font-medium transition-all duration-300 shadow-sm hover:shadow-md ${
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
                    ৳{val}
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Input + Button */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="flex flex-col gap-2 flex-1">
                <label className="font-medium">Custom Input:</label>
                <input
                  type="number"
                  value={studentTk}
                  onChange={(e) => setStudentTk(e.target.value)}
                  placeholder="Enter Total Tk"
                  required
                  className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 bg-transparent ${inputBorder}`}
                />
              </div>

              <button
                type="submit"
                className="bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 text-white font-medium px-6 py-2.5 rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
              >
                {editIndex === null ? "Add Student" : "Update Student"}
              </button>
            </div>
          </form>
        </div>


        {/* Cards */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center cursor-pointer">
          <ReusableCard title="Total Money" amount={totalMoney} color="red" darkMode={darkMode} />
          <ReusableCard title="Remaining Money" amount={remainingMoney} color="green" darkMode={darkMode} />
        </div>

        {/* Students Table */}
        <div className={`backdrop-blur-sm p-5 rounded-md transition-colors duration-500 ${cardBg}`}>
          <h2 className="text-xl font-semibold mb-4">📊 Students Data</h2>
          <table className={`w-full border-collapse text-center border transition-colors duration-500 ${
            darkMode ? "border-gray-600 text-white" : "border-gray-300 text-black"
          }`}>
            <thead>
              <tr className={darkMode ? "bg-gray-700/30" : "bg-white/20"}>
                <th className="border py-2">ID</th>
                <th className="border py-2">Name</th>
                <th className="border py-2">Money</th>
                <th className="border py-2">Date</th>
                <th className="border py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student, i) => (
                <tr
                  key={i}
                  className={`transition-all duration-300 cursor-pointer ${
                    darkMode
                      ? "hover:bg-gradient-to-r hover:from-teal-500/30 hover:to-purple-500/30"
                      : "hover:bg-gradient-to-r hover:from-teal-400/20 hover:to-pink-400/20"
                  }`}
                >
                  <td className="border py-2">{i + 1}</td>
                  <td className="border py-2">{student.name}</td>
                  <td className="border py-2">
                    ৳{student.studentTk}
                    {student.editCount > 0 && (
                      <span
                        onClick={() => setShowHistoryIndex(i)}
                        className="text-xs text-yellow-300 ml-2 cursor-pointer hover:underline"
                      >
                        #{student.editCount} ✎
                      </span>
                    )}
                  </td>
                  <td className="border py-2">{student.date}</td>
                  <td className="border py-2">
                    <button
                      onClick={() => {
                        setName(student.name);
                        setStudentTk(student.studentTk);
                        setEditIndex(i);
                        setSelectedAmount(student.studentTk);
                      }}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded-md text-sm transition"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-3 text-gray-400 text-sm">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-6">
          <Button type="delete" onClick={deleteLast} />
          <Button type="restart" onClick={restartAll} />
        </div>

      {/* Edit History Modal */}
      {showHistoryIndex !== null && (
        <div className="fixed inset-0 bg-black/90 flex justify-center items-center z-50">
          <div
            className={`relative p-6 rounded-2xl w-80 md:w-96 backdrop-blur-md bg-[#1E1E2F]/90 border border-teal-400 shadow-[0_0_25px_rgba(20,184,166,0.4)] transition-all duration-500 ${cardBg}`}
          >
            {/* Title */}
            <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-purple-500 to-pink-500 text-center">
              ✎ Edit History of {students[showHistoryIndex].name}
            </h3>

            {/* Table */}
            <div className="overflow-hidden rounded-lg border border-gray-600 shadow-inner">
              <table className="w-full text-white text-sm">
                <thead className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700">
                  <tr>
                    <th className="px-2 py-2 border border-gray-600">#</th>
                    <th className="px-2 py-2 border border-gray-600">Edited Date</th>
                  </tr>
                </thead>
                <tbody>
                  {students[showHistoryIndex].editHistory.length > 0 ? (
                    students[showHistoryIndex].editHistory.map((date, idx) => (
                      <tr
                        key={idx}
                        className="cursor-pointer hover:bg-gradient-to-r hover:from-teal-500/30 hover:to-purple-500/30 transition-colors text-center"
                      >
                        <td className="border border-gray-700 py-2">{idx + 1}</td>
                        <td className="border border-gray-700 py-2">{date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="py-3 text-gray-400">
                        No edits yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowHistoryIndex(null)}
              className="mt-5 w-full py-2 rounded-md font-medium text-white bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 hover:opacity-90 shadow-[0_0_15px_rgba(244,114,182,0.4)] transition"
            >
              Close
            </button>
          </div>
        </div>
      )}


        {/* Global Alert */}
        <AlertPopup
          show={alertData.show}
          onClose={closeAlert}
          title={alertData.title}
          message={alertData.message}
          type={alertData.type}
          onConfirm={alertData.onConfirm}
        />
      </div>
    </div>
  );
}

