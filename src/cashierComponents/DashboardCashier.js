// import React, { useEffect, useState } from "react";
// import { Switch } from "@material-ui/core";
// import { Link } from "react-router-dom";
// import { tab } from "@testing-library/user-event/dist/tab";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

// const TableModal = ({
//   table,
//   itemData,
//   orderLength,
//   onSave,
//   onClose,
//   setOrderLength,
// }) => {
//   const [orders, setOrders] = useState(table.orders);

//   const handleItemChange = (orderId, itemIndex, selectedItemId) => {
//     setOrders((prevOrders) => {
//       const updatedOrders = prevOrders.map((order) => {
//         if (order.orderId === orderId) {
//           const updatedItems = [...order.items];
//           updatedItems[itemIndex] = {
//             ...itemData.find((item) => item.id === selectedItemId),
//           };
//           return { ...order, items: updatedItems };
//         }
//         return order;
//       });
//       return updatedOrders;
//     });
//   };

//   const handleAddItem = (orderId) => {
//     setOrders((prevOrders) => {
//       const updatedOrders = prevOrders.map((order) => {
//         if (order.orderId === orderId) {
//           const updatedItems = [
//             ...order.items,
//             itemData[0] || { id: null, name: "", type: "" },
//           ];
//           return { ...order, items: updatedItems };
//         }
//         return order;
//       });
//       return updatedOrders;
//     });
//   };

//   const handleRemoveItem = (orderId, itemIndex) => {
//     setOrders((prevOrders) => {
//       const updatedOrders = prevOrders.map((order) => {
//         if (order.orderId === orderId) {
//           const updatedItems = [...order.items];
//           updatedItems.splice(itemIndex, 1);
//           return { ...order, items: updatedItems };
//         }
//         return order;
//       });
//       return updatedOrders;
//     });
//   };
//   const getCurrentTime = () => {
//     const currentTime = new Date();
//     return currentTime.toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//       hour12: false,
//     });
//   };
//   const handleAddOrder = (tableId) => {
//     const newOrder = {
//       orderId: orderLength + 1,
//       items: [],
//       time: getCurrentTime(),
//       status: "created",
//       tableNumber: tableId,
//     };
//     setOrders((prevOrders) => [...prevOrders, newOrder]);
//     setOrderLength(orderLength + 1);
//   };

//   const handleSaveTable = () => {
//     onSave(table.id, orders);
//     onClose();
//   };
//   const handleQuantityChange = (orderId, itemIndex, quantity) => {
//     setOrders((prevOrders) => {
//       const updatedOrders = prevOrders.map((order) => {
//         if (order.orderId === orderId) {
//           const updatedItems = [...order.items];
//           updatedItems[itemIndex] = {
//             ...updatedItems[itemIndex],
//             quantity: quantity,
//           };
//           return { ...order, items: updatedItems };
//         }
//         return order;
//       });
//       return updatedOrders;
//     });
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-10  ">
//       <div className="bg-white rounded shadow-lg p-6 lg:max-w-5xl md:max-w-md sm:max-w-sm max-h-50rem overflow-y-auto  ">
//         <div className="flex justify-between">
//           <h2 className="text-lg font-bold mb-4">{table.name}</h2>
//           <div>
//             <button
//               className="bg-thirtiary border-b-2 border-r-2 border-thirtiaryD hover:bg-transparent hover:text-black text-white px-2 py-1 rounded"
//               onClick={() => handleAddOrder(table.id)}>
//               Add Order
//             </button>
//           </div>
//         </div>

//         <div className="flex flex-wrap  ">
//           {/* ...orders */}
//           {orders.map((order) => (
//             <div
//               key={order.orderId}
//               className="border border-gray-300 rounded p-4 mr-4 mb-4">
//               <Link to={`/orders/${order.orderId}`}>
//                 <h3 className="font-bold mb-2 text-thirtiary underline">
//                   Order {order.orderId}
//                 </h3>
//               </Link>

