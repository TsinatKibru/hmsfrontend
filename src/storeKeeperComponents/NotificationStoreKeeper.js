import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiBell } from "react-icons/fi";
import axios from "axios";
import { addNotification } from "../store";
import {
  removeAllNotifications,
  removeAllPurchaserNotification,
} from "../store";
import { removeNotification } from "../store";
import { FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";

const NotificationStoreKeeper = () => {
  const purchaserNotifications = useSelector(
    (state) => state.purchaserNotifications
  );

  const notifications = useSelector((state) => state.notifications);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  purchaserNotifications.forEach((notification) => {
    Swal.fire({
      title: "Notification",
      text: notification.message,
      icon: "info",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(removeAllPurchaserNotification());
      }
    });
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/notifications/"
        );
        const filteredresponse = response.data.filter(
          (res) =>
            res.seen === false &&
            (res.action === "added" || res.action === "itemtransfer")
        );

        filteredresponse.forEach((notification) => {
          let formattedNotification;
          if (notification.action === "itemtransfer") {
            formattedNotification = `Item Transfer Request for: (${notification.amount}) items`;
          } else {
            formattedNotification = `Item added: ${notification.chanegdEntityName} (Quantity ${notification.amount})`;
          }

          const notificationObj = {
            id: notification.id,
            message: formattedNotification,
          };
          dispatch(addNotification(notificationObj));
        });
      } catch (error) {
        console.log("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

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
  const handleSeenNotifications = (notificationId, note) => {
    const temp = notifications.find((item) => item.id === notificationId);
    const tempNotificationObj = {
      seen: true,
    };
    axios
      .put(
        `http://localhost:8000/api/notifications/${notificationId}/`,
        tempNotificationObj
      )
      .then((response) => {
        // Handle success, you can update the local state or do any other necessary actions
        console.log("Notification marked as seen:", response.data);
      })
      .catch((error) => {
        // Handle error if the request fails
        console.error("Error marking notification as seen:", error);
      });

    dispatch(removeNotification(note.id));
  };

  const handleAllSeenNotifications = () => {
    for (const notification of notifications) {
      const tempNotificationObj = {
        seen: true,
      };
      axios
        .put(
          `http://localhost:8000/api/notifications/${notification.id}/`,
          tempNotificationObj
        )
        .then((response) => {
          // Handle success, you can update the local state or do any other necessary actions
          console.log("Notification marked as seen:", response.data);
        })
        .catch((error) => {
          // Handle error if the request fails
          console.error("Error marking notification as seen:", error);
        });
    }
    dispatch(removeAllNotifications());
  };
  return (
    <div className="fixed right-1 top-5 z-10  rounded-md w-36 md:mr-36 md:w-48">
      <div
        className={`dropdown ${isDropdownOpen ? "open" : ""}`}
        onClick={handleDropdownToggle}
        //ththth
        ref={dropdownRef}>
        <span className="dropdown-toggle cursor-pointer  bg-FCF6F5 text-gray border-none rounded-md px-2 py-1">
          <FiBell className="inline-block mr-1" />{" "}
          <div className=" hidden lg:inline-block">Notifications: </div>
          {notifications.length}
        </span>
        {isDropdownOpen && (
          <div className="overflow-y-auto h-40rem">
            <ul className="dropdown-menu " onClick={handleDropdownMenuClick}>
              {notifications.map((notification, index) => (
                <li
                  key={index}
                  className="bg-gray-200 px-2 py-1 my-7 rounded-md "
                  onClick={handleDropdownItemClick}>
                  <div className="flex  ">
                    {notification.message}
                    <div>
                      {" "}
                      {
                        <FaTimes
                          onClick={() =>
                            handleSeenNotifications(
                              notification.id,
                              notification
                            )
                          }
                          className="text-xs cursor-pointer"
                        />
                      }
                    </div>
                  </div>
                </li>
              ))}
              <h3
                className="bg-gray-200 px-2 py-1 my-7 rounded-md cursor-pointer"
                onClick={handleAllSeenNotifications}>
                collapse all
              </h3>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationStoreKeeper;
