import React, { useState } from "react";
import { FaBars, FaTimes, FaExchangeAlt } from "react-icons/fa";
import {
  FiBarChart2,
  FiShoppingCart,
  FiClock,
  FiAlertCircle,
  FiSettings,
  FiGitPullRequest,
  FiCheckCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {
  RiCashLine,
  RiClipboardLine,
  RiMenu2Line,
  RiEdit2Line,
  RiSaveLine,
} from "react-icons/ri";

const SidebarCashier = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const sidebarWidth = isOpen ? "w-27rem" : "w-16";

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeMenuOnSelect = () => {
    if (window.innerWidth < 640) {
      setIsOpen(false);
    }
  };

  const handleDashboardClick = () => {
    navigate("/");
    closeMenuOnSelect();
  };

  const handleOrdersClick = () => {
    navigate("/orders");
    closeMenuOnSelect();
  };

  const handlePaymentsClick = () => {
    navigate("/payments");
    closeMenuOnSelect();
  };
  const handleMenuDisplayClick = () => {
    navigate("/menu");
    closeMenuOnSelect();
  };

  return (
    <div className=" fixed  lg:relative  z-10 lg:z-0   flex h-full bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-27rem" : "w-16"
        } bg-thirtiary transition-all duration-300 ease-in-out flex-shrink-0 `}>
        <div className="flex flex-col h-full ">
          {/* Sidebar header */}
          <div className="flex items-center justify-between flex-shrink-0 h-16 px-4 bg-thirtiaryD">
            {isOpen && <span>Menu</span>}
            <button
              className="text-black  focus:outline-none"
              onClick={toggleSidebar}>
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
          {/* Sidebar content */}
          <div className="flex-1 overflow-y-auto">
            <nav className="px-2 py-4 space-y-2">
              {/* Reporting Dashboard */}
              <div
                onClick={handleDashboardClick}
                className="flex items-center px-2 py-2 text-white rounded-md hover:bg-thirtiaryD">
                <FiBarChart2 className="inline-block mr-2" />
                {isOpen && <span className="ml-2 font-medium">Dashboard</span>}
              </div>

              <div
                onClick={handleOrdersClick}
                className="flex items-center px-2 py-2 text-white rounded-md hover:bg-thirtiaryD">
                <RiCashLine className="inline-block mr-2 text-white" />
                {isOpen && <span className="ml-2 font-medium">orders</span>}
              </div>

              {/* Request Form */}
              <div
                onClick={handlePaymentsClick}
                className="flex items-center px-2 py-2 text-white rounded-md hover:bg-thirtiaryD">
                <FiCheckCircle className="inline-block mr-2 text-white" />
                {isOpen && <span className="ml-2 font-medium">Payments</span>}
              </div>

              <div
                onClick={handleMenuDisplayClick}
                className="flex items-center px-2 py-2 text-white rounded-md hover:bg-thirtiaryD">
                <RiEdit2Line className="inline-block mr-2 text-white" />
                {isOpen && (
                  <span className="ml-2 font-medium">MenuDisplay</span>
                )}
              </div>

              <div className="py-6"></div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarCashier;
