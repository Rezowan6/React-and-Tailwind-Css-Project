import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [totalMoney, setTotalMoney] = useState(0);
  const [totalMeal, setTotalMeal] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [expensePerMeal, setExpensePerMeal] = useState(0);

  const calculateTotals = () => {
    const millData = JSON.parse(localStorage.getItem("millData")) || [];
    const moneyData = JSON.parse(localStorage.getItem("studentsData")) || [];
    const expenses = JSON.parse(localStorage.getItem("expensesData")) || [];

    const merged = moneyData.map((s, index) => {
      const millObj = millData.find((m) => m.name === s.name);
      return {
        id: index + 1,
        name: s.name,
        totalMoney: s.studentTk || 0,
        totalMill: millObj ? millObj.mill : 0,
      };
    });

    setStudents(merged);

    const moneySum = merged.reduce((acc, s) => acc + (s.totalMoney || 0), 0);
    const mealSum = merged.reduce((acc, s) => acc + (s.totalMill || 0), 0);
    const expensesSum = expenses.reduce((acc, e) => acc + (e.expencesTk || 0), 0);

    setTotalMoney(moneySum);
    setTotalMeal(mealSum);
    setTotalExpenses(expensesSum);
    setExpensePerMeal(mealSum > 0 ? expensesSum / mealSum : 0);
  };

  useEffect(() => {
    calculateTotals();
    const handleStorageChange = () => calculateTotals();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
// PDF file
const generatePDF = () => {
  if (students.length === 0) {
    alert("No student data to export!");
    return;
  }

  const doc = new jsPDF({ orientation: "landscape" });

  doc.setFontSize(18);
  doc.setTextColor(0, 0, 128);
  doc.text("Student Dashboard", 14, 20);

  const tableColumn = [
    "ID",
    "Name",
    "Total Money",
    "Total Meal",
    "Expenses",
    "Positive",
    "Negative",
  ];

  const tableRows = students.map((student) => {
    const studentMill = Number(student.totalMill || 0);
    const studentMoney = Number(student.totalMoney || 0);
    const studentExpense = (studentMill * expensePerMeal).toFixed(2);
    const diff = (studentMoney - studentExpense).toFixed(2);

    return [
      student.id,
      student.name,
      studentMoney.toLocaleString(),
      studentMill.toLocaleString(),
      studentExpense.toLocaleString(),
      Number(diff) > 0 ? Number(diff).toLocaleString() : "-",
      Number(diff) < 0 ? Number(diff).toLocaleString() : "-",
    ];
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 30,
    styles: {
      font: "courier", // monospace, number alignment ঠিক থাকবে
      fontSize: 11,
      cellPadding: 4,
    },
    headStyles: { fillColor: [22, 160, 133], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 248, 255] },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 50, halign: "center" },
      2: { cellWidth: 30, halign: "center" },
      3: { cellWidth: 25, halign: "center" },
      4: { cellWidth: 30, halign: "center" },
      5: { cellWidth: 30, halign: "center" },
      6: { cellWidth: 30, halign: "center" },
    },
  });

  doc.save("student_dashboard.pdf");
};



  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-100 dark:bg-[#1E1E2F]/90 rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl sm:text-3xl font-semibold text-center">
        📊 Student Dashboard
      </h2>

      {/* Totals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-lg sm:text-xl font-medium text-center">
        <h3 className="text-teal-600 dark:text-teal-400 break-words">
          Total Money: ৳{totalMoney}
        </h3>
        <h3 className="text-red-600 dark:text-red-400 break-words">
          Total Expenses: ৳{totalExpenses}
        </h3>
        <h3 className="text-purple-600 dark:text-purple-400 break-words">
          Total Meal: {totalMeal}
        </h3>
        <h3 className="text-yellow-500 dark:text-yellow-400 break-words">
          Per Meal Expense: ৳{expensePerMeal.toFixed(2)}
        </h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-center border rounded-lg">
          <thead className="bg-gray-200 dark:bg-gray-700/50">
            <tr>
              <th className="border px-2 sm:px-4 py-2 text-sm sm:text-base">ID</th>
              <th className="border px-2 sm:px-4 py-2 text-sm sm:text-base">Name</th>
              <th className="border px-2 sm:px-4 py-2 text-sm sm:text-base">Total Money</th>
              <th className="border px-2 sm:px-4 py-2 text-sm sm:text-base">Total Meal</th>
              <th className="border px-2 sm:px-4 py-2 text-sm sm:text-base">Expenses</th>
              <th className="border px-2 sm:px-4 py-2 text-sm sm:text-base">Positive</th>
              <th className="border px-2 sm:px-4 py-2 text-sm sm:text-base">Negative</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student) => {
                const studentExpense = (student.totalMill * expensePerMeal).toFixed(2);
                const diff = (student.totalMoney - studentExpense).toFixed(2);
                const positive = Number(diff) > 0 ? diff : null;
                const negative = Number(diff) < 0 ? diff : null;

                return (
                  <tr
                    key={student.id}
                    className="hover:bg-teal-100 dark:hover:bg-teal-600/30 transition-all text-sm sm:text-base"
                  >
                    <td className="border px-2 sm:px-4 py-2">{student.id}</td>
                    <td className="border px-2 sm:px-4 py-2">{student.name}</td>
                    <td className="border px-2 sm:px-4 py-2 text-center">৳{student.totalMoney}</td>
                    <td className="border px-2 sm:px-4 py-2 text-center">{student.totalMill}</td>
                    <td className="border px-2 sm:px-4 py-2 text-center">৳{studentExpense}</td>
                    <td className={`border px-2 sm:px-4 py-2 text-center ${positive ? "text-green-600 dark:text-green-400 font-medium" : ""}`}>
                      {positive ? `৳${positive}` : "-"}
                    </td>
                    <td className={`border px-2 sm:px-4 py-2 text-center ${negative ? "text-red-600 dark:text-red-400 font-medium" : ""}`}>
                      {negative ? `৳${negative}` : "-"}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="py-4 text-gray-500 text-sm sm:text-base">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PDF Button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={generatePDF}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}









