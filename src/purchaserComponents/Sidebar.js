import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import {
  FiBarChart2,
  FiShoppingCart,
  FiClock,
  FiSettings,
  FiAlertCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const sidebarWidth = isOpen ? "w-27rem" : "w-16";
  const [selected, setSelected] = useState("");
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeMenuOnSelect = () => {
    if (window.innerWidth < 640) {
      setIsOpen(false);
    }
  };

  const handleReportingDashboardClick = () => {
    navigate("/reporting-dashboard");
    closeMenuOnSelect();
    setSelected("d");
  };

  const handlePurchaseFormClick = () => {
    navigate("/purchase-form");
    closeMenuOnSelect();
    setSelected("pf");
  };

  const handlePurchaseHistoryClick = () => {
    navigate("/purchase-history");
    closeMenuOnSelect();
    setSelected("ph");
  };

  const handleStockManagementClick = () => {
    navigate("/stock-management");
    closeMenuOnSelect();
    setSelected("sm");
  };
  const handleStockAlertClick = () => {
    navigate("/stock-alert");
    closeMenuOnSelect();
    setSelected("sa");
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
          <div className="flex-1 overflow-y-auto ">
            <nav className=" px-2 py-4 space-y-2  overflow-x-hidden">
              {/* Reporting Dashboard */}
              <div
                onClick={handleReportingDashboardClick}
                className={`flex items-center px-2 py-2  rounded-md ${
                  selected === "d"
                    ? "bg-white -mr-3 text-black"
                    : "text-white hover:bg-thirtiaryD "
                }`}>
                <FiBarChart2 className="inline-block mr-2" />
                {isOpen && (
                  <span className="ml-2 font-medium">Reporting Dashboard</span>
                )}
              </div>
              {/* Purchase Form */}
              <div
                onClick={handlePurchaseFormClick}
                className={`flex items-center px-2 py-2  rounded-md  ${
                  selected === "pf"
                    ? "bg-white -mr-3 text-black"
                    : "text-white hover:bg-thirtiaryD"
                }`}>
                <FiShoppingCart className="inline-block mr-2" />
                {isOpen && (
                  <span className="ml-2 font-medium">Purchase Form</span>
                )}
              </div>
              {/* Purchase History */}
              <div
                onClick={handlePurchaseHistoryClick}
                className={`flex items-center px-2 py-2  rounded-md  ${
                  selected === "ph"
                    ? "bg-white -mr-3 text-black"
                    : "text-white hover:bg-thirtiaryD"
                }`}>
                <FiClock className="inline-block mr-2" />
                {isOpen && (
                  <span className="ml-2 font-medium">Purchase History</span>
                )}
              </div>

              {/* Stock Management */}
              <div
                onClick={handleStockManagementClick}
                className={`flex items-center px-2 py-2  rounded-md  ${
                  selected === "sm"
                    ? "bg-white -mr-3 text-black"
                    : "text-white hover:bg-thirtiaryD"
                }`}>
                <FiSettings className="inline-block mr-2" />
                {isOpen && (
                  <span className="ml-2 font-medium">Stock Management</span>
                )}
              </div>
              {/* Stock Alert */}
              <div
                onClick={handleStockAlertClick}
                className={`flex items-center px-2 py-2  rounded-md  ${
                  selected === "sa"
                    ? "bg-white -mr-3 text-black"
                    : "text-white hover:bg-thirtiaryD"
                }`}>
                <FiAlertCircle className="inline-block mr-2" />
                {isOpen && (
                  <span className="ml-2 font-medium">Stock Alert</span>
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

export default Sidebar;
