import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import RecipeEdit from "./RecipeEdit"; // Make sure to adjust the import path

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [editingRecipe, setEditingRecipe] = useState(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/recipes/");
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const handleCardClick = (recipe) => {
    setEditingRecipe(recipe);
    // Optionally, you can open the edit modal here or navigate to a separate edit page
  };

  const handleEditCancel = () => {
    setEditingRecipe(null);
    fetchRecipes();
  };

  return (
    <div className="container mx-auto overflow-y-auto">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Recipe List</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {recipes !== undefined &&
          recipes !== null &&
          recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-lg shadow-thirtiary shadow-md p-4 cursor-pointer"
              onClick={() => handleCardClick(recipe)}>
              <h4 className="text-lg font-semibold mb-2">{recipe.name}</h4>
              <p>Error Margin: {recipe.error_margin}</p>
              <p>Cost: {recipe.cost}</p>
              <p>Theoretical Quantity: {recipe.theoretical_quantity}</p>
              <h5 className="text-md font-semibold mt-4">Ingredients:</h5>
              <ul>
                {recipe.items.map((i) => (
                  <li key={i.item.name}>
                    <span>{i.item.name}</span> - Used Quantity:{" "}
                    {i.used_quantity}
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>

      {/* Edit Recipe Modal/Component */}
      {editingRecipe && (
        <RecipeEdit editrecipe={editingRecipe} onCancel={handleEditCancel} />
      )}
    </div>
  );
};

export default RecipeList;
