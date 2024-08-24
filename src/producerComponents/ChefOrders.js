import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { useParams } from "react-router-dom";

const ChefOrders = () => {
  const { orderId } = useParams();
  const [socket, setSocket] = useState(null);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/orders/");
      const data = await response.json();

      // Filter orders with "pending" or "ready" status
      const filteredOrders = data.filter(
        (order) => order.status === "pending" || order.status === "ready"
      );

      setOrders(filteredOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  const sendOrderReadyStatus = (orderId) => {
    const updatedOrders = orders.map((order) =>
      order.orderId === orderId ? { ...order, status: "ready" } : order
    );
    setOrders(updatedOrders);

    if (socket) {
      const message = {
        type: "order_update",
        order_id: orderId,
        status: "ready",
      };

      socket.send(JSON.stringify(message));
    }
  };

  const connectWebSocket = () => {
    const socket = new WebSocket("ws://localhost:8000/ws/order_exchange/");

    socket.addEventListener("open", () => {
      console.log("WebSocket cheff connection established");

      const joinGroupMessage = {
        type: "join_group",
        group_name: "order_updates",
      };
      socket.send(JSON.stringify(joinGroupMessage));

      setSocket(socket);
    });

    socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      console.log("Received message:", message);

      if (message.order) {
        const newOrder = message.order;
        setOrders((prevOrders) => {
          // Check if an order with the same orderId exists
          const existingOrderIndex = prevOrders.findIndex(
            (order) => order.orderId === newOrder.orderId
          );

          if (existingOrderIndex !== -1) {
            // Replace the existing order
            const updatedOrders = [...prevOrders];
            updatedOrders[existingOrderIndex] = newOrder;
            return updatedOrders;
          } else {
            // Add the new order to the existing orders
            return [...prevOrders, newOrder];
          }
        });
      }
    });
    socket.addEventListener("close", () => {
      console.log("WebSocket connection closed");
      connectWebSocket();
    });
  };

  useEffect(() => {
    connectWebSocket();
  }, []);

  return (
    <div className="container mx-auto p-4 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Chef Orders</h2>
      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Order ID</th>
            <th className="py-2 px-4 border-b">Time</th>
            <th className="py-2 px-4 border-b">Table Number</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Items Ordered</th>
            <th className="py-2 px-4 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.orderId}
              className={
                order.orderId.toString() === orderId ? "bg-gray-200" : ""
              }>
              <td className="py-2 px-4 border-b">{order.orderId}</td>
              <td className="py-2 px-4 border-b">{order.time}</td>
              <td className="py-2 px-4 border-b">{order.tableNumber}</td>
              <td
                className={`${
                  order.status === "pending" ? "text-red-300" : ""
                } py-2 px-4 border-b`}>
                {order.status}
              </td>
              <td className="py-2 px-4 border-b">
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.name} - {item.quantity}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="py-2 px-4 border-b">
                {order.status === "pending" ? (
                  <button
                    className="bg-thirtiaryD hover:bg-thirtiary text-white font-bold py-1 px-2 rounded"
                    onClick={() => sendOrderReadyStatus(order.orderId)}>
                    Order Ready
                  </button>
                ) : (
                  <div className="flex flex-col justify-items-center">
                    <span>
                      {" "}
                      <FaBell />
                    </span>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChefOrders;
