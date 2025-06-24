import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import plusIcon from "../../../../assets/images/Company Documentation/plus icon.svg";
import viewIcon from "../../../../assets/images/Companies/view.svg";
import editIcon from "../../../../assets/images/Company Documentation/edit.svg";
import deleteIcon from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../../Utils/Config";
import axios from "axios";

const QmsListOpportunityAssessment = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();

  // Get user company ID
  const getUserCompanyId = () => {
    const storedCompanyId = localStorage.getItem("company_id");
    if (storedCompanyId) return storedCompanyId;

    const userRole = localStorage.getItem("role");
    if (userRole === "user") {
      const userData = localStorage.getItem("user_company_id");
      if (userData) {
        try {
          return JSON.parse(userData);
        } catch (e) {
          console.error("Error parsing user company ID:", e);
          return null;
        }
      }
    }
    return null;
  };

  // Fetch assessments from API


  const fetchAssessments = async () => {
  try {
    setLoading(true);
    const companyId = getUserCompanyId();

    const response = await axios.get(`${BASE_URL}/qms/risk-opportunities/company/${companyId}/`);
    setAssessments(response.data);
    setError("");
    console.log("Fetched assessments:", response.data);
  } catch (error) {
    console.error("Error fetching assessments:", error);

    if (error.response && error.response.status === 404) {
      // Backend explicitly says no records found
      setAssessments([]); // treat as empty, not error
      setError(""); // clear error
    } else {
      // Other errors (network, 500s, etc.)
      setError("Failed to load opportunity assessments");
    }
  } finally {
    setLoading(false);
  }
};


  // Load data on component mount
  useEffect(() => {
    fetchAssessments();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); 
  };

  // Helper function to get risk category ranking
  const getRiskRanking = (score) => {
    if (!score) return "N/A";
    if (score >= 15) return "VH";  
    if (score >= 8) return "H";    
    if (score >= 4) return "M";    
    if (score >= 1) return "L";    
    return "N/A";
  };

  // Helper function to get ranking color
  const getRankingColor = (ranking) => {
    switch (ranking) {
      case "VH":
         return "bg-[#dd363611] text-[#dd3636]";
      case "H":
        return "bg-[#DD6B0611] text-[#DD6B06]";
      case "M":
        return "bg-[#FFD70011] text-[#FFD700]";
      case "L":
        return "bg-[#36DDAE11] text-[#36DDAE]";
      default:
        return "bg-[#858585] text-[#858585]";
    }
  };

  // Search functionality
  const filteredAssessments = assessments.filter((assessment) =>
    (assessment.activity || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (assessment.potential_opportunity || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (assessment.opportunity_score || "").toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    formatDate(assessment.date).toLowerCase().includes(searchQuery.toLowerCase()) ||
    (assessment.status || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const itemsPerPage = 10;
  const totalItems = filteredAssessments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAssessments.slice(indexOfFirstItem, indexOfLastItem);

  const handleAddAssessment = () => {
    navigate("/company/qms/add-opportunity-assessment");
  };

  const handleDraftOpportunityAssessment = () => {
    navigate("/company/qms/draft-opportunity-assessment");
  };

  const handleViewAssessment = (id) => {
    navigate(`/company/qms/view-opportunity-assessment/${id}`);
  };

  const handleEditAssessment = (id) => {
    navigate(`/company/qms/edit-opportunity-assessment/${id}`);
  };

  // Handle delete
  const handleDeleteAssessment = async (assessment) => {
    if (!window.confirm(`Are you sure you want to delete the assessment for "${assessment.activity}"?`)) {
      return;
    }

    try {
      setDeleteLoading(true);
      await axios.delete(`${BASE_URL}/qms/risk-opportunity/${assessment.id}/`,  
      );

      // Remove from local state
      setAssessments(assessments.filter((item) => item.id !== assessment.id));
      
      // Reset to first page if current page becomes empty
      const remainingItems = assessments.length - 1;
      const newTotalPages = Math.ceil(remainingItems / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (error) {
      console.error("Error deleting assessment:", error);
      alert("Failed to delete assessment. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Display loading state
  if (loading) {
    return (
      <div className="bg-[#1C1C24] not-found p-5 rounded-lg flex justify-center items-center">
        <p>Loading Opportunity Assessments...</p>
      </div>
    );
  }

  // Display error state
  if (error && !loading) {
    return (
      <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
        <div className="text-red-500 text-center mb-4">{error}</div>
        <div className="text-center">
          <button
            onClick={fetchAssessments}
            className="add-manual-btn duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="list-manual-head">List Opportunity Assessments</h1>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="serach-input-manual focus:outline-none bg-transparent"
            />
            <div className="absolute right-[1px] top-[2px] text-white bg-[#24242D] p-[10.5px] w-[55px] rounded-tr-[6px] rounded-br-[6px] flex justify-center items-center">
              <Search size={18} />
            </div>
          </div>
          <button
            className="flex items-center justify-center add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white !w-[100px]"
            onClick={() => handleDraftOpportunityAssessment()}
          >
            <span>Drafts</span>
          </button>
          <button
            className="flex items-center justify-center add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
            onClick={handleAddAssessment}
          >
            <span>Add Opportunity Assessment</span>
            <img
              src={plusIcon}
              alt="Add Icon"
              className="w-[18px] h-[18px] qms-add-plus"
            />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-[#24242D]">
            <tr className="h-[48px]">
              <th className="pl-4 pr-2 text-left add-manual-theads">No</th>
              <th className="px-2 text-left add-manual-theads">
                Activity/Process
              </th>
              <th className="px-2 text-left add-manual-theads">
                Potential Opportunity
              </th>
              <th className="px-2 text-left add-manual-theads" colSpan={2}>
                Opportunity Score
              </th>
              <th className="px-2 text-left add-manual-theads">Due Date</th>
              <th className="px-2 text-center add-manual-theads">Status</th>
              <th className="px-2 text-center add-manual-theads">View</th>
              <th className="px-2 text-center add-manual-theads">Edit</th>
              <th className="pr-2 text-center add-manual-theads">Delete</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((assessment, index) => {
                const ranking = getRiskRanking(assessment.opportunity_score);
                return (
                  <tr
                    key={assessment.id}
                    className="border-b border-[#383840] hover:bg-[#1a1a20] h-[50px] cursor-pointer"
                  >
                    <td className="pl-5 pr-2 add-manual-datas">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-2 add-manual-datas">
                      {assessment.activity || "N/A"}
                    </td>
                    <td className="px-2 add-manual-datas">
                      {assessment.potential_opportunity || "N/A"}
                    </td>
                    <td className="px-2 add-manual-datas text-center w-[6%]">
                      {assessment.opportunity_score || "N/A"}
                    </td>
                    <td className="pl-1 add-manual-datas">
                      <span
                        className={`inline-block rounded-[4px] px-[15px] py-[5px] text-xs ${getRankingColor(ranking)}`}
                      >
                        {ranking}
                      </span>
                    </td>
                    <td className="px-2 add-manual-datas">
                      {formatDate(assessment.date)}
                    </td>
                    <td className="px-2 add-manual-datas !text-center">
                      <span
                        className={`inline-block rounded-[4px] px-[6px] py-[3px] text-xs ${
                          assessment.status === "Achieved"
                            ? "bg-[#36DDAE11] text-[#36DDAE]"
                            : assessment.status === "Not Achieved"
                            ? "bg-[#dd363611] text-[#dd3636]"
                            : assessment.status === "Cancelled"
                            ? "bg-[#1E84AF11] text-[#1E84AF]"
                            : "bg-[#FFD70011] text-[#FFD700]"
                        }`}
                      >
                        {assessment.status || "N/A"}
                      </span>
                    </td>
                    <td className="px-2 add-manual-datas !text-center">
                      <button onClick={() => handleViewAssessment(assessment.id)}>
                        <img
                          src={viewIcon}
                          alt="View Icon"
                          style={{
                            filter:
                              "brightness(0) saturate(100%) invert(69%) sepia(32%) saturate(4%) hue-rotate(53deg) brightness(94%) contrast(86%)",
                          }}
                        />
                      </button>
                    </td>
                    <td className="px-2 add-manual-datas !text-center">
                      <button onClick={() => handleEditAssessment(assessment.id)}>
                        <img src={editIcon} alt="Edit Icon" />
                      </button>
                    </td>
                    <td className="px-2 add-manual-datas !text-center">
                      <button 
                        onClick={() => handleDeleteAssessment(assessment)}
                        disabled={deleteLoading}
                        className={deleteLoading ? "opacity-50 cursor-not-allowed" : ""}
                      >
                        <img src={deleteIcon} alt="Delete Icon" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="10" className="py-4 text-center not-found">
                  {searchQuery ? "No matching assessments found" : "No Opportunity Assessments Found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 text-sm">
          <div className="text-white total-text">Total-{totalItems}</div>
          <div className="flex items-center gap-5">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`cursor-pointer swipe-text ${
                currentPage === 1 ? "opacity-50" : ""
              }`}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`${
                  currentPage === number ? "pagin-active" : "pagin-inactive"
                }`}
              >
                {number}
              </button>
            ))}

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`cursor-pointer swipe-text ${
                currentPage === totalPages ? "opacity-50" : ""
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Show total count even when pagination is not needed */}
      {totalPages <= 1 && totalItems > 0 && (
        <div className="flex justify-start items-center mt-6 text-sm">
          <div className="text-white total-text">Total-{totalItems}</div>
        </div>
      )}
    </div>
  );
};

export default QmsListOpportunityAssessment;