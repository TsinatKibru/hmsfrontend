import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiBell } from "react-icons/fi";

const Notification = () => {
  const notifications = useSelector((state) => state.notifications);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  if (!notifications || notifications.length === 0) {
    return null; // Return null when there are no notifications
  }

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownItemClick = () => {
    setIsDropdownOpen(false);
  };

  const handleDropdownMenuClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed right-1 top-5 z-10 overflow-y-visible rounded-md w-36 md:mr-36 md:w-48">
      <div
        className={`dropdown ${isDropdownOpen ? "open" : ""}`}
        onClick={handleDropdownToggle}
        ref={dropdownRef}>
        <span className="dropdown-toggle cursor-pointer  bg-FCF6F5 text-gray border-none rounded-md px-2 py-1">
          <FiBell className="inline-block mr-1" />{" "}
          <div className=" hidden lg:inline-block">Notifications: </div>
          {notifications.length}
        </span>
        {isDropdownOpen && (
          <ul className="dropdown-menu" onClick={handleDropdownMenuClick}>
            {notifications.map((notification, index) => (
              <li
                key={index}
                className="bg-gray-200 px-2 py-1 my-7 rounded-md"
                onClick={handleDropdownItemClick}>
                {notification}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notification;
