import React, { useState, useEffect } from "react";
import axios from "axios";
import DishEdit from "./DishEdit";

const DishList = () => {
  const [dishes, setDishes] = useState([]);
  const [editingDishId, setEditingDishId] = useState(null);
  const [editingEdittable, setEditingEdittable] = useState(null);

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/dishes/");
      setDishes(response.data);
    } catch (error) {
      console.error("Error fetching dishes:", error);
    }
  };

  const handleEditClick = (dishId) => {
    const selectedDish = dishes.find((dish) => dish.id === dishId);
    setEditingDishId(dishId);
    setEditingEdittable(selectedDish);
  };

  const handleEditCancel = () => {
    setEditingDishId(null);
    setEditingEdittable(null);
    fetchDishes();
  };

  return (
    <div className="container mx-auto overflow-y-auto  ">
      <h2 className="text-3xl font-bold mb-6 text-center">Dish List</h2>
      <div className="flex flex-wrap m-5">
        {dishes.map((dish) => (
          <div
            key={dish.id}
            className="mb-8 p-6   border border-gray-300 rounded-lg">
            {editingDishId !== dish.id ? (
              <div className={` ${editingDishId !== null ? "blur" : ""}`}>
                <h3 className="text-xl font-bold mb-4">{dish.name}</h3>

                <div className="mb-4">
                  <p className="text-gray-700 mb-2">Cost: ${dish.cost}</p>
                  <p className="text-gray-700 mb-2">
                    Theoretical Quantity: {dish.theoretical_quantity}
                  </p>
                  <p className="text-gray-700 mb-2">
                    Error Margin: {dish.error_margin}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700 mb-2">Items:</p>
                  <ul className="list-disc pl-6 mb-2">
                    {dish.items.map((item) => (
                      <li key={item.item.id}>{item.item.name}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700 mb-2">Recipes:</p>
                  <ul className="list-disc pl-6 mb-2">
                    {dish.recipes.map((recipe) => (
                      <li key={recipe.recipe.id}>{recipe.recipe.name}</li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleEditClick(dish.id)}
                  className="bg-thirtiaryD text-white px-6 py-2 rounded-full hover:bg-thirtiary transition">
                  Edit
                </button>
              </div>
            ) : (
              <DishEdit
                className="z-10"
                edittable={editingEdittable}
                onCancel={handleEditCancel}
              />
            )}
            <hr className="mt-6" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DishList;
