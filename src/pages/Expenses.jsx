import React, { useState, useEffect } from "react";
import Button from "../components/Button.jsx";
import ReusableCard from "../components/ReusableCard.jsx";
import AlertPopup from "../components/AlertPopup.jsx";
import EditHistoryModal from "../components/EditHistoryModal.jsx";
import useAlert from "../hooks/useAlert.js";

export default function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [amount, setAmount] = useState("");
    const [totalStudentsMoney, setTotalStudentsMoney] = useState(0);
    const [editIndex, setEditIndex] = useState(null);
    const [viewHistory, setViewHistory] = useState(null);

    const { alertData, showAlert, showConfirm, closeAlert } = useAlert();

    // Load expenses & total students money
    useEffect(() => {
        const savedExpenses = JSON.parse(localStorage.getItem("expensesData")) || [];
        setExpenses(savedExpenses);

        const students = JSON.parse(localStorage.getItem("studentsData")) || [];
        const totalMoney = students.reduce((acc, s) => acc + s.studentTk, 0);
        setTotalStudentsMoney(totalMoney);
    }, []);

    // Save expenses & notify Home.jsx
    useEffect(() => {
        localStorage.setItem("expensesData", JSON.stringify(expenses));
        window.dispatchEvent(new Event("storage"));
    }, [expenses]);

    const handleAddExpense = (e) => {
        e.preventDefault();
        if (!amount) return showAlert("❌ Error", "Please enter expense amount!");

        const formattedDate = new Date().toLocaleDateString("en-GB");
        const newAmount = Number(amount);

        // ✏️ Edit mode
        if (editIndex !== null) {
        setExpenses((prevExpenses) =>
            prevExpenses.map((exp, i) => {
            if (i !== editIndex) return exp;

            // ✅ Check edit limit per day (max 3)
            let editCount = exp.editCount || 0;
            if (exp.date === formattedDate && editCount >= 3) {
                showAlert("⚠️ Warning", "You can edit this expense a maximum of 3 times per day!");
                return exp;
            }
            editCount = exp.date === formattedDate ? editCount + 1 : 1;

        const prevMill = exp.expencesTk;
        const newMill = Number(amount);

        return {
        ...exp,
        expencesTk: newMill,
        edited: true,
        date: formattedDate,
        editCount: editCount,
        editHistory: exp.editHistory
            ? [...exp.editHistory, { prevMill, newMill, date: formattedDate }]
            : [{ prevMill, newMill, date: formattedDate }],
        };


            })
        );
        setEditIndex(null);
        setAmount("");
        return showAlert("✅ Updated", "Expense has been successfully updated!");
        }

        // ➕ Add new expense
        const newExpense = {
        expencesTk: newAmount,
        date: formattedDate,
        edited: false,
        editCount: 0,
        editHistory: [],
        };

        setExpenses([...expenses, newExpense]);
        setAmount("");
        showAlert("✅ Added", "Expense added successfully!");
    };

    const handleEdit = (index) => {
        const exp = expenses[index];
        setAmount(String(exp.expencesTk));
        setEditIndex(index);
    };

    const handleViewHistory = (row) => setViewHistory(row);
    const closeHistoryView = () => setViewHistory(null);

    // Delete button
    const deleteLast = () => {
        if (!expenses.length) return showAlert("❌ Error", "No expense to delete!");
        showConfirm("🗑 Delete Last", "Are you sure you want to delete the last expense?", () => {
        setExpenses((prev) => prev.slice(0, -1));
        showAlert("✅ Deleted", "Last expense deleted successfully!");
        });
    };

    // Restart all
    const restartAll = () => {
        if (!expenses.length) return showAlert("❌ Error", "No expense data to clear!");
        showConfirm("⚠️ Restart All", "Are you sure you want to delete all expenses?", () => {
        setExpenses([]);
        localStorage.removeItem("expensesData");
        window.dispatchEvent(new Event("storage"));
        showAlert("✅ Cleared", "All expense data cleared!");
        });
    };

    const totalExpenses = expenses.reduce((acc, e) => acc + e.expencesTk, 0);
    const remainingMoney = totalStudentsMoney - totalExpenses;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1E1E2F] via-[#2A1A40] to-[#000000] text-white p-5">
        <div className="max-w-6xl mx-auto space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mt-8 mb-6">
            📋 Every Day Expenses
            </h2>

            {/* Add/Edit Form */}
            <div className="backdrop-blur-sm bg-white/10 shadow-lg rounded-md py-6 px-6">
            <form onSubmit={handleAddExpense} className="flex flex-col md:flex-row md:items-end gap-4 w-full">
                <div className="flex flex-col w-full md:w-auto flex-1">
                <label htmlFor="amount" className="text-sm md:text-base font-medium text-teal-300 mb-2 tracking-wide">
                    💰 Enter Total Expense:
                </label>
                <input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter Total Tk"
                    required
                    className="px-3 py-2 border bg-transparent text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:text-gray-300 w-full"
                />
                </div>

                <button type="submit" className="addUpdateBtn">
                {editIndex !== null ? "Update Expense" : "Add Expense"}
                </button>
            </form>
            </div>

            {/* Cards */}
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <ReusableCard title="Total Expenses" amount={totalExpenses} color="red" />
            <ReusableCard title="Remaining Money" amount={remainingMoney} color="green" />
            </div>

            {/* Expenses Table */}
            <div className="backdrop-blur-md bg-white/10 shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">📊 Expenses Data</h2>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-center">
                <thead>
                    <tr className="bg-white/20">
                    <th className="border border-white py-2">ID</th>
                    <th className="border border-white py-2">Expenses Tk</th>
                    <th className="border border-white py-2">Date</th>
                    <th className="border border-white py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((exp, index) => (
                    <tr key={index} className="hover:bg-white/20 transition-colors cursor-pointer">
                        <td className="border border-white py-2">{index + 1}</td>
                        <td className="border border-white py-2">
                        ৳{exp.expencesTk}{" "}
                        {exp.editHistory?.length > 0 && (
                            <span
                            className="text-xs text-yellow-300 cursor-pointer hover:underline ml-1"
                            title="Click to view edit history"
                            onClick={() => handleViewHistory(exp)}
                            >
                            #{exp.editHistory.length}✎
                            </span>
                        )}
                        </td>
                        <td className="border border-white py-2">{exp.date}</td>
                        <td className="border border-white py-2">
                        <button
                            onClick={() => handleEdit(index)}
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-3 py-1 rounded-md text-sm transition"
                        >
                            Edit
                        </button>
                        </td>
                    </tr>
                    ))}
                    {expenses.length === 0 && (
                    <tr>
                        <td colSpan="4" className="py-3 text-gray-300">
                        No expenses found
                        </td>
                    </tr>
                    )}
                </tbody>
                </table>
            </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row justify-center gap-4 mt-6">
            <Button type="delete" onClick={deleteLast} />
            <Button type="restart" onClick={restartAll} />
            </div>

            {/* Edit History Modal */}
            <EditHistoryModal
            show={!!viewHistory}
            onClose={closeHistoryView}
            student={viewHistory}
            headerLabel="Expense"
            />

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








