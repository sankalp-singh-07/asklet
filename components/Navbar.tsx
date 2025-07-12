"use client";

import { useState } from "react";
import Button from "./Button";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      <nav className="flex justify-between items-center px-4 sm:px-6 md:px-8 lg:px-10 py-4 relative">
        <h1 className="text-xl sm:text-2xl uppercase font-semibold">Asklet</h1>

        <button
          onClick={toggleMenu}
          className="sm:hidden flex flex-col justify-center items-center w-8 h-8 gap-1 cursor-pointer z-20"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-7 h-0.5 bg-black transition-all rounded-2xl duration-300 ease-in-out ${
              isMenuOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          ></span>
          <span
            className={`block w-7 h-0.5 bg-black transition-all rounded-2xl duration-300 ease-in-out ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block w-7 h-0.5 bg-black transition-all rounded-2xl duration-300 ease-in-out ${
              isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          ></span>
        </button>

        <ul className="hidden sm:flex space-x-4 md:space-x-6 lg:space-x-8">
          <li>
            <Button>SIGNUP</Button>
          </li>
          <li>
            <Button>LOGIN</Button>
          </li>
        </ul>

        <div
          className={`sm:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-200 transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "opacity-100 translate-y-0 visible"
              : "opacity-0 -translate-y-4 invisible"
          }`}
        >
          <ul className="flex flex-col py-4 px-4 space-y-3">
            <li>
              <Button className="w-full">SIGNUP</Button>
            </li>
            <li>
              <Button className="w-full">LOGIN</Button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
