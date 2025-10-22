import { useState, useEffect } from "react";
import Button from "../components/Button.jsx";

export default function Updates({ filter }) {
  const [students, setStudents] = useState([]);
  const [selectedName, setSelectedName] = useState("");
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customInput, setCustomInput] = useState("");
  const [extraRows, setExtraRows] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [viewStudent, setViewStudent] = useState(null);

  // ✅ Load data on start
  useEffect(() => {
    const savedStudents = JSON.parse(localStorage.getItem("studentsData")) || [];
    const names = savedStudents.map(({ name }) => ({ name }));
    setStudents(names);

    const savedMillData = JSON.parse(localStorage.getItem("millData")) || [];
    setExtraRows(savedMillData);
  }, []);

  // ✅ Save mill data to localStorage whenever updated
  useEffect(() => {
    localStorage.setItem("millData", JSON.stringify(extraRows));
  }, [extraRows]);

  // ✅ Save daily entry into monthly history (once per day)
  const addToMonthlyData = (name, millValue) => {
    const today = new Date().toLocaleDateString("en-GB");
    const monthlyData = JSON.parse(localStorage.getItem("monthlyMillData")) || {};

    if (!monthlyData[name]) monthlyData[name] = [];

    // একদিনে একবারের চেক
    const todayEntry = monthlyData[name].find((entry) => entry.date === today);
    if (todayEntry) {
      alert(`❌ ${name} এর জন্য আজকের দিন already মিল এন্ট্রি আছে! তুমি শুধু edit করতে পারবে।`);
      return false; // add হবে না
    }

    monthlyData[name].push({ date: today, mill: millValue });
    localStorage.setItem("monthlyMillData", JSON.stringify(monthlyData));
    return true; // add সফল
  };

  // ✅ Checkbox handler
  const handleCheckbox = (value) => {
    if (selectedAmount === value) {
      setSelectedAmount(null);
      setCustomInput("");
    } else {
      setSelectedAmount(value);
      setCustomInput(String(value));
    }
  };

  // ✅ Add or Update Mill
  const handleAdd = () => {
    if (!selectedName) return alert("একজন নাম সিলেক্ট করুন!");
    if (!customInput) return alert("মিল এন্ট্রি লিখুন বা সিলেক্ট করুন!");

    const millValue = Number(customInput);

    setExtraRows((prevRows) => {
      if (editIndex !== null) {
        // ✅ Edit মোড: একাধিকবার edit allowed
        const updated = [...prevRows];
        updated[editIndex] = {
          ...updated[editIndex],
          mill: millValue,
          edited: true, // চিহ্ন
        };
        setEditIndex(null);

        // Monthly data update
        const monthlyData = JSON.parse(localStorage.getItem("monthlyMillData")) || {};
        const today = new Date().toLocaleDateString("en-GB");
        if (!monthlyData[selectedName]) monthlyData[selectedName] = [];
        const todayEntryIndex = monthlyData[selectedName].findIndex(
          (entry) => entry.date === today
        );
        if (todayEntryIndex !== -1) {
          monthlyData[selectedName][todayEntryIndex].mill = millValue;
          monthlyData[selectedName][todayEntryIndex].edited = true; // ✎ চিহ্ন
        }
        localStorage.setItem("monthlyMillData", JSON.stringify(monthlyData));

        return updated;
      }

      // ✅ Add মোড: একদিনে একবারের চেক
      const success = addToMonthlyData(selectedName, millValue);
      if (!success) return prevRows;

      const rowIndex = prevRows.findIndex((r) => r.name === selectedName);
      if (rowIndex !== -1) {
        const updatedRows = [...prevRows];
        updatedRows[rowIndex] = {
          ...updatedRows[rowIndex],
          mill: updatedRows[rowIndex].mill + millValue,
        };
        return updatedRows;
      } else {
        return [...prevRows, { name: selectedName, mill: millValue }];
      }
    });

    setSelectedName("");
    setSelectedAmount(null);
    setCustomInput("");
  };

  // ✅ Edit button handler
  const handleEdit = (index) => {
    const row = extraRows[index];
    setSelectedName(row.name);
    setCustomInput(String(row.mill));
    setSelectedAmount(null);
    setEditIndex(index);
  };

  // ✅ View monthly data
  const handleViewMonthly = (name) => {
    const monthlyData = JSON.parse(localStorage.getItem("monthlyMillData")) || {};
    setViewStudent({ name, data: monthlyData[name] || [] });
  };

  const closeMonthlyView = () => setViewStudent(null);

  // ✅ Delete last student
  const deleteLast = () => {
    if (!extraRows.length) return alert("No student left to delete!");
    if (confirm("Delete last student?")) {
      const updatedRows = extraRows.slice(0, -1);
      setExtraRows(updatedRows);

      const allStudents = JSON.parse(localStorage.getItem("studentsData")) || [];
      const newStudents = allStudents.slice(0, -1);
      localStorage.setItem("studentsData", JSON.stringify(newStudents));
    }
  };

  // ✅ Restart all students
  const restartAll = () => {
    if (!extraRows.length) return;
    if (confirm("Delete all students and all data?")) {
      setExtraRows([]);
      setStudents([]);
      localStorage.removeItem("studentsData");
      localStorage.removeItem("millData");
      localStorage.removeItem("monthlyMillData");
      alert("✅ All student data cleared!");
    }
  };

  // ✅ Apply search filter
  const filteredRows = extraRows.filter((row) =>
    row.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 font-[Times_New_Roman] p-5">
      <div className="max-w-6xl mx-auto space-y-8">
        <h2 className="text-3xl font-bold text-center text-white">
          Every Day Mill Updates
        </h2>

        {/* 🔹 Form Section */}
        <div className="backdrop-blur-sm bg-white/10 p-6 rounded-2xl shadow-md space-y-6">
          <h3 className="text-xl font-semibold text-white text-center mb-4">
            ⚙️ {editIndex !== null ? "Edit Mill Entry" : "Add Mill Entry"}
          </h3>

          {/* Select Student */}
          <div className="flex justify-center">
            <select
              value={selectedName}
              onChange={(e) => setSelectedName(e.target.value)}
              className="px-3 py-2 border border-white/40 bg-transparent text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              <option value="" className="text-black">
                Select Name
              </option>
              {students.map((s, i) => (
                <option key={i} value={s.name} className="text-black">
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Mill Checkboxes */}
          <div className="flex flex-wrap gap-4 justify-center">
            {[1, 2, 3, 4, 5, 6].map((val) => (
              <label
                key={val}
                className={`flex items-center gap-2 border text-white rounded-md px-4 py-2 cursor-pointer transition ${
                  selectedAmount === val
                    ? "bg-teal-600 border-teal-400"
                    : "border-white/50"
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

          {/* Input + Add Button */}
          <div className="flex flex-col md:flex-row md:items-end gap-4 justify-center">
            <input
              type="number"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Enter Mill"
              className="px-3 py-2 border border-white/40 bg-transparent text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <button
              onClick={handleAdd}
              className={`${
                editIndex !== null
                  ? "bg-yellow-600 hover:bg-yellow-700"
                  : "bg-green-600 hover:bg-green-700"
              } text-white px-6 py-2 rounded-md transition`}
            >
              {editIndex !== null ? "Update Mill" : "Add Mill"}
            </button>
          </div>
        </div>

        {/* 🔹 Table Section */}
        {!viewStudent ? (
          <div className="backdrop-blur-sm bg-white/10 p-6 rounded-2xl shadow-inner space-y-4">
            <h2 className="text-xl font-semibold mb-4 text-white">
              📊 Every Day Mill Data
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-center text-white overflow-hidden">
                <thead>
                  <tr className="bg-white/20">
                    <th className="border py-2">ID</th>
                    <th className="border py-2">Name</th>
                    <th className="border py-2">Total Mill</th>
                    <th className="border py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row, i) => (
                    <tr
                      key={i}
                      className="hover:bg-teal-600/40 transition cursor-pointer"
                    >
                      <td className="border py-2">{i + 1}</td>
                      <td className="border py-2">{row.name}</td>
                      <td className="border py-2">
                        {row.mill}{" "}
                        {row.edited && (
                          <span className="text-sm text-yellow-300">✎</span>
                        )}
                      </td>
                      <td className="border py-2 space-x-2">
                        <button
                          onClick={() => handleEdit(i)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded-md font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleViewMonthly(row.name)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md font-semibold"
                        >
                          View Monthly
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredRows.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-3 text-gray-300">
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Last & All Students Buttons */}
            <div className="flex flex-col md:flex-row justify-center gap-4 mt-6">
              <Button type="delete" onClick={deleteLast} />
              <Button type="restart" onClick={restartAll} />
            </div>
          </div>
        ) : (
          // 🔹 Monthly Data View
          <div className="backdrop-blur-sm bg-white/10 p-6 rounded-2xl shadow-inner space-y-4">
            <h2 className="text-2xl font-semibold text-center text-white mb-4">
              📅 {viewStudent.name}'s Monthly Mill Data
            </h2>

            {viewStudent.data.length > 0 ? (
              <table className="w-full border-collapse text-center text-white overflow-hidden">
                <thead>
                  <tr className="bg-white/20">
                    <th className="border py-2">#</th>
                    <th className="border py-2">Date</th>
                    <th className="border py-2">Mill</th>
                  </tr>
                </thead>
                <tbody>
                  {viewStudent.data.map((d, idx) => (
                    <tr key={idx} className="hover:bg-teal-600/40">
                      <td className="border py-2">{idx + 1}</td>
                      <td className="border py-2">{d.date}</td>
                      <td className="border py-2">
                        {d.mill}{" "}
                        {d.edited && (
                          <span className="text-sm text-yellow-300">✎</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-300">
                No monthly data found for {viewStudent.name}.
              </p>
            )}

            <div className="text-center">
              <button
                onClick={closeMonthlyView}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md mt-3"
              >
                Back to Main Table
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}







