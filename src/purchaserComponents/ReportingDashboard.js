import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { Chart, CategoryScale } from "chart.js";
Chart.register(CategoryScale);

const ReportingDashboard = () => {
  // Dummy data for stock levels, inventory turnover, and sales
  const stockLevelsData = [
    { month: "Jan", stockLevel: 100 },
    { month: "Feb", stockLevel: 120 },
    { month: "Mar", stockLevel: 80 },
    { month: "Apr", stockLevel: 90 },
    { month: "May", stockLevel: 110 },
    { month: "Jun", stockLevel: 130 },
  ];

  const inventoryTurnoverData = [
    { month: "Jan", turnover: 5 },
    { month: "Feb", turnover: 4 },
    { month: "Mar", turnover: 6 },
    { month: "Apr", turnover: 5.5 },
    { month: "May", turnover: 4.8 },
    { month: "Jun", turnover: 5.2 },
  ];

  const salesData = [
    { month: "Jan", sales: 5000 },
    { month: "Feb", sales: 6000 },
    { month: "Mar", sales: 4500 },
    { month: "Apr", sales: 5500 },
    { month: "May", sales: 7000 },
    { month: "Jun", sales: 6500 },
  ];

  return (
    <div className="container mx-auto">
      <div className="flex flex-col justify-items-center p-4 mb-10 ml-14 overflow-x-hidden flex-grow">
        <h2>Reporting Dashboard</h2>
        <div className="flex-1 flex-col">
          <div className="flex flex-col md:flex-row">
            <div className="mb-4 md:mr-4">
              <h3>Stock Levels</h3>
              <BarChart
                width={500}
                height={300}
                data={stockLevelsData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="stockLevel" fill="#8884d8" />
              </BarChart>
            </div>

            <div className="mb-4 md:mr-4">
              <h3>Inventory Turnover</h3>
              <LineChart
                width={500}
                height={300}
                data={inventoryTurnoverData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="turnover" stroke="#82ca9d" />
              </LineChart>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="mb-4 md:mr-4">
              <h3>Sales</h3>
              <BarChart
                width={500}
                height={300}
                data={salesData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#ff7300" />
              </BarChart>
            </div>

            <div className="mb-4 md:mr-4">
              <h3>Stock Levels vs. Sales</h3>
              <LineChart
                width={500}
                height={300}
                data={stockLevelsData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="stockLevel" stroke="#8884d8" />
                <Line type="monotone" dataKey="sales" stroke="#ff7300" />
              </LineChart>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportingDashboard;
