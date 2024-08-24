//src/sockethms/WebSocketComponent.js
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  addNotification,
  removeAllNotifications,
  addPchNotification,
  addPurchaserNotification,
} from "../store";
import axios from "axios";
const WebSocketComponent = () => {
  let socket = null;
  const dispatch = useDispatch();

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        "https://hmsbackend-gamma.vercel.app/api/notifications/"
      );
      const filteredresponse = response.data.filter(
        (res) => res.seen === false
      );
      const formattedNotifications = filteredresponse.map(
        (notification) =>
          `${notification.entity_type_name} ${notification.action} ${notification.amount}`
      );

      dispatch(addPchNotification(formattedNotifications));
      console.log("ff");
    } catch (error) {
      console.log("Error fetching notifications:", error);
    }
  };

  const checkSocketConnection = () => {
    if (socket === null || socket.readyState === WebSocket.CLOSED) {
      socket = new WebSocket(
        "ws://hmsbackend-gamma.vercel.app/ws/notifications/"
      );

      socket.addEventListener("open", () => {
        console.log("WebSocket connection established");
      });

      socket.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);
        console.log("Received item change:", message);

        // console.log("Received:", event);

        if (typeof message === "object" && message.type === "alert") {
          console.log(message);
          dispatch(addPurchaserNotification(message));
        } else if (
          typeof message === "object" &&
          message.type === "item_changed" &&
          message.action === "deducted"
        ) {
          dispatch(addPchNotification(message));
        } else if (
          typeof message === "object" &&
          message.type === "item_changed" &&
          (message.action === "added" || message.action === "itemtransfer")
        ) {
          dispatch(addNotification(message));
        }
      });

      socket.addEventListener("close", () => {
        console.log("WebSocket connection closed");
        // Check the socket connection on closure
        checkSocketConnection();
      });
    }
  };

  useEffect(() => {
    checkSocketConnection();
    // fetchNotifications();
    return () => {
      socket.close();
    };
  }, []);

  return <div></div>;
};

export default WebSocketComponent;
