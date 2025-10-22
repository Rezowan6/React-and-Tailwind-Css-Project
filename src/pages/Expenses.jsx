import React, { useState, useEffect } from "react";
import Button from "../components/Button.jsx";
import ReusableCard from "../components/ReusableCard.jsx";

export default function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [amount, setAmount] = useState("");
    const [totalStudentsMoney, setTotalStudentsMoney] = useState(0);

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
        window.dispatchEvent(new Event("storage")); // notify Home.jsx
    }, [expenses]);

    const handleAddExpense = (e) => {
        e.preventDefault();
        if (!amount) return alert("Enter amount!");
        const formattedDate = new Date().toLocaleDateString("en-GB");
        setExpenses([...expenses, { expencesTk: Number(amount), date: formattedDate }]);
        setAmount("");
    };

    const deleteLast = () => {
        if (!expenses.length) return alert("No expense to delete!");
        if (confirm("Delete last expense?")) setExpenses(expenses.slice(0, -1));
    };

    const restartAll = () => {
        if (!expenses.length) return;
        if (confirm("Delete all expenses?")) {
        setExpenses([]);
        localStorage.removeItem("expensesData");
        window.dispatchEvent(new Event("storage"));
        }
    };

    const totalExpenses = expenses.reduce((acc, e) => acc + e.expencesTk, 0);
    const remainingMoney = totalStudentsMoney - totalExpenses;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1E1E2F] via-[#2A1A40] to-[#000000] text-white p-5">
        <div className="max-w-6xl mx-auto space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mt-8 mb-6">
            📋 Every Day Expenses
            </h2>

            {/* Add Expense Form */}
            <div className="backdrop-blur-sm bg-white/10 shadow-lg rounded-md py-6 px-6">
            <form
                onSubmit={handleAddExpense}
                className="flex flex-col md:flex-row gap-4 items-start md:items-end"
            >
                <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter Total Tk"
                required
                className="px-3 py-2 border bg-transparent text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 w-full md:w-auto"
                />
                <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition"
                >
                Add Expense
                </button>
            </form>
            </div>

            {/* Cards */}
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <ReusableCard
                title="Total Expenses"
                amount={totalExpenses}
                color="red"
            />
            <ReusableCard
                title="Remaining Money"
                amount={remainingMoney}
                color="green"
            />
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
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((exp, index) => (
                    <tr
                        key={index}
                        className="hover:bg-white/20 transition-colors cursor-pointer"
                    >
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
            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row justify-center gap-4 mt-6">
            <Button type="delete" onClick={deleteLast} />
            <Button type="restart" onClick={restartAll} />
            </div>
        </div>
        </div>
    );
}




