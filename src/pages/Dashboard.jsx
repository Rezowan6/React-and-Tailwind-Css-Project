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
  const pageWidth = doc.internal.pageSize.getWidth();

  // ===== HEADER =====
  doc.setFillColor(22, 160, 133);
  doc.rect(0, 0, pageWidth, 25, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text("Student Dashboard Report", 14, 17);

  doc.setFontSize(10);
  doc.setTextColor(230);
  const today = new Date();
  const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;

  doc.text(`Generated on: ${formattedDate}`, pageWidth - 60, 17);


  // ===== SUMMARY BOX =====
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(10, 30, pageWidth - 20, 18, 3, 3, "F");

  const summaryX = [14, 85, 160, 235];
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");

  doc.setTextColor(0, 102, 51);
  doc.text(`Total Money: ${totalMoney.toLocaleString()}`, summaryX[0], 42);

  doc.setTextColor(204, 0, 0);
  doc.text(`Total Expenses: ${totalExpenses.toLocaleString()}`, summaryX[1], 42);

  doc.setTextColor(102, 0, 204);
  doc.text(`Total Meal: ${totalMeal.toLocaleString()}`, summaryX[2], 42);

  doc.setTextColor(0, 150, 150);
  doc.text(`Per Meal Expense: ${expensePerMeal.toFixed(2)}`, summaryX[3], 42);

  // ===== TABLE HEAD =====
  const tableColumn = [
    "ID",
    "Name",
    "Total Money",
    "Total Meal",
    "Expenses",
    "Positive",
    "Negative",
  ];

  // ===== TABLE BODY =====
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
      Number(diff) > 0 ? Number(diff).toLocaleString() : "",
      Number(diff) < 0 ? Number(diff).toLocaleString() : "",
    ];
  });

  // ===== TABLE DESIGN =====
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 55,
    tableWidth: '100%',
    styles: {
      font: "helvetica",
      fontSize: 11,
      cellPadding: 4,
      valign: "middle",
      lineColor: [220, 220, 220],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [22, 160, 133],
      textColor: 255,
      fontStyle: "bold",
      halign: "center",
    },
    bodyStyles: {
      halign: "center",
    },
    alternateRowStyles: { fillColor: [245, 255, 250] },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 55, halign: "left" },
      2: { cellWidth: 35 },
      3: { cellWidth: 30 },
      4: { cellWidth: 35 },
      5: { cellWidth: 35, textColor: [0, 128, 0], fontStyle: "bold" }, // positive
      6: { cellWidth: 35, textColor: [255, 0, 0], fontStyle: "bold" }, // negative
    },
    margin: { left: 10, right: 10 },
    didDrawPage: function (data) {
      const pageCount = doc.internal.getNumberOfPages();
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;

      // ===== FOOTER LINE =====
      doc.setDrawColor(200);
      doc.line(10, pageHeight - 30, pageWidth - 10, pageHeight - 30);

      // ===== SIGNATURE SECTION =====
      doc.setFontSize(11);
      doc.setTextColor(0);
      doc.text("Prepared By:", 20, pageHeight - 20);
      doc.text("Verified By:", pageWidth / 2 + 20, pageHeight - 20);

      // Signature lines
      doc.line(45, pageHeight - 22, 110, pageHeight - 22); // Prepared By line
      doc.line(pageWidth / 2 + 45, pageHeight - 22, pageWidth / 2 + 110, pageHeight - 22); // Verified By line

      // Optional text under signature
      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text("(Name & Signature)", 60, pageHeight - 15);
      doc.text("(Name & Signature)", pageWidth / 2 + 65, pageHeight - 15);

      // ===== FOOTER INFO =====
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text("Generated by Student Meal Manager", 14, pageHeight - 5);
      doc.text(`Page ${data.pageNumber} of ${pageCount}`, pageWidth - 40, pageHeight - 5);
    },
  });

  doc.save("student_dashboard_report.pdf");
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
        <h3 className="text-orange-500 dark:text-amber-500 break-words">
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
          className="yesBtn lg:w-52"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}









