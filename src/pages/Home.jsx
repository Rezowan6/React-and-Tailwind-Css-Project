/* eslint-disable no-unused-vars */
import React, {useRef, useState, useEffect } from "react";
import Button from "../components/Button.jsx";
import ReusableCard from "../components/ReusableCard.jsx";
import EditHistoryModal from "../components/EditHistoryModal.jsx";
import AlertPopup from "../components/AlertPopup.jsx";
import useAlert from "../hooks/useAlert.js";
import { useNavigate } from "react-router-dom";

export default function Home({ filter, darkMode }) {
  const formRef = useRef(null); // 👈 ref create
  const [students, setStudents] = React.useState([]);
  const [name, setName] = useState("");
  const [studentTk, setStudentTk] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(null);
  // const [showHistoryIndex, setShowHistoryIndex] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const { alertData, showAlert, showConfirm, closeAlert, confirmAction } = useAlert();
  const navigate = useNavigate();

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

      // clear form
  const clearForm = () => {
    setName("");
    setStudentTk("");
    setSelectedAmount(null);
  };

  // Add or Edit student
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !studentTk) return showAlert("❌ Error", "Please fill all fields!",6000);

    // formatted date--
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB");
    const currentMonth  = `${now.getMonth() + 1}-${now.getFullYear()}`; // month and date
    // new student object
    const newStudent = {
      name,
      studentTk: Number(studentTk),
      date: formattedDate,
      editCount: 0,
      editHistory: [{ newTk: Number(studentTk), date: formattedDate }],
      lastEditMonth: currentMonth, // future edit limit track এর জন্য
    };
    // duplicate name checked
    const isDuplicate = students.some(
      (s) => s.name.toLowerCase() === name.toLowerCase() && editIndex === null
    );
    if (isDuplicate){ 
      clearForm();
      return showAlert("❌ Error", "Same name already exists!",6000);
    }
    // new srudent added
    if (editIndex === null) {
      setStudents([...students, newStudent]);
      showAlert("✅ Added", "Student added successfully!",6000);
    } else {
        // updated section
        const updated = [...students];
        const student = updated[editIndex];

        // check month reset
        if (student.lastEditMonth !== currentMonth) {
          student.editCount = 0; // reset edit count if new month
          student.lastEditMonth = currentMonth; // update month record
        }

        // Create new history
        const newHistory = [
          ...(student.editHistory || []),
          { prevTk: student.studentTk, newTk: Number(studentTk), date: formattedDate },
        ];

        // Updating student
        updated[editIndex] = {
          ...student,
          studentTk: Number(studentTk),
          date: formattedDate,
          editCount: student.editCount + 1,
          editHistory: newHistory,
          lastEditMonth: currentMonth, // ensure saved to object
        };

        const monthlyLimit = 3;
        const totalEditsThisMonth = student.editCount + 1;
        const remainingEdits = monthlyLimit - totalEditsThisMonth;

        setStudents(updated);
        setEditIndex(null);
        showAlert(
          "✅ Updated",
          `Student updated successfully! You can edit ${remainingEdits} more time(s) this month (Limit: ${monthlyLimit}).`
        );
      }
    clearForm();
  };

// ✅ Delete last student
const deleteLast = () => {
  if (!students.length)
    return showAlert("❌ Error", "No student data found to delete!");

  showConfirm("🗑 Delete Last", "Are you sure you want to delete the last student?", () => {
    const updated = students.slice(0, -1);
    const lastStudent = students[students.length - 1];

    // 🔹 Delete that student's mill data too
    const monthlyData = JSON.parse(localStorage.getItem("monthlyMillData")) || {};
    if (lastStudent && lastStudent.name) delete monthlyData[lastStudent.name];

    localStorage.setItem("monthlyMillData", JSON.stringify(monthlyData));

    // 🔹 Update students and mill data
    localStorage.setItem("studentsData", JSON.stringify(updated));
    localStorage.setItem(
      "millData",
      JSON.stringify(updated.map(s => ({ name: s.name })))
    );

    setStudents(updated);
    showAlert("✅ Deleted", "Last student deleted successfully!");
  });
};

