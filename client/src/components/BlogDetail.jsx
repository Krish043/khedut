import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/blog/${id}`);
        setBlog(response.data);
        
        if (response.data.author) {
          const authorResponse = await axios.get(`http://localhost:3000/users/${response.data.author}`);
          setAuthor(authorResponse.data);
        }
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Error fetching blog');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return <p className="text-center text-green-700">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-700">{error}</p>;
  }

  if (!blog) {
    return <p className="text-center text-gray-700">Blog not found.</p>;
  }

  return (
    <div className="max-w-screen-lg mx-auto p-6 mt-20">
      <div className="flex flex-col md:flex-row items-stretch space-y-6 md:space-x-6 md:space-y-0 p-2 m-4">
        
        <div className="w-full md:w-2/3 flex flex-col justify-between">
          <img 
            src={blog.image} 
            alt={blog.title} 
            className="w-full h-[250px] sm:h-[300px] md:h-[370px] lg:h-[400px] object-cover rounded-lg shadow-lg"
          />
          
          <div className="flex justify-between mt-4">
            <div className="text-sm text-gray-600">
              <strong>Likes:</strong> {blog.likesCount || 0}
            </div>
            <div className="text-sm text-gray-600">
              <strong>Shares:</strong> {blog.shareCount || 0}
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/3">
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 flex flex-col items-center h-full">
            <div className="mb-4">
              <h2 className="text-center text-xl font-bold text-gray-700">Posted by</h2>
              {author?.img && (
                <img 
                  src={author.img} 
                  alt={`${author.name}'s profile`} 
                  className="w-28 h-28 border-black shadow-lg transform hover:scale-105 transition-transform duration-300"
                />
              )}
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-700">{author?.name}</h2>
              <p className="text-sm text-gray-500">{author?.email}</p>
              <p className="text-sm text-gray-500">Role: {author?.role}</p>
              <p className="text-sm text-gray-500">
                <strong>Created At:</strong> {new Date(blog.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        
      </div>

      <div className="text-lg text-gray-700 mb-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">{blog.title}</h1>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>

      <div className="flex justify-center mt-10">
        <button
          onClick={() => navigate('/')}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline duration-300"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default BlogDetail;
