import { useRef, useState, useEffect } from "react";
import AlertPopup from "../components/AlertPopup.jsx";
import EditHistoryModal from "../components/EditHistoryModal.jsx";
import useAlert from "../hooks/useAlert.js";

export default function Updates({ filter, darkMode }) {
  const formRef = useRef(null);
  const [students, setStudents] = useState([]);
  const [selectedName, setSelectedName] = useState("");
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customInput, setCustomInput] = useState("");
  const [extraRows, setExtraRows] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [viewStudent, setViewStudent] = useState(null);
  const [viewHistory, setViewHistory] = useState(null);

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

  // ================= Helper Functions =================

  const getTodayEntry = (name) => {
    const today = new Date().toLocaleDateString("en-GB");
    const monthlyData = JSON.parse(localStorage.getItem("monthlyMillData")) || {};
    if (!monthlyData[name]) monthlyData[name] = [];

    let todayEntry = monthlyData[name].find((entry) => entry.date === today);
    if (!todayEntry) {
      todayEntry = { date: today, mill: 0, edited: false, editCount: 0 };
      monthlyData[name].push(todayEntry);
    }

    localStorage.setItem("monthlyMillData", JSON.stringify(monthlyData));
    return todayEntry;
  };

  const saveMill = (name, millValue, edit = false) => {
    const todayEntry = getTodayEntry(name);

    if (edit) {
      if (todayEntry.editCount >= 1) return false;
      todayEntry.mill = millValue;
      todayEntry.edited = true;
      todayEntry.editCount += 1;
    } else {
      if (todayEntry.mill > 0) return false;
      todayEntry.mill = millValue;
    }

    const monthlyData = JSON.parse(localStorage.getItem("monthlyMillData")) || {};
    monthlyData[name] = monthlyData[name].map((entry) =>
      entry.date === todayEntry.date ? todayEntry : entry
    );
    localStorage.setItem("monthlyMillData", JSON.stringify(monthlyData));
    return true;
  };

  // ================= Event Handlers =================
  const handleCheckbox = (value) => {
    if (selectedAmount === value) {
      setSelectedAmount(null);
      setCustomInput("");
    } else {
      setSelectedAmount(value);
      setCustomInput(String(value));
    }
  };

  const handleAdd = () => {
    if (!selectedName) return showAlert("❌ Error", "Please select a student!");
    if (!customInput) return showAlert("❌ Error", "Please enter or select a mill value!");

    const millValue = Number(customInput);

    setExtraRows((prevRows) => {
      if (editIndex !== null) {
        const updated = [...prevRows];
        const row = updated[editIndex];

        const success = saveMill(row.name, millValue, true);
        if (!success) {
          showAlert("⚠️ Warning", "You can only edit once per day!");
          return prevRows;
        }

        updated[editIndex] = {
          ...row,
          mill: millValue,
          editHistory: row.editHistory
            ? [...row.editHistory, { prevMill: row.mill, newMill: millValue, date: new Date().toLocaleDateString("en-GB") }]
            : [{ prevMill: row.mill, newMill: millValue, date: new Date().toLocaleDateString("en-GB") }],
        };

        setEditIndex(null);
        showAlert("✅ Updated", `The mill entry for ${row.name} has been successfully updated.`);
        return updated;
      }

      const success = saveMill(selectedName, millValue);
      if (!success) {
        showAlert("⚠️ Warning", `A mill entry for ${selectedName} has already been added today!`);
        return prevRows;
      }

      const rowIndex = prevRows.findIndex((r) => r.name === selectedName);
      if (rowIndex !== -1) {
        const updatedRows = [...prevRows];
        updatedRows[rowIndex] = {
          ...updatedRows[rowIndex],
          mill: updatedRows[rowIndex].mill + millValue,
          editHistory: updatedRows[rowIndex].editHistory || [],
        };
        showAlert("✅ Added", `Mill entry for ${selectedName} has been added successfully!`);
        return updatedRows;
      } else {
        showAlert("✅ Added", `Mill entry for ${selectedName} has been added successfully!`);
        return [...prevRows, { name: selectedName, mill: millValue, edited: false, editHistory: [] }];
      }
    });

    setSelectedName("");
    setSelectedAmount(null);
    setCustomInput("");
  };

  const handleEdit = (index) => {
    const row = extraRows[index];
    const todayEntry = getTodayEntry(row.name);

    if (todayEntry.editCount >= 1) {
      showAlert("⚠️ Warning", "You can only edit once per day!");
      return;
    }

    formRef.current?.scrollIntoView({ behavior: "smooth" });

    setSelectedName(row.name);
    setCustomInput(String(todayEntry.mill));
    setSelectedAmount(todayEntry.amount || row.amount || todayEntry.mill || "");
    setEditIndex(index);
  };

  const handleViewMonthly = (name) => {
    const monthlyData = JSON.parse(localStorage.getItem("monthlyMillData")) || {};
    setViewStudent({ name, data: monthlyData[name] || [] });
  };

  const handleViewHistory = (row) => {
    setViewHistory(row);
  };

  const closeMonthlyView = () => setViewStudent(null);
  const closeHistoryView = () => setViewHistory(null);


  const filteredRows = extraRows.filter((row) =>
    row.name.toLowerCase().includes(filter.toLowerCase())
  );

  const totalMeals = filteredRows.reduce((sum, row) => sum + (Number(row.mill) || 0), 0);

  // ================= JSX =================
  return (
    <div ref={formRef} className={`containers ${bgClass}`}>
      <div className="mainContent">
        <h2 className="headerText">Every Day Meal Updates</h2>

        {/* Form Section */}
        <div className={`addForm ${cardBg}`}>
          <h3 className={`headerForm ${darkMode ? "textWhite" : "textBlack"}`}>
            ⚙️ {editIndex !== null ? "Edit Mill Entry" : "Add Mill Entry"}
          </h3>

          <form
            onSubmit={(e) => { e.preventDefault(); handleAdd(); }}
            className="form"
          >
            {/* Student select */}
            <div className="inputDiv">
              <label className="font-medium">Select Student:</label>
              <select
                value={selectedName}
                onChange={(e) => setSelectedName(e.target.value)}
                className={`input ${inputBorder}`}
              >
                <option value="">Select Name</option>
                {students.map((s, i) => (
                  <option key={i} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Mill selection */}
            <div className="checkDiv">
              <label className="font-medium">Select Mill:</label>
              <div className="selectDiv">
                {[1,2,3,4,5,6].map((val) => (
                  <label key={val} className={`lable ${selectedAmount === val ? "selectValue" : darkMode ? "darkVlaue" : "lightValue"}`}>
                    <input type="checkbox" checked={selectedAmount === val} onChange={() => handleCheckbox(val)} className="accent-teal-500"/>
                    {val}
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Input + Submit */}
            <div className="customInputDiv">
              <div className="customDiv">
                <label className="font-medium">Custom Input:</label>
                <input
                  type="number"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Enter Mill"
                  className={`customInput ${inputBorder}`}
                />
              </div>

              <button type="submit" className="addUpdateBtn">
                {editIndex !== null ? "Update Mill" : "Add Mill"}
              </button>
            </div>
          </form>
        </div>


        {/* Table Section */}
        <div className={`tableMainDiv ${cardBg}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="tableTitle">📊 Selected Students</h2>
            <p className={`text-xl font-medium ${darkMode ? "text-white" : "text-black"}`}>Total Meal: {totalMeals}</p>
          </div>

          <table className={`table ${darkMode ? "tableDark" : "tableLight"}`}>
            <thead className={darkMode ? "bg-gray-700/30" : "bg-white/20"}>
              <tr>
                <th className="border py-2">ID</th>
                <th className="border py-2">Name</th>
                <th className="border py-2">Total Meal</th>
                <th className="border py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => {
                const row = extraRows.find(r => r.name === s.name);
                return (
                  <tr key={i} className={`tableRow ${darkMode ? "tableRowDark" : "tableRowLight"}`}>
                    <td className="border py-2">{i+1}</td>
                    <td className="border py-2">{s.name}</td>
                    <td className="border py-2">{row ? row.mill : 0}</td>
                    <td className="border py-2">{/* blank */}</td>
                  </tr>
                );
              })}
              {students.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-3 text-gray-400 text-sm">No data found</td>
                </tr>
              )}
            </tbody>
          </table>
          
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
                        <tr key={idx} className="hover:bg-teal-600/30 transition-colors text-center hover:cursor-pointer">
                          <td className="border py-2">{idx+1}</td>
                          <td className="border py-2">{d.date}</td>
                          <td className="border py-2">{d.mill} {d.edited && <span className="text-sm text-yellow-300">✎</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <p className="text-center text-gray-400">No monthly data found</p>}

              <button onClick={closeMonthlyView} className="closeBtn">Close</button>
            </div>
          </div>
        )}

        {/* Edit History Modal */}
        <EditHistoryModal
          show={!!viewHistory}
          onClose={closeHistoryView}
          student={viewHistory}
          headerLabel="Meal"
        />

        {/* Alert Popup */}
        {alertData.show && <AlertPopup
          show={alertData.show}
          onClose={closeAlert}
          title={alertData.title}
          message={alertData.message}
          type={alertData.type}
          autoHide={alertData.autoHide}
        />}
      </div>
    </div>
  );
}








