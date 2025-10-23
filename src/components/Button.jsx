import React from "react";

export default function Button({ type, onClick, label }) {
    let bgColor = "";
    let hoverColor = "";
    let textColor = "text-white";

    switch (type) {
        case "delete":
        bgColor = "bg-red-600";
        hoverColor = "hover:bg-red-700";
        break;
        case "restart":
        bgColor = "bg-gray-500";
        hoverColor = "hover:bg-gray-600";
        break;
        case "backup":
        bgColor = "bg-blue-600";
        hoverColor = "hover:bg-blue-700";
        break;
        case "restore":
        bgColor = "bg-yellow-500";
        hoverColor = "hover:bg-yellow-600";
        textColor = "text-white";
        break;
        default:
        bgColor = "bg-teal-600";
        hoverColor = "hover:bg-teal-700";
        break;
    }

    return type === "restore" ? (
        // Special case for Restore (file input)
        <label
        className={`${bgColor} ${hoverColor} ${textColor} px-6 py-2 rounded-md shadow-md cursor-pointer transition hover:scale-105`}
        >
        {label || "Restore"}
        <input
            type="file"
            accept=".json"
            className="hidden"
            onChange={onClick} // onClick here handles file upload
        />
        </label>
    ) : (
        <button
        onClick={onClick}
        className={`${bgColor} ${hoverColor} ${textColor} px-6 py-2 rounded-md shadow-md cur transition hover:scale-105`}
        >
        {label ||
            (type === "delete"
            ? "Delete Last Student"
            : type === "restart"
            ? "Restart All"
            : type === "backup"
            ? "Backup"
            : "Button")}
        </button>
    );
}


