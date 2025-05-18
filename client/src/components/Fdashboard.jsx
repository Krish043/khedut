// import React, { useState, useEffect } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
// } from "recharts";
// import axios from "axios";

// const UserDashboard = () => {
//   const [user, setUser] = useState(null);
//   const [appliedSchemes, setAppliedSchemes] = useState([]);
//   const [schemeDetails, setSchemeDetails] = useState([]);
//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [selectedTab, setSelectedTab] = useState("granted");
//   const [grantedAmounts, setGrantedAmounts] = useState({}); // Store fixed granted amounts

//   const storedUser = JSON.parse(localStorage.getItem("auth")) || {};

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         if (!storedUser.email) {
//           setError("User email not found in local storage");
//           setLoading(false);
//           return;
//         }

//         const [userResponse, blogsResponse] = await Promise.all([
//           axios.get(`http://localhost:3000/users/email/${storedUser.email}`),
//           axios.get("http://localhost:3000/blog"),
//         ]);

//         const fetchedUser = userResponse.data;
//         setUser(fetchedUser);

//         const filteredBlogs = blogsResponse.data.filter(
//           (blog) => blog.author === fetchedUser.id
//         );
//         setBlogs(filteredBlogs);

//         const applied = fetchedUser.appliedSchemes || [];
//         setAppliedSchemes(applied);

//         if (applied.length > 0) {
//           const detailsPromises = applied.map((schemeObj) => {
//             const schemeId =
//               typeof schemeObj.scheme === "object"
//                 ? schemeObj.scheme._id
//                 : schemeObj.scheme;
//             return axios.get(`http://localhost:3000/schemes/${schemeId}`);
//           });

//           const detailsResponses = await Promise.all(detailsPromises);
//           const detailsData = detailsResponses.map((res) => res.data);
//           setSchemeDetails(detailsData);

//           // Initialize fixed granted amounts
//           const initialAmounts = {};
//           applied.forEach((schemeObj, index) => {
//             if (schemeObj.status === "granted") {
//               const schemeInfo = detailsData[index];
//               if (schemeInfo) {
//                 const maxAmount = parseMaxAmount(schemeInfo.amount);
//                 // Store a fixed percentage (e.g., 70%) of max amount
//                 initialAmounts[schemeObj._id || schemeObj.scheme] = Math.floor(
//                   maxAmount * 0.7
//                 );
//               }
//             }
//           });
//           setGrantedAmounts(initialAmounts);
//         } else {
//           setSchemeDetails([]);
//         }
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load user data or blogs");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [storedUser.email]);

//   function parseMaxAmount(amountStr) {
//     if (!amountStr) return 50000;
//     const regex = /₹?([\d,]+)/;
//     const match = amountStr.match(regex);
//     if (match && match[1]) {
//       const numStr = match[1].replace(/,/g, "");
//       const num = parseInt(numStr, 10);
//       return isNaN(num) ? 50000 : num;
//     }
//     return 50000;
//   }

//   // Calculate total granted amount from fixed values
//   const totalAmountGranted = Object.values(grantedAmounts).reduce(
//     (sum, amount) => sum + amount,
//     0
//   );

//   const pendingSchemes = appliedSchemes.filter((s) => s.status === "pending");
//   const grantedSchemes = appliedSchemes.filter((s) => s.status === "granted");
//   const rejectedSchemes = appliedSchemes.filter((s) => s.status === "rejected");

//   const mostLikedBlog =
//     blogs.length > 0
//       ? blogs.reduce((maxBlog, blog) =>
//           (blog.likes || 0) > (maxBlog.likes || 0) ? blog : maxBlog
//         )
//       : null;

//   const profitData = [
//     { name: "Vegetables", profit: 20000 },
//     { name: "Dairy items", profit: 15000 },
//     { name: "Grains", profit: 10000 },
//     { name: "Fruits", profit: 5000 },
//     { name: "Poultry", profit: 8000 },
//   ];

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;
//   if (!user) return <p>User not found.</p>;

//   const renderSchemeCards = (schemes) => {
//     if (schemes.length === 0)
//       return (
//         <p className="text-gray-500 italic">No schemes in this category.</p>
//       );

//     return schemes.map((schemeObj) => {
//       const schemeId =
//         typeof schemeObj.scheme === "object"
//           ? schemeObj.scheme._id
//           : schemeObj.scheme;
//       const schemeInfo = schemeDetails.find(
//         (s) => s._id === schemeId || s.id === schemeId
//       );

//       return (
//         <div
//           key={schemeObj._id || schemeId}
//           className="border border-gray-200 rounded-md p-3 shadow-sm hover:shadow-md transition-shadow bg-white"
//         >
//           <p className="font-semibold text-green-700 text-md">
//             {schemeInfo?.name || "Unnamed Scheme"}
//           </p>
//           <p className="text-xs text-gray-600">
//             Type: {schemeInfo?.type || "N/A"}
//           </p>
//           <p className="text-xs text-gray-600">
//             Status:{" "}
//             <span
//               className={`font-semibold ${
//                 schemeObj.status === "granted"
//                   ? "text-green-600"
//                   : schemeObj.status === "pending"
//                   ? "text-yellow-600"
//                   : "text-red-600"
//               }`}
//             >
//               {schemeObj.status}
//             </span>
//           </p>
//           <p className="text-xs text-gray-600">
//             Amount: {schemeInfo?.amount || "N/A"}
//           </p>
//         </div>
//       );
//     });
//   };

//   return (
//     <div className="h-[calc(100vh-70px)] rounded-lg p-4 mb-4 flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0 bg-gray-50">
//       {/* LEFT CONTAINER */}
//       <div className="flex flex-col flex-1 space-y-4">
//         {/* Profile Box */}
//         <div className="bg-white p-4 rounded-lg flex items-center space-x-4 shadow">
//           <img
//             src={user.img || "/default-user.jpg"}
//             alt="User"
//             className="w-16 h-16 rounded-full object-cover border-2 border-green-600"
//           />
//           <div>
//             <p className="text-xl font-semibold text-green-700">{user.name}</p>
//             <p className="text-xs text-gray-600">Email: {user.email}</p>
//             <p className="text-xs text-gray-600">Role: {user.role}</p>
//           </div>
//         </div>

//         {/* Scheme Stats and Blog side-by-side */}
//         <div className="flex space-x-4 h-[calc(100%-180px)]">
//           {/* Scheme Stats */}
//           <div className="bg-white p-4 rounded-lg shadow flex-1 flex flex-col">
//             <p className="text-lg font-semibold mb-2 border-b border-green-300 pb-1">
//               Scheme Stats
//             </p>

//             {/* Tab Buttons */}
//             <div className="flex space-x-1 mb-2">
//               {["pending", "granted", "rejected"].map((tab) => (
//                 <button
//                   key={tab}
//                   onClick={() => setSelectedTab(tab)}
//                   className={`px-2 py-1 text-xs rounded-md font-semibold transition-colors ${
//                     selectedTab === tab
//                       ? "bg-green-600 text-white shadow"
//                       : "bg-green-100 text-green-800 hover:bg-green-200"
//                   }`}
//                   aria-pressed={selectedTab === tab}
//                 >
//                   {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                 </button>
//               ))}
//             </div>

//             {/* Scheme Cards */}
//             <div className="space-y-2 overflow-y-auto flex-1">
//               {selectedTab === "granted" && renderSchemeCards(grantedSchemes)}
//               {selectedTab === "pending" && renderSchemeCards(pendingSchemes)}
//               {selectedTab === "rejected" && renderSchemeCards(rejectedSchemes)}
//             </div>

//             {/* Summary */}
//             <div className="mt-2 border-t pt-2 text-sm text-gray-700 font-semibold">
//               <p>Total Schemes Applied: {appliedSchemes.length}</p>
//               <p>
//                 Total Amount Granted: ₹{totalAmountGranted.toLocaleString()}
//               </p>
//             </div>
//           </div>

//           {/* Top Blog */}
//           <div className="bg-white p-4 rounded-lg shadow flex-[0.6] flex flex-col">
//             <p className="text-lg font-semibold mb-2 border-b border-green-300 pb-1">
//               Top Blog by Likes
//             </p>

//             {mostLikedBlog ? (
//               <div className="flex-1 flex flex-col rounded-md border border-green-200 overflow-hidden">
//                 {mostLikedBlog.image &&
//                 typeof mostLikedBlog.image === "string" ? (
//                   <img
//                     src={mostLikedBlog.image}
//                     alt={mostLikedBlog.title}
//                     className="h-40 object-cover w-full"
//                   />
//                 ) : (
//                   mostLikedBlog.image
//                 )}

//                 <div className="p-3 flex flex-col flex-1">
//                   <h3 className="text-md font-bold text-green-800 mb-1 line-clamp-2">
//                     {mostLikedBlog.title}
//                   </h3>

//                   <p className="text-sm text-gray-600 mb-2 line-clamp-2">
//                     {mostLikedBlog.description}
//                   </p>

//                   <div className="mt-auto flex items-center gap-1 text-sm text-red-600 font-medium">
//                     <span className="text-lg">❤️</span>
//                     {mostLikedBlog.likes || 0} Likes
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <p className="text-gray-500 italic">No blogs available</p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* RIGHT CONTAINER - Profit Chart */}
//       <div className="bg-white p-4 rounded-lg shadow w-full lg:max-w-md h-[calc(100vh-170px)]">
//         <p className="text-lg font-semibold mb-2 border-b border-green-300 pb-1">
//           Profit Distribution
//         </p>
//         <div className="h-[calc(100%-40px)]">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart
//               data={profitData}
//               margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
//             >
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="profit" fill="#16a34a" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;




