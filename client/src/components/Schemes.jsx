

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SchemeContext } from './SchemeContext';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Schemes = () => {
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');
  const { setSelectedSchemeId } = useContext(SchemeContext);

  const [currentPage, setCurrentPage] = useState(1);
  const schemesPerPage = 4; // Number of schemes per page

  useEffect(() => {
    const localAuth = JSON.parse(localStorage.getItem('auth')) || { auth: false, role: '' };
    if (!localAuth.auth) {
      navigate('/signin');
      return;
    }
    setUserRole(localAuth.role);
  }, [navigate]);

  useEffect(() => {
    const fetchSchemes = async () => {
      if (!userRole) return;
      try {
        const response = await axios.get('http://localhost:3000/schemes');
        const filteredSchemes = response.data.filter((scheme) => {
          if (scheme.applicableTo.length === 2) {
            return true;
          } else if (scheme.applicableTo.length === 1) {
            return scheme.applicableTo.includes(userRole);
          }
          return false;
        });
        setSchemes(filteredSchemes);
      } catch (err) {
        console.error('Error fetching schemes:', err);
        setError('Error fetching schemes');
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, [userRole]);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastScheme = currentPage * schemesPerPage;
  const indexOfFirstScheme = indexOfLastScheme - schemesPerPage;
  const currentSchemes = schemes.slice(indexOfFirstScheme, indexOfLastScheme);
  const totalPages = Math.ceil(schemes.length / schemesPerPage);

  const handleApply = (schemeId) => {
    setSelectedSchemeId(schemeId);
    navigate('/add-scheme');
  };

  if (loading) {
    return <p className="text-center text-green-700">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-700">{error}</p>;
  }

  if (!schemes || schemes.length === 0) {
    return <p className="text-center text-gray-700">No schemes available for your role.</p>;
  }

  return (
    <div className="max-w-7xl mx-auto mt-20 h-[calc(100vh-120px)] flex flex-col">
      <div className=" h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {currentSchemes.map((scheme) => (
          <div
            key={scheme._id}
            className="bg-white h-[500px] shadow-lg rounded-lg p-6 flex flex-col hover:scale-95 transform transition-all duration-300 hover:shadow-2xl"
          >
            <img
              src={scheme.image}
              alt={scheme.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold text-green-800 mb-2">{scheme.name}</h2>
            <p className="text-sm text-gray-600 mb-2">{scheme.type}</p>
            <div className="text-lg font-bold text-green-600 mb-4">{scheme.amount}</div>
            <p className="text-sm text-gray-500 flex-grow mb-4">{scheme.description}</p>
            <button
              onClick={() => handleApply(scheme._id)}
              className="mt-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
            >
              Apply Now
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6 ">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className="text-slate-600 hover:cursor-pointer"
                onClick={() => handleClick(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            {[...Array(totalPages).keys()].map((number) => (
              <PaginationItem key={number + 1}>
                <PaginationLink
                  onClick={() => handleClick(number + 1)}
                  className={currentPage === number + 1 ? 'bg-green-500 text-white' : 'hover:cursor-pointer'}
                >
                  {number + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                className="text-slate-600 hover:cursor-pointer"
                onClick={() => handleClick(currentPage < totalPages ? currentPage + 1 : totalPages)}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default Schemes;
