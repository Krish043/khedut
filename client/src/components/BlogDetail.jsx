"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogRes = await axios.get(`http://localhost:3000/blog/${id}`);
        setBlog(blogRes.data);

        if (blogRes.data.author) {
          const authorRes = await axios.get(
            `http://localhost:3000/users/id/${blogRes.data.author}`
          );
          setAuthor(authorRes.data);
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading)
    return <p className="text-center pt-24 text-green-700">Loading...</p>;
  if (error || !blog)
    return (
      <p className="text-center pt-24 text-red-600">
        {error || "Blog not found"}
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">
      {/* Top Section: Image + Author Side by Side */}
      <div className="max-w-screen-md mx-auto">
        {/* Blog Image (Full Width) */}
        <div
          className="rounded-xl overflow-hidden shadow-lg border border-gray-200"
          style={{ maxHeight: "300px" }}
        >
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover object-center"
            style={{ maxHeight: "300px", minHeight: "250px" }}
          />
        </div>

        {/* Author Info Bar */}
        <div className="relative -mt-6 mx-4">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-3 flex items-center">
            {/* Author Avatar */}
            <div className="flex-shrink-0 mr-3">
              {author?.img && (
                <img
                  src={author.img}
                  alt={author.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                />
              )}
            </div>

            {/* Author Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-0.5">
                    Posted by
                  </h3>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-base font-semibold text-gray-800 truncate">
                      {author?.name}
                    </h2>
                    {author?.role && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">
                        {author.role}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-gray-500 text-xs">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center space-x-1 text-gray-700">
                    <span>❤️ {blog.likesCount || 0}</span>
                    <span>•</span>
                    <span>🔁 {blog.shareCount || 0}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rest of your blog content would go here */}
      </div>

      {/* Blog Content */}
      <div className="mt-10 prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{blog.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>

      {/* Back Button */}
      <div className="flex justify-center mt-12">
        <Button
          onClick={() => navigate("/")}
          className="rounded-full bg-green-600 hover:bg-green-700 text-white px-6 py-2 font-semibold shadow-lg transition"
        >
          ← Back to Home
        </Button>
      </div>
    </div>
  );
}
