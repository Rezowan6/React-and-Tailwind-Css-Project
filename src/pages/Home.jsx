import React, { useState, useEffect } from "react";

export default function Home({ filter }) {
    const [students, setStudents] = useState([]);
    const [name, setName] = useState("");
    const [studentTk, setStudentTk] = useState("");
    const [editIndex, setEditIndex] = useState(null);
    const [selectedAmount, setSelectedAmount] = useState(null);

    // ✅ Load data from LocalStorage
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("studentsData")) || [];
        setStudents(saved);
    }, []);

    // ✅ Save to LocalStorage
    useEffect(() => {
        localStorage.setItem("studentsData", JSON.stringify(students));
    }, [students]);

    // ✅ Add or Edit Student
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !studentTk) return alert("Please fill all fields!");

        const formattedDate = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        });

        const newStudent = { name, studentTk: Number(studentTk), date: formattedDate };

        if (editIndex === null) {
        setStudents([...students, newStudent]);
        } else {
        const updated = [...students];
        updated[editIndex] = newStudent;
        setStudents(updated);
        setEditIndex(null);
        }

        setName("");
        setStudentTk("");
        setSelectedAmount(null);
    };

    // ✅ Delete Last Student
    const deleteLast = () => {
        if (students.length === 0) return alert("⚠️ No student left to delete!");
        if (window.confirm("⚠️ Are you sure you want to delete last student?")) {
        setStudents(students.slice(0, -1));
        }
    };

    // ✅ Restart All Students
    const restartAll = () => {
        if (students.length === 0) return;
        if (window.confirm("⚠️ Are you sure you want to delete all students?")) {
        setStudents([]);
        localStorage.removeItem("studentsData");
        alert("✅ All student data cleared!");
        }
    };

    // ✅ Filter & Total
    const filtered = students.filter((s) =>
        s.name.toLowerCase().includes(filter.toLowerCase())
    );
    const totalMoney = filtered.reduce((acc, s) => acc + s.studentTk, 0);

    // ✅ Handle Checkbox
    const handleCheckbox = (value) => {
        if (selectedAmount === value) {
        setSelectedAmount(null);
        setStudentTk("");
        } else {
        setSelectedAmount(value);
        setStudentTk(value);
        }
    };

    return (
        <div className="min-h-screen bg-[darkblue] font-[Times_New_Roman] p-5">
        {/* 📋 Main Content */}
        <div className="max-w-6xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-center text-white">
            Students Mill Management
            </h2>

            {/* 🧍‍♂️ Add Student Form */}
            <div className="backdrop-blur-sm bg-white/10 p-6 rounded-2xl space-y-5">
            <h3 className="text-xl font-semibold text-white">📅 Add First Data</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <input
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full lg:w-1/4 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                />

                {/* 💰 Checkboxes */}
                <div className="flex flex-wrap gap-4">
                {[500, 1000, 1500, 2000, 2500].map((val) => (
                    <label
                    key={val}
                    className={`flex items-center gap-2 border text-white rounded-md px-3 py-2 cursor-pointer ${
                        selectedAmount === val ? "bg-teal-600" : "border-white"
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

                {/* ✏️ Custom Input */}
                <div className="flex flex-col md:flex-row md:items-end gap-4">
                <div className="flex flex-col gap-2">
                    <label className="text-white font-medium">Custom Input:</label>
                    <input
                    type="number"
                    value={studentTk}
                    onChange={(e) => setStudentTk(e.target.value)}
                    placeholder="Enter Total Tk"
                    required
                    className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition"
                >
                    {editIndex === null ? "Add Student" : "Update Student"}
                </button>
                </div>
            </form>
            </div>

            {/* 📊 Student Table */}
            <div className="backdrop-blur-sm bg-white/10 p-5 rounded-md">
            <p className="text-white text-lg font-semibold mb-3">
                Total Money: ৳{totalMoney}
            </p>
            <h2 className="text-xl font-semibold mb-4 text-white">
                📊 Students Data
            </h2>

            <table className="w-full border-collapse text-white border border-white text-center">
                <thead>
                <tr>
                    <th className="border py-2">ID</th>
                    <th className="border py-2">Name</th>
                    <th className="border py-2">Student Tk</th>
                    <th className="border py-2">Date</th>
                </tr>
                </thead>
                <tbody>
                {filtered.map((student, i) => (
                    <tr key={i}>
                    <td className="border py-2">{i + 1}</td>
                    <td className="border py-2">{student.name}</td>
                    <td className="border py-2">৳{student.studentTk}</td>
                    <td className="border py-2">{student.date}</td>
                    </tr>
                ))}
                {filtered.length === 0 && (
                    <tr>
                    <td colSpan="4" className="py-3 text-gray-300">
                        No students found
                    </td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>

            {/* 🗑️ Buttons */}
            <div className="flex flex-col md:flex-row justify-center gap-4 mt-6">
            <button
                onClick={deleteLast}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition"
            >
                Delete Last Student
            </button>
            <button
                onClick={restartAll}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition"
            >
                Restart
            </button>
            </div>
        </div>
        </div>
    );
}

