import React, { useState } from "react";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
const PurchaseForm = () => {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  const [purchases, setPurchases] = useState([
    {
      itemName: "",
      vendor: "",
      quantity: "",
      quantityUnit: "",
      price: "",
      expirationDate: "",
      threshold: "",
      category: "",
    },
  ]);

  // const handleInputChange = (index, field, value) => {
  //   const updatedPurchases = [...purchases];
  //   updatedPurchases[index][field] = value;
  //   setPurchases(updatedPurchases);
  // };
  const handleInputChange = (index, field, value) => {
    const updatedPurchases = [...purchases];
    if (field === "quantity") {
      const quantityValue = parseFloat(value);
      if (!isNaN(quantityValue)) {
        updatedPurchases[index].quantity = quantityValue;
      } else {
        updatedPurchases[index].quantity = "";
      }
    } else if (field === "category") {
      updatedPurchases[index].category = value;
      if (value === "solid") {
        updatedPurchases[index].quantityUnit = "g";
      } else if (value === "liquid") {
        updatedPurchases[index].quantityUnit = "l";
      } else if (value === "countable") {
        updatedPurchases[index].quantityUnit = "count";
      }
    } else {
      updatedPurchases[index][field] = value;
    }
    setPurchases(updatedPurchases);
  };
  const handleAddRow = () => {
    setPurchases([
      ...purchases,
      {
        itemName: "",
        vendor: "",
        quantity: "",
        quantityUnit: "",
        price: "",
        expirationDate: "",
        threshold: "",
        category: "",
      },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      for (const purchase of purchases) {
        // Create item data
        const itemData = {
          name: purchase.itemName,
          quantity: convertQuantityToBaseUnit(
            purchase.quantity,
            purchase.quantityUnit,
            purchase.category
          ),
          price: MaketPricePerBaseUnit(
            purchase.price,
            purchase.quantityUnit,
            purchase.category
          ),
          expiration_date: purchase.expirationDate,
          // threshold: parseInt(purchase.threshold),
          threshold: convertQuantityToBaseUnit(
            purchase.threshold,
            purchase.quantityUnit,
            purchase.category
          ),

          category: purchase.category,
        };
        console.log(itemData);

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

          const convertedQuantity = parseFloat(quantity) * conversionFactor;
          const approximatedQuantity =
            Math.round(convertedQuantity * 1000) / 1000;
          return approximatedQuantity.toFixed(3);
        }

        function MaketPricePerBaseUnit(price, quantityUnit, category) {
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
          const threeDecimal = (parseFloat(price) / conversionFactor).toFixed(
            3
          );

          return threeDecimal;
        }

        // Send POST request to create item
        const itemResponse = await axios.post(
          "http://localhost:8000/api/items/",
          itemData
        );
        const item = itemResponse.data;

        // Create purchase data
        const purchaseData = {
          item: item.id,
          vendor: purchase.vendor,
          quantity: item.quantity,
          status: "pending",
        };

        // Send POST request to create purchase
        await axios.post(
          "http://localhost:8000/api/purchases/",
          purchaseData,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Notify the storekeeper about the created item
        await axios.post("http://localhost:8000/api/notifications/", {
          role: "storeKeeper",
          entity_type: "Item",
          entity_id: itemResponse.data.id,
          entity: JSON.stringify(itemResponse.data),
          action: "added",
          amount: purchaseData.quantity,
          seen: false,
        });
      }

      // Reset form fields
      setPurchases([
        {
          itemName: "",
          vendor: "",
          quantity: "",
          quantityUnit: "",
          price: "",
          expirationDate: "",
          threshold: "",
          category: "",
        },
      ]);

      // Display success message or perform further actions
      console.log("Purchases created successfully!");
    } catch (error) {
      // Handle error responses
      console.error("Error creating purchases:", error);
    }
  };

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

  function getPricePlaceholder(unit) {
    return `Per ${unit}`;
  }

  const handleRemoveRow = (index) => {
    // Create a new array without the element at the specified index
    const updatedPurchases = purchases.filter((purchase, i) => i !== index);

    // Update the state with the new array
    setPurchases(updatedPurchases);
  };

  return (
    <div className="container mx-auto p-4 overflow-y-auto">
      <form onSubmit={handleSubmit} className="p-4 ">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gradient-to-b from-gray-200 to-gray-400">
                <th className="px-4 py-2">Item Name</th>
                <th className="px-4 py-2">Vendor</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Expiration Date</th>
                <th className="px-4 py-2">Threshold</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase, index) => (
                <tr key={index} className="bg-white">
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      required
                      value={purchase.itemName}
                      onChange={(e) =>
                        handleInputChange(index, "itemName", e.target.value)
                      }
                      className="w-full border rounded px-3 py-2"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={purchase.vendor}
                      required
                      onChange={(e) =>
                        handleInputChange(index, "vendor", e.target.value)
                      }
                      className="w-full border rounded px-3 py-2"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={purchase.category}
                      required
                      onChange={(e) =>
                        handleInputChange(index, "category", e.target.value)
                      }
                      className="w-full border rounded px-3 py-2">
                      <option value="">category</option>
                      <option value="solid">Solid</option>
                      <option value="liquid">Liquid</option>
                      <option value="countable">Countable</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex">
                      <input
                        type="number"
                        required
                        value={purchase.quantity}
                        onChange={(e) =>
                          handleInputChange(index, "quantity", e.target.value)
                        }
                        className="w-full border rounded px-3 py-2"
                      />
                      {purchase.category === "solid" && (
                        <select
                          value={purchase.quantityUnit}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "quantityUnit",
                              e.target.value
                            )
                          }
                          className="border rounded px-3 py-2 ml-2">
                          <option value="">unit</option>
                          <option value="g">g</option>
                          <option value="oz">oz</option>
                          <option value="lb">lb</option>
                          <option value="kg">kg</option>
                        </select>
                      )}
                      {purchase.category === "liquid" && (
                        <select
                          value={purchase.quantityUnit}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "quantityUnit",
                              e.target.value
                            )
                          }
                          className="border rounded px-3 py-2 ml-2">
                          <option value="">unit</option>
                          <option value="l">L</option>
                          <option value="ml">ml</option>
                          {/* Add more volume unit options as needed */}
                        </select>
                      )}
                      {purchase.category === "countable" && (
                        <select
                          value={purchase.quantityUnit}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "quantityUnit",
                              e.target.value
                            )
                          }
                          className="border rounded px-3 py-2 ml-2">
                          <option value="">unit</option>
                          <option value="count">count</option>
                          <option value="dozen">dozen</option>
                          <option value="pair">pair</option>
                          {/* Add more counting unit options as needed */}
                        </select>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={purchase.price}
                      onChange={(e) =>
                        handleInputChange(index, "price", e.target.value)
                      }
                      placeholder={getPricePlaceholder(purchase.quantityUnit)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="date"
                      required
                      value={purchase.expirationDate}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "expirationDate",
                          e.target.value
                        )
                      }
                      className="w-full border rounded px-3 py-2"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      required
                      value={purchase.threshold}
                      onChange={(e) =>
                        handleInputChange(index, "threshold", e.target.value)
                      }
                      className="w-full border rounded px-3 py-2"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleRemoveRow(index)}
                      className="group text-gray-700 hover:text-red-600 flex items-center transition-colors duration-300">
                      <FontAwesomeIcon icon={faTrash} className="mr-2" />
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Remove Row
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-between">
          <button
            type="button"
            onClick={handleAddRow}
            className="bg-thirtiary hover:bg-thirtiaryD text-white font-bold py-2 px-4 rounded">
            Add Row
          </button>
          <button
            type="submit"
            className="bg-thirtiaryD hover:bg-thirtiary border border-black text-white font-bold py-2 px-4 rounded">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default PurchaseForm;
