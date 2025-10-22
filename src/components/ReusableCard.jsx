import React from "react";

export default function ReusableCard({ title, amount, color }) {
  // color = 'red' or 'green'
  const gradientClass =
    color === "red"
      ? "bg-gradient-to-r from-red-500 to-pink-500"
      : "bg-gradient-to-r from-green-500 to-teal-500";

  return (
    <div
      className={`backdrop-blur-md rounded-xl shadow-lg p-6 w-full md:w-1/2 text-center
                  ${gradientClass}
                  hover:scale-105 transition-transform duration-300`}
    >
      <p className="text-lg md:text-xl font-semibold text-white">{title}</p>
      <p className="text-2xl md:text-3xl font-bold mt-2 text-white">৳{amount}</p>
    </div>
  );
}




