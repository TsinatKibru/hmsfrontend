import React, { useState, useEffect } from "react";

const IngredientTransferComponent = () => {
  const [socket, setSocket] = useState(null);
  const [items, setItems] = useState([]);

  const gramQuantities = {
    g: 1,
    oz: 28.3495,
    lb: 453.592,
    kg: 1000,
  };

  const literQuantities = {
    l: 1,
    ml: 0.001,
    gal: 3.78541,
    // Add more volume unit options as needed
  };

  const countQuantities = {
    count: 1,
    dozen: 12,
    pair: 2,
    // Add more counting unit options as needed
  };

  function convertQuantityToBaseUnit(quantity, quantityUnit, category) {
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

  const handleApproveAll = async () => {
    const requestIds = items.map((itemTransferData) => itemTransferData.id);
    console.log(requestIds, "ids");

    socket.send(
      JSON.stringify({ type: "approve_request", request_ids: requestIds })
    );

    for (const itemTransferData of items) {
      for (const item of itemTransferData.items) {
        const convertedquntity = convertQuantityToBaseUnit(
          item.quantity,
          item.unit,
          item.category
        );

        if (item.status === "pending") {
          try {
            const encodedName = encodeURIComponent(item.name);
            await fetch(
              `https://hmsbackend-gamma.vercel.app/api/items/name/${encodedName}/quantity/${convertedquntity}/`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
              }
            );

            console.log("Item updated successfully");
          } catch (error) {
            console.error("Error updating item:", error);
            // Handle the error accordingly
          }
        }
      }
    }
  };

  const handleReject = (requestId, itemIndex) => {
    // Send a WebSocket message to the server to reject the specific request item
    socket.send(
      JSON.stringify({
        type: "reject_request",
        request_id: requestId,
        index: itemIndex,
      })
    );
  };

  const connectWebSocket = () => {
    const socket = new WebSocket(
      "wss://hmsbackend-gamma.vercel.app/ws/item_transfer/"
    );

    socket.addEventListener("open", () => {
      console.log("Item Transfer WebSocket connection established");

      // Join the specified group when the connection is open
      const joinGroupMessage = {
        type: "join_group",
        group_name: "ItemTransferGroup",
      };
      socket.send(JSON.stringify(joinGroupMessage));

      setSocket(socket);
    });

    socket.addEventListener("message", (event) => {
      // Handle incoming WebSocket messages here
      const message = JSON.parse(event.data);
      console.log("Received message:", message);

      const filteredItems = {
        ...message.item_transfer_data,
        items: message.item_transfer_data.items.filter(
          (item) => item.status === "pending"
        ),
      };

      const itemId = filteredItems.id;
      const existingItemIndex = items.findIndex((item) => item.id === itemId);

      if (existingItemIndex !== -1) {
        // Replace existing item with filteredItems object
        const newItems = [...items];
        newItems[existingItemIndex] = filteredItems;
        setItems(newItems);
      } else {
        // Add filteredItems object to items array
        setItems([...items, filteredItems]);
      }
    });

    socket.addEventListener("close", () => {
      console.log("WebSocket connection closed");
      connectWebSocket();
    });
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  useEffect(() => {
    fetchtranferdata();
  }, []);

  useEffect(() => {
    console.log(items, "it");
  }, [items]);

  const fetchtranferdata = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/item-transfers/");
      const data = await response.json();

      const filteredItems = data.map((transferdata) => ({
        ...transferdata,
        items: transferdata.items.filter((item) => item.status === "pending"),
      }));

      setItems(filteredItems);
    } catch (error) {
      console.error("Error fetching item transfer data:", error);
    }
  };

  return (
    <div className="flex flex-col justify-items-center p-4 mb-20 ml-14 mr-2 overflow-x-hidden flex-grow">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Ingredient Transfer
      </h2>

      <h3 className="text-lg font-bold mb-2">Transfer Requests:</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Request User</th>
              <th className="py-2 px-4 text-left">Grant User</th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Quantity</th>
              <th className="py-2 px-4 text-left">Unit</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="border-l-2 shadow-md">
            {items !== undefined &&
              items !== null &&
              items.map((itemTransferData, index) => (
                <React.Fragment key={index}>
                  {itemTransferData.items !== undefined &&
                    itemTransferData.items !== null &&
                    itemTransferData.items.map((item, itemIndex) => (
                      <tr
                        key={itemIndex}
                        className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-2 px-4">{itemTransferData.id}</td>
                        <td className="py-2 px-4">
                          {itemTransferData.request_user}
                        </td>
                        <td className="py-2 px-4">
                          {itemTransferData.grant_user}
                        </td>
                        <td className="py-2 px-4">{item.name}</td>
                        <td className="py-2 px-4">{item.quantity}</td>
                        <td className="py-2 px-4">{item.unit}</td>
                        <td className="py-2 px-4">{item.status}</td>
                        <td className="py-2 px-4">
                          {/* reject button here */}

                          <button
                            onClick={() =>
                              handleReject(itemTransferData.id, itemIndex)
                            }
                            className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded-md">
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                </React.Fragment>
              ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center mt-4">
        <button
          onClick={handleApproveAll}
          className="bg-thirtiary hover:bg-thirtiaryD text-white py-1 px-2 rounded-md mb-2 w-32">
          Approve
        </button>
      </div>
    </div>
  );
};

export default IngredientTransferComponent;
