import React, { useState, useEffect } from "react";
import axios from "axios";

const PurchaseList = () => {
  const [purchases, setPurchases] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch the list of purchases from the API
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
        setPurchases(response.data);
      } catch (error) {
        console.error("Error fetching purchases:", error);
      }
    };

    fetchPurchases();
  }, []);

  const handleStatusChange = async (purchaseId, newStatus, quantity) => {
    try {
      // Update the purchase status
      await axios.patch(
        `https://hmsbackend-gamma.vercel.app/api/purchases/${purchaseId}/`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // If the purchase is approved, update the associated item's quantity
      if (newStatus === "rejected") {
        const purchase = purchases.find(
          (purchase) => purchase.id === purchaseId
        );
        const itemId = purchase.item.id;
        const updatedQuantity = purchase.item.quantity - quantity;

        await axios.patch(
          `https://hmsbackend-gamma.vercel.app/api/items/${itemId}/`,
          {
            quantity: updatedQuantity,
          }
        );
      }

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

  return (
    <div>
      <h2>Purchase List</h2>
      {purchases.map((purchase) => (
        <div key={purchase.id}>
          <p>
            Purchase of {purchase.quantity} {purchase.item.name} on{" "}
            {purchase.purchase_date}
          </p>
          <p>Status: {purchase.status}</p>
          <div>
            {purchase.status !== "approved" && (
              <button
                onClick={() =>
                  handleStatusChange(purchase.id, "approved", purchase.quantity)
                }>
                Approve
              </button>
            )}
            {purchase.status !== "approved" && (
              <button
                onClick={() => handleStatusChange(purchase.id, "rejected", 0)}>
                Reject
              </button>
            )}
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default PurchaseList;
