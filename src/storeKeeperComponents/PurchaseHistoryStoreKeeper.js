import React, { useState, useEffect } from "react";
import axios from "axios";
import { RiMarkupFill } from "react-icons/ri";
import { FaCheckCircle, FaTimes } from "react-icons/fa";

const PurchaseHistoryStoreKeeper = () => {
  const [purchases, setPurchases] = useState([]);
  const token = localStorage.getItem("token");
  let socket = null;
  const [refresh, setRefresh] = useState(false);

  const fetchPurchases = async () => {
    try {
      const response = await axios.get(
        "https://hmsbackend-gamma.vercel.app/api/purchaselist/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Sort the filtered purchases by purchase_date in descending order (most recent first)
      const sortedPurchases = response.data.sort(
        (a, b) => new Date(b.purchase_date) - new Date(a.purchase_date)
      );

      // const puchaseData = sortedPurchases.map((purchase) => {
      //   return {
      //     id: purchase.id,
      //     vendor: purchase.vendor,
      //     quantity: purchase.quantity,
      //     purchase_date: purchase.purchase_date,
      //     status:purchase.status,
      //     item:purchase.item,
      //     unit: "",
      //   };
      // });

      const purchaseData = sortedPurchases.map((purchase) => {
        return {
          ...purchase,
          unit: "",
        };
      });

      setPurchases(purchaseData);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    }
  };

  useEffect(() => {
    // Fetch the list of purchases from the API
    fetchPurchases();
  }, []);

  const handleStatusChange = async (purchaseId, newStatus, quantity) => {
    try {
      // Update the purchase status
      await axios.put(
        `https://hmsbackend-gamma.vercel.app/api/purchases/${purchaseId}/`,
        {
          purchaseId: purchaseId,
          newStatus: newStatus,
          quantity: quantity,
          status: newStatus,
          vendor: purchases.find((purchase) => purchase.id === purchaseId)
            .vendor,
          item: purchases.find((purchase) => purchase.id === purchaseId).item
            .id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // If the purchase is rejected, update the associated item's quantity
      if (newStatus === "rejected") {
        const purchase = purchases.find(
          (purchase) => purchase.id === purchaseId
        );
        const itemId = purchase.item.id;
        const itemname = purchase.item.name;

        const itemprice = purchase.item.price;
        const itemexpiration_date = purchase.item.expiration_date;
        const itemthreshold = purchase.item.threshold;
        const itemcategory = purchase.item.category;

        const updatedQuantity = purchase.item.quantity - quantity;

        await axios.put(
          `https://hmsbackend-gamma.vercel.app/api/items/${itemId}/`,
          {
            id: itemId,
            quantity: updatedQuantity,
            name: itemname,
            price: itemprice,
            threshold: itemthreshold,
            category: itemcategory,
            expiration_date: itemexpiration_date,
          }
        );

        await axios.post(
          "https://hmsbackend-gamma.vercel.app/api/notifications/",
          {
            role: "storeKeeper",
            entity_type: "Item",
            entity_id: itemId,
            entity: JSON.stringify(purchase.item),
            action: "deducted",
            amount: quantity,
            seen: false,
          }
        );
      }

      // if (newStatus === "rejected") {
      //   const purchase = purchases.find(
      //     (purchase) => purchase.id === purchaseId
      //   );
      //   const itemId = purchase.item.id;
      //   const itemname = purchase.item.name;

      //   const itemprice = purchase.item.price;
      //   const itemexpiration_date = purchase.item.expiration_date;
      //   const itemthreshold = purchase.item.threshold;
      //   const itemcategory = purchase.item.category;

      //   const updatedQuantity = purchase.item.quantity - quantity;

      //   await axios.put(`https://hmsbackend-gamma.vercel.app/api/items/${itemId}/`, {
      //     id: itemId,
      //     quantity: updatedQuantity,
      //     name: itemname,
      //     price: itemprice,
      //     threshold: itemthreshold,
      //     category: itemcategory,
      //     expiration_date: itemexpiration_date,
      //   });
      // }

      // Notify the storekeeper about the removed  item

      // Update the status locally in the purchases state
      const updatedPurchases = purchases.map((purchase) =>
        purchase.id === purchaseId
          ? { ...purchase, status: newStatus }
          : purchase
      );
      setPurchases(updatedPurchases);
    } catch (error) {
      console.error("Error updating purchase status:", error);
    }
  };

  const formatPurchaseTime = (purchaseTime) => {
    const date = new Date(purchaseTime);
    return date.toLocaleString();
  };

  const checkSocketConnection = () => {
    if (socket === null || socket.readyState === WebSocket.CLOSED) {
      socket = new WebSocket(
        "wss://hmsbackend-gamma.vercel.app/ws/notifications/"
      );

      socket.addEventListener("open", () => {
        console.log("WebSocket connection established");
      });

      socket.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);
        console.log("Received item change:", message);
        console.log(event, "EVENT");

        setRefresh(true);
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
    setRefresh(false);
    fetchPurchases();
    return () => {
      socket.close();
    };
  }, [refresh]);

  const gramQuantities = {
    g: 1,
    oz: 1 / 28.3495,
    lb: 1 / 453.592,
    kg: 0.001,
  };

  const literQuantities = {
    l: 1,
    ml: 1000,
    gal: 1 / 3.78541,
    // Add more volume unit options as needed
  };

  const countQuantities = {
    count: 1,
    dozen: 1 / 12,
    pair: 1 / 2,
    // Add more counting unit options as needed
  };

  function convertQuantityToBaseUnit(quantity, quantityUnit, category) {
    if (quantityUnit == undefined) {
      return parseFloat(quantity);
    }
    let conversionFactor;
    if (category === "solid") {
      conversionFactor = gramQuantities[quantityUnit];
    } else if (category === "liquid") {
      conversionFactor = literQuantities[quantityUnit];
    } else if (category === "countable") {
      conversionFactor = countQuantities[quantityUnit];
    } else {
      // Default to 1 if the category is not recognized
      conversionFactor = 1;
    }

    return parseFloat(quantity) * conversionFactor;
  }

  const handleInputChange = (id, value) => {
    setPurchases((prevStockItems) => {
      // Find the item with the matching ID
      const updatedStockItems = prevStockItems.map((item) => {
        if (item.id === id) {
          // Update the unit value for the selected item
          return { ...item, unit: value };
        }
        return item;
      });

      return updatedStockItems;
    });
  };

  return (
    <div className="container mx-auto overflow-y-auto px-5  ">
      <h2 className="text-2xl font-bold mb-4 text-black">Purchase List</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Item</th>
            <th className="py-2 px-4 bg-gray-100 border-b">Unit</th>
            <th className="py-2 px-4 border-b">Quantity</th>
            <th className="py-2 px-4 border-b">Purchase Date</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((purchase) => (
            <tr key={purchase.id}>
              <td className="py-2 px-4 border-b">{purchase.item.name}</td>
              <td className="py-2 px-4 border-b">
                {purchase.item.category === "solid" && (
                  <select
                    value={purchase.unit}
                    onChange={(e) =>
                      handleInputChange(
                        purchase.id,

                        e.target.value
                      )
                    }
                    className="border rounded px-3 py-2 ml-2">
                    <option value="g">g</option>
                    <option value="oz">oz</option>
                    <option value="lb">lb</option>
                    <option value="kg">kg</option>
                  </select>
                )}
                {purchase.item.category === "liquid" && (
                  <select
                    value={purchase.unit}
                    onChange={(e) =>
                      handleInputChange(
                        purchase.id,

                        e.target.value
                      )
                    }
                    className="border rounded px-3 py-2 ml-2">
                    <option value="l">L</option>
                    <option value="ml">ml</option>
                    {/* Add more volume unit options as needed */}
                  </select>
                )}
                {purchase.item.category === "countable" && (
                  <select
                    value={purchase.unit}
                    onChange={(e) =>
                      handleInputChange(
                        purchase.id,

                        e.target.value
                      )
                    }
                    className="border rounded px-3 py-2 ml-2">
                    <option value="count">count</option>
                    <option value="dozen">dozen</option>
                    <option value="pair">pair</option>
                    {/* Add more counting unit options as needed */}
                  </select>
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {purchase.unit === ""
                  ? purchase.quantity
                  : convertQuantityToBaseUnit(
                      purchase.quantity,
                      purchase.unit,
                      purchase.item.category
                    )}
              </td>
              <td className="py-2 px-4 border-b">
                {formatPurchaseTime(purchase.purchase_date)}
              </td>
              <td
                className={`py-2 px-4 border-b ${
                  purchase.status === "rejected" ? "text-red-500" : ""
                }`}>
                {purchase.status}
              </td>
              <td className="py-2 px-4 border-b">
                {purchase.status === "pending" && (
                  <div className="flex justify-center items-center">
                    <button
                      className="bg-thirtiary hover:bg-thirtiaryD text-white font-bold py-1 px-2 rounded focus:outline-none"
                      onClick={() =>
                        handleStatusChange(
                          purchase.id,
                          "approved",
                          purchase.quantity
                        )
                      }>
                      Approve
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded focus:outline-none ml-2"
                      onClick={() =>
                        handleStatusChange(
                          purchase.id,
                          "rejected",
                          purchase.quantity
                        )
                      }>
                      Reject
                    </button>
                  </div>
                )}

                <div className="flex justify-center items-center">
                  {purchase.status == "approved" && <FaCheckCircle />}
                </div>
                <div className="flex justify-center items-center">
                  {purchase.status == "rejected" && <FaTimes />}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseHistoryStoreKeeper;
