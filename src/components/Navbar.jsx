import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar({ filter, setFilter }) {
  const [open, setOpen] = useState(false);

  const linkClass =
    "block py-2 px-4 text-white hover:text-teal-400 transition duration-200";
  const activeClass = "text-teal-400 font-semibold";

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md shadow-md p-4 rounded-xl mb-8 max-w-6xl mx-auto bg-white/10">
      <div className="flex items-center justify-between w-full">
        {/* 🧭 Logo - hidden on mobile */}
        <h1 className="text-2xl font-bold text-white hidden md:block">
          Mill Management System
        </h1>

        {/* 🔍 Search Input - hidden on desktop, visible on mobile */}
        <div className="block md:hidden flex-1 mr-3">
          <input
            type="text"
            placeholder="Search..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 text-black"
          />
        </div>

        {/* 🔍 Search Input (Desktop only) */}
        <div className="hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 text-black w-60"
          />
        </div>

        {/* 📱 Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="text-white md:hidden focus:outline-none ml-2"
        >
          {open ? <FaTimes size={26} /> : <FaBars size={26} />}
        </button>
      </div>

      {/* 🧭 Desktop Menu */}
      <ul className="hidden md:flex justify-center gap-10 font-medium text-white text-lg mt-4">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/updates"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            Updates
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/expenses"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            Expenses
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            Dashboard
          </NavLink>
        </li>
      </ul>

      {/* 📱 Mobile Dropdown Menu */}
      {open && (
        <div className="mt-4 md:hidden flex flex-col items-center space-y-4 text-white text-lg">
          <ul className="flex flex-col items-center gap-4">
            <li>
              <NavLink
                to="/"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `${linkClass} ${isActive ? activeClass : ""}`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/updates"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `${linkClass} ${isActive ? activeClass : ""}`
                }
              >
                Updates
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/expenses"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `${linkClass} ${isActive ? activeClass : ""}`
                }
              >
                Expenses
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `${linkClass} ${isActive ? activeClass : ""}`
                }
              >
                Dashboard
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}



