import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import JoditEditor from "jodit-react";
import { toast } from "sonner";
const AddBlog = () => {
  const navigate = useNavigate();
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [currentStage, setCurrentStage] = useState(1);
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({
    title: "",
    description: "",
    image: "",
  });
  const [user, setUser] = useState(() => {
    const local = localStorage.getItem("auth");
    return local ? JSON.parse(local) : { auth: false };
  });
  const stages = [
    { id: 1, label: "Add Title" },
    { id: 2, label: "Add Description" },
    { id: 3, label: "Add Content" },
    { id: 4, label: "Add Image URL" },
  ];
  useEffect(() => {
    const fetchUserByEmail = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/users/email/${user.email}`
        );
        const fullUser = {
          ...user,
          id: res.data.id, // 👈 this is the MongoDB _id
          role: res.data.role,
          name: res.data.name,
          img: res.data.img,
        };
        setUser(fullUser);
        localStorage.setItem("auth", JSON.stringify(fullUser)); // optional
      } catch (err) {
        toast.error("Failed to fetch full user info:", err);
      }
    };

    if (user.auth && !user.id) {
      fetchUserByEmail();
    }
  }, [user.auth, user.email]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBlog((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStage = () => {
    if (currentStage < stages.length) {
      setCurrentStage(currentStage + 1);
    }
  };

  const handlePreviousStage = () => {
    if (currentStage > 1) {
      setCurrentStage(currentStage - 1);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    console.log("User ID:", user.id); // ✅ Now this won't be undefined

    const blogToSubmit = {
      ...newBlog,
      content,
      author: user.id,
      role: user.role,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/blog",
        blogToSubmit
      );
      setBlogs([...blogs, response.data]);
      setNewBlog({ title: "", description: "", image: "" });
      setContent("");
      navigate("/profile");
      toast.success("Blog added successfully!");
    } catch (error) {
      console.error("Error adding blog:", error.response || error);
      toast.error(
        error.response?.data?.message || "There was an error adding the blog!"
      );
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-9">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-green-800 mb-4">
            Add a New Blog
          </h2>
          <div className="flex justify-between items-center mb-8">
            {stages.map((stage) => (
              <div
                key={stage.id}
                className={`flex-1 border-t-4 ${
                  currentStage === stage.id
                    ? "border-green-600"
                    : "border-gray-300"
                } p-2 text-center`}
              >
                <span
                  className={`text-sm ${
                    currentStage === stage.id
                      ? "text-green-600 font-bold"
                      : "text-gray-500"
                  }`}
                >
                  {stage.label}
                </span>
              </div>
            ))}
          </div>
          <form onSubmit={handleFormSubmit}>
            {currentStage === 1 && (
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="title"
                >
                  Title
                </label>
                <Textarea
                  id="title"
                  name="title"
                  value={newBlog.title}
                  onChange={handleInputChange}
                  className="appearance-none border rounded bg-gray-100 w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
                <button
                  type="button"
                  onClick={handleNextStage}
                  className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Next Stage
                </button>
              </div>
            )}
            {currentStage === 2 && (
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="description"
                >
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={newBlog.description}
                  onChange={handleInputChange}
                  className="appearance-none border rounded bg-gray-100 w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={handlePreviousStage}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Previous Stage
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStage}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Next Stage
                  </button>
                </div>
              </div>
            )}
            {currentStage === 3 && (
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="content"
                >
                  Content
                </label>
                <JoditEditor
                  ref={editor}
                  value={content}
                  onChange={(newContent) => setContent(newContent)}
                />
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={handlePreviousStage}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Previous Stage
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStage}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Next Stage
                  </button>
                </div>
              </div>
            )}
            {currentStage === 4 && (
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="image"
                >
                  Image URL
                </label>
                <Textarea
                  id="image"
                  name="image"
                  value={newBlog.image}
                  onChange={handleInputChange}
                  className="appearance-none border rounded bg-gray-100 w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                />
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={handlePreviousStage}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Previous Stage
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Add Blog
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBlog;
