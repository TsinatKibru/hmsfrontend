import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaFilter, FaCalendar } from "react-icons/fa"; // Import icons from a library like react-icons

const PurchaseHistoryList = () => {
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [cost, setCost] = useState(0);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedDate2, setSelectedDate2] = useState(
    new Date().toISOString().split("T")[0]
  );

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchPurchaseHistory(selectedDate);
  }, []);

  const fetchPurchaseHistory = async (date) => {
    try {
      const response = await axios.get(
        `https://hmsbackend-gamma.vercel.app/api/purchaselist/?date=${date}`,
        { headers }
      );

      setPurchaseHistory(response.data);
      const totalCost = response.data.reduce((accumulator, purchase) => {
        const purchaseCost =
          Number(purchase.item.price) * Number(purchase.item.quantity);
        return accumulator + purchaseCost;
      }, 0);

      setCost(totalCost);
    } catch (error) {
      console.error("Error fetching purchase history:", error);
    }
  };

  const isWithinRange = (date, startDate, endDate) => {
    const currentDate = new Date(formatPurchaseTime(date));
    const start = new Date(formatPurchaseTime(startDate));
    const end = new Date(formatPurchaseTime(endDate));

    return start <= currentDate && currentDate <= end;
  };

  useEffect(() => {
    const filteredData = statusFilter
      ? purchaseHistory.filter((purchase) => purchase.status === statusFilter)
      : selectedDate && selectedDate2
      ? purchaseHistory.filter((purchase) =>
          isWithinRange(
            formatPurchaseTime(purchase.purchase_date),
            selectedDate,
            selectedDate2
          )
        )
      : purchaseHistory;

    const searchData = filteredData.filter((purchase) =>
      purchase.item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredHistory(searchData);
    const totalCost = searchData.reduce((accumulator, purchase) => {
      const purchaseCost =
        Number(purchase.item.price) * Number(purchase.item.quantity);
      return accumulator + purchaseCost;
    }, 0);

    setCost(totalCost);
  }, [purchaseHistory, statusFilter, searchQuery, selectedDate, selectedDate2]);
  const formatPurchaseTime = (purchaseTime) => {
    const date = new Date(purchaseTime);
    return date.toLocaleDateString();
  };

  console.log(selectedDate, "1");
  console.log(formatPurchaseTime(selectedDate));
  const [showDateRangeFilter, setShowDateRangeFilter] = useState(false);
  const handleToggleFilter = () => {
    setShowDateRangeFilter(!showDateRangeFilter);
  };
  return (
    <div className="container mx-auto w-screen overflow-y-auto ">
      <div className="p-6 ">
        <h2 className="text-2xl font-bold mb-4">Purchase History List</h2>
        <div className="flex space-x-4 mb-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-40 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by item name..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex mt-4 gap-2 ">
            <div className="flex  items-center">
              <span className="py-2 mr-2">
                <FaCalendar />
              </span>
              <span className="py-2">From</span>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-40 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center mt-2">
              <span className="py-2 mr-2">
                <FaCalendar />
              </span>
              <span className="py-2">To</span>
            </div>
            <input
              type="date"
              value={selectedDate2}
              onChange={(e) => setSelectedDate2(e.target.value)}
              className="w-40 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Purchase Time
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHistory.map((purchase) => (
                <tr key={purchase.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatPurchaseTime(purchase.purchase_date)}
                  </td>
                  <td className="px-6 py-4">{purchase.item.name}</td>
                  <td className="px-6 py-4">{purchase.item.quantity}</td>
                  <td className="px-6 py-4">{purchase.item.price}</td>
                  <td className="px-6 py-4">{purchase.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <span className="block mt-4 px-6 py-3 text-left text-lg font-semibold bg-gray-200 text-gray-800">
            Total Cost: {cost}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistoryList;