//               {order.items.length === 0 ? (
//                 <p>No items selected.</p>
//               ) : (
//                 <ul className="mb-4">
//                   {order.items.map((item, itemIndex) => (
//                     <li key={itemIndex} className="flex items-center mb-2">
//                       <select
//                         value={item.id}
//                         className="p-2 border border-gray-300 rounded mr-2"
//                         onChange={(e) =>
//                           handleItemChange(
//                             order.orderId,
//                             itemIndex,
//                             parseInt(e.target.value)
//                           )
//                         }>
//                         {itemData.map((itemOption) => (
//                           <option key={itemOption.id} value={itemOption.id}>
//                             {itemOption.name}
//                           </option>
//                         ))}
//                       </select>
//                       <input
//                         type="number"
//                         value={item.quantity}
//                         className="p-2 w-20 border border-gray-300 rounded mr-2"
//                         placeholder="Quantity"
//                         onChange={(e) =>
//                           handleQuantityChange(
//                             order.orderId,
//                             itemIndex,
//                             parseInt(e.target.value)
//                           )
//                         }
//                       />

//                       <button
//                         className="text-red-500 hover:text-red-700"
//                         onClick={() =>
//                           handleRemoveItem(order.orderId, itemIndex)
//                         }>
//                         Remove
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//               <button
//                 className="bg-gray-100 border-t-2 border-l-2 border-r-2 border-b-2  hover:bg-thirtiaryD text-black hover:text-white px-2 py-1 rounded"
//                 onClick={() => handleAddItem(order.orderId)}>
//                 Add Item
//               </button>
//             </div>
//           ))}
//         </div>

