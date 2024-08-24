import { Grid } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Card } from "@material-ui/core";
import { Paper } from "@material-ui/core";
import Font, { Text } from "react-font";

const MenuForm = () => {
  const [selectedMenuType, setSelectedMenuType] = useState("breakfast");
  const [menuItems, setMenuItems] = useState([]);
  const [selectedDish, setSelectedDish] = useState(null);
  const [description, setDescription] = useState("");
  const [isMenuItemAdded, setIsMenuItemAdded] = useState(false);
  const [dishes, setDishes] = useState([]);

  const fetchDishes = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/dishes/");
      const data = await response.json();
      setDishes(data);
    } catch (error) {
      console.error("Error fetching dishes:", error);
    }
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  const handleMenuTypeChange = (event) => {
    setSelectedMenuType(event.target.value);
    setSelectedDish(null);
    setDescription("");
  };

  const handleDishChange = (event) => {
    const selectedDishname = event.target.value;
    const selectedDish = dishes.find((dish) => dish.name === selectedDishname);
    setSelectedDish(selectedDish || null);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleAddMenuItem = () => {
    const menuType = selectedMenuType;
    const existingMenu = menuItems.find((item) => item.menu_type === menuType);

    if (existingMenu !== undefined) {
      console.log("x");
      existingMenu.dishes.push(selectedDish.id);
      setMenuItems((prevMenuItems) => [...prevMenuItems]);
      setSelectedDish(null);
      setDescription("");
      setIsMenuItemAdded(true);
    } else {
      const menuItem = {
        dishes: [selectedDish.id],
        menu_type: menuType,
        description,
        date: new Date().toISOString().split("T")[0],
      };
      setMenuItems((prevMenuItems) => [...prevMenuItems, menuItem]);
      setSelectedDish(null);
      setDescription("");
      setIsMenuItemAdded(true);
    }
  };

  const handleSubmitMenu = () => {
    menuItems.forEach((menu) => {
      fetch("http://localhost:8000/api/daily-menus/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dishes: menu.dishes,
          menu_type: menu.menu_type,
          description: menu.description,
          date: menu.date,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the response data
          console.log("New menu added:", data);
        })
        .catch((error) => {
          // Handle the error
          console.error("Error adding new menu:", error);
        });
    });
  };

  useEffect(() => {
    console.log(menuItems);
  }, [menuItems]);

  return (
    <div className="flex flex-col justify-items-center p-4 mb-20 ml-14 mr-2 overflow-x-hidden flex-grow">
      <div className="flex flex-row justify-between">
        <h2 className="text-3xl font-bold mb-4">Create Menu</h2>
        <button
          onClick={handleSubmitMenu}
          type="submit"
          className="bg-thirtiary mt-4 w-24 rounded-lg  text-white hover:text-NeonBlue shadow-md px-4 py-2">
          Submit
        </button>
      </div>
      <div className="mb-4">
        <label htmlFor="menuType" className="font-bold block mb-2">
          Menu Type:
        </label>
        <select
          id="menuType"
          value={selectedMenuType}
          onChange={handleMenuTypeChange}
          className="border border-gray-300 px-3 py-2 rounded-md w-full">
          <option value="breakfast">Breakfast</option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="dish" className="font-bold block mb-2">
          Dish:
        </label>
        <select
          id="dish"
          value={selectedDish?.name || ""}
          onChange={handleDishChange}
          className="border border-gray-300 px-3 py-2 rounded-md w-full">
          <option value="">Select a dish</option>
          {dishes.map((dish) => (
            <option key={dish.name} value={dish.name}>
              {dish.name}
            </option>
          ))}
        </select>
      </div>
      {selectedDish && (
        <div className="mb-4">
          <p className="font-bold">Price: ${selectedDish.price}</p>
        </div>
      )}
      <div className="mb-4">
        <label htmlFor="description" className="font-bold block mb-2">
          Description:
        </label>
        <textarea
          id="description"
          value={description}
          onChange={handleDescriptionChange}
          className="border border-gray-300 px-3 py-2 rounded-md w-full"></textarea>
      </div>
      <button
        onClick={handleAddMenuItem}
        className="bg-thirtiary text-white px-4 py-2 rounded-md hover:bg-thirtiaryD">
        Add Menu Item
      </button>
      <div className="grid sm:grid-cols-3 lg:grid-cols-3 gap-4 mt-6 md:grid-cols-2">
        {menuItems.map((menuItem, index) => (
          <div key={index}>
            <Font family="Courier">
              <h3 className="text-xl font-bold">{menuItem.menu_type} Menu:</h3>
            </Font>
            <ul>
              <Card className="mb-4">
                <Paper className="p-4">
                  {menuItem.dishes.map((dishId) => {
                    const dish = dishes.find((item) => item.id === dishId);
                    return dish ? <p key={dish.id}>Dish: {dish.name}</p> : null;
                  })}
                  <p>Description: {menuItem.description}</p>
                  <p>Date: {menuItem.date}</p>
                </Paper>
              </Card>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuForm;
