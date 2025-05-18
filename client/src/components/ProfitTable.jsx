import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { saveAs } from "file-saver";
import Papa from "papaparse";

// Base agriculture-themed colors
const BASE_COLORS = [
  "#4E8C3A", // Green
  "#6B8E23", // Olive
  "#8FBC8F", // Dark Sea Green
  "#556B2F", // Dark Olive Green
  "#7CFC00", // Lawn Green
  "#228B22", // Forest Green
  "#9ACD32", // Yellow Green
  "#6B8E23", // Olive Drab
];

// Function to generate shades for unlimited entries
const generateColors = (count) => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    // Use base colors and then generate variations
    const baseColor = BASE_COLORS[i % BASE_COLORS.length];
    const variation = Math.floor(i / BASE_COLORS.length) * 30;
    colors.push(lightenDarkenColor(baseColor, variation));
  }
  return colors;
};

// Helper function to lighten/darken colors
const lightenDarkenColor = (col, amt) => {
  let usePound = false;
  if (col[0] === "#") {
    col = col.slice(1);
    usePound = true;
  }
  const num = parseInt(col, 16);
  let r = (num >> 16) + amt;
  if (r > 255) r = 255;
  else if (r < 0) r = 0;
  let b = ((num >> 8) & 0x00ff) + amt;
  if (b > 255) b = 255;
  else if (b < 0) b = 0;
  let g = (num & 0x0000ff) + amt;
  if (g > 255) g = 255;
  else if (g < 0) g = 0;
  return (
    (usePound ? "#" : "") +
    (g | (b << 8) | (r << 16)).toString(16).padStart(6, "0")
  );
};

