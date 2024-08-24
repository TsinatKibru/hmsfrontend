import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const DishEdit = ({ edittable, onCancel }) => {
  const [availableIngredients, setAvailableIngredints] = useState([]);
  const [recipes, setRecipes] = useState([]);

  const [dish, setDish] = useState([
    {
      dishName: edittable.name,
      ingredients: edittable.items.map((item) => ({
        id: item.item.id,
        name: item.item.name,
        cost: item.item.cost,
        quantity: item.quantity,
        category: item.item.category,
        unit:
          item.item.category === "countable"
            ? "count"
            : item.item.category === "solid"
            ? "g"
            : "l",
      })),
      recipes: edittable.recipes.map((recipe) => ({
        id: recipe.recipe.id,
        name: recipe.recipe.name,
        cost: recipe.recipe.cost,
        quantity: recipe.quantity,
      })),
      cost: edittable.cost,
      totalprice: edittable.totalprice,
      theoreticalQuantity: 0,
      errormargin: 0,
      price: edittable.price,
    },
  ]);

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

  const handleInputChange = (index, field, value) => {
    const updatedDish = [...dish];
    updatedDish[index][field] = value;
    const price = parseFloat(updatedDish[index].price);
    const serviceCharge = price * 0.1; // 10% service charge
    const vat = (price + serviceCharge) * 0.15; // 15% VAT

    updatedDish[index]["totalprice"] = price + serviceCharge + vat;
    setDish(updatedDish);
  };

  const handleIngredientChange = (index, ingredientIndex, field, value) => {
    const i = availableIngredients.find(
      (ingredient) => ingredient.itemName === value
    );
    const id = i ? i.itemId : null;
    const category = i ? i.category : null;

    const updatedDish = [...dish];
    updatedDish[index].ingredients[ingredientIndex][field] = value;
    if (field === "name") {
      updatedDish[index].ingredients[ingredientIndex]["category"] = category;
      updatedDish[index].ingredients[ingredientIndex]["id"] = id;
    }

    updatedDish[index].cost = calculateDishCost(updatedDish[index]);
    // updatedDish[index].totalcost = calculateDishTotalCost(updatedDish[index]);
    updatedDish[index].theoreticalQuantity = calculateDishQuantity(
      updatedDish[index]
    );
    setDish(updatedDish);
  };

  const handleRecipeChange = (index, recipeIndex, field, value) => {
    const i = recipes.find((recipe) => recipe.name === value);
    const id = i ? i.id : null;

    const updatedDish = [...dish];
    updatedDish[index].recipes[recipeIndex][field] = value;
    if (field === "name") {
      updatedDish[index].recipes[recipeIndex]["id"] = id;
    }
    updatedDish[index].cost = calculateDishCost(updatedDish[index]);
    // updatedDish[index].totalcost = calculateDishTotalCost(updatedDish[index]);
    updatedDish[index].theoreticalQuantity = calculateDishQuantity(
      updatedDish[index]
    );
    setDish(updatedDish);
  };

  const handleAddIngredient = (index) => {
    const updatedDish = [...dish];
    updatedDish[index].ingredients.push({
      id: "",
      name: "",
      cost: 0,
      quantity: 0,
    });
    updatedDish[index].cost = calculateDishCost(updatedDish[index]);
    // updatedDish[index].totalcost = calculateDishTotalCost(updatedDish[index]);

    setDish(updatedDish);
  };

  const handleAddRecipe = (index) => {
    const updatedDish = [...dish];
    updatedDish[index].recipes.push({ id: "", name: "", cost: 0, quantity: 0 });
    updatedDish[index].cost = calculateDishCost(updatedDish[index]);
    // updatedDish[index].totalcost = calculateDishTotalCost(updatedDish[index]);
    setDish(updatedDish);
  };

  const calculateDishCost = (d) => {
    let totalCost = 0;
    d.ingredients.forEach((ingredient) => {
      const matchedIngredient = availableIngredients.find(
        (availableIngredient) =>
          availableIngredient.itemName === ingredient.name
      );
      if (matchedIngredient) {
        const quantityInBaseUnit = convertQuantityToBaseUnit(
          ingredient.quantity,
          ingredient.unit,
          ingredient.category
        );
        totalCost += matchedIngredient.costPerQuantity * quantityInBaseUnit;
      }
    });
    d.recipes.forEach((recipe) => {
      const matchedrecipe = recipes.find(
        (recipe) => recipe.name === recipe.name
      );
      if (matchedrecipe) {
        totalCost += matchedrecipe.cost * recipe.quantity;
      }
    });

    return totalCost.toFixed(2);
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

    const convertedQuantity = parseFloat(quantity) * conversionFactor;
    const approximatedQuantity = Math.round(convertedQuantity * 1000) / 1000;
    return approximatedQuantity.toFixed(3);
  }
  // const calculateDishTotalCost = (d) => {
  //   let totalCost = 0;

  //   d.ingredients.forEach((ingredient) => {
  //     const matchedIngredient = availableIngredients.find(
  //       (availableIngredient) =>
  //         availableIngredient.itemName === ingredient.name
  //     );
  //     if (matchedIngredient) {
  //       const quantityInBaseUnit = convertQuantityToBaseUnit(
  //         ingredient.quantity,
  //         ingredient.unit,
  //         ingredient.category
  //       );
  //       totalCost += matchedIngredient.costPerQuantity * quantityInBaseUnit;
  //     }
  //   });

  //   d.recipes.forEach((recipe) => {
  //     const matchedRecipe = recipes.find((r) => r.name === recipe.name);
  //     if (matchedRecipe) {
  //       totalCost += matchedRecipe.cost * recipe.quantity;
  //     }
  //   });

  //   // Add service charge of 10%
  //   const serviceCharge = totalCost * 0.1;
  //   totalCost += serviceCharge;

  //   // Add VAT of 15%
  //   const vat = totalCost * 0.15;
  //   totalCost += vat;

  //   return totalCost.toFixed(2);
  // };

  const calculateDishQuantity = (d) => {
    let totalQuantity = 0;
    d.ingredients.forEach((ingredient) => {
      totalQuantity += parseInt(ingredient.quantity);
    });
    d.recipes.forEach((recipe) => {
      totalQuantity += parseInt(recipe.quantity);
    });
    return totalQuantity;
  };

  const isIngredientsInDefaultState = (ingredients) => {
    if (ingredients.length !== 1) {
      return false;
    }

    const defaultIngredient = ingredients[0];

    return (
      defaultIngredient.id === "" &&
      defaultIngredient.name === "" &&
      defaultIngredient.cost === 0 &&
      defaultIngredient.quantity === 0 &&
      defaultIngredient.category === "" &&
      defaultIngredient.unit === ""
    );
  };

  // Helper function to check if recipes are in default state
  const isRecipesInDefaultState = (recipes) => {
    if (recipes.length !== 1) {
      return false;
    }

    const defaultRecipe = recipes[0];

    return (
      defaultRecipe.id === "" &&
      defaultRecipe.name === "" &&
      defaultRecipe.cost === 0 &&
      defaultRecipe.quantity === 0
    );
  };

  const handleSubmitDish = () => {
    dish.forEach((d) => {
      if (
        !d.dishName ||
        d.ingredients.length === 0 ||
        !d.cost ||
        !d.totalprice ||
        !d.price
      ) {
        window.alert("Please provide all required fields for each dish.");
        return;
      }

      if (!isIngredientsInDefaultState(d.ingredients)) {
        for (const ingredient of d.ingredients) {
          if (
            !ingredient.id ||
            !ingredient.name ||
            !ingredient.quantity ||
            !ingredient.category ||
            !ingredient.unit
          ) {
            window.alert(
              "Please provide all required fields for each ingredient."
            );
            return;
          }
        }
      }

      if (!isRecipesInDefaultState(d.recipes)) {
        if (
          isIngredientsInDefaultState(d.ingredients) &&
          isRecipesInDefaultState(d.recipes)
        ) {
          window.alert("Please provide either ingredients or recipes.");
          return;
        }

        for (const recipe of d.recipes) {
          if (!recipe.id || !recipe.name || !recipe.quantity) {
            window.alert("Please provide all required fields for each recipe.");
            return;
          }
        }
      }
      for (const ingredient of d.ingredients) {
        ingredient.quantity = convertQuantityToBaseUnit(
          ingredient.quantity,
          ingredient.unit,
          ingredient.category
        );
      }

      console.log(
        "get",
        JSON.stringify({
          name: d.dishName,
          items: d.ingredients,
          recipes: d.recipes,
          theoretical_quantity: d.theoreticalQuantity,
          cost: Number(d.cost).toFixed(2),
          totalprice: Number(d.totalprice).toFixed(2),
          error_margin: d.errormargin,
          price: Number(d.price).toFixed(2),
        })
      );

      fetch(`https://hmsbackend-gamma.vercel.app/api/dishes/${edittable.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: d.dishName,
          items: d.ingredients,
          recipes: d.recipes,
          theoretical_quantity: d.theoreticalQuantity,
          cost: Number(d.cost).toFixed(2),
          totalprice: Number(d.totalprice).toFixed(2),
          error_margin: d.errormargin,
          price: Number(d.price).toFixed(2),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the response data
          console.log("New dish added:", data);

          onCancel();
        })
        .catch((error) => {
          // Handle the error
          console.error("Error adding new recipe:", error);
        });
    });
  };

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const itemsData = await fetch(
          `https://hmsbackend-gamma.vercel.app/api/items/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (itemsData.ok) {
          const items = await itemsData.json();
          const ingredients = items.map((itemData) => ({
            itemId: itemData.id,
            itemName: itemData.name,
            availableQuantity: itemData.quantity,
            costPerQuantity: itemData.price,
            category: itemData.category,
          }));
          setAvailableIngredints(ingredients);
          console.log("Items fetched successfully");
        } else {
          console.error("Failed to fetch items:", itemsData.status);
          // Handle the error accordingly
        }
      } catch (error) {
        console.error("Error fetching items:", error);
        // Handle the error accordingly
      }
    };

    const fetchRecipes = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/recipes/");
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
    fetchIngredients();
  }, []);

  const handleRemoveIngredient = (dishIndex, ingredientIndex) => {
    const updatedDish = [...dish];
    updatedDish[dishIndex].ingredients.splice(ingredientIndex, 1); // Remove the ingredient at the specified index
    updatedDish[dishIndex].cost = calculateDishCost(updatedDish[dishIndex]);

    setDish(updatedDish);
  };

  const handleRemoveRecipe = (dishIndex, recipeIndex) => {
    const updatedDish = [...dish];
    updatedDish[dishIndex].recipes.splice(recipeIndex, 1); // Remove the ingredient at the specified index
    updatedDish[dishIndex].cost = calculateDishCost(updatedDish[dishIndex]);

    setDish(updatedDish);
  };

  const handleRemoveDish = (index) => {
    const updatedDish = [...dish];
    updatedDish.splice(index, 1);
    setDish(updatedDish);
  };

  return (
    <div className="flex justify-center ">
      <div className="flex flex-col left-20 right-20 inset-0 top-52 pt-16 justify-items-center fixed z-10 bg-gray-100 w-4/5  shadow-thirtiaryD shadow-inner h-1/2 p-4 mb-20 ml-14 mr-2 overflow-x-hidden flex-grow">
        <div className="overflow-x-auto">
          <table className="w-full overflow-x-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2">Dish Name</th>
                <th className="px-4 py-2">Ingredients</th>
                <th className="px-4 py-2">Recipes</th>
                <th className="px-4 py-2">Cost</th>

                {/* <th className="px-4 py-2">Theoretical Quantity</th>
              <th className="px-4 py-2">Error Margin</th> */}
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">AfterTax</th>
              </tr>
            </thead>
            <tbody>
              {dish.map((d, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border-r-2 border-l-2  border-b-2">
                    <input
                      type="text"
                      value={d.dishName}
                      onChange={(e) =>
                        handleInputChange(index, "dishName", e.target.value)
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-4 py-2 border-r-2 border-b-2">
                    <ul>
                      {d.ingredients.map((ingredient, ingredientIndex) => (
                        <li
                          key={ingredientIndex}
                          className="flex items-center mb-2">
                          <select
                            value={ingredient.name}
                            onChange={(e) =>
                              handleIngredientChange(
                                index,
                                ingredientIndex,
                                "name",
                                e.target.value
                              )
                            }
                            className="w-1/2 px-2 py-1 mr-2 border border-gray-300 rounded">
                            <option value="">Select Ingredient</option>
                            {availableIngredients.map(
                              (availableIngredient, i) => (
                                <option
                                  key={i}
                                  value={availableIngredient.itemName}>
                                  {availableIngredient.itemName}
                                </option>
                              )
                            )}
                          </select>
                          <input
                            type="number"
                            value={ingredient.quantity}
                            onChange={(e) =>
                              handleIngredientChange(
                                index,
                                ingredientIndex,
                                "quantity",
                                e.target.value
                              )
                            }
                            className="w-1/4 px-2 py-1 mr-2 border border-gray-300 rounded"
                          />

                          {ingredient.category === "solid" && (
                            <select
                              value={ingredient.unit}
                              onChange={(e) =>
                                handleIngredientChange(
                                  index,
                                  ingredientIndex,
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
                          {ingredient.category === "liquid" && (
                            <select
                              value={ingredient.unit}
                              onChange={(e) =>
                                handleIngredientChange(
                                  index,
                                  ingredientIndex,
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
                          {ingredient.category === "countable" && (
                            <select
                              value={ingredient.unit}
                              onChange={(e) =>
                                handleIngredientChange(
                                  index,
                                  ingredientIndex,
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
                          <button
                            onClick={() =>
                              handleRemoveIngredient(index, ingredientIndex)
                            }
                            className="group m-3 text-gray-700 hover:text-red-600 flex items-center transition-colors duration-300">
                            <FontAwesomeIcon icon={faTrash} className="mr-2" />
                          </button>
                        </li>
                      ))}
                      <li>
                        <button
                          onClick={() => handleAddIngredient(index)}
                          className="px-2 py-1 text-white bg-thirtiary rounded-lg shadow-md hover:bg-green-600">
                          Add Ingredient
                        </button>
                      </li>
                    </ul>
                  </td>
                  <td className="px-4 py-2 border-r-2 border-b-2">
                    <ul>
                      {d.recipes.map((recipe, recipeIndex) => (
                        <li
                          key={recipeIndex}
                          className="flex items-center mb-2">
                          <select
                            value={recipe.name}
                            onChange={(e) =>
                              handleRecipeChange(
                                index,
                                recipeIndex,
                                "name",
                                e.target.value
                              )
                            }
                            className="w-1/2 px-2 py-1 mr-2 border border-gray-300 rounded">
                            <option value="">Select Recipe</option>
                            {recipes.map((recipe, i) => (
                              <option key={i} value={recipe.name}>
                                {recipe.name}
                              </option>
                            ))}
                          </select>
                          <input
                            type="number"
                            value={recipe.quantity}
                            onChange={(e) =>
                              handleRecipeChange(
                                index,
                                recipeIndex,
                                "quantity",
                                e.target.value
                              )
                            }
                            className="w-1/4 px-2 py-1 mr-2 border border-gray-300 rounded"
                          />
                          <label>{recipe.quantity} kg</label>
                          <button
                            onClick={() =>
                              handleRemoveRecipe(index, recipeIndex)
                            }
                            className="group m-3 text-gray-700 hover:text-red-600 flex items-center transition-colors duration-300">
                            <FontAwesomeIcon icon={faTrash} className="mr-2" />
                          </button>
                        </li>
                      ))}

                      <li>
                        <button
                          onClick={() => handleAddRecipe(index)}
                          className="px-2 py-1 text-white bg-thirtiary rounded-lg shadow-md hover:bg-green-600">
                          Add Recipe
                        </button>
                      </li>
                    </ul>
                  </td>
                  <td className="px-4 py-2 border-r-2 border-b-2">
                    {calculateDishCost(d)}
                  </td>

                  {/* <td className="px-4 py-2 border-r-2 border-b-2">
                  {calculateDishQuantity(d)} kg
                </td>
                <td className="px-4 py-2 border-r-2 border-b-2">
                  <input
                    type="text"
                    value={d.errormargin}
                    onChange={(e) =>
                      handleInputChange(index, "errormargin", e.target.value)
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                    placeholder="Enter percentage"
                  />
                </td> */}
                  <td className="px-4 py-2 border-r-2 border-b-2">
                    <input
                      type="text"
                      value={d.price}
                      onChange={(e) =>
                        handleInputChange(index, "price", e.target.value)
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded"
                      placeholder="Enter Price"
                    />
                  </td>
                  <td className="px-4 py-2 border-r-2 border-b-2">
                    {d.totalprice}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleRemoveDish(index)}
                      className="group text-gray-700 hover:text-red-600 flex items-center transition-colors duration-300">
                      <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Remove Dish
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between">
          <button
            onClick={handleSubmitDish}
            type="submit"
            className="bg-thirtiary mt-4  rounded-lg text-white hover:text-NeonBlue shadow-md px-4 py-2 ">
            Submit
          </button>
          <button
            className="bg-gray-300 mt-4 hover:bg-gray-400 text-gray-800 shadow-md px-4 py-2"
            onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DishEdit;
