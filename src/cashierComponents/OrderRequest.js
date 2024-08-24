// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom"; // Assuming you're using React Router
// import Payment from "./Payment";
// const OrderRequests = () => {
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const { orderId } = useParams(); // Get the orderId from the URL
//   const [socket, setSocket] = useState(null);
//   const [orders, setOrders] = useState([]);

//   const fetchOrders = async () => {
//     try {
//       const response = await fetch("http://127.0.0.1:8000/api/orders/");
//       const data = await response.json();
//       setOrders(data);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const sendToKitchen = async (order) => {
//     const orderId = order.orderId;
//     const url = `http://127.0.0.1:8000/api/orders/${orderId}/`;
//     const updatedStatus = "pending";

//     try {
//       const response = await fetch(url, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           status: updatedStatus,
//           items: order.items,
//           orderId: order.orderId,
//           tableNumber: order.tableNumber,
//           time: order.time,
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         const updatedOrders = orders.map((order) =>
//           order.orderId === data.orderId
//             ? { ...order, status: data.status }
//             : order
//         );
//         setOrders(updatedOrders);
//         console.log(`Order ${orderId} status changed to ${updatedStatus}`);
//         socket.send(
//           JSON.stringify({
//             type: "new_order_notification", // Specify the event type
//             order_id: data.orderId, // Provide the order ID
//           })
//         );
//       } else {
//         throw new Error("Failed to update order status");
//       }
//     } catch (error) {
//       console.error("Error updating order status:", error);
//       // Handle the error case
//     }
//   };

//   const handleOrderSelection = (order) => {
//     console.log(order);

//     setSelectedOrder(order);
//   };

//   const connectWebSocket = () => {
//     const socket = new WebSocket("ws://localhost:8000/ws/order_exchange/");

//     socket.addEventListener("open", () => {
//       console.log("WebSocket connection established");

//       // Join the specified group when the connection is open
//       const joinGroupMessage = {
//         type: "join_group",
//         group_name: "order_updates",
//       };
//       socket.send(JSON.stringify(joinGroupMessage));

//       setSocket(socket);
//     });
//     socket.addEventListener("message", (event) => {
//       const message = JSON.parse(event.data);
//       console.log("Received message:", message);

//       if (message.order_id) {
//         const newStatus = message.status;
//         setOrders((prevOrders) => {
//           // Check if an order with the same orderId exists
//           const existingOrderIndex = prevOrders.findIndex(
//             (order) => order.orderId === message.order_id
//           );

//           if (existingOrderIndex !== -1) {
//             // Replace the existing order
//             const updatedOrders = [...prevOrders];
//             updatedOrders[existingOrderIndex].status = newStatus;
//             return updatedOrders;
//           } else {
//             // Order with the given orderId does not exist, return the existing orders
//             return prevOrders;
//           }
//         });
//       }
//     });

//     socket.addEventListener("close", () => {
//       console.log("WebSocket connection closed");
//       connectWebSocket();
//     });
//   };

//   useEffect(() => {
//     connectWebSocket();
//   }, []);

//   const formatPurchaseTime = (purchaseTime) => {
//     const date = new Date(purchaseTime);
//     return date.toLocaleString();
//   };
//   return (
//     <div className="container mx-auto p-4 overflow-y-auto">
//       <h2 className="text-2xl font-bold mb-4">Order Requests</h2>
//       <table className="border-collapse w-full">
//         <thead>
//           <tr>
//             <th className="py-2 px-4 border-b">Order ID</th>
//             <th className="py-2 px-4 border-b">Time</th>
//             <th className="py-2 px-4 border-b">Table Number</th>
//             <th className="py-2 px-4 border-b">Status</th>
//             <th className="py-2 px-4 border-b">Items Ordered</th>
//             <th className="py-2 px-4 border-b">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {orders.map((order) => (
//             <tr
//               key={order.orderId}
//               className={
//                 order.orderId.toString() === orderId ? "bg-gray-200" : ""
//               }>
//               <td className="py-2 px-4 border-b">{order.orderId}</td>
//               <td className="py-2 px-4 border-b">
//                 {formatPurchaseTime(order.time)}
//               </td>
//               <td className="py-2 px-4 border-b">{order.tableNumber}</td>
//               <td
//                 className={`${
//                   order.status === "created" ? "text-red-300" : ""
//                 } py-2 px-4 border-b`}>
//                 {order.status}
//               </td>
//               <td className="py-2 px-4 border-b">
//                 <ul>
//                   {order.items.map((item, index) => (
//                     <li key={index}>
//                       {item.name} - {item.quantity}
//                     </li>
//                   ))}
//                 </ul>
//               </td>
//               <td className="py-2 px-4 border-b flex justify-between">
//                 {order.status === "created" ? (
//                   <button
//                     className="bg-thirtiaryD hover:bg-thirtiary text-white font-bold py-1 px-2 rounded"
//                     onClick={() => sendToKitchen(order)}>
//                     Send to Kitchen
//                   </button>
//                 ) : (
//                   order.status === "ready" && (
//                     <button
//                       className="bg-thirtiaryD hover:bg-thirtiary text-white font-bold py-1 px-2 rounded"
//                       onClick={() => handleOrderSelection(order)}>
//                       Bill
//                     </button>
//                   )
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <div className="z-10">
//         {selectedOrder && (
//           <Payment
//             selectedOrder={selectedOrder}
//             handleOrderSelection={handleOrderSelection}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default OrderRequests;

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const OrderManagement = ({
  setTotal,
  setTax,
  setSubtotal,

  setSelectedItems,

  setTableNumber,
  setBilling,
  setOrderlength,
  billing,
}) => {
  const [orders, setOrders] = useState([]);
  const [socket, setSocket] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/orders/");
      const data = await response.json();
      const filteredData = data.filter((order) => order.status !== "paid");

      setOrders(filteredData);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, [billing]);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setSelectedItems(order.items);
    setSubtotal(order.subtotal);
    setTax(order.tax);
    setTotal(order.total);
    setTableNumber(order.tableNumber);
    setBilling(false);
  };

  const handleGenerateBill = (order) => {
    setOrderlength(order.orderId);
    setSelectedItems(order.items);
    setSubtotal(order.subtotal);
    setTax(order.tax);
    setTotal(order.total);
    setTableNumber(order.tableNumber);
    setBilling(true);
    // if (order) {
    //   // Logic to generate the bill for the selected order
    //   console.log("Bill generated for order:", order);

    //   // Prepare receipt content
    //   const itemsList = order.items.map((item, index) => (
    //     <li key={index}>
    //       {item.name} x {item.quantity}
    //     </li>
    //   ));
    //   // Display the receipt using SweetAlert2
    //   Swal.fire({
    //     icon: "success",
    //     title: "Receipt",
    //     html: `
    //       <div>
    //         <h3>Order ID: ${order.id}</h3>
    //         <p>Table Number: ${order.tableNumber}</p>
    //         <ul>${itemsList}</ul>
    //         <p>Total: $${order.total}</p>
    //         <p>Payment Method: ${order.paymentMethod}</p>
    //         <!-- Add more details as needed -->
    //       </div>
    //     `,
    //     showConfirmButton: false,
    //     showCancelButton: true,
    //     cancelButtonText: "Print",
    //     cancelButtonColor: "#4caf50",
    //     customClass: {
    //       popup: "receipt-popup",
    //       content: "receipt-content",
    //       cancelButton: "receipt-print-button",
    //     },
    //   });
    // }
  };

  const connectWebSocket = () => {
    const socket = new WebSocket("ws://localhost:8000/ws/order_exchange/");

    socket.addEventListener("open", () => {
      console.log("WebSocket connection established");

      // Join the specified group when the connection is open
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

      if (message.order_id) {
        const newStatus = message.status;
        setOrders((prevOrders) => {
          // Check if an order with the same orderId exists
          const existingOrderIndex = prevOrders.findIndex(
            (order) => order.orderId === message.order_id
          );
          if (existingOrderIndex !== -1) {
            // Replace the existing order
            const updatedOrders = [...prevOrders];
            updatedOrders[existingOrderIndex].status = newStatus;
            return updatedOrders;
          } else {
            // Order with the given orderId does not exist, return the existing orders
            return prevOrders;
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
    <div className="flex container mx-auto p-4 bg-gray-100">
      <div className="w-full">
        <h2 className="text-2xl font-bold mb-4">Orders</h2>
        {orders.length === 0 ? (
          <p>No orders available.</p>
        ) : (
          <ul className="space-y-4">
            {orders !== undefined &&
              orders !== null &&
              orders.map((order) => (
                <li key={order.id} className="bg-white p-4 rounded">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold">
                        Order ID: {order.id}
                      </h3>
                      <p>Table Number: {order.tableNumber}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {order.status === "ready" ? (
                        <div className="flex">
                          <p className="mr-4 text-green-500 font-semibold">
                            Status: {order.status}
                          </p>
                          <button
                            onClick={() => handleGenerateBill(order)}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring focus:border-blue-300 transition duration-300 ease-in-out">
                            Bill
                          </button>
                        </div>
                      ) : (
                        <div className="flex">
                          <p className="mr-4 text-gray-500 font-semibold">
                            Status: {order.status}
                          </p>
                          <button
                            onClick={() => handleEditOrder(order)}
                            className="px-4 py-2 bg-thirtiary text-white rounded hover:bg-thirtiaryD focus:outline-none focus:ring focus:border-blue-300 transition duration-300 ease-in-out">
                            Edit
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
