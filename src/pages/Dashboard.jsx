// Dashboard.jsx
import React, { useEffect, useState } from "react";

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
        setExpensePerMeal(mealSum > 0 ? (expensesSum / mealSum).toFixed(2) : 0);
    };

    useEffect(() => {
        calculateTotals();
        const handleStorageChange = () => calculateTotals();
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-100 dark:bg-[#1E1E2F]/90 rounded-lg shadow-md space-y-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center">📊 Student Dashboard</h2>

        {/* Totals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-lg sm:text-xl font-medium text-center">
            <h3 className="text-teal-600 dark:text-teal-400 break-words">Total Money: ৳{totalMoney}</h3>
            <h3 className="text-red-600 dark:text-red-400 break-words">Total Expenses: ৳{totalExpenses}</h3>
            <h3 className="text-purple-600 dark:text-purple-400 break-words">Total Meal: {totalMeal}</h3>
            <h3 className="text-yellow-500 dark:text-yellow-400 break-words">Per Meal Expense: ৳{expensePerMeal}</h3>
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
                        <td className="border px-2 sm:px-4 py-2">৳{student.totalMoney}</td>
                        <td className="border px-2 sm:px-4 py-2">{student.totalMill}</td>
                        <td className="border px-2 sm:px-4 py-2">৳{studentExpense}</td>
                        <td className={`border px-2 sm:px-4 py-2 ${positive ? 'text-green-600 dark:text-green-400 font-medium' : ''}`}>
                        {positive ? `৳${positive}` : '-'}
                        </td>
                        <td className={`border px-2 sm:px-4 py-2 ${negative ? 'text-red-600 dark:text-red-400 font-medium' : ''}`}>
                        {negative ? `৳${negative}` : '-'}
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
        </div>
    );
}





