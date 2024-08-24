import React, { useState } from "react";

const RegisterEndProductComponent = () => {
  const [productName, setProductName] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [rawItems, setRawItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleAddRawItem = () => {
    setRawItems([...rawItems, { itemName: "", quantity: "" }]);
  };

  const handleRemoveRawItem = (index) => {
    const updatedRawItems = [...rawItems];
    updatedRawItems.splice(index, 1);
    setRawItems(updatedRawItems);
  };

  const handleRawItemChange = (index, field, value) => {
    const updatedRawItems = [...rawItems];
    updatedRawItems[index][field] = value;
    setRawItems(updatedRawItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Calculate the price based on the raw materials and end product quantity
    const totalPrice = calculatePrice(rawItems, productQuantity);

    // Register the end product in the database
    registerEndProduct(productName, productQuantity, rawItems, totalPrice);

    setProductName("");
    setProductQuantity("");
    setRawItems([]);
    setErrorMessage("");
    setSuccessMessage("End product registered successfully.");
  };

  const calculatePrice = (rawItems, quantity) => {
    // Replace this with your own logic to calculate the price based on the raw materials and end product quantity
    // Return the calculated price
  };

  const registerEndProduct = (
    productName,
    productQuantity,
    rawItems,
    totalPrice
  ) => {
    // Replace this with your own logic to register the end product in the database
    // You can use the provided parameters to store the end product details in the database
  };

  return (
    <div className="flex flex-col justify-items-center p-4 mb-20 ml-14 mr-2 overflow-x-hidden flex-grow">
      <h2 className="text-2xl font-bold mb-4">Register End Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="productName" className="text-lg font-semibold mb-2">
            Product Name:
          </label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="productQuantity"
            className="text-lg font-semibold mb-2">
            Product Quantity:
          </label>
          <input
            type="number"
            id="productQuantity"
            value={productQuantity}
            onChange={(e) => setProductQuantity(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2"
          />
        </div>
        {rawItems.map((rawItem, index) => (
          <div key={index} className="flex flex-col space-y-2">
            <label
              htmlFor={`rawItemName${index}`}
              className="text-lg font-semibold mb-2">
              Raw Item Name:
            </label>
            <input
              type="text"
              id={`rawItemName${index}`}
              value={rawItem.itemName}
              onChange={(e) =>
                handleRawItemChange(index, "itemName", e.target.value)
              }
              className="border border-gray-300 rounded-md px-4 py-2"
            />
            <label
              htmlFor={`rawItemQuantity${index}`}
              className="text-lg font-semibold mb-2">
              Raw Item Quantity:
            </label>
            <input
              type="number"
              id={`rawItemQuantity${index}`}
              value={rawItem.quantity}
              onChange={(e) =>
                handleRawItemChange(index, "quantity", e.target.value)
              }
              className="border border-gray-300 rounded-md px-4 py-2"
            />
            <button
              type="button"
              onClick={() => handleRemoveRawItem(index)}
              className="px-4 py-2 bg-red-500 text-white rounded-md">
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddRawItem}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Add Raw Item
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
          Register
        </button>
      </form>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
    </div>
  );
};

export default RegisterEndProductComponent;
