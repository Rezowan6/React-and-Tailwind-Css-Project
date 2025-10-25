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

  // === new popup states ===
  const [editPopup, setEditPopup] = useState({ show: false, index: null, value: "" });

  const { alertData, showAlert, closeAlert } = useAlert();

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

  const handleViewMonthly = (name) => {
    const monthlyData = JSON.parse(localStorage.getItem("monthlyMillData")) || {};
    setViewStudent({ name, data: monthlyData[name] || [] });
  };

  const closeMonthlyView = () => setViewStudent(null);
  const closeHistoryView = () => setViewHistory(null);

  const filteredRows = extraRows.filter((row) =>
    row.name.toLowerCase().includes(filter.toLowerCase())
  );

  const totalMeals = filteredRows.reduce((sum, row) => sum + (Number(row.mill) || 0), 0);

  // ========= Mini Popup Save =========
const handlePopupSave = () => {
  if (!editPopup.value) return showAlert("⚠️ Warning", "Please enter a meal value!");

  const idx = editPopup.index;
  const updated = { ...viewStudent };

  const todayEntry = updated.data[idx];

  // Check if this entry has already been edited ever today
  if (todayEntry.edited) {
    return showAlert("⚠️ Warning", "You have already edited this day's entry! No more edits allowed today.");
  }

  // Update monthly modal data
  todayEntry.mill = Number(editPopup.value);
  todayEntry.edited = true;       // mark as edited today
  todayEntry.editLocked = true;   // lifetime lock for today

  // Save to localStorage
  const monthlyData = JSON.parse(localStorage.getItem("monthlyMillData")) || {};
  monthlyData[updated.name] = updated.data;
  localStorage.setItem("monthlyMillData", JSON.stringify(monthlyData));

  setViewStudent(updated);

  // Update main table
  setExtraRows(prevRows => {
    return prevRows.map(row => {
      if (row.name === updated.name) {
        return {
          ...row,
          mill: Number(editPopup.value), // today's value replaces old
          todayValue: Number(editPopup.value),
          editedToday: true, // hide edit icon
        };
      }
      return row;
    });
  });

  // Close popup
  setEditPopup({ show: false, index: null, value: "" });
  showAlert("✅ Updated", "Meal entry updated successfully!");
};



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
                    <td className="border py-2 text-center">
                      <button
                        onClick={() => handleViewMonthly(s.name)}
                        className="editBtn"
                      >
                        View Monthly
                      </button>
                    </td>
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
          <div className="monthlyViewContainer">
            <div className={`monthlyViewDiv ${cardBg}`}>
              <h3 className="monthlyViewHeader">
                📝 {viewStudent.name}'s Monthly Mill Data
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
                        <tr key={idx} className="monthlyViewTr">
                          <td className="border py-2">{idx+1}</td>
                          <td className="border py-2">{d.date}</td>
                          <td className="border py-2 text-center">
                            {d.mill}
                            {d.edited && <span className="text-sm text-yellow-300 ml-1"></span>}
                            <span
                              onClick={() => setEditPopup({ show: true, index: idx, value: d.mill })}
                              className="ml-2 text-indigo-400 hover:text-yellow-400 cursor-pointer hover:underline"
                              title="Edit this day's meal"
                            >#✎
                            </span>
                          </td>
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

        {/* === Mini Edit Popup === */}
        {editPopup.show && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? "bg-[#1E1E2F]" : "bg-white/95 text-black"}`}>
              <h3 className="text-lg font-semibold mb-3">✎ Edit Meal Entry</h3>
              <input
                type="number"
                value={editPopup.value}
                onChange={(e) => setEditPopup({ ...editPopup, value: e.target.value })}
                className={`border rounded px-3 py-1 w-40 text-center ${darkMode ? "bg-gray-800 text-white" : "bg-gray-100"}`}
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={handlePopupSave}
                  className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded text-white"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditPopup({ show: false, index: null, value: "" })}
                  className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <EditHistoryModal
          show={!!viewHistory}
          onClose={closeHistoryView}
          student={viewHistory}
          headerLabel="Meal"
        />

        {alertData.show && (
          <AlertPopup
            show={alertData.show}
            onClose={closeAlert}
            title={alertData.title}
            message={alertData.message}
            type={alertData.type}
            autoHide={alertData.autoHide}
          />
        )}
      </div>
    </div>
  );
}

