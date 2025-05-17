import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Fdashboard from "./Fdashboard";
import { toast } from "sonner";
const Profile = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSchemePage, setCurrentSchemePage] = useState(1);
  const [appliedSchemes, setAppliedSchemes] = useState([]);
  const [schemeDetails, setSchemeDetails] = useState([]);
  const blogsPerPage = 3;
  const schemesPerPage = 3;

  const user = JSON.parse(localStorage.getItem("auth")) || {
    auth: false,
    id: "",
  };
  const [blogToDelete, setBlogToDelete] = useState(null);

  useEffect(() => {
    const fetchBlogsAndSchemes = async () => {
      setLoading(true);
      try {
        // Fetch all blogs and user data by email
        const [blogsResponse, userResponse] = await Promise.all([
          axios.get("http://localhost:3000/blog"),
          axios.get(`http://localhost:3000/users/email/${user.email}`),
        ]);

        const userId = userResponse.data.id; // get the user ID
        // Filter blogs where author id matches user ID
        const filteredBlogs = blogsResponse.data.filter(
          (blog) => blog.author === userId
        );

        setBlogs(filteredBlogs);
        setAppliedSchemes(userResponse.data.appliedSchemes);
        const schemeDetailsPromises = userResponse.data.appliedSchemes.map(
          (schemeObj) =>
            axios.get(`http://localhost:3000/schemes/${schemeObj.scheme._id}`)
        );
        const schemeDetailsResponses = await Promise.all(schemeDetailsPromises);
        setSchemeDetails(
          schemeDetailsResponses.map((response) => response.data)
        );
        setLoading(false);
      } catch (err) {
        setError("Failed to load blogs or applied schemes");
        setLoading(false);
      }
    };

    fetchBlogsAndSchemes();
  }, [user.email]);

  const handleDelete = (blogId) => {
    setBlogToDelete(blogId);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/blog/${blogToDelete}`);
      setBlogs(blogs.filter((blog) => blog._id !== blogToDelete));
      toast.success("Blog deleted successfully.");
    } catch (error) {
      toast.error("Error Deleting the Blog.");
    }
    setBlogToDelete(null);
  };

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastScheme = currentSchemePage * schemesPerPage;
  const indexOfFirstScheme = indexOfLastScheme - schemesPerPage;
  const currentSchemes = schemeDetails.slice(
    indexOfFirstScheme,
    indexOfLastScheme
  );
  const totalSchemePages = Math.ceil(schemeDetails.length / schemesPerPage);

  const paginateSchemes = (pageNumber) => setCurrentSchemePage(pageNumber);

  if (loading) {
    return <p className="text-center text-green-700">Loading profile...</p>;
  }

  if (error) {
    return <p className="text-center text-red-700">{error}</p>;
  }
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-9">
      <div className="max-w-7xl mx-auto">
        {user.role == "businessman" && <Fdashboard />}
        {user.role == "farmer" && <Fdashboard />}
        <div className="bg-white rounded-lg p-8 mb-8">
          <div className="h-auto flex justify-between p-2 mb-2">
            <h2 className="text-2xl font-semibold text-green-800">
              Applied Schemes
            </h2>
            <div className="text-right">
              <button
                onClick={() => navigate("/schemes")}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Apply for more
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {currentSchemes.length > 0 ? (
              <>
                {(() => {
                  // Create a map of schemeId -> status
                  const appliedSchemesStatusMap = {};
                  appliedSchemes?.forEach((applied) => {
                    // console.log(applied.status);
                    const schemeId = applied.scheme?._id
                      ? applied.scheme._id.toString()
                      : applied.scheme.toString();
                    appliedSchemesStatusMap[schemeId] = applied.status;
                  });

                  return currentSchemes.map((scheme, index) => {
                    const schemeId = scheme._id.toString();
                    const status = appliedSchemesStatusMap[schemeId] || null;
                    // console.log(status);

                    return (
                      <div
                        key={index}
                        className="bg-white shadow-lg rounded-lg p-6 flex flex-col hover:scale-105 transform transition-all duration-300 hover:shadow-2xl"
                      >
                        <img
                          src={scheme.image}
                          alt={scheme.name}
                          className="w-full h-40 object-cover mb-4 rounded-lg"
                        />
                        <h3 className="text-xl font-semibold text-green-800 mb-2">
                          {scheme.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {scheme.amount}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          {scheme.description}
                        </p>

                        {status && (
                          <p
                            className={`text-sm font-semibold mt-2 px-2 py-1 rounded-md w-fit ${
                              status === "granted"
                                ? "bg-green-100 text-green-700"
                                : status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            Status: {status}
                          </p>
                        )}
                      </div>
                    );
                  });
                })()}

                <div className="flex justify-center mt-6 col-span-full">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          className="text-slate-600 hover:cursor-pointer"
                          onClick={() =>
                            paginateSchemes(
                              currentSchemePage > 1 ? currentSchemePage - 1 : 1
                            )
                          }
                          disabled={currentSchemePage === 1}
                        />
                      </PaginationItem>

                      {[...Array(totalSchemePages).keys()].map((number) => (
                        <PaginationItem key={number + 1}>
                          <PaginationLink
                            onClick={() => paginateSchemes(number + 1)}
                            className={
                              currentSchemePage === number + 1
                                ? "bg-green-500 text-white"
                                : "hover:cursor-pointer"
                            }
                          >
                            {number + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          className="text-slate-600 hover:cursor-pointer"
                          onClick={() =>
                            paginateSchemes(
                              currentSchemePage < totalSchemePages
                                ? currentSchemePage + 1
                                : totalSchemePages
                            )
                          }
                          disabled={currentSchemePage === totalSchemePages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </>
            ) : (
              <p className="text-center col-span-full">No schemes found.</p>
            )}
          </div>
        </div>

        <div className="rounded-lg p-8 mb-8">
          <div className="h-auto flex justify-between p-2 mb-2">
            <h2 className="text-2xl font-semibold text-green-800">
              Your Blogs
            </h2>
            <div className="text-right">
              <button
                onClick={() => navigate("/add-blog")}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Add New Blog
              </button>
            </div>
          </div>

          {blogs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {currentBlogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="bg-white shadow-md hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden flex flex-col"
                  >
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-44 object-cover"
                    />
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="text-lg font-semibold text-green-800 mb-1 line-clamp-1">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {blog.description.slice(0, 100)}...
                      </p>

                      <div className="mt-auto flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <span className="text-red-600 text-base">❤️</span>
                          {blog.likes || 0}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-blue-500 text-base">🔁</span>
                          {blog.shares || 0}
                        </div>

                        {/* Delete button with confirmation */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              className="text-red-500 hover:text-red-600 transition-colors"
                              title="Delete Blog"
                              onClick={() => setBlogToDelete(blog._id)}
                            >
                             Delete Blog 🗑️
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-red-500">
                                Confirm Deletion
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. Do you want to
                                delete this blog permanently?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                className="mt-0"
                                onClick={() => setBlogToDelete(null)}
                              >
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600"
                                onClick={confirmDelete}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        className="text-slate-600 hover:cursor-pointer"
                        onClick={() =>
                          paginate(currentPage > 1 ? currentPage - 1 : 1)
                        }
                        disabled={currentPage === 1}
                      />
                    </PaginationItem>
                    {[...Array(totalPages).keys()].map((number) => (
                      <PaginationItem key={number + 1}>
                        <PaginationLink
                          onClick={() => paginate(number + 1)}
                          className={
                            currentPage === number + 1
                              ? "bg-green-500 text-white"
                              : "hover:cursor-pointer"
                          }
                        >
                          {number + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        className="text-slate-600 hover:cursor-pointer"
                        onClick={() =>
                          paginate(
                            currentPage < totalPages
                              ? currentPage + 1
                              : totalPages
                          )
                        }
                        disabled={currentPage === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-700">
              You haven't written any blogs yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