// ✅ Restart all students (Delete everything)
const restartAll = () => {
  if (!students.length)
    return showAlert("❌ Error", "No student data to restart!");

  showConfirm(
    "⚠️ Restart All",
    "Are you absolutely sure? This action cannot be undone.",
    () => {
      let confirmed = false;

      showConfirm("🧹 Final Confirmation", "Really delete all student data?", () => {
        confirmed = true;
        setStudents([]);
        localStorage.removeItem("studentsData");
        localStorage.removeItem("millData");
        localStorage.removeItem("monthlyMillData"); // 🔹 also clear Updates.jsx data
        clearForm();

        showAlert("✅ Cleared", "All students deleted successfully!");
      });

      // Auto-close final confirm after 3s if user doesn’t click
      setTimeout(() => {
        if (!confirmed) closeAlert();
      }, 6000);
    }
  );
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

    // ✅ শুধু id, name, totalMoney পাঠানো হবে
  const limitedData = students.map((s, index) => ({
    id: index + 1,
    name: s.name,
    totalMoney: s.studentTk, // তোমার data-তে totalMoney field নেই, আছে studentTk
  }));


  return (
    <div ref={formRef} className={`containers ${bgClass}`}>
      <div className="mainContent">
        <h2 className="headerText">{`Students Mill Management`}</h2>

        {/* Add Student Form */}
        <div className={` addForm ${cardBg}`}>
          <h3
            className={`headerForm ${
              darkMode ? "textWhite" : "textBlack"
            }`}
          >
            ❤️ {editIndex !== null ? "Edit Money Entry" : "Add Money Entry"}
          </h3>

          <form
            onSubmit={handleSubmit}
            className="form"
          >
            {/* Name Input */}
            <div className="inputDiv">
              <label className="font-medium">Name:</label>
              <input
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))
                }
                className={`input ${inputBorder}`}
              />
            </div>

            {/* check box Money Options */}
            <div className="checkDiv">
              <label className="font-medium">Select Money:</label>
              <div className="selectDiv">
                {[500, 1000, 1500, 2000, 2500, 3000].map((val) => (
                  <label
                    key={val}
                    className={`lable ${
                      selectedAmount === val
                        ? "selectValue"
                        : darkMode
                        ? "darkVlaue"
                        : "lightValue"
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
            <div className="customInputDiv">
              <div className="customDiv">
                <label className="font-medium">Custom Input:</label>
                <input
                  type="number"
                  value={studentTk}
                  onChange={(e) => setStudentTk(e.target.value)}
                  placeholder="Enter Total Tk"
                  className={`customInput ${inputBorder}`}
                />
              </div>
              {/* add/update student button */}
              <button
                type="submit"
                className="addUpdateBtn"
              >
                {editIndex === null ? "Add Student" : "Update Student"}
              </button>
            </div>
          </form>
        </div>


        {/* Cards */}
        <div className="cardDiv">
          <ReusableCard title="Total Money" amount={totalMoney} color="red" darkMode={darkMode} />
          <ReusableCard title="Remaining Money" amount={remainingMoney} color="green" darkMode={darkMode} />
        </div>

        {/* Students Table */}
        <div className={`tableMainDiv ${cardBg}`}>
          <h2 className="tableTitle">📊 Students Data</h2>
          <table className={`table ${
            darkMode ? "tableDark" : "tableLight"
          }`}>
            <thead>
              <tr className={darkMode ? "bg-gray-700/30" : "bg-white/20"}>
                <th className="border py-2">ID</th>
                <th className="border py-2">Name</th>
                <th className="border py-2">Money</th>
                <th className="border py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student, i) => (
                <tr
                  key={i}
                  className={`tableRow ${
                    darkMode
                      ? "tableRowDark"
                      : "tableRowLight"
                  }`}
                >
                  <td className="border py-2">{i + 1}</td>
                  <td className="border py-2">{student.name}</td>

                  {/* total money and edit history */}
                  <td className="border py-2">
                    ৳{student.studentTk}
                    {student.editCount > 0 && (
                      <span
                        onClick={() => {
                          setSelectedStudent(student); // student object পাঠাও
                          setShowHistory(true); // modal দেখাও
                        }}
                        className="text-xs text-yellow-300 ml-2 cursor-pointer hover:underline"
                      >
                        #{student.editCount} ✎
                      </span>

                    )}
                  </td>

                  {/* action sectin and edit btn */}
                  <td className="border py-2">
                    <button
                      onClick={() => {
                        const student = students[i];

                        // current date info
                        const now = new Date();
                        const formattedDate = now.toLocaleDateString("en-GB");
                        const currentMonth  = `${now.getMonth() + 1}-${now.getFullYear()}`;
                        const todayKey = formattedDate;

                        const monthlyLimit = 3;
                        const totalEditsThisMonth = student.editCount + 1; // এই update সহ
                        const remainingEdits = monthlyLimit - totalEditsThisMonth;

                        // আজকে edit করা হয়েছে কি না
                        const alreadyEditedToday = student.editHistory.some(
                          (h) => (typeof h === "object" ? h.date === todayKey : h === todayKey)
                        );
                        if (remainingEdits === 0) {
                            setEditIndex(null);
                            clearForm();
                            return showAlert(
                              "⚠️ Limit Reached",
                              `⚠️ You have reached the monthly edit limit ${monthlyLimit} for this student.`
                            );
                          }
                        else if (alreadyEditedToday) {
                          // warning দেখাও, edit mode off
                          setEditIndex(null);
                          clearForm();
                          return showAlert(
                            "⚠️ Warning",
                            "You already edited this student today!"
                          );
                        }

                        // যদি আজ edit না করা হয়ে থাকে, তাহলে ফর্মে ভরো এবং scroll করাও
                        setName(student.name);
                        setStudentTk(student.studentTk);
                        setEditIndex(i);
                        setSelectedAmount(student.studentTk);

                        // scroll to form
                        formRef.current?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="editBtn"
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
      <EditHistoryModal
        show={showHistory}
        onClose={() => setShowHistory(false)}
        student={selectedStudent}
        cardBg="dark:bg-slate-800" // চাইলে কাস্টম ব্যাকগ্রাউন্ড দিতে পারো
      />



        {/* Global Alert */}
      <AlertPopup
        show={alertData.show}
        onClose={closeAlert}
        title={alertData.title}
        message={alertData.message}
        type={alertData.type}
        onConfirm={confirmAction}
        autoHide={alertData.autoHide}
      />
      </div>
    </div>
  );
}

