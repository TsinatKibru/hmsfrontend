import React, { useState, useEffect } from "react";

const EditAndSubmitEndProductComponent = () => {
  const [endProducts, setEndProducts] = useState([]);
  const [editedEndProducts, setEditedEndProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchEndProductsFromDatabase = async () => {
      // Replace this with your own logic to fetch the registered end products from the database
      // Store the fetched end products in the state variable
      const fetchedEndProducts = [
        {
          id: 1,
          name: "End Product 1",
          quantity: 10,
          rawMaterials: [
            { name: "Raw Material 1", quantity: 5 },
            { name: "Raw Material 2", quantity: 3 },
          ],
        },
        {
          id: 2,
          name: "End Product 2",
          quantity: 5,
          rawMaterials: [
            { name: "Raw Material 3", quantity: 2 },
            { name: "Raw Material 4", quantity: 4 },
          ],
        },
        {
          id: 3,
          name: "End Product 3",
          quantity: 2,
          rawMaterials: [
            { name: "Raw Material 5", quantity: 1 },
            { name: "Raw Material 6", quantity: 2 },
          ],
        },
      ];
      setEndProducts(fetchedEndProducts);
      setEditedEndProducts(
        fetchedEndProducts.map((endProduct) => ({ ...endProduct }))
      );
    };

    fetchEndProductsFromDatabase();
  }, []);

  const handleEndProductChange = (index, field, value, rawMaterialIndex) => {
    const updatedEndProducts = [...editedEndProducts];
    if (field === "rawMaterials") {
      const updatedRawMaterials = [...updatedEndProducts[index].rawMaterials];
      updatedRawMaterials[rawMaterialIndex] = {
        ...updatedRawMaterials[rawMaterialIndex],
        ...value,
      };
      updatedEndProducts[index].rawMaterials = updatedRawMaterials;
    } else {
      updatedEndProducts[index][field] = value;
    }
    setEditedEndProducts(updatedEndProducts);
  };
  const handleAddRawMaterial = (index) => {
    const updatedEndProducts = [...editedEndProducts];
    const newRawMaterial = { name: "", quantity: 0 };
    updatedEndProducts[index].rawMaterials.push(newRawMaterial);
    setEditedEndProducts(updatedEndProducts);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Update the end products in the database
    updateEndProductsInDatabase();

    setSuccessMessage("End products updated successfully.");
  };

  const updateEndProductsInDatabase = () => {
    // Replace this with your own logic to update the end products in the database
    // You can use the editedEndProducts state variable to get the updated end product details
    console.log("Updated end products:", editedEndProducts);
  };

  return (
    <div className="flex flex-col justify-items-center p-4 mb-20 ml-14 mr-2 overflow-x-hidden flex-grow">
      <h2 className="text-3xl font-bold mb-8">Edit and Submit End Products</h2>
      {endProducts.length > 0 ? (
        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
          <table className="col-span-2 border border-collapse border-gray-300 rounded-lg">
            <thead>
              <tr className="border-b">
                <th className="p-2">End Product Name</th>
                <th className="p-2">End Product Quantity</th>
                <th className="p-2">Raw Materials</th>
              </tr>
            </thead>
            <tbody>
              {editedEndProducts.map((endProduct, index) => (
                <tr key={endProduct.id} className="border-b">
                  <td className="p-2">
                    <input
                      type="text"
                      name={`name-${index}`}
                      value={endProduct.name}
                      onChange={(e) =>
                        handleEndProductChange(index, "name", e.target.value)
                      }
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full bg-gray-100 hover:bg-gray-200"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      name={`quantity-${index}`}
                      value={endProduct.quantity}
                      onChange={(e) =>
                        handleEndProductChange(
                          index,
                          "quantity",
                          e.target.value
                        )
                      }
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full bg-gray-100 hover:bg-gray-200"
                    />
                  </td>
                  <td className="p-2">
                    {endProduct.rawMaterials.map(
                      (rawMaterial, rawMaterialIndex) => (
                        <div
                          key={rawMaterialIndex}
                          className="flex items-center space-x-2 mb-2">
                          <input
                            type="text"
                            name={`rawMaterialName-${index}-${rawMaterialIndex}`}
                            value={rawMaterial.name}
                            onChange={(e) =>
                              handleEndProductChange(
                                index,
                                "rawMaterials",
                                {
                                  name: e.target.value,
                                  quantity: rawMaterial.quantity,
                                },
                                rawMaterialIndex
                              )
                            }
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full bg-gray-100 hover:bg-gray-200"
                          />
                          <input
                            type="number"
                            name={`rawMaterialQuantity-${index}-${rawMaterialIndex}`}
                            value={rawMaterial.quantity}
                            onChange={(e) =>
                              handleEndProductChange(
                                index,
                                "rawMaterials",
                                {
                                  name: rawMaterial.name,
                                  quantity: e.target.value,
                                },
                                rawMaterialIndex
                              )
                            }
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full bg-gray-100 hover:bg-gray-200"
                          />
                        </div>
                      )
                    )}
                    <button
                      type="button"
                      onClick={() => handleAddRawMaterial(index)}
                      className="text-thirtiary underline text-sm mt-1">
                      Add Raw Material
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="col-span-1 space-y-4">
            <button
              type="submit"
              className="bg-thirtiary text-white px-4 py-2 rounded-md">
              Submit
            </button>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {successMessage && (
              <p className="text-green-500">{successMessage}</p>
            )}
          </div>
        </form>
      ) : (
        <p>Loading end products...</p>
      )}
    </div>
  );
};

export default EditAndSubmitEndProductComponent;
