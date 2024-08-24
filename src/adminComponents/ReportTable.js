import React, { useEffect, useState } from "react";

const ReportTable = () => {
  const [transferredItems, setTransferredItems] = useState([]);
  const [orderedDishes, setOrderedDishes] = useState([]);
  const [dishesdata, setDishesdata] = useState([]);
  const [totalitemsize, setTotalitemsize] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const currentDate = new Date().toISOString().split("T")[0];

  const fetchDishes = async () => {
    try {
      const response = await fetch(
        "https://hmsbackend-gamma.vercel.app/api/dishes/"
      );
      const data = await response.json();

      const dishes = data.map((dish) => {
        return {
          ...dish,
          unit: "",
        };
      });
      setDishesdata(dishes);
    } catch (error) {
      console.error("Error fetching dishes:", error);
    }
  };

  const gramQuantities = {
    g: 1,
    oz: 1 / 28.3495,
    lb: 1 / 453.592,
    kg: 1 / 1000,
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

  useEffect(() => {
    fetchDishes();
  }, []);

  useEffect(() => {
    fetchTransferredItems();
    fetchOrderedDishes();
  }, []);
  const formatPurchaseTime = (purchaseTime) => {
    const date = new Date(purchaseTime);
    return date.toLocaleDateString();
  };

  const fetchTransferredItems = async () => {
    try {
      const response = await fetch(
        "https://hmsbackend-gamma.vercel.app/api/item-transfers/"
      );
      const data = await response.json();
      const filteredData = selectedDate
        ? data.filter(
            (d) =>
              formatPurchaseTime(d.transfer_date) ===
              formatPurchaseTime(selectedDate)
          )
        : data;
      const x = data.map((d) => d.transfer_date);
      // console.log("Fetched data:", data);
      // console.log(
      //   formatPurchaseTime(selectedDate),
      //   formatPurchaseTime(x[0]),
      //   "aklg"
      // );

      const itemsMap = new Map();
      filteredData.forEach((request) => {
        request.items.forEach((itemTransferRequest) => {
          if (itemTransferRequest.status === "approved") {
            const existingItem = itemsMap.get(itemTransferRequest.name);
            if (existingItem) {
              existingItem.quantity += parseInt(itemTransferRequest.quantity);
            } else {
              itemsMap.set(itemTransferRequest.name, {
                name: itemTransferRequest.name,
                quantity: parseInt(itemTransferRequest.quantity),
                unit: itemTransferRequest.unit,
                category: itemTransferRequest.category,
              });
            }
          }
        });
      });

      const items = Array.from(itemsMap.values());
      // console.log("Processed items:", items);
      setTransferredItems(items);
    } catch (error) {
      console.error("Error fetching transferred items:", error);
    }
  };

  const fetchOrderedDishes = async () => {
    try {
      const response = await fetch(
        "https://hmsbackend-gamma.vercel.app/api/orders/"
      );
      const data = await response.json();
      const filteredData = selectedDate
        ? data.filter(
            (d) =>
              formatPurchaseTime(d.time) === formatPurchaseTime(selectedDate)
          )
        : data;
      // console.log("Fetched orders:", data);

      const dishesMap = new Map();
      filteredData.forEach((order) => {
        order.items.forEach((dish) => {
          const existingDish = dishesMap.get(dish.name);
          if (existingDish) {
            existingDish.quantity += parseInt(dish.quantity);
          } else {
            dishesMap.set(dish.name, {
              name: dish.name,
              quantity: parseInt(dish.quantity),
            });
          }
        });
      });

      const dishes = Array.from(dishesMap.values());
      // console.log("Ordered dishes:", dishes);
      setOrderedDishes(dishes);
    } catch (error) {
      console.error("Error fetching ordered dishes:", error);
    }
  };

  function getTotalUsedQuantity(dishId, itemId, unit) {
    // console.log("x", dishId, itemId);

    const dish = dishesdata.find((dish) => dish.name === dishId.name); // Replace dishState with your actual dish state variable
    let totalQuantity = 0;

    if (dish) {
      // Check if the dish has items
      if (dish.items) {
        for (const item of dish.items) {
          if (item.item.name === itemId.name) {
            totalQuantity += item.quantity;
          }
        }
      }

      // Check if the dish has recipes
      if (dish.recipes) {
        for (const recipe of dish.recipes) {
          if (recipe.recipe.items) {
            for (const recipeItem of recipe.recipe.items) {
              if (recipeItem.item.name === itemId.name) {
                totalQuantity += recipeItem.used_quantity * recipe.quantity;
              }
            }
          }
        }
      }
    }
    // console.log(totalQuantity);
    const xunittotal = convertQuantityToBaseUnit(
      totalQuantity,
      unit,
      itemId.category
    );
    totalQuantity = xunittotal;

    return totalQuantity * dishId.quantity;
  }

  const handleInputChange = (index, category, field, value) => {
    const updatedtransferredItems = [...transferredItems];
    if (category === "solid") {
      const x = gramQuantities[value];
      const y = gramQuantities[updatedtransferredItems[index][field]];
      const z = x * y;
      updatedtransferredItems[index]["quantity"] =
        updatedtransferredItems[index]["quantity"] / z;
    } else if (category === "liquid") {
      const x = literQuantities[value];
      const y = literQuantities[updatedtransferredItems[index][field]];
      const z = x * y;
      updatedtransferredItems[index]["quantity"] =
        updatedtransferredItems[index]["quantity"] / z;
    } else if (category === "countable") {
      const x = countQuantities[value];
      const y = countQuantities[updatedtransferredItems[index][field]];
      const z = x * y;
      updatedtransferredItems[index]["quantity"] =
        updatedtransferredItems[index]["quantity"] / z;
    }
    updatedtransferredItems[index][field] = value;

    setTransferredItems(updatedtransferredItems);
  };
  useEffect(() => {
    fetchTransferredItems();
    fetchOrderedDishes();
  }, [selectedDate]);

  return (
    <div className="container mx-auto overflow-y-auto">
      <h2 className="w-40 px-4 py-2 mt-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-40 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </h2>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Transferred Item</th>
            <th className="py-2 px-4 border-b">Quantity Transferred</th>

            {orderedDishes.map((dish, index) => (
              <th key={index} className="py-2 px-4 border-b">
                {dish.name} - {dish.quantity}
              </th>
            ))}

            <th className="py-2 px-4 border-b">Total Quantity Used</th>
          </tr>
        </thead>
        <tbody>
          {transferredItems.map((item, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b">{item.name}</td>
              <td className="py-2 px-4 border-b">
                {item.quantity}
                {/* {convertQuantityToBaseUnit(
                  item.quantity,
                  item.unit,
                  item.category
                )} */}
                <span>
                  {item.category === "solid" && (
                    <select
                      value={item.unit}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          item.category,

                          "unit",
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
                  {item.category === "liquid" && (
                    <select
                      value={item.unit}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          item.category,

                          "unit",
                          e.target.value
                        )
                      }
                      className="border rounded px-3 py-2 ml-2">
                      <option value="">select</option>
                      <option value="l">L</option>
                      <option value="ml">ml</option>
                      {/* Add more volume unit options as needed */}
                    </select>
                  )}
                  {item.category === "countable" && (
                    <select
                      value={item.unit}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          item.category,
                          "unit",
                          e.target.value
                        )
                      }
                      className="border rounded px-3 py-2 ml-2">
                      <option value="">select</option>
                      <option value="count">count</option>
                      <option value="dozen">dozen</option>
                      <option value="pair">pair</option>
                      {/* Add more counting unit options as needed */}
                    </select>
                  )}
                </span>
              </td>
              {orderedDishes.map((dish, dishIndex) => (
                <React.Fragment key={dishIndex}>
                  <td className="py-2 px-4 border-b ">
                    {getTotalUsedQuantity(dish, item, item.unit)}
                    {item.category === "solid" && (
                      <select
                        value={item.unit}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            item.category,

                            "unit",
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
                    {item.category === "liquid" && (
                      <select
                        value={item.unit}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            item.category,

                            "unit",
                            e.target.value
                          )
                        }
                        className="border rounded px-3 py-2 ml-2">
                        <option value="">select</option>
                        <option value="l">L</option>
                        <option value="ml">ml</option>
                        {/* Add more volume unit options as needed */}
                      </select>
                    )}
                    {item.category === "countable" && (
                      <select
                        value={item.unit}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            item.category,
                            "unit",
                            e.target.value
                          )
                        }
                        className="border rounded px-3 py-2 ml-2">
                        <option value="">select</option>
                        <option value="count">count</option>
                        <option value="dozen">dozen</option>
                        <option value="pair">pair</option>
                        {/* Add more counting unit options as needed */}
                      </select>
                    )}
                  </td>
                </React.Fragment>
              ))}
              <td className="py-2 px-4 border-b">
                {orderedDishes.reduce((total, dish) => {
                  return total + getTotalUsedQuantity(dish, item, item.unit);
                }, 0)}
                {" - "}
                {item.unit}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;
