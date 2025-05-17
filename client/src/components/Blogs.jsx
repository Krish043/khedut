import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 3; // Number of blogs per page
  const navigate = useNavigate();

  const handleReadMore = (post) => {
    navigate(`/${post._id}`);
  };
  const handleLike = async (blogId) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/blog/like/${blogId}`
      );
      const updatedLikes = response.data.likes;

      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === blogId ? { ...blog, likes: updatedLikes } : blog
        )
      );

      toast.success("You liked the blog!");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        toast.error("You can only like once!");
      } else {
        toast.error("Error liking blog. Please try again.");
      }
    }
  };

  const handleShare = (blogId) => {
    const url = `${window.location.origin}/${blogId}`;

    if (navigator.share) {
      navigator.share({
        title: "Check out this blog!",
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("Blog link copied to clipboard!");
    }
  };

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("http://localhost:3000/blog");
      const blogsData = response.data;
      // console.log("Fetched blogs:", blogsData);

      // Fetch author names for each blog
      const updatedBlogs = await Promise.all(
        blogsData.map(async (blog) => {
          // console.log("Processing blog:", blog); // ✅ Add this

          try {
            // console.log("Fetching user for author ID:", blog.author); // ✅ Add this

            const userResponse = await axios.get(
              `http://localhost:3000/users/id/${blog.author}`
            );
            // console.log(blog.author);

            // Extract name from the response
            const authorName = userResponse.data.name || "Unknown Author";
            return { ...blog, authorName };
          } catch (userErr) {
            console.error(`Error fetching user for blog ${blog._id}:`, userErr);
            return { ...blog, authorName: "Unknown Author" };
          }
        })
      );

      setBlogs(updatedBlogs);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Error fetching blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <p className="text-center text-green-700">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-700">{error}</p>;
  }

  if (!blogs || blogs.length === 0) {
    return <p className="text-center text-gray-700">No blogs available.</p>;
  }

  return (
    <div className="bg-black-50 mt-24 h-auto">
      <div className="w-full max-w-screen-xl mx-auto px-6">
        <div className="bg-green-100 p-2 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold text-green-800 text-center">
            Stay updated with the latest news, insights, and stories. Dive into
            our blogs to discover fresh perspectives and stay informed!
          </h3>
        </div>
        <div className="grid grid-cols-1 px-3 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentBlogs.map((blog) => (
            <div
              key={blog._id}
              className="h-[400px] relative bg-white shadow-lg rounded-lg overflow-hidden transition transform hover:scale-95"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {blog.title}
                </h3>
                <p>posted by: {blog.authorName}</p>
                {/* <p className="text-gray-600 line-clamp-3">{blog.description}</p> */}
                <p className="text-gray-600 line-clamp-3">
                  {`${blog.description.split(" ").slice(0, 12).join(" ")}...`}
                </p>
              </div>
              <div className="absolute bottom-3 left-3 flex space-x-4">
                <button
                  className="mt-4 text-green-700 font-semibold px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
                  onClick={() => handleReadMore(blog)}
                >
                  Read More
                </button>
                <button
                  className="mt-4 text-gray-600 hover:text-red-500 px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
                  onClick={() => handleLike(blog._id)}
                >
                  ❤️ {blog.likes || 0}
                </button>

                <button
                  className="mt-4 text-gray-600 hover:text-blue-500 px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
                  onClick={() => handleShare(blog._id)}
                >
                  🔗 Share
                </button>
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
                      currentPage < totalPages ? currentPage + 1 : totalPages
                    )
                  }
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      <style jsx="true">{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 3;
        }
      `}</style>
    </div>
  );
};

export default Blogs;
