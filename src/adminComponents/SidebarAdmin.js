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
import { FaChartLine, FaShoppingCart } from "react-icons/fa";

const SidebarAdmin = () => {
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

  const handleReportingDashboardClick = () => {
    navigate("/reporting-dashboard");
    closeMenuOnSelect();
  };

  const handlePurchaseReportClick = () => {
    navigate("/purchase-report");
    closeMenuOnSelect();
  };

  const handleReportClick = () => {
    navigate("/report");
    closeMenuOnSelect();
  };

  const handleStockAlertClick = () => {
    navigate("/stock-alert");
    closeMenuOnSelect();
  };

  const handleStockManagementClick = () => {
    navigate("/stock-management");
    closeMenuOnSelect();
  };

  const handleGeneralStockManagementClick = () => {
    navigate("/general-stock-management");
    closeMenuOnSelect();
  };

  const handleSoldOrdersReportClick = () => {
    navigate("/sales-report");
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
                onClick={handleReportingDashboardClick}
                className="flex items-center px-2 py-2 text-white rounded-md hover:bg-thirtiaryD">
                <FiBarChart2 className="inline-block mr-2" />
                {isOpen && (
                  <span className="ml-2 font-medium">Reporting Dashboard</span>
                )}
              </div>
              {/* Purchase Form */}
              <div
                onClick={handlePurchaseReportClick}
                className="flex items-center px-2 py-2 text-white rounded-md hover:bg-thirtiaryD">
                <FiShoppingCart className="inline-block mr-2" />
                {isOpen && (
                  <span className="ml-2 font-medium">Purchase Report</span>
                )}
              </div>
              {/* Purchase History */}
              <div
                onClick={handleReportClick}
                className="flex items-center px-2 py-2 text-white rounded-md hover:bg-thirtiaryD">
                <FiClock className="inline-block mr-2" />
                {isOpen && (
                  <span className="ml-2 font-medium">Report Table</span>
                )}
              </div>
              {/* Stock Alert */}
              <div
                onClick={handleStockAlertClick}
                className="flex items-center px-2 py-2 text-white rounded-md hover:bg-thirtiaryD">
                <FiAlertCircle className="inline-block mr-2" />
                {isOpen && (
                  <span className="ml-2 font-medium">Stock Alert</span>
                )}
              </div>
              {/* Stock Management */}
              <div
                onClick={handleStockManagementClick}
                className="flex items-center px-2 py-2 text-white rounded-md hover:bg-thirtiaryD">
                <FiSettings className="inline-block mr-2 text-white" />
                {isOpen && (
                  <span className="ml-2 font-medium">Stock Management</span>
                )}
              </div>
              <div
                onClick={handleSoldOrdersReportClick}
                className="flex items-center px-2 py-2 text-white rounded-md hover:bg-thirtiaryD">
                <FaChartLine className="inline-block mr-2 text-white" />
                {isOpen && (
                  <span className="ml-2 font-medium">Sells Report</span>
                )}
              </div>
              {/* General Stock Management */}
              {/* <div
                onClick={handleGeneralStockManagementClick}
                className="flex items-center px-2 py-2 text-white rounded-md hover:bg-thirtiaryD">
                <FiSettings className="inline-block mr-2 text-white" />
                {isOpen && (
                  <span className="ml-2 font-medium">
                    General Stock Management
                  </span>
                )}
              </div> */}

              <div className="py-6"></div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarAdmin;
