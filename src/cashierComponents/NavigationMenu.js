import React from "react";

const NavigationMenu = () => {
  return (
    <nav className="bg-thirtiary py-4">
      <div className="container mx-auto">
        <ul className="flex space-x-4">
          <li>
            <a href="/" className="text-white hover:text-gray-300">
              Home
            </a>
          </li>
          <li>
            <a href="/dashboard" className="text-white hover:text-gray-300">
              Dashboard
            </a>
          </li>
          <li>
            <a href="/orders" className="text-white hover:text-gray-300">
              Orders
            </a>
          </li>
          <li>
            <a href="/payments" className="text-white hover:text-gray-300">
              Payments
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavigationMenu;
