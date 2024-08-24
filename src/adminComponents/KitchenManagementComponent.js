import React, { useEffect, useState } from "react";
import bellSound from "../assets/Bellaudio.mp3";
const OrderComponent = () => {
  const audio = new Audio(bellSound);
  const [orders, setOrders] = useState([]);
  const [readyOrders, setReadyOrders] = useState([]);
  const [selectedFoodItem, setSelectedFoodItem] = useState("");
  const foodOptions = ["Pizza", "Burger", "Salad", "Pasta"];

  const addOrder = () => {
    const newOrder = {
      id: "",
      time: getCurrentTime(),
      table: "",
      foodItems: [],
    };
    setOrders((prevOrders) => [...prevOrders, newOrder]);
  };
  // useEffect(() => {
  //   addOrder();
  // }, []);

  const addFoodItem = (orderId) => {
    const orderIndex = orders.findIndex((order) => order.id === orderId);
    if (orderIndex !== -1 && selectedFoodItem) {
      const updatedOrders = [...orders];
      updatedOrders[orderIndex].foodItems.push(selectedFoodItem);
      setOrders(updatedOrders);
      setSelectedFoodItem("");
    }
  };

  const markOrderReady = (orderId) => {
    const orderIndex = orders.findIndex((order) => order.id === orderId);
    if (orderIndex !== -1) {
      const order = orders[orderIndex];
      const updatedOrders = [...orders];
      updatedOrders.splice(orderIndex, 1);
      setOrders(updatedOrders);
      setReadyOrders((prevReadyOrders) => [...prevReadyOrders, order]);
    }
    audio.play();
  };

  const updateOrder = (index, field, value) => {
    const updatedOrders = [...orders];
    updatedOrders[index] = {
      ...updatedOrders[index],
      [field]: value,
    };
    setOrders(updatedOrders);
  };
  const getCurrentTime = () => {
    const date = new Date();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleFoodItem = (index, findex, item) => {
    orders[index].foodItem[findex] = item;
  };

  return (
    <div className="flex  p-4 ">
      <div>
        <h2 className="text-2xl font-bold mb-4">Order Table</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="py-2">ID</th>
              <th className="py-2">Time</th>
              <th className="py-2">Table</th>
              <th className="py-2">Food Items</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    value={order.id}
                    onChange={(e) => updateOrder(index, "id", e.target.value)}
                    className="border border-gray-300 rounded-md py-1 px-2"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={order.time}
                    onChange={(e) => updateOrder(index, "time", e.target.value)}
                    className="border border-gray-300 rounded-md py-1 px-2"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={order.table}
                    onChange={(e) =>
                      updateOrder(index, "table", e.target.value)
                    }
                    className="border border-gray-300 rounded-md py-1 px-2"
                  />
                </td>
                <td className="border border-gray-300 rounded-md  px-2 mt-10">
                  <ul>
                    {order.foodItems.map((foodItem, findex) => (
                      <select
                        value={foodItem}
                        onChange={(e) =>
                          handleFoodItem(index, findex, e.target.value)
                        }
                        className="border border-gray-300 rounded-md py-1 px-2 mt-2">
                        <option value="">Select Food Item</option>
                        {foodOptions.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ))}
                  </ul>
                  {order.foodItems.length !== foodOptions.length && (
                    <select
                      value={selectedFoodItem}
                      onChange={(e) => setSelectedFoodItem(e.target.value)}
                      className="border border-gray-300 rounded-md py-1 px-2 mt-2">
                      <option value="">Select Food Item</option>
                      {foodOptions.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                  {order.foodItems.length !== foodOptions.length && (
                    <button
                      onClick={() => addFoodItem(order.id)}
                      className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded-md mt-2">
                      Add
                    </button>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => markOrderReady(order.id)}
                    className="bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded-md">
                    Mark Ready
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="5">
                <button
                  onClick={addOrder}
                  className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded-md">
                  Add Row
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        {readyOrders.length > 0 && (
          <div className="mt-4">
            <h2 className="text-2xl font-bold mb-4">Ready Orders</h2>
            <ul>
              {readyOrders.map((order, index) => (
                <li key={index}>{order.id}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderComponent;