const ProfitTable = ({ user }) => {
  const [productProfits, setProductProfits] = useState([]);
  const [summary, setSummary] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfitData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `http://localhost:3000/users/email/${user.email}`
        );
        const profits = res.data.sales;

        const productDetails = await Promise.all(
          profits.map(async (entry) => {
            const productRes = await axios.get(
              `http://localhost:3000/products/${entry.productId}`
            );
            return {
              ...entry,
              category: productRes.data.category,
              productName: productRes.data.productname,
              price: productRes.data.price,
              description: productRes.data.description,
              quantity: entry.quantity,
            };
          })
        );

        const categoryMap = {};
        const productMap = {};

        for (let item of productDetails) {
          const { category, productName, totalProfit } = item;

          if (!categoryMap[category]) {
            categoryMap[category] = { revenue: 0 };
          }
          categoryMap[category].revenue += totalProfit;

          if (!productMap[productName]) {
            productMap[productName] = {
              revenue: 0,
              category,
            };
          }
          productMap[productName].revenue += totalProfit;
        }

        const summarizedData = Object.entries(categoryMap)
          .map(([category, { revenue }]) => ({
            category,
            revenue,
          }))
          .sort((a, b) => b.revenue - a.revenue);

        const productTableData = Object.entries(productMap)
          .map(([productName, { revenue, category }]) => ({
            productName,
            category,
            revenue,
          }))
          .sort((a, b) => b.revenue - a.revenue);

        setSummary(summarizedData);
        setProductProfits(productTableData);
      } catch (error) {
        console.error("Error fetching profit data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfitData();
  }, [user.email]);

  const exportCSV = (data, filename) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, filename);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-bold">{label}</p>
          <p className="text-green-700">₹{payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  const renderBarChart = (data, dataKey, nameKey, color) => {
    const colors = generateColors(data.length);

    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          layout="horizontal"
          margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <YAxis type="number" />
          <XAxis
            dataKey={dataKey}
            type="category"
            width={120}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="revenue"
            name="Revenue"
            fill={color}
            radius={[0, 4, 4, 0]}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderPieChart = (data, dataKey, nameKey, title) => {
    const colors = generateColors(data.length);
    const displayedData = data.slice(0, 8); // Show top 8 for readability

    return (
      <div className="w-full h-full flex flex-col items-center">
        <h4 className="text-md font-semibold mb-2">{title}</h4>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={displayedData}
              dataKey="revenue"
              nameKey={nameKey}
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ [nameKey]: name, percent }) =>
                `${name.slice(0, 12)}${name.length > 12 ? "..." : ""}: ${(
                  percent * 100
                ).toFixed(0)}%`
              }
              labelLine={false}
            >
              {displayedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]}
              itemStyle={{ color: "#4E8C3A" }}
            />
            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              wrapperStyle={{ paddingLeft: "20px" }}
              formatter={(value) =>
                value.slice(0, 15) + (value.length > 15 ? "..." : "")
              }
            />
          </PieChart>
        </ResponsiveContainer>
        {data.length > 8 && (
          <p className="text-sm text-gray-500 mt-2">
            Showing top 8 of {data.length} entries
          </p>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 w-full max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-green-800">
        Sales Analytics Dashboard
      </h2>

      <Tabs defaultValue="tables" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-green-100">
          <TabsTrigger value="tables" className="text-green-800">
            Detailed Tables
          </TabsTrigger>
          <TabsTrigger value="charts" className="text-green-800">
            Visualization Charts
          </TabsTrigger>
        </TabsList>

        {/* Charts Tab Content */}
        <TabsContent value="charts" className="mt-4">
          <div className="w-full">
            <Tabs defaultValue="category" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-green-100">
                <TabsTrigger value="category" className="text-green-800">
                  Category Analysis
                </TabsTrigger>
                <TabsTrigger value="product" className="text-green-800">
                  Product Analysis
                </TabsTrigger>
              </TabsList>

              {/* Category Analysis */}
              <TabsContent value="category" className="mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                  <div className="bg-white p-4 rounded-lg shadow w-full">
                    {renderBarChart(summary, "category", "category", "#4E8C3A")}
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow w-full">
                    {renderPieChart(
                      summary,
                      "revenue",
                      "category",
                      "Category Revenue Distribution"
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Product Analysis */}
              <TabsContent value="product" className="mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                  <div className="bg-white p-4 rounded-lg shadow w-full">
                    {renderBarChart(
                      productProfits.slice(0, 15), // Show top 15 products
                      "productName",
                      "productName",
                      "#6B8E23"
                    )}
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow w-full">
                    {renderPieChart(
                      productProfits,
                      "revenue",
                      "productName",
                      "Product Revenue Distribution"
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>

        {/* Tables Tab Content */}
        <TabsContent value="tables">
          
          <div className="mt-4 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
              {/* Category-wise Revenue Table */}
              <div className="bg-white p-4 rounded-lg shadow flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-green-700">
                    Category-wise Revenue
                  </h3>
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                    onClick={() =>
                      exportCSV(summary, "category-wise-revenue.csv")
                    }
                  >
                    Export CSV
                  </button>
                </div>
                <div className="overflow-x-auto flex-1">
                  <table className="min-w-full border border-green-200 h-full">
                    <thead className="bg-green-100">
                      <tr>
                        <th className="px-4 py-2 border border-green-300 text-left">
                          Category
                        </th>
                        <th className="px-4 py-2 border border-green-300 text-right">
                          Revenue (₹)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.map((row, idx) => (
                        <tr
                          key={idx}
                          className={idx % 2 === 0 ? "bg-green-50" : "bg-white"}
                        >
                          <td className="px-4 py-2 border border-green-200">
                            {row.category}
                          </td>
                          <td className="px-4 py-2 border border-green-200 text-right">
                            {row.revenue.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Product-wise Revenue Table */}
              <div className="bg-white p-4 rounded-lg shadow flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-green-700">
                    Product-wise Revenue
                  </h3>
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                    onClick={() =>
                      exportCSV(productProfits, "product-wise-revenue.csv")
                    }
                  >
                    Export CSV
                  </button>
                </div>
                <div className="overflow-x-auto flex-1">
                  <table className="min-w-full border border-green-200 h-full">
                    <thead className="bg-green-100">
                      <tr>
                        <th className="px-4 py-2 border border-green-300 text-left">
                          Product Name
                        </th>
                        <th className="px-4 py-2 border border-green-300 text-left">
                          Category
                        </th>
                        <th className="px-4 py-2 border border-green-300 text-right">
                          Revenue (₹)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {productProfits.map((item, idx) => (
                        <tr
                          key={idx}
                          className={idx % 2 === 0 ? "bg-green-50" : "bg-white"}
                        >
                          <td className="px-4 py-2 border border-green-200">
                            {item.productName}
                          </td>
                          <td className="px-4 py-2 border border-green-200">
                            {item.category}
                          </td>
                          <td className="px-4 py-2 border border-green-200 text-right">
                            {item.revenue.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfitTable;
