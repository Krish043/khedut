// import React, { useState, useEffect } from "react";
// import { useNavigate } from 'react-router-dom';
// import axios from "axios";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { Toast } from "@/components/ui/toast";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";

// const Fprofile = () => {
//   const navigate = useNavigate();
//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [appliedSchemes, setAppliedSchemes] = useState([]);
//   const [schemeDetails, setSchemeDetails] = useState([]);
//   const blogsPerPage = 3;

//   const user = JSON.parse(localStorage.getItem('auth')) || { auth: false, id: '' };
//   const [blogToDelete, setBlogToDelete] = useState(null);

//   useEffect(() => {
//     const fetchBlogsAndSchemes = async () => {
//       setLoading(true);
//       try {
//         const [blogsResponse, userResponse] = await Promise.all([
//           axios.get('http://localhost:3000/blog'),
//           axios.get(`http://localhost:3000/users/${user.email}`)
//         ]);
//         const filteredBlogs = blogsResponse.data.filter(blog => blog.author === user.email);
//         setBlogs(filteredBlogs);
//         setAppliedSchemes(userResponse.data.appliedSchemes);

//         // Fetch details for each applied scheme
//         const schemeDetailsPromises = userResponse.data.appliedSchemes.map(schemeId =>
//           axios.get(`http://localhost:3000/schemes/${schemeId}`)
//         );
//         const schemeDetailsResponses = await Promise.all(schemeDetailsPromises);
//         setSchemeDetails(schemeDetailsResponses.map(response => response.data));

//         setLoading(false);
//       } catch (err) {
//         setError('Failed to load blogs or applied schemes');
//         setLoading(false);
//       }
//     };
//     fetchBlogsAndSchemes();
//   }, [user.email]);

//   const handleDelete = (blogId) => {
//     setBlogToDelete(blogId);
//   };

//   const confirmDelete = async () => {
//     try {
//       await axios.delete(`http://localhost:3000/blog/${blogToDelete}`);
//       setBlogs(blogs.filter(blog => blog._id !== blogToDelete));
//       Toast({
//         description: "Blog deleted successfully.",
//         duration: 2000,
//       });
//     } catch (error) {
//       Toast({
//         description: "Error Deleting the Blog.",
//         duration: 2000,
//       });
//     }
//     setBlogToDelete(null);
//   };

//   const indexOfLastBlog = currentPage * blogsPerPage;
//   const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
//   const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

//   const totalPages = Math.ceil(blogs.length / blogsPerPage);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   if (loading) {
//     return <p className="text-center text-green-700">Loading profile...</p>;
//   }

//   if (error) {
//     return <p className="text-center text-red-700">{error}</p>;
//   }

//   return (
//     <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-9">
//       <div className="max-w-7xl mx-auto">
//         <div className="bg-white shadow-xl rounded-lg p-8 mb-8">
//           <h1 className="text-3xl font-semibold text-green-800 mb-4">Profile</h1>
//           {user && (
//             <>
//               <div className="flex items-center space-x-6 mb-6">
//                 <img src={user.img} alt="User" className="w-24 h-24 rounded-full object-cover border-4 border-green-600" />
//                 <div>
//                   <p className="text-2xl font-semibold text-green-700">{user.name}</p>
//                   <p className="text-sm text-gray-600">{user.email}</p>
//                   <p className="text-sm text-gray-600">{user.role}</p>
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <p className="text-lg text-gray-700"><strong>Profit:</strong> ₹{user.profit}</p>
//                 <p className="text-lg text-gray-700"><strong>Total Applied Schemes:</strong> {appliedSchemes.length}</p>
//                 <p className="text-lg text-gray-700"><strong>Blogs Posted:</strong> {blogs.length}</p>
//               </div>
//             </>
//           )}
//         </div>

//         <div className="bg-white rounded-lg p-8 mb-8">
//         <div className="h-auto flex justify-between p-2 mb-2">
//             <h2 className="text-2xl font-semibold text-green-800">Applied Schemes</h2>
//             <div className="text-right">
//               <button
//                 onClick={() => navigate('/schemes')}
//                 className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//               >
//                 Apply for more
//               </button>
//             </div>
//           </div>
//           {schemeDetails.length > 0 ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
//               {schemeDetails.map((scheme, index) => (
//                 <div
//                   key={index}
//                   className="bg-white shadow-lg rounded-lg p-6 flex flex-col hover:scale-105 transform transition-all duration-300 hover:shadow-2xl"
//                 >
//                   <img src={scheme.image} alt={scheme.name} className="w-full h-40 object-cover mb-4 rounded-lg" />
                    
//                   <h3 className="text-xl font-semibold text-green-800 mb-2">{scheme.name}</h3>
//                   <p className="text-sm text-gray-600 mb-2">{scheme.amount}</p>
//                   <p className="text-sm text-gray-600 mb-2">{scheme.description}</p>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="text-center text-gray-700">No applied schemes found.</p>
//           )}
//         </div>

