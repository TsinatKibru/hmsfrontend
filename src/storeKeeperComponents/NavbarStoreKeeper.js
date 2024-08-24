import React, { useEffect } from "react";
import { FiUser, FiLogOut } from "react-icons/fi";
import logo from "../images/logo.jfif";
import { useSelector } from "react-redux";
import NotificationStoreKeeper from "./NotificationStoreKeeper";
import { logout } from "../store";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addNotification } from "../store";

const NavbarStoreKeeper = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    navigate("/");
    localStorage.removeItem("token");
    dispatch(logout());
  };

  return (
    <nav className="bg-FCF6F5 border-thirtary border-b-0.5 p-4 sticky flex overflow-y-hidden top-0 items-center justify-between">
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="w-8 h-8 mr-2 border-white" />
        <h1 className="text-gray text-2xl font-bold">HMSp</h1>
      </div>
      <div className="flex items-center">
        <NotificationStoreKeeper />{" "}
        {/* Render the NotificationPurchaser component here */}
        <div className="mr-4">
          <button
            className="text-gray flex items-center"
            onClick={handleLogout}>
            <FiLogOut className="mr-2" />
            <h3 className="hidden lg:block ">Logout</h3>
          </button>
        </div>
        <div>
          <button className="text-gray flex items-center">
            <FiUser className="mr-2" />
            <h3 className="hidden lg:block">Profile</h3>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavbarStoreKeeper;