//         <div className="flex justify-end">
//           <button
//             className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mr-2"
//             onClick={handleSaveTable}>
//             Save Table
//           </button>
//           <button
//             className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
//             onClick={onClose}>
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const DashboardCashier = () => {
//   const [ordersData, setOrdersData] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedTable, setSelectedTable] = useState(null);
//   const [tableData, setTableData] = useState([
//     {
//       id: 1,
//       name: "Table 1",
//       status: "vacant",
//       orders: [],
//     },
//     {
//       id: 2,
//       name: "Table 2",
//       status: "vacant",
//       orders: [],
//     },
//     {
//       id: 3,
//       name: "Table 3",
//       status: "vacant",
//       orders: [],
//     },
//     {
//       id: 4,
//       name: "Table 4",
//       status: "vacant",
//       orders: [],
//     },
//     {
//       id: 5,
//       name: "Table 5",
//       status: "vacant",
//       orders: [],
//     },
//     {
//       id: 6,
//       name: "Table 6",
//       status: "vacant",
//       orders: [],
//     },
//     {
//       id: 7,
//       name: "Table 7",
//       status: "vacant",
//       orders: [],
//     },
//     {
//       id: 8,
//       name: "Table 8",
//       status: "vacant",
//       orders: [],
//     },
//   ]);

//   useEffect(() => {
//     console.log("tabledata", tableData);
//   }, [tableData]);

//   const handleAddTable = () => {
//     const newTable = {
//       id: tableData.length + 1,
//       name: `Table ${tableData.length + 1}`,
//       status: "vacant",
//       orders: [],
//     };

//     setTableData((prevTableData) => [...prevTableData, newTable]);
//   };
//   const [itemData, setItemData] = useState([]);
//   const [orderLength, setOrderLength] = useState([]);
//   const fetchOrders = async () => {
//     try {
//       const response = await fetch("http://127.0.0.1:8000/api/orders/");
//       const data = await response.json();

//       const ordersLength = data.length;
//       //TODO
//       //filter data by status to exclude paid ,or by time
//       const filteredOrders = data.filter((order) => order.status !== "paid");

//       if (ordersLength > 0) {
//         setTableData((prevTableData) =>
//           prevTableData.map((table) => {
//             const matchingOrders = filteredOrders.filter(
//               (order) => order.tableNumber === table.id
//             );
//             if (matchingOrders.length > 0) {
//               return { ...table, orders: matchingOrders, status: "occupied" };
//             }
//             return { ...table, orders: [], status: "vacant" };
//           })
//         );
//       } else {
//         setTableData((prevTableData) =>
//           prevTableData.map((table) => ({
//             ...table,
//             orders: [],
//             status: "vacant",
//           }))
//         );
//       }

//       setOrderLength(ordersLength);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   useEffect(() => {
//     const fetchDishes = async () => {
//       try {
//         const response = await fetch(
//           "http://127.0.0.1:8000/api/daily-menulist/"
//         );
//         const data = await response.json();
//         console.log("di", data);
//         const dailyMenus = data;
//         const currentDate = new Date().toISOString().split("T")[0];
//         console.log(currentDate);
//         // const currentDate = "2023-11-16";
//         const filteredMenus = dailyMenus.filter(
//           (menu) => menu.date === currentDate
//         );
//         const extractedDishes = filteredMenus.flatMap((menu) => menu.dishes);
//         console.log(extractedDishes);
//         setItemData(extractedDishes);
//       } catch (error) {
//         console.error("Error fetching dishes:", error);
//       }
//     };

//     fetchDishes();
//   }, []);

//   const handleSaveOrder = async (tableId, orders) => {
//     try {
//       for (const order of orders) {
//         const response = await fetch("http://127.0.0.1:8000/api/orders/", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             orderId: order.orderId,
//             items: order.items,
//             tableNumber: order.tableNumber,
//             status: "created",
//             time: order.time,
//           }),
//         });

//         // Check if the request was successful
//         if (!response.ok) {
//           throw new Error(`Failed to save the order with id ${order.orderId}`);
//         }

//         // Process the response if needed
//         const data = await response.json();
//         console.log(`Order with id ${order.orderId} saved successfully:`, data);
//       }
//     } catch (error) {
//       console.error("Error saving the orders:", error);
//     }

//     console.log("check", orders);
//     setTableData((prevTableData) => {
//       const updatedTableData = prevTableData.map((table) => {
//         if (table.id === tableId) {
//           return { ...table, orders: orders, status: "occupied" };
//         }
//         return table;
//       });
//       return updatedTableData;
//     });
//   };

//   const handleOpenModal = (tableId) => {
//     setSelectedTable(tableId);
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     fetchOrders();
//     let x = 0;
//     tableData.map((td) => {
//       x += td.orders.length;
//     });
//     setOrderLength(orderLength + x);

//     setSelectedTable(null);
//     setShowModal(false);
//   };

//   const handleToggleTableStatus = (tableId) => {
//     setTableData((prevTableData) => {
//       const updatedTableData = prevTableData.map((table) => {
//         if (table.id === tableId) {
//           const newStatus = table.status === "occupied" ? "vacant" : "occupied";
//           return { ...table, status: newStatus, orders: [] };
//         }
//         return table;
//       });
//       return updatedTableData;
//     });
//   };
//   // const itemData = [
//   //   { id: 1, name: "Item 1", type: "Type A" },
//   //   { id: 2, name: "Item 2", type: "Type B" },
//   //   { id: 3, name: "Item 3", type: "Type C" },
//   //   // Add more items as needed
//   // ];

//   const ordereditem = itemData.map((item) => ({
//     id: item.id,
//     name: item.name,
//     quantity: "",
//     price: item.price,
//   }));

//   const occupiedTables = tableData.filter(
//     (table) => table.status === "occupied"
//   );
//   const vacantTables = tableData.filter((table) => table.status === "vacant");
//   const occupancyPercentage = (occupiedTables.length / tableData.length) * 100;
//   // useEffect(() => {
//   //   console.log("here", orderLength, ordereditem, tableData);
//   // }, [orderLength, ordereditem, tableData]);
//   return (
//     <div className="w-full flex flex-col md:p-20 lg:p-10 sm:pl-20">
//       <div className="flex items-center justify-between p-4 mb-4 bg-gradient-to-br from-thirtiary to-green-100 text-white rounded-lg shadow-lg">
//         <div className="lg:flex md:flex lg:items-center md:items-center sm:flex-row">
//           <span className="mr-4 font-bold">Occupied Tables:</span>
//           <span className="mr-4">{occupiedTables.length}</span>
//           <span className="mr-4 font-bold">Vacant Tables:</span>
//           <span className="mr-4">{vacantTables.length}</span>
//           <span className="font-bold">Occupancy:</span>
//           <span>{occupancyPercentage.toFixed(2)}%</span>
//         </div>
//         <button
//           onClick={handleAddTable}
//           className="bg-thirtiaryD hover:bg-thirtiary text-white font-bold rounded-full px-6 py-3 transition duration-300">
//           Add Table
//         </button>
//       </div>
//       <div className="flex flex-wrap">
//         {tableData.map((table) => (
//           <div
//             key={table.id}
//             className="p-2 shadow-md bg-gray-200  rounded-xl m-4 h-36 w-1/6   ">
//             {table.status === "occupied" && (
//               <div className=" items-center justify-between p-4 ">
//                 <button
//                   className="text-blue-500 underline"
//                   onClick={() => handleOpenModal(table.id)}>
//                   {table.name}
//                 </button>
//                 <div>
//                   <span className="ml-2 text-gray-500">
//                     {table.status} ({table.orders.length} orders)
//                   </span>
//                   <Switch
//                     checked
//                     onClick={() => handleToggleTableStatus(table.id)}
//                   />
//                 </div>
//               </div>
//             )}
//             {table.status === "vacant" && (
//               <div className="flex items-center justify-between">
//                 <div>
//                   <span>{table.name}</span>
//                 </div>
//                 <div>
//                   <span className="ml-2 text-gray-500">{table.status}</span>
//                   <Switch onClick={() => handleToggleTableStatus(table.id)} />
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//       {showModal && selectedTable && (
//         <TableModal
//           table={tableData.find((table) => table.id === selectedTable)}
//           itemData={ordereditem}
//           orderLength={orderLength}
//           onSave={handleSaveOrder}
//           onClose={handleCloseModal}
//           setOrderLength={setOrderLength}
//         />
//       )}
//     </div>
//   );
// };

// export default DashboardCashier;

import React, { useEffect, useState } from "react";
import { FaSearch, FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import OrderManagement from "./OrderRequest";
import axios from "axios";

const DashboardCashier = () => {
  // Placeholder data
  const menuCategories = [
    "All Menus",
    "appetizer",
    "main_course",
    "dessert",
    "beverage",
    "special",
  ];
  const [customer, setCustomer] = useState("");
  const [cashier, setCashier] = useState("");

  const [menuItems, setMenuItems] = useState([]);

  const fetchDishes = async () => {
    try {
      const response = await axios.get(
        "https://hmsbackend-gamma.vercel.app/api/dishes/"
      );
      setMenuItems(response.data);
      const updatedData = response.data.map((res) => {
        res.price = Number(res.price);
        return res;
      });
      console.log(updatedData); // Optional: Output the updated data to the console
    } catch (error) {
      console.error("Error fetching dishes:", error);
    }
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  const [orders, setOrders] = useState([]);
  const [billing, setBilling] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(menuCategories[0]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [tableNumber, setTableNumber] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [socket, setSocket] = useState(null);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleAddToOrder = (item) => {
    setBilling(false);
    const newItem = { ...item, quantity: 1 }; // Set default quantity to 1
    setSelectedItems([...selectedItems, newItem]);
    setSubtotal(subtotal + newItem.price);
    setTax(0.1 * (subtotal + newItem.price));
    setTotal(0.1 * (subtotal + newItem.price) + (subtotal + newItem.price));
  };

  const handlePlaceOrder = async () => {
    if (!tableNumber) {
      window.alert("Table number is required.");
      return;
    }

    // Check if items are selected
    if (selectedItems.length === 0) {
      window.alert("At least one item must be selected.");
      return;
    }

    // Check if subtotal, tax, and total are valid
    if (subtotal <= 0 || tax < 0 || total <= 0) {
      window.alert("Invalid values for subtotal, tax, or total.");
      return;
    }

    const newOrder = {
      orderId: orderLength + 1,
      tableNumber,
      items: selectedItems,
      subtotal,
      tax,
      total,
      status: "pending",
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/orders/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOrder),
      });

      // Check if the request was successful
      if (!response.ok) {
        throw new Error(
          `Failed to save the order with id ${newOrder.orderId}: ${response.status} ${response.statusText}`
        );
      }

      // Process the response if needed
      const data = await response.json();
      socket.send(
        JSON.stringify({
          type: "new_order_notification", // Specify the event type
          order_id: data.orderId, // Provide the order ID
        })
      );
      console.log(
        `Order with id ${newOrder.orderId} saved successfully:`,
        data
      );
    } catch (error) {
      console.error("Error saving the order:", error);
    }

    setOrderLength(orderLength + 1);
    // Perform actions when placing the order, e.g., send data to the server
    console.log("Order placed:", {
      newOrder,
    });

    setSelectedItems([]);
    setSubtotal(0);
    setTax(0);
    setTotal(0);
    setTableNumber("");
  };
  const [selectedComponent, setSelectedComponent] = useState("menus");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRemoveFromOrder = (itemId) => {
    const updatedItems = selectedItems.filter((item) => item.id !== itemId);
    setSelectedItems(updatedItems);
    setSubtotal(
      subtotal - selectedItems.find((item) => item.id === itemId).price
    );
    setTax(
      0.1 * (subtotal - selectedItems.find((item) => item.id === itemId).price)
    );
    setTotal(
      0.1 *
        (subtotal - selectedItems.find((item) => item.id === itemId).price) +
        (subtotal - selectedItems.find((item) => item.id === itemId).price)
    );
  };

  const handleQuantityChange = (itemId, change) => {
    const updatedItems = selectedItems.map((item) =>
      item.id === itemId
        ? { ...item, quantity: Math.max(item.quantity + change, 1) }
        : item
    );
    setSelectedItems(updatedItems);
    setSubtotal(calculateSubtotal(updatedItems));
    setTax(0.1 * calculateSubtotal(updatedItems));
    setTotal(
      0.1 * calculateSubtotal(updatedItems) + calculateSubtotal(updatedItems)
    );
  };

  const calculateSubtotal = (items) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };
  const foodKeywords = [
    "Spaghetti Bolognese",
    "Chicken Stir-Fry",
    "pasta",
    "Salad",
    "Pizza",
  ];
  const [orderLength, setOrderLength] = useState(0);

  const handleGenerateRecipt = async () => {
    const newOrder = {
      orderId: orderLength,
      tableNumber,
      items: selectedItems,
      subtotal,
      tax,
      total,
      status: "paid",
    };

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/orders/${newOrder.orderId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newOrder),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSelectedItems([]);
        setSubtotal(0);
        setTax(0);
        setTotal(0);
        setTableNumber("");
        setBilling(false);
        // const updatedOrders = orders.map((order) =>
        //   order.orderId === data.orderId
        //     ? { ...order, status: data.status }
        //     : order
        // );
        // selectedOrder.status = data.status;
        // handleOrderSelection(selectedOrder);

        // setOrders(updatedOrders);
      } else {
        throw new Error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      // Handle the error case
      return;
    }
  };
  const handleCancel = () => {
    setSelectedItems([]);
    setSubtotal(0);
    setTax(0);
    setTotal(0);
    setTableNumber("");
    setBilling(false);
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/orders/");
      const data = await response.json();

      const ordersLength = data.length;
      setOrderLength(ordersLength);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);

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
        // const newStatus = message.status;
        // setOrders((prevOrders) => {
        //   // Check if an order with the same orderId exists
        //   const existingOrderIndex = prevOrders.findIndex(
        //     (order) => order.orderId === message.order_id
        //   );
        //   if (existingOrderIndex !== -1) {
        //     // Replace the existing order
        //     const updatedOrders = [...prevOrders];
        //     updatedOrders[existingOrderIndex].status = newStatus;
        //     return updatedOrders;
        //   } else {
        //     // Order with the given orderId does not exist, return the existing orders
        //     return prevOrders;
        //   }
        // });
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

  const getRandomFoodImage = (name) => {
    const searchTerm = name.toLowerCase().startsWith("chicken")
      ? `food, roasted, delicious, ${name.toLowerCase()}`
      : `delicious, ${name.toLowerCase()}`;
    const encodedSearch = encodeURIComponent(searchTerm);
    return `https://source.unsplash.com/200x200/?${encodedSearch}`;
  };

  return (
    <div className="flex container mx-auto p-4 bg-gray-100 ml-10 ">
      <div className="w-2/3 ">
        <nav className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedComponent("menus")}
              className={`text-black hover:text-thirtiary ${
                selectedComponent === "menus"
                  ? "border-b-2 border-thirtiary"
                  : "border-b-2 border-transparent"
              } transition duration-300 focus:outline-none focus:border-thirtiary`}
              autoFocus>
              Menus
            </button>
            <button
              onClick={() => setSelectedComponent("orders")}
              className={`text-black hover:text-thirtiary ${
                selectedComponent === "orders"
                  ? "border-b-2 border-thirtiary"
                  : "border-b-2 border-transparent"
              } transition duration-300 focus:outline-none focus:border-thirtiary`}>
              Orders
            </button>
          </div>
        </nav>
        {/* make  it so that if orders button above is selected a component called <OrderRequest> is loaded */}
        {selectedComponent === "orders" ? (
          <OrderManagement
            setTotal={setTotal}
            setTax={setTax}
            setSubtotal={setSubtotal}
            setSelectedItems={setSelectedItems}
            setTableNumber={setTableNumber}
            setBilling={setBilling}
            setOrderlength={setOrderLength}
            billing={billing}
          />
        ) : (
          <div className="flex flex-col space-y-4">
            <div className="flex  flex-wrap items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-64 pl-8 pr-2 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
                <FaSearch className="absolute left-2 top-2 text-gray-500" />
              </div>
              <div className="flex flex-wrap  gap-4">
                {menuCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-4 py-2  rounded ${
                      category === selectedCategory
                        ? "bg-thirtiaryD text-white"
                        : "bg-gray-300"
                    }`}>
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto max-h-45rem ">
              {menuItems !== undefined &&
                menuItems !== null &&
                menuItems
                  .filter(
                    (item) =>
                      selectedCategory === "All Menus" ||
                      item.category === selectedCategory
                  )
                  .filter((item) =>
                    item.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((item) => (
                    <div
                      key={item.id}
                      className="p-4 border rounded-2xl bg-white hover:shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-thirtiary">
                      {/* Row 1: Image */}
                      <div className="mb-4 ">
                        <img
                          src={getRandomFoodImage(item.name)}
                          alt={item.name}
                          className="w-full h-32 object-cover rounded"
                        />
                      </div>
                      {/* Row 2: Item Name and Price */}
                      <div className="mb-2">
                        <h3 className="text-lg font-bold">{item.name}</h3>
                        <p className="text-gray-600">Price: ${item.price}</p>
                      </div>
                      {/* Row 3: "Add to Order" Button */}
                      <button
                        onClick={() => handleAddToOrder(item)}
                        className="w-2/3 ml-6 shadow-md  px-4 py-1 bg-thirtiary text-white rounded-3xl hover:bg-green-500 focus:outline-none focus:ring focus:border-blue-300 transition duration-300 ease-in-out">
                        Add to Order
                      </button>
                    </div>
                  ))}
            </div>
          </div>
        )}
      </div>
      <div className="w-1/3 p-4 bg-gray-200">
        <div className="flex flex-col space-y-4">
          <div
            className={`${billing ? "shadow-2xl" : ""} bg-white p-4 rounded`}>
            {billing && (
              <div className="flex justify-end">
                <div>Date: {new Date().toLocaleDateString()}</div>
              </div>
            )}
            {billing ? (
              <div className="flex justify-center">
                <div className="text-xl font-serif mt-10 mb-4">
                  Cash Invoice
                </div>
              </div>
            ) : (
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            )}

            {billing && (
              <div>
                <div className="flex items-center justify-between">
                  <label className="block mb-2 mr-3">Customer:</label>
                  <input
                    type="text"
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    className="w-80 border p-2 mb-4"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="block mb-2 mr-3">Cashier:</label>
                  <input
                    type="text"
                    value={cashier}
                    onChange={(e) => setCashier(e.target.value)}
                    className="w-80 border p-2 mb-4"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="block mb-2 mr-3">Table number:</label>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-80 border p-2 mb-4"
                  />
                </div>
              </div>
            )}

            {billing && (
              <div>
                <div className="flex justify-between border-b">
                  <div className="text-xl font-serif mt-10 mb-4">
                    Description
                  </div>
                  <div className="text-xl font-serif mt-10 mb-4">Quantity</div>
                  <div className="text-xl font-serif mt-10 mb-4">Price</div>
                </div>
                <div>
                  {selectedItems.map((item) => (
                    <div
                      key={item.id}
                      className=" py-2 flex items-center justify-between">
                      <div className="text-lg  font-thin font-sans mb-2">
                        {item.name}
                      </div>
                      <div className="text-lg font-light mb-2">
                        {item.quantity}
                      </div>
                      <div className="text-lg font-light mb-2">
                        {item.price}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mb-4 mt-4">
                  <div className="flex justify-between">
                    <div className="text-xl  font-thin font-serif mb-2">
                      Subtotal:
                    </div>
                    <span className="mx-1">
                      ....................................................................
                    </span>
                    <div>${Number(subtotal).toFixed(2)}</div>
                  </div>

                  <div className="flex justify-between">
                    <div className="text-xl  font-thin font-serif mb-2">
                      Tax:
                    </div>
                    <span className="mx-1">
                      ....................................................................
                    </span>
                    <div>${Number(tax).toFixed(2)}</div>
                  </div>

                  <div className="flex justify-between">
                    <div className="text-xl  font-thin font-serif mb-2">
                      Total:
                    </div>
                    <span className="mx-1">
                      ....................................................................
                    </span>
                    <div>${Number(total).toFixed(2)}</div>
                  </div>
                </div>
              </div>
            )}

            {!billing &&
              selectedItems.map((item) => (
                <div
                  key={item.id}
                  className="border-b py-2 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{item.name}</h3>
                    <p>
                      Price: ${item.price} | Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaTrash
                      className="text-red-500 cursor-pointer"
                      onClick={() => handleRemoveFromOrder(item.id)}
                    />
                    <FaPlus
                      className="text-green-500 cursor-pointer"
                      onClick={() => handleQuantityChange(item.id, 1)}
                    />
                    <FaMinus
                      className="text-yellow-500 cursor-pointer"
                      onClick={() => handleQuantityChange(item.id, -1)}
                    />
                  </div>
                </div>
              ))}
          </div>

          <div className="bg-white p-4 rounded">
            {!billing && (
              <div>
                <label className="block mb-2">Table Number:</label>
                <input
                  type="number"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full border p-2 mb-4"
                />
              </div>
            )}
            {!billing && (
              <div>
                <p>Subtotal: ${Number(subtotal).toFixed(2)}</p>
                <p>Tax: ${Number(tax).toFixed(2)}</p>
                <p>Total: ${Number(total).toFixed(2)}</p>
              </div>
            )}
            <div className="flex justify-between">
              <div>
                {billing ? (
                  <button
                    onClick={handleGenerateRecipt}
                    className="mt-4 px-4 py-2 bg-green-800 text-white rounded hover:bg-green-900 focus:outline-none focus:ring focus:border-blue-300 transition duration-300 ease-in-out">
                    Print Receipt
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    className="mt-4 px-4 py-2 bg-green-800 text-white rounded hover:bg-green-900 focus:outline-none focus:ring focus:border-blue-300 transition duration-300 ease-in-out">
                    Place Order
                  </button>
                )}
              </div>
              <div>
                <button
                  onClick={handleCancel}
                  className="mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded focus:outline-none hover:bg-gray-400 hover:text-gray-800 transition duration-300 ease-in-out">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCashier;
