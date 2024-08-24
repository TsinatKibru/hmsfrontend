import { useState, useEffect } from "react";

const DailyMenuList = () => {
  const [dailyMenus, setDailyMenus] = useState([]);
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    fetchDailyMenus();
  }, []);

  const fetchDailyMenus = async () => {
    try {
      const response = await fetch(
        "https://hmsbackend-gamma.vercel.app/api/daily-menulist"
      );
      const data = await response.json();

      // Filter menus by current date
      const currentDate = new Date().toISOString().split("T")[0];
      const filtered = data.filter((menu) => menu.date === currentDate);

      setDailyMenus(filtered);
      setFilteredMenus(filtered);
    } catch (error) {
      console.log("Error fetching daily menus:", error);
    }
  };

  const handleFilterByDate = (e) => {
    const selectedDate = e.target.value;
    setSelectedDate(selectedDate);

    if (selectedDate) {
      const filtered = dailyMenus.filter((menu) => menu.date === selectedDate);
      setFilteredMenus(filtered);
    } else {
      setFilteredMenus(dailyMenus);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Daily Menu List</h1>
      <div className="flex items-center mb-4">
        <label htmlFor="dateFilter" className="text-lg mr-2">
          Filter by Date:
        </label>
        <input
          type="date"
          id="dateFilter"
          value={selectedDate}
          onChange={handleFilterByDate}
          className="border border-gray-300 px-3 py-2 rounded-md"
        />
      </div>
      <div>
        {filteredMenus.map((menu) => (
          <div
            key={menu.id}
            className="border border-gray-300 p-4 mb-8 rounded-lg">
            <h2 className="text-xl font-bold mb-4">{menu.menu_type}</h2>
            <p className="text-sm mb-2">Description: {menu.description}</p>
            <p className="text-sm mb-2">Date: {menu.date}</p>
            <h3 className="text-lg font-semibold mb-2">Dishes:</h3>
            <ul>
              {menu.dishes.map((dish) => (
                <li key={dish.id} className="mb-4">
                  <h4 className="text-lg font-bold mb-2">{dish.name}</h4>
                  <p className="text-sm mb-2">Cost: {dish.cost}</p>
                  <p className="text-sm mb-2">
                    Theoretical Quantity: {dish.theoretical_quantity}
                  </p>
                  <p className="text-sm mb-2">Price: {dish.price}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyMenuList;
