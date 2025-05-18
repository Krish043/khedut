
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SchemeContext } from "./SchemeContext";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const SkeletonCard = () => (
  <div className="bg-white rounded-lg shadow-md p-6 animate-pulse flex flex-col h-[500px]">
    <div className="bg-gray-300 rounded-md w-full h-48 mb-4"></div>
    <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
    <div className="h-4 bg-gray-300 rounded mb-2 w-1/3"></div>
    <div className="h-8 bg-gray-300 rounded mb-4 w-1/2"></div>
    <div className="flex-grow bg-gray-300 rounded mb-4"></div>
    <div className="h-10 bg-gray-300 rounded w-1/2 self-end"></div>
  </div>
);

const SchemeCard = ({ scheme, onApply }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div
      className="bg-white h-[500px] shadow-lg rounded-lg p-6 flex flex-col
        transition-colors duration-300 cursor-pointer hover:bg-green-50"
    >
      {/* Image container with skeleton and fade-in */}
      <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden bg-gray-100">
        {!imgLoaded && <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>}
        <img
          src={scheme.image}
          alt={scheme.name}
          className={`w-full h-full object-cover transition-opacity duration-700 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
        />
      </div>
      <h2 className="text-xl font-semibold text-green-800 mb-2">{scheme.name}</h2>
      <p className="text-sm text-gray-600 mb-2">{scheme.type}</p>
      <div className="text-lg font-bold text-green-600 mb-4">{scheme.amount}</div>
      <p className="text-sm text-gray-500 flex-grow mb-4">{scheme.description}</p>
      <button
        onClick={() => onApply(scheme._id)}
        className="mt-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
      >
        Apply Now
      </button>
    </div>
  );
};

const Schemes = () => {
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState("");
  const { setSelectedSchemeId } = useContext(SchemeContext);

  const [currentPage, setCurrentPage] = useState(1);
  const schemesPerPage = 4; // Number of schemes per page

  useEffect(() => {
    const localAuth = JSON.parse(localStorage.getItem("auth")) || {
      auth: false,
      role: "",
    };
    if (!localAuth.auth) {
      navigate("/signin");
      return;
    }
    setUserRole(localAuth.role);
  }, [navigate]);

  useEffect(() => {
    const fetchSchemes = async () => {
      if (!userRole) return;
      try {
        const response = await axios.get("http://localhost:3000/schemes");
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
        console.error("Error fetching schemes:", err);
        setError("Error fetching schemes");
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
    navigate("/add-scheme");
  };

  if (error) {
    return <p className="text-center text-red-700 mt-10">{error}</p>;
  }

  if (!schemes || schemes.length === 0) {
    if (!loading)
      return (
        <p className="text-center text-gray-700 mt-10">
          No schemes available for your role.
        </p>
      );
  }

  return (
    <div className="max-w-7xl mx-auto mt-20 flex flex-col px-4">
      {/* Enhanced Title Section */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-green-800 mb-2">
          Government Schemes
        </h1>
        <p className="text-lg text-green-600">
          Apply for schemes to avail exclusive benefits offered by the government
        </p>
      </header>

      {/* Schemes Grid */}
      <div className="h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {loading
          ? Array(schemesPerPage)
              .fill(0)
              .map((_, idx) => <SkeletonCard key={idx} />)
          : currentSchemes.map((scheme) => (
              <SchemeCard key={scheme._id} scheme={scheme} onApply={handleApply} />
            ))}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className="text-slate-600 hover:cursor-pointer"
                  onClick={() =>
                    handleClick(currentPage > 1 ? currentPage - 1 : 1)
                  }
                  disabled={currentPage === 1}
                />
              </PaginationItem>

              {[...Array(totalPages).keys()].map((number) => (
                <PaginationItem key={number + 1}>
                  <PaginationLink
                    onClick={() => handleClick(number + 1)}
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
                    handleClick(
                      currentPage < totalPages ? currentPage + 1 : totalPages
                    )
                  }
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default Schemes;
