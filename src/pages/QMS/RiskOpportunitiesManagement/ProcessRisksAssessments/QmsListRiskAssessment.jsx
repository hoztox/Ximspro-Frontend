import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import plusIcon from "../../../../assets/images/Company Documentation/plus icon.svg";
import viewIcon from "../../../../assets/images/Companies/view.svg";
import editIcon from "../../../../assets/images/Company Documentation/edit.svg";
import deleteIcon from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../../Utils/Config";
import axios from "axios";

const QmsListRiskAssessment = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();



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

  const getRelevantUserId = () => {
    const userRole = localStorage.getItem("role");
    if (userRole === "user") {
      const userId = localStorage.getItem("user_id");
      if (userId) return userId;
    }
    const companyId = localStorage.getItem("company_id");
    if (companyId) return companyId;
    return null;
  };



useEffect(() => {
  fetchAssessments();
}, []);

const fetchAssessments = async () => {
  try {
    setLoading(true);

    const companyId = getUserCompanyId();
    const response = await fetch(`${BASE_URL}/qms/process-risk-assessment/company/${companyId}/`);

    const data = await response.json();

 
    if (Array.isArray(data)) {
      setAssessments(data);
    } else {
      setAssessments([]);  
    }
  } catch (error) {
    console.error('Error fetching assessments:', error);
    setError('Failed to load risk assessments. Please try again.');
    setAssessments([]); // optional: set to empty if error occurs
  } finally {
    setLoading(false);
  }
};



  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Pagination
  const itemsPerPage = 10;

  // Search functionality - filter all assessments first
  const filteredAssessments = assessments.filter((assessment) =>
    assessment.activity?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assessment.hazard?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assessment.owner?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assessment.date?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalItems = filteredAssessments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Get current items after filtering
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAssessments.slice(indexOfFirstItem, indexOfLastItem);

  const handleAddRiskAssessment = () => {
    navigate("/company/qms/add-process-risks-assessments");
  };

  const handleDraftRiskAssessment = () => {
    navigate("/company/qms/draft-process-risks-assessments");
  };

  const handleViewRiskAssessment = (id) => {
    navigate(`/company/qms/view-process-risks-assessments/${id}`);
  };

  const handleEditRiskAssessment = (id) => {
    navigate(`/company/qms/edit-process-risks-assessments/${id}`);
  };

  // Handle delete with API call
  const handleDeleteRiskAssessment = async (assessment) => {
    if (!window.confirm('Are you sure you want to delete this risk assessment?')) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/qms/process-risk-assessment/${assessment.id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers if needed
          // 'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Remove from local state
        setAssessments(assessments.filter((item) => item.id !== assessment.id));
        // Show success message
        alert('Risk assessment deleted successfully');
      } else {
        throw new Error('Failed to delete assessment');
      }
    } catch (error) {
      console.error('Error deleting assessment:', error);
      alert('Failed to delete risk assessment. Please try again.');
    }
  };

  // Utility function to get risk ranking letter based on category
  const getRiskRanking = (category) => {
    switch (category) {
      case "Very High Risk":
        return "VH";
      case "High Risk":
        return "H";
      case "Moderate Risk":
        return "M";
      case "Low Risk":
        return "L";
      default:
        return "N/A";
    }
  };

 
  const getRankingColorClass = (category) => {
    switch (category) {
      case "Very High Risk":
         return "bg-[#dd363611] text-[#dd3636]";
      case "High Risk":
       return "bg-[#DD6B0611] text-[#DD6B06]";
      case "Moderate Risk":
         return "bg-[#FFD70011] text-[#FFD700]";
      case "Low Risk":
        return "bg-[#36DDAE11] text-[#36DDAE]";
      default:
        return "bg-[#85858511] text-[#858585]";
    }
  };

  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); 
  };

  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

 
  if (loading) {
    return (
      <div className="bg-[#1C1C24] not-found p-5 rounded-lg flex justify-center items-center">
        <p>Loading Risk Assessments...</p>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchAssessments}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
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
        <h1 className="list-manual-head">List Risk Assessment</h1>
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
            onClick={() => handleDraftRiskAssessment()}
          >
            <span>Drafts</span>
          </button>
          <button
            className="flex items-center justify-center add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
            onClick={handleAddRiskAssessment}
          >
            <span>Add Risk Assessment</span>
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
              <th className="px-2 text-left add-manual-theads">Activity</th>
              <th className="px-2 text-left add-manual-theads">Hazard</th>
              <th className="px-2 text-left add-manual-theads" colSpan={2}>
                Risk Assessment
              </th>
              <th className="px-2 text-left add-manual-theads">Action Owner</th>
              <th className="px-2 text-left add-manual-theads" colSpan={2}>
                Residual Risk
              </th>
              <th className="px-2 text-left add-manual-theads">Review Date</th>
              <th className="px-2 text-center add-manual-theads">View</th>
              <th className="px-2 text-center add-manual-theads">Edit</th>
              <th className="pr-2 text-center add-manual-theads">Delete</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((assessment, index) => (
                <tr
                  key={assessment.id}
                  className="border-b border-[#383840] hover:bg-[#1a1a20] h-[50px] cursor-pointer"
                >
                  <td className="pl-5 pr-2 add-manual-datas">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="px-2 add-manual-datas">
                    {assessment.activity || 'N/A'}
                  </td>
                  <td className="px-2 add-manual-datas">
                    {assessment.hazard || 'N/A'}
                  </td>
                  <td className="px-2 add-manual-datas text-center w-[56px]">
                    {assessment.risk_score || 'N/A'}
                  </td>
                  <td className="pl-1 add-manual-datas">
                    <span
                      className={`inline-block rounded-[4px] px-[15px] py-[5px] text-xs ${getRankingColorClass(assessment.risk_category)}`}
                    >
                      {getRiskRanking(assessment.risk_category)}
                    </span>
                  </td>
                  <td className="px-2 add-manual-datas">
                    {assessment.owner
                      ? `${assessment.owner.first_name || ''} ${assessment.owner.last_name || ''}`.trim() ||
                      assessment.owner.username
                      : 'N/A'}
                  </td>

                  <td className="px-2 add-manual-datas text-center w-[45px]">
                    {assessment.residual_score || 'N/A'}
                  </td>
                  <td className="pl-1 add-manual-datas">
                    <span
                      className={`inline-block rounded-[4px] px-[15px] py-[5px] text-xs ${getRankingColorClass(assessment.residual_category)}`}
                    >
                      {getRiskRanking(assessment.residual_category)}
                    </span>
                  </td>
                  <td className="px-2 add-manual-datas">
                    {formatDate(assessment.date)}
                  </td>
                  <td className="px-2 add-manual-datas !text-center">
                    <button onClick={() => handleViewRiskAssessment(assessment.id)}>
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
                    <button onClick={() => handleEditRiskAssessment(assessment.id)}>
                      <img src={editIcon} alt="Edit Icon" />
                    </button>
                  </td>
                  <td className="px-2 add-manual-datas !text-center">
                    <button onClick={() => handleDeleteRiskAssessment(assessment)}>
                      <img src={deleteIcon} alt="Delete Icon" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="py-4 text-center not-found">
                  {searchQuery ? 'No matching risk assessments found' : 'No Risk Assessments Found'}
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
              className={`cursor-pointer swipe-text ${currentPage === 1 ? "opacity-50" : ""
                }`}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`${currentPage === number ? "pagin-active" : "pagin-inactive"
                  }`}
              >
                {number}
              </button>
            ))}

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`cursor-pointer swipe-text ${currentPage === totalPages ? "opacity-50" : ""
                }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QmsListRiskAssessment;