import React, { useState, useEffect } from "react";

export default function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [amount, setAmount] = useState("");

    // ✅ Load data from localStorage
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("expensesData")) || [];
        setExpenses(saved);
    }, []);

    // ✅ Save data to localStorage
    useEffect(() => {
        localStorage.setItem("expensesData", JSON.stringify(expenses));
    }, [expenses]);

    // ✅ Add Expense
    const handleAddExpense = (e) => {
        e.preventDefault();
        if (!amount) return alert("⚠️ Please enter an amount!");

        const formattedDate = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        });

        const newExpense = { expencesTk: Number(amount), date: formattedDate };
        setExpenses([...expenses, newExpense]);
        setAmount("");
    };

    // ✅ Delete Last Expense
    const deleteLast = () => {
        if (expenses.length === 0) return alert("⚠️ No expense to delete!");
        if (confirm("Delete last expense?")) {
        const updated = [...expenses];
        updated.pop();
        setExpenses(updated);
        }
    };

    // ✅ Restart All
    const restartAll = () => {
        if (expenses.length === 0) return;
        if (confirm("Delete all expenses?")) {
        setExpenses([]);
        localStorage.removeItem("expensesData");
        alert("✅ All data cleared!");
        }
    };

    // ✅ Total
    const totalMoney = expenses.reduce((acc, e) => acc + e.expencesTk, 0);

    return (
        <div className="space-y-8 text-white">
        {/* 🧾 Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-center mt-8 mb-6">
            📋 Every Day Expenses
        </h2>

        {/* 🧾 Form */}
        <div className="backdrop-blur-sm bg-white/10 shadow-lg rounded-md py-6 px-6">
            <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">📅 Add Expenses Data</h3>
            <p className="text-lg font-medium">
                Total Expenses: ৳{totalMoney}
            </p>
            </div>

            <form
            onSubmit={handleAddExpense}
            className="flex flex-col md:flex-row gap-4 items-start md:items-end"
            >
            <div className="flex flex-col gap-2 w-full md:w-auto flex-1">
                <label className="font-medium">Custom Input:</label>
                <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter Total Tk"
                required
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 w-full text-black"
                />
            </div>

            <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition duration-200 w-full md:w-auto"
            >
                Add Expense
            </button>
            </form>
        </div>

        {/* 📊 Table */}
        <div className="backdrop-blur-sm bg-white/10 shadow-lg rounded-md p-6">
            <h2 className="text-xl font-semibold mb-4">📊 Expenses Data</h2>
            <table className="w-full border-collapse border border-white text-center">
            <thead>
                <tr>
                <th className="border border-white py-2">ID</th>
                <th className="border border-white py-2">Expenses Tk</th>
                <th className="border border-white py-2">Date</th>
                </tr>
            </thead>
            <tbody>
                {expenses.map((exp, index) => (
                <tr key={index}>
                    <td className="border border-white py-2">{index + 1}</td>
                    <td className="border border-white py-2">৳{exp.expencesTk}</td>
                    <td className="border border-white py-2">{exp.date}</td>
                </tr>
                ))}
                {expenses.length === 0 && (
                <tr>
                    <td colSpan="3" className="py-3 text-gray-300">
                    No expenses found
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>

        {/* 🧹 Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
            <button
            onClick={deleteLast}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition duration-200"
            >
            Delete Expense
            </button>
            <button
            onClick={restartAll}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition duration-200"
            >
            Restart
            </button>
        </div>
        </div>
    );
}