//         <div className="rounded-lg p-8 mb-8">
//           <div className="h-auto flex justify-between p-2 mb-2">
//             <h2 className="text-2xl font-semibold text-green-800">Your Blogs</h2>
//             <div className="text-right">
//               <button
//                 onClick={() => navigate('/add-blog')}
//                 className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//               >
//                 Add New Blog
//               </button>
//             </div>
//           </div>

//           {blogs.length > 0 ? (
//             <>
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
//                 {currentBlogs.map((blog) => (
//                   <div
//                     key={blog._id}
//                     className="bg-white shadow-lg rounded-lg p-6 flex flex-col hover:scale-105 transform transition-all duration-300 hover:shadow-2xl"
//                   >
//                     <img src={blog.image} alt={blog.title} className="w-full h-40 object-cover mb-4 rounded-lg" />
//                     <h3 className="text-xl font-semibold text-green-800 mb-2">{blog.title}</h3>
//                     <p className="text-sm text-gray-600 mb-2">{blog.description.slice(0, 100)}...</p>
//                     <div className="mt-auto flex justify-between items-center">
//                       <AlertDialog>
//                         <AlertDialogTrigger asChild>
//                           <button
//                             onClick={() => handleDelete(blog._id)}
//                             className="text-red-600 hover:underline"
//                           >
//                             Delete Blog
//                           </button>
//                         </AlertDialogTrigger>
//                         <AlertDialogContent>
//                           <AlertDialogHeader>
//                             <AlertDialogTitle className='text-red-500'>Are you absolutely sure?</AlertDialogTitle>
//                             <AlertDialogDescription>
//                               This action cannot be undone. This will permanently delete this blog.
//                             </AlertDialogDescription>
//                           </AlertDialogHeader>
//                           <AlertDialogFooter>
//                             <AlertDialogCancel className='h-full mt-0' onClick={() => setBlogToDelete(null)}>Cancel</AlertDialogCancel>
//                             <AlertDialogAction className='h-full bg-red-500 hover:bg-red-600' onClick={confirmDelete}>Delete</AlertDialogAction>
//                           </AlertDialogFooter>
//                         </AlertDialogContent>
//                       </AlertDialog>
//                       <span className="text-gray-600">Likes: {blog.likes || 0}</span>
//                       <span className="text-gray-600">Shares: {blog.shares || 0}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="flex justify-center mt-6">
//                 <Pagination>
//                   <PaginationContent>
//                     <PaginationItem>
//                       <PaginationPrevious
//                         className='text-slate-600 hover:cursor-pointer'
//                         onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
//                         disabled={currentPage === 1}
//                       />
//                     </PaginationItem>
//                     {[...Array(totalPages).keys()].map(number => (
//                       <PaginationItem key={number + 1}>
//                         <PaginationLink
//                           onClick={() => paginate(number + 1)}
//                           className={currentPage === number + 1 ? 'bg-green-500 text-white' : 'hover:cursor-pointer'}
//                         >
//                           {number + 1}
//                         </PaginationLink>
//                       </PaginationItem>
//                     ))}
//                     <PaginationItem>
//                       <PaginationNext
//                         className='text-slate-600 hover:cursor-pointer'
//                         onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
//                         disabled={currentPage === totalPages}
//                       />
//                     </PaginationItem>
//                   </PaginationContent>
//                 </Pagination>
//               </div>
//             </>
//           ) : (
//             <p className="text-center text-gray-700">You haven't written any blogs yet.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Fprofile;


