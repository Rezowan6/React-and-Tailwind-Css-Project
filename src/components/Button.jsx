import React from "react";

export default function Button({ type, onClick }) {
    let bgColor = "";
    let hoverColor = "";

    if (type === "delete") {
        bgColor = "bg-red-600";
        hoverColor = "hover:bg-red-700";
    } else if (type === "restart") {
        bgColor = "bg-gray-500";
        hoverColor = "hover:bg-gray-600";
    } else {
        bgColor = "bg-blue-600";
        hoverColor = "hover:bg-blue-700";
    }

    return (
        <button
        onClick={onClick}
        className={`${bgColor} ${hoverColor} text-white px-6 py-2 rounded-md transition`}
        >
        {type === "delete"
            ? "Delete Last Student"
            : type === "restart"
            ? "Restart All"
            : "Button"}
        </button>
    );
}

