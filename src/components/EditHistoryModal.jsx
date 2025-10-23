import React from "react";

export default function EditHistoryModal({ show, onClose, student }) {
    if (!show || !student) return null;

    return (
        <div className="fixed inset-0 bg-black/90 flex justify-center items-center z-50 p-5">
        <div className="relative p-6 rounded-2xl w-full max-w-96 backdrop-blur-md border border-yellow-400 shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all duration-500 bg-white/10">
            <h3 className="text-xl font-bold mb-4 text-yellow-400 text-center">
            ✎ Edit History of {student.name}
            </h3>

            {student.editHistory?.length > 0 ? (
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
                    {student.editHistory.map((h, idx) => (
                    <tr key={idx} className="hover:bg-yellow-500/30 transition-colors text-center hover:cursor-pointer">
                        <td className="border py-2">{idx + 1}</td>
                        <td className="border py-2">{h.date}</td>
                        <td className="border py-2">{h.prevMill} → {h.newMill}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            ) : (
            <p className="text-center text-gray-400">No edit history found</p>
            )}

            <button
            onClick={onClose}
            className="mt-5 w-full py-2 rounded-md font-medium text-white bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:opacity-90 shadow-[0_0_15px_rgba(245,158,11,0.4)] transition"
            >
            Close
            </button>
        </div>
        </div>
    );
}