import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [appliedSchemes, setAppliedSchemes] = useState([]);
  const [schemeDetails, setSchemeDetails] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTab, setSelectedTab] = useState("granted");
  const [grantedAmounts, setGrantedAmounts] = useState({});

  const storedUser = JSON.parse(localStorage.getItem("auth")) || {};

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        if (!storedUser.email) {
          setError("User email not found in local storage");
          setLoading(false);
          return;
        }

        const [userResponse, blogsResponse] = await Promise.all([
          axios.get(`http://localhost:3000/users/email/${storedUser.email}`),
          axios.get("http://localhost:3000/blog"),
        ]);

        const fetchedUser = userResponse.data;
        setUser(fetchedUser);

        const filteredBlogs = blogsResponse.data.filter(
          (blog) => blog.author === fetchedUser.id
        );
        setBlogs(filteredBlogs);

        const applied = fetchedUser.appliedSchemes || [];
        setAppliedSchemes(applied);

        if (applied.length > 0) {
          const detailsPromises = applied.map((schemeObj) => {
            const schemeId =
              typeof schemeObj.scheme === "object"
                ? schemeObj.scheme._id
                : schemeObj.scheme;
            return axios.get(`http://localhost:3000/schemes/${schemeId}`);
          });

          const detailsResponses = await Promise.all(detailsPromises);
          const detailsData = detailsResponses.map((res) => res.data);
          setSchemeDetails(detailsData);

          const initialAmounts = {};
          applied.forEach((schemeObj, index) => {
            if (schemeObj.status === "granted") {
              const schemeInfo = detailsData[index];
              if (schemeInfo) {
                const maxAmount = parseMaxAmount(schemeInfo.amount);
                initialAmounts[schemeObj._id || schemeObj.scheme] = Math.floor(
                  maxAmount * 0.7
                );
              }
            }
          });
          setGrantedAmounts(initialAmounts);
        } else {
          setSchemeDetails([]);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load user data or blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [storedUser.email]);

  function parseMaxAmount(amountStr) {
    if (!amountStr) return 50000;
    const regex = /₹?([\d,]+)/;
    const match = amountStr.match(regex);
    if (match && match[1]) {
      const numStr = match[1].replace(/,/g, "");
      const num = parseInt(numStr, 10);
      return isNaN(num) ? 50000 : num;
    }
    return 50000;
  }

  const totalAmountGranted = Object.values(grantedAmounts).reduce(
    (sum, amount) => sum + amount,
    0
  );

  const pendingSchemes = appliedSchemes.filter((s) => s.status === "pending");
  const grantedSchemes = appliedSchemes.filter((s) => s.status === "granted");
  const rejectedSchemes = appliedSchemes.filter((s) => s.status === "rejected");

  const mostLikedBlog =
    blogs.length > 0
      ? blogs.reduce((maxBlog, blog) =>
          (blog.likes || 0) > (maxBlog.likes || 0) ? blog : maxBlog
        )
      : null;

  const profitData = [
    { name: "Vegetables", profit: 20000 },
    { name: "Dairy items", profit: 15000 },
    { name: "Grains", profit: 10000 },
    { name: "Fruits", profit: 5000 },
    { name: "Poultry", profit: 8000 },
  ];

  if (loading) return <DashboardSkeleton />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p>User not found.</p>;

  const renderSchemeCards = (schemes) => {
    if (schemes.length === 0)
      return (
        <p className="text-gray-500 italic">No schemes in this category.</p>
      );

    return schemes.map((schemeObj) => {
      const schemeId =
        typeof schemeObj.scheme === "object"
          ? schemeObj.scheme._id
          : schemeObj.scheme;
      const schemeInfo = schemeDetails.find(
        (s) => s._id === schemeId || s.id === schemeId
      );

      return (
        <div
          key={schemeObj._id || schemeId}
          className="border border-gray-200 rounded-md p-3 shadow-sm hover:shadow-md transition-shadow bg-white"
        >
          <p className="font-semibold text-green-700 text-md">
            {schemeInfo?.name || "Unnamed Scheme"}
          </p>
          <p className="text-xs text-gray-600">
            Type: {schemeInfo?.type || "N/A"}
          </p>
          <p className="text-xs text-gray-600">
            Status:{" "}
            <span
              className={`font-semibold ${
                schemeObj.status === "granted"
                  ? "text-green-600"
                  : schemeObj.status === "pending"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {schemeObj.status}
            </span>
          </p>
          <p className="text-xs text-gray-600">
            Amount: {schemeInfo?.amount || "N/A"}
          </p>
        </div>
      );
    });
  };

  return (
    <div className="h-[calc(100vh-70px)] rounded-lg p-4 mb-4 flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0 bg-gray-50">
      {/* LEFT CONTAINER */}
      <div className="flex flex-col flex-1 space-y-4">
        {/* Profile Box */}
        <div className="bg-white p-4 rounded-lg flex items-center space-x-4 shadow">
          <img
            src={user.img || "/default-user.jpg"}
            alt="User"
            className="w-16 h-16 rounded-full object-cover border-2 border-green-600"
          />
          <div>
            <p className="text-xl font-semibold text-green-700">{user.name}</p>
            <p className="text-xs text-gray-600">Email: {user.email}</p>
            <p className="text-xs text-gray-600">Role: {user.role}</p>
          </div>
        </div>

        {/* Scheme Stats and Blog side-by-side */}
        <div className="flex space-x-4 h-[calc(100%-180px)]">
          {/* Scheme Stats */}
          <div className="bg-white p-4 rounded-lg shadow flex-1 flex flex-col">
            <p className="text-lg font-semibold mb-2 border-b border-green-300 pb-1">
              Scheme Stats
            </p>

            {/* Tab Buttons */}
            <div className="flex space-x-1 mb-2">
              {["pending", "granted", "rejected"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-2 py-1 text-xs rounded-md font-semibold transition-colors ${
                    selectedTab === tab
                      ? "bg-green-600 text-white shadow"
                      : "bg-green-100 text-green-800 hover:bg-green-200"
                  }`}
                  aria-pressed={selectedTab === tab}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Scheme Cards */}
            <div className="space-y-2 overflow-y-auto flex-1">
              {selectedTab === "granted" && renderSchemeCards(grantedSchemes)}
              {selectedTab === "pending" && renderSchemeCards(pendingSchemes)}
              {selectedTab === "rejected" && renderSchemeCards(rejectedSchemes)}
            </div>

            {/* Summary */}
            <div className="mt-2 border-t pt-2 text-sm text-gray-700 font-semibold">
              <p>Total Schemes Applied: {appliedSchemes.length}</p>
              <p>
                Total Amount Granted: ₹{totalAmountGranted.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Top Blog */}
          <div className="bg-white p-4 rounded-lg shadow flex-[0.6] flex flex-col">
            <p className="text-lg font-semibold mb-2 border-b border-green-300 pb-1">
              Top Blog by Likes
            </p>

            {mostLikedBlog ? (
              <div className="flex-1 flex flex-col rounded-md border border-green-200 overflow-hidden">
                {mostLikedBlog.image &&
                typeof mostLikedBlog.image === "string" ? (
                  <img
                    src={mostLikedBlog.image}
                    alt={mostLikedBlog.title}
                    className="h-40 object-cover w-full"
                  />
                ) : (
                  mostLikedBlog.image
                )}

                <div className="p-3 flex flex-col flex-1">
                  <h3 className="text-md font-bold text-green-800 mb-1 line-clamp-2">
                    {mostLikedBlog.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {mostLikedBlog.description}
                  </p>

                  <div className="mt-auto flex items-center gap-1 text-sm text-red-600 font-medium">
                    <span className="text-lg">❤️</span>
                    {mostLikedBlog.likes || 0} Likes
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">No blogs available</p>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT CONTAINER - Profit Chart */}
      <div className="bg-white p-4 rounded-lg shadow w-full lg:max-w-md h-[calc(100vh-170px)]">
        <p className="text-lg font-semibold mb-2 border-b border-green-300 pb-1">
          Profit Distribution
        </p>
        <div className="h-[calc(100%-40px)]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={profitData}
              margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="profit" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const DashboardSkeleton = () => {
  return (
    <div className="h-[calc(100vh-70px)] rounded-lg p-4 mb-4 flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0 bg-gray-50">
      {/* LEFT CONTAINER SKELETON */}
      <div className="flex flex-col flex-1 space-y-4">
        {/* Profile Box Skeleton */}
        <div className="bg-white p-4 rounded-lg flex items-center space-x-4 shadow">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        {/* Scheme Stats and Blog side-by-side Skeleton */}
        <div className="flex space-x-4 h-[calc(100%-180px)]">
          {/* Scheme Stats Skeleton */}
          <div className="bg-white p-4 rounded-lg shadow flex-1 flex flex-col">
            <Skeleton className="h-6 w-32 mb-4" />
            
            {/* Tab Buttons Skeleton */}
            <div className="flex space-x-1 mb-4">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>

            {/* Scheme Cards Skeleton */}
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>

            {/* Summary Skeleton */}
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          {/* Top Blog Skeleton */}
          <div className="bg-white p-4 rounded-lg shadow flex-[0.6] flex flex-col">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-1/3 mt-4" />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT CONTAINER - Profit Chart Skeleton */}
      <div className="bg-white p-4 rounded-lg shadow w-full lg:max-w-md h-[calc(100vh-170px)]">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="h-[calc(100%-40px)]">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;