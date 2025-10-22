/* eslint-disable no-unused-vars */

import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes, FaMoon, FaSun } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ filter, setFilter, darkMode, setDarkMode }) {
  const [open, setOpen] = useState(false);

  const linkClass = "block py-2 px-4 rounded-lg hover:bg-primary/20 transition duration-200";
  const activeClass = "text-primary font-semibold";

  return (
    <>
      {/* Full page fade overlay */}
      <AnimatePresence>
        <motion.div
          key={darkMode ? "dark" : "light"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 pointer-events-none bg-light dark:bg-secondary transition-opacity duration-500"
        />
      </AnimatePresence>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg shadow-md p-4 rounded-xl mb-8 max-w-6xl mx-auto 
                      bg-white/30 dark:bg-secondary/70 transition-all duration-300">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <h1 className="text-2xl font-bold text-secondary dark:text-white tracking-wide">
            Mill Management
          </h1>

          {/* Search (Desktop) */}
          <div className="hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 
                        bg-transparent text-secondary dark:text-white
                        focus:outline-none focus:ring-2 focus:ring-primary w-64"
            />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="ml-3 p-2 rounded-full hover:bg-primary/20 transition text-secondary dark:text-white"
          >
            {darkMode ? <FaSun size={22} /> : <FaMoon size={22} />}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="text-secondary dark:text-white md:hidden focus:outline-none ml-2"
          >
            {open ? <FaTimes size={26} /> : <FaBars size={26} />}
          </button>
        </div>

        {/* Desktop menu */}
        <ul className="hidden md:flex justify-center gap-10 font-medium text-lg mt-4">
          {["Home", "Updates", "Expenses", "Dashboard"].map((name) => (
            <li key={name}>
              <NavLink
                to={name === "Home" ? "/" : `/${name.toLowerCase()}`}
                className={({ isActive }) =>
                  `${linkClass} ${
                    isActive ? activeClass : "text-secondary dark:text-white"
                  }`
                }
              >
                {name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Mobile Menu */}
        {open && (
          <div className="mt-4 md:hidden flex flex-col items-center space-y-4 text-secondary dark:text-white text-lg">
            {["Home", "Updates", "Expenses", "Dashboard"].map((name) => (
              <NavLink
                key={name}
                to={name === "Home" ? "/" : `/${name.toLowerCase()}`}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `${linkClass} ${
                    isActive ? activeClass : "text-secondary dark:text-white"
                  }`
                }
              >
                {name}
              </NavLink>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}








