import React, { useEffect, useState } from "react";

const StockAlert = () => {
  const [stockItems, setStockItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/items/");
        const data = await response.json();
        const itemData = data.map((item) => {
          return {
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            expiration_date: item.expiration_date,
            threshold: item.threshold,
            category: item.category,
            unit: "",
          };
        });
        setStockItems(itemData); // Set the state with the processed data
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };
    fetchIngredients();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

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

  function convertThresholdToBaseUnit(quantity, quantityUnit, category) {
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
    setStockItems((prevStockItems) => {
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
    <div className="flex flex-col justify-items-center p-4 mb-20 ml-14 mr-2 overflow-x-hidden flex-grow">
      <h2 className="text-2xl font-bold mb-4">Stock Management</h2>
      <input
        type="text"
        placeholder="Search by item name"
        value={searchTerm}
        onChange={handleSearch}
        className="w-full px-4 py-2 mb-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="py-2 px-4 bg-gray-100 border-b">ID</th>
            <th className="py-2 px-4 bg-gray-100 border-b">Item Name</th>
            <th className="py-2 px-4 bg-gray-100 border-b">Unit</th>
            <th className="py-2 px-4 bg-gray-100 border-b">Quantity</th>
            <th className="py-2 px-4 bg-gray-100 border-b">Exp.</th>
            <th className="py-2 px-4 bg-gray-100 border-b">Threshold</th>
            <th className="py-2 px-4 bg-gray-100 border-b">Price</th>
          </tr>
        </thead>
        <tbody>
          {stockItems.map((item) => (
            <tr
              key={item.id}
              className={item.quantity < item.threshold ? "bg-red-100" : ""}>
              <td className="py-2 px-4 border-b">{item.id}</td>
              <td className="py-2 px-4 border-b">{item.name}</td>
              <td className="py-2 px-4 border-b">
                {item.category === "solid" && (
                  <select
                    value={item.unit}
                    onChange={(e) => handleInputChange(item.id, e.target.value)}
                    className="border rounded px-3 py-2 ml-2">
                    <option value="g">g</option>
                    <option value="oz">oz</option>
                    <option value="lb">lb</option>
                    <option value="kg">kg</option>
                  </select>
                )}
                {item.category === "liquid" && (
                  <select
                    value={item.unit}
                    onChange={(e) => handleInputChange(item.id, e.target.value)}
                    className="border rounded px-3 py-2 ml-2">
                    <option value="l">L</option>
                    <option value="ml">ml</option>
                    {/* Add more volume unit options as needed */}
                  </select>
                )}
                {item.category === "countable" && (
                  <select
                    value={item.unit}
                    onChange={(e) => handleInputChange(item.id, e.target.value)}
                    className="border rounded px-3 py-2 ml-2">
                    <option value="count">count</option>
                    <option value="dozen">dozen</option>
                    <option value="pair">pair</option>
                    {/* Add more counting unit options as needed */}
                  </select>
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {item.unit === ""
                  ? item.quantity
                  : convertQuantityToBaseUnit(
                      item.quantity,
                      item.unit,
                      item.category
                    )}
              </td>
              <td className="py-2 px-4 border-b">{item.expiration_date}</td>
              <td className="py-2 px-4 border-b">
                {item.unit === ""
                  ? item.threshold
                  : convertThresholdToBaseUnit(
                      item.threshold,
                      item.unit,
                      item.category
                    )}
              </td>
              <td className="py-2 px-4 border-b">{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockAlert;
