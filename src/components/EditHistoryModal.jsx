import React from "react";

export default function EditHistoryModal({
    show,
    onClose,
    student,
    cardBg = "",
    headerLabel = "Tk", // ← ডিফল্টভাবে 'Tk' থাকবে
    }) {
    if (!show || !student) return null;

    return (
        <div className="fixed inset-0 bg-black/90 flex justify-center items-center z-50 p-4">
        <div
            className={`relative p-6 rounded-2xl w-80 md:w-96 backdrop-blur-md bg-[#1E1E2F]/90 
            border border-teal-400 shadow-[0_0_25px_rgba(20,184,166,0.4)] 
            transition-all duration-500 ${cardBg}`}
        >
            <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-purple-500 to-pink-500 text-center">
            ✎ Edit History of {student.name}
            </h3>

            <div className="overflow-hidden rounded-lg border border-gray-600 shadow-inner">
            <table className="w-full text-white text-sm border-collapse">
                <thead className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700">
                <tr>
                    <th className="px-2 py-2 border border-gray-600">#</th>
                    <th className="px-2 py-2 border border-gray-600">Date</th>
                    {/* 🔽 এখানে ডাইনামিক টেক্সট */}
                    <th className="px-2 py-2 border border-gray-600">{headerLabel}</th>
                </tr>
                </thead>
                <tbody>
                {student.editHistory?.length > 0 ? (
                    student.editHistory.map((h, idx) => (
                    <tr
                        key={idx}
                        className="cursor-pointer hover:bg-gradient-to-r hover:from-teal-500/30 hover:to-purple-500/30 transition-colors text-center"
                    >
                        <td className="border border-gray-700 py-2">{idx + 1}</td>
                        <td className="border border-gray-700 py-2">{h.date}</td>
                        <td className="border border-gray-700 py-2">
                        {h.prevTk ?? h.prevMill} → {h.newTk ?? h.newMill}
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                    <td colSpan="3" className="py-3 text-gray-400">
                        No edits yet
                    </td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>

            <button onClick={onClose} className="closeBtn mt-4">
            Close
            </button>
        </div>
        </div>
    );
}


