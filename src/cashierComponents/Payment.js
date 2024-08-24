import React, { useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
const dummyOrderData = {
  id: 1,
  tableNumber: 5,
  timestamp: "2023-10-28 15:30:00",
  items: [
    { id: 1, name: "Burger", price: 10, quantity: 2 },
    { id: 2, name: "Fries", price: 5, quantity: 1 },
    { id: 3, name: "Drink", price: 2, quantity: 3 },
  ],
};

const Payment = ({ selectedOrder, handleOrderSelection }) => {
  const componentRef = React.useRef();
  const [tipAmount, setTipAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [orderData, setOrderData] = useState(null);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/orders/");
      const data = await response.json();

      // Filter orders with "pending" or "ready" status

      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  const handleTipAmountChange = (e) => {
    setTipAmount(parseFloat(e.target.value));
  };

  const handleDiscountAmountChange = (e) => {
    setDiscountAmount(parseFloat(e.target.value));
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;

    selectedOrder.items.forEach((item) => {
      totalPrice += item.price * item.quantity;
    });

    return totalPrice;
  };

  const handleCancel = () => {
    setTipAmount(0);
    setDiscountAmount(0);
    handleOrderSelection(null);
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: async () => {
      const url = `http://127.0.0.1:8000/api/orders/${selectedOrder.orderId}/`;
      const updatedStatus = "paid";

      try {
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: updatedStatus,
            items: selectedOrder.items,
            orderId: selectedOrder.orderId,
            tableNumber: selectedOrder.tableNumber,
            time: selectedOrder.time,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const updatedOrders = orders.map((order) =>
            order.orderId === data.orderId
              ? { ...order, status: data.status }
              : order
          );
          selectedOrder.status = data.status;
          handleOrderSelection(selectedOrder);

          setOrders(updatedOrders);
        } else {
          throw new Error("Failed to update order status");
        }
      } catch (error) {
        console.error("Error updating order status:", error);
        // Handle the error case
        return;
      }
    },
  });
  useEffect(() => {
    console.log(selectedOrder, "sl");
  }, [selectedOrder]);
  if (selectedOrder !== undefined && selectedOrder.items == null) {
    return <p>Loading order data...</p>;
  }

  return (
    <div className="container mx-auto p-6 ">
      {selectedOrder === undefined ? (
        <table className="min-w-full divide-y divide-gray-200  overflow-y-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Table Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr
                key={order.id}
                className={order.paid ? "bg-green-100" : "bg-red-100"}>
                <td className="px-6 py-4 whitespace-nowrap">{order.orderId}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.tableNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{order.time}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.status == "paid" ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-500 text-white">
                      Paid
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-500 text-white">
                      Not Paid
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ul className="list-disc list-inside">
                    {order.items.map((item) => (
                      <li
                        key={
                          item.id
                        }>{`${item.name} - $${item.price} x ${item.quantity}`}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        selectedOrder !== undefined &&
        selectedOrder.items !== null && (
          <div className=" max-w-md mx-auto bg-white shadow-2xl rounded-lg p-6 z-10 receipt">
            <div ref={componentRef} id="bill-section">
              <h2 className=" text-2xl font-bold mb-4">
                Payment for Order {selectedOrder.orderId}
              </h2>
              <div className="border-b border-gray-300 pb-4 mb-4">
                <p className="text-gray-600">
                  Table Number: {selectedOrder.tableNumber}
                </p>
                <p className="text-gray-600">Timestamp: {selectedOrder.time}</p>
              </div>

              <div className="border-b border-gray-300 pb-4 mb-4">
                <p className="font-bold">Order Items:</p>
                <ul className="mt-2">
                  {selectedOrder.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex justify-between items-center">
                      <span>{item.name}</span>
                      <span>
                        $ {item.price} x {item.quantity}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-b border-gray-300 pb-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="font-bold">Total Amount:</span>
                  <span>
                    ${calculateTotalPrice() + tipAmount - discountAmount}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-bold">Tax Amount:</span>
                  <span>
                    $
                    {(calculateTotalPrice() + tipAmount - discountAmount) * 0.1}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={handlePrint}>
                Print
              </button>
              <button
                type="button"
                className="bg-gray-300 text-white font-bold py-2 px-4 rounded"
                onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Payment;
