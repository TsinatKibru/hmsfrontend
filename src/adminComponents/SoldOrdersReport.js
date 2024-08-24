import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const SoldOrdersReport = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [soldDishes, setSoldDishes] = useState({});
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/orders/");
      const data = await response.json();
      setOrders(data);
      setIsLoading(false);
    } catch (error) {
      setError("Error fetching orders");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const calculateSoldDishesAndRevenue = () => {
    const dishes = {};
    let revenue = 0;

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (dishes.hasOwnProperty(item.name)) {
          dishes[item.name] += item.quantity;
        } else {
          dishes[item.name] = item.quantity;
        }
        revenue += parseFloat(order.total);
      });
    });

    setSoldDishes(dishes);
    setTotalRevenue(revenue);
  };
  useEffect(() => {
    calculateSoldDishesAndRevenue();
  }, [orders]);

  const sortedDishes = Object.entries(soldDishes).sort((a, b) => b[1] - a[1]);

  const handleFilter = () => {
    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.time).toISOString().split("T")[0];
      return orderDate >= startDate && orderDate <= endDate;
    });

    const dishes = {};
    let revenue = 0;

    filtered.forEach((order) => {
      order.items.forEach((item) => {
        if (dishes.hasOwnProperty(item.name)) {
          dishes[item.name] += item.quantity;
        } else {
          dishes[item.name] = item.quantity;
        }
        revenue += parseFloat(order.total);
      });
    });

    setSoldDishes(dishes);
    setTotalRevenue(revenue);
  };

  const ordersByMonth = {
    Jan: 0,
    Feb: 0,
    Mar: 0,
    Apr: 0,
    May: 0,
    Jun: 0,
    Jul: 0,
    Aug: 0,
    Sep: 0,
    Oct: 0,
    Nov: 0,
    Dec: 0,
  };

  const numordersByMonth = {
    Jan: 0,
    Feb: 0,
    Mar: 0,
    Apr: 0,
    May: 0,
    Jun: 0,
    Jul: 0,
    Aug: 0,
    Sep: 0,
    Oct: 0,
    Nov: 0,
    Dec: 0,
  };

  orders.forEach((order) => {
    const orderMonth = new Date(order.time).toLocaleString("en-us", {
      month: "short",
    });
    ordersByMonth[orderMonth] += parseFloat(order.total);
  });

  orders.forEach((order) => {
    const orderMonth = new Date(order.time).toLocaleString("en-us", {
      month: "short",
    });
    numordersByMonth[orderMonth] += parseFloat(1);
  });

  const chartData = {
    labels: Object.keys(ordersByMonth),
    datasets: [
      {
        label: "Revenue",
        data: Object.values(ordersByMonth),
        fill: false,
        borderColor: "green",
        tension: 0.4,
      },
    ],
  };

  const numchartData = {
    labels: Object.keys(ordersByMonth),
    datasets: [
      {
        label: "Revenue",
        data: Object.values(numordersByMonth),
        fill: false,
        borderColor: "green",
        tension: 0.4,
      },
    ],
  };

  // const filterOrdersForCurrentMonth = () => {
  //   const currentDate = new Date();
  //   const currentMonth = currentDate.getMonth() + 1; // JavaScript months are zero-based

  //   return orders.filter((order) => {
  //     const orderDate = new Date(order.time);
  //     return orderDate.getMonth() + 1 === currentMonth; // Filter orders for the current month
  //   });
  // };

  // const orders = filterOrdersForCurrentMonth();

  //better filter at the backend ,front would be troubled when data becomes big

  const ordersByDay = {};
  orders.forEach((order) => {
    const orderDate = new Date(order.time).toLocaleDateString();
    if (ordersByDay.hasOwnProperty(orderDate)) {
      ordersByDay[orderDate] += parseFloat(order.total);
    } else {
      ordersByDay[orderDate] = parseFloat(order.total);
    }
  });

  // Create an array of labels and data for the new chart
  const dailyRevenueChartData = {
    labels: Object.keys(ordersByDay),
    datasets: [
      {
        label: "Daily Revenue",
        data: Object.values(ordersByDay),
        fill: false,
        borderColor: "green", // Choose your preferred color
        tension: 0.4,
      },
    ],
  };

  const [showAllDishes, setShowAllDishes] = useState(false);

  // Adjust the number of displayed dishes based on 'showAllDishes' state
  const displayedDishes = showAllDishes
    ? sortedDishes
    : sortedDishes.slice(0, 3);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="w-screen px-4 pt-2  mx-auto  overflow-y-auto overflow-x-hidden">
      {/* First Row */}
      <div className="flex flex-col lg:flex-row justify-between mb-8 lg:mb-0 shadow-lg p-4 bg-white rounded-md">
        <div className="bg-thirtiary text-white p-6 rounded-md mb-4 lg:mb-0">
          <h2 className="text-xl lg:text- font-bold">Total Revenue</h2>
          <span className="text-xl lg:text-2xl font-bold">
            ${totalRevenue.toFixed(2)}
          </span>
        </div>
        <div className="bg-thirtiaryD text-white p-6 rounded-md">
          <h2 className="text-xl lg:text-2xl font-bold">Total Orders</h2>
          <span className="text-xl lg:text-2xl font-bold">{orders.length}</span>
        </div>
      </div>

      {/* Second Row */}
      {/* <div className="flex flex-col  lg:flex-row bg-gray-100 shadow-lg mb-4 p-2 rounded-md overflow-x-auto">
        {["Revenue Chart", "Orders Chart", "Daily Revenue Chart"].map(
          (title, index) => (
            <div
              key={index}
              className="flex-1 bg-white rounded-md shadow-md p-4 mb-4 lg:mb-0 lg:mr-2 hover:shadow-lg transition duration-300 ease-in-out">
              <h3 className="text-lg lg:text-xl font-semibold mb-2">{title}</h3>
              {index === 0 && <Line data={chartData} />}
              {index === 1 && <Line data={numchartData} />}
              {index === 2 && <Line data={dailyRevenueChartData} />}
            </div>
          )
        )}
      </div> */}
      <div className="flex flex-wrap mb-4 shadow-lg">
        {["Revenue Chart", "Orders Chart", "Daily Revenue Chart"].map(
          (title, index) => (
            <div
              key={index}
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 p-2">
              <div className="bg-white rounded-md shadow-md p-2 mb-4 hover:shadow-lg transition duration-300 ease-in-out">
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                {/* Render the graph component here */}
                {index === 0 && <Line data={chartData} />}
                {index === 1 && <Line data={numchartData} />}
                {index === 2 && <Line data={dailyRevenueChartData} />}
              </div>
            </div>
          )
        )}
      </div>

      {/* Third Row */}
      <div className="flex flex-col bg-gray-100 shadow-lg p-4 rounded-md">
        <div className="mt-4 mb-8 flex flex-col lg:flex-row items-center lg:space-x-4">
          <label className="text-lg mb-2 lg:mb-0">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 mb-2 lg:mb-0"
          />
          <label className="text-lg mb-2 lg:mb-0">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 mb-2 lg:mb-0"
          />
          <button
            onClick={handleFilter}
            className="bg-thirtiary text-white rounded px-4 py-2 hover:bg-thirtiaryD transition duration-300 ease-in-out">
            Filter
          </button>
        </div>

        {/* Fourth Row */}
        <div>
          <h3 className="text-lg lg:text-xl font-semibold mb-4">Dishes Sold</h3>
          <table className="table-auto w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Dish</th>
                <th className="border px-4 py-2">Quantity Sold</th>
              </tr>
            </thead>
            <tbody>
              {displayedDishes.map(([dish, quantity]) => (
                <tr key={dish}>
                  <td className="border px-4 py-2">{dish}</td>
                  <td className="border px-4 py-2">{quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Show All Button */}
        {!showAllDishes && sortedDishes.length > 3 && (
          <button
            onClick={() => setShowAllDishes(true)}
            className="bg-gray-200 text-thirtiary font-bold rounded px-4 py-2 mt-4 hover:bg-gray-100 transition duration-300 ease-in-out">
            See All
          </button>
        )}
        {showAllDishes && (
          <button
            onClick={() => setShowAllDishes(false)}
            className="bg-gray-200 text-thirtiary font-bold rounded px-4 py-2 mt-4 hover:bg-gray-100 transition duration-300 ease-in-out">
            Collapse
          </button>
        )}
      </div>
    </div>
  );
};

export default SoldOrdersReport;