import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
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
import { Toast } from "@/components/ui/toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Fprofile = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSchemePage, setCurrentSchemePage] = useState(1);
  const [appliedSchemes, setAppliedSchemes] = useState([]);
  const [schemeDetails, setSchemeDetails] = useState([]);
  const blogsPerPage = 3;
  const schemesPerPage = 3;

  const user = JSON.parse(localStorage.getItem('auth')) || { auth: false, id: '' };
  const [blogToDelete, setBlogToDelete] = useState(null);

  useEffect(() => {
    const fetchBlogsAndSchemes = async () => {
      setLoading(true);
      try {
        const [blogsResponse, userResponse] = await Promise.all([
          axios.get('http://localhost:3000/blog'),
          axios.get(`http://localhost:3000/users/${user.email}`)
        ]);
        const filteredBlogs = blogsResponse.data.filter(blog => blog.author === user.email);
        setBlogs(filteredBlogs);
        setAppliedSchemes(userResponse.data.appliedSchemes);

        const schemeDetailsPromises = userResponse.data.appliedSchemes.map(schemeId =>
          axios.get(`http://localhost:3000/schemes/${schemeId}`)
        );
        const schemeDetailsResponses = await Promise.all(schemeDetailsPromises);
        setSchemeDetails(schemeDetailsResponses.map(response => response.data));

        setLoading(false);
      } catch (err) {
        setError('Failed to load blogs or applied schemes');
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
      setBlogs(blogs.filter(blog => blog._id !== blogToDelete));
      Toast({
        description: "Blog deleted successfully.",
        duration: 2000,
      });
    } catch (error) {
      Toast({
        description: "Error Deleting the Blog.",
        duration: 2000,
      });
    }
    setBlogToDelete(null);
  };

  // Pagination for Blogs
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Pagination for Schemes
  const indexOfLastScheme = currentSchemePage * schemesPerPage;
  const indexOfFirstScheme = indexOfLastScheme - schemesPerPage;
  const currentSchemes = schemeDetails.slice(indexOfFirstScheme, indexOfLastScheme);
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
        <div className="bg-white shadow-xl rounded-lg p-8 mb-8">
          {user && (
            <>
              <div className="flex items-center space-x-6 mb-6">
                <img src={user.img} alt="User" className="w-24 h-24 rounded-full object-cover border-4 border-green-600" />
                <div>
                  <p className="text-2xl font-semibold text-green-700">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-600">{user.role}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-lg text-gray-700"><strong>Profit:</strong> ₹{user.profit}</p>
                <p className="text-lg text-gray-700"><strong>Total Applied Schemes:</strong> {appliedSchemes.length}</p>
                <p className="text-lg text-gray-700"><strong>Blogs Posted:</strong> {blogs.length}</p>
              </div>
            </>
          )}
        </div>

        <div className="bg-white rounded-lg p-8 mb-8">
          <div className="h-auto flex justify-between p-2 mb-2">
            <h2 className="text-2xl font-semibold text-green-800">Applied Schemes</h2>
            <div className="text-right">
              <button
                onClick={() => navigate('/schemes')}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Apply for more
              </button>
            </div>
          </div>
          {currentSchemes.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {currentSchemes.map((scheme, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-lg rounded-lg p-6 flex flex-col hover:scale-105 transform transition-all duration-300 hover:shadow-2xl"
                  >
                    <img src={scheme.image} alt={scheme.name} className="w-full h-40 object-cover mb-4 rounded-lg" />
                    <h3 className="text-xl font-semibold text-green-800 mb-2">{scheme.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{scheme.amount}</p>
                    <p className="text-sm text-gray-600 mb-2">{scheme.description}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        className='text-slate-600 hover:cursor-pointer'
                        onClick={() => paginateSchemes(currentSchemePage > 1 ? currentSchemePage - 1 : 1)}
                        disabled={currentSchemePage === 1}
                      />
                    </PaginationItem>
                    {[...Array(totalSchemePages).keys()].map(number => (
                      <PaginationItem key={number + 1}>
                        <PaginationLink
                          onClick={() => paginateSchemes(number + 1)}
                          className={currentSchemePage === number + 1 ? 'bg-green-500 text-white' : 'hover:cursor-pointer'}
                        >
                          {number + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        className='text-slate-600 hover:cursor-pointer'
                        onClick={() => paginateSchemes(currentSchemePage < totalSchemePages ? currentSchemePage + 1 : totalSchemePages)}
                        disabled={currentSchemePage === totalSchemePages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-700">No applied schemes found.</p>
          )}
        </div>
      </div> 


      <div className="rounded-lg p-8 mb-8">
          <div className="h-auto flex justify-between p-2 mb-2">
            <h2 className="text-2xl font-semibold text-green-800">Your Blogs</h2>
            <div className="text-right">
              <button
                onClick={() => navigate('/add-blog')}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Add New Blog
              </button>
            </div>
          </div>

          {blogs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {currentBlogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="bg-white shadow-lg rounded-lg p-6 flex flex-col hover:scale-105 transform transition-all duration-300 hover:shadow-2xl"
                  >
                    <img src={blog.image} alt={blog.title} className="w-full h-40 object-cover mb-4 rounded-lg" />
                    <h3 className="text-xl font-semibold text-green-800 mb-2">{blog.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{blog.description.slice(0, 100)}...</p>
                    <div className="mt-auto flex justify-between items-center">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            onClick={() => handleDelete(blog._id)}
                            className="text-red-600 hover:underline"
                          >
                            Delete Blog
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className='text-red-500'>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete this blog.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className='h-full mt-0' onClick={() => setBlogToDelete(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction className='h-full bg-red-500 hover:bg-red-600' onClick={confirmDelete}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <span className="text-gray-600">Likes: {blog.likes || 0}</span>
                      <span className="text-gray-600">Shares: {blog.shares || 0}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        className='text-slate-600 hover:cursor-pointer'
                        onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                        disabled={currentPage === 1}
                      />
                    </PaginationItem>
                    {[...Array(totalPages).keys()].map(number => (
                      <PaginationItem key={number + 1}>
                        <PaginationLink
                          onClick={() => paginate(number + 1)}
                          className={currentPage === number + 1 ? 'bg-green-500 text-white' : 'hover:cursor-pointer'}
                        >
                          {number + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        className='text-slate-600 hover:cursor-pointer'
                        onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                        disabled={currentPage === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-700">You haven't written any blogs yet.</p>
          )}
        </div>
    </div>
  );
};

export default Fprofile;
