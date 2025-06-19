import React, { useState } from "react";
import { Search } from "lucide-react";
import plusIcon from "../../../../assets/images/Company Documentation/plus icon.svg";
import viewIcon from "../../../../assets/images/Companies/view.svg";
import editIcon from "../../../../assets/images/Company Documentation/edit.svg";
import deleteIcon from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from "react-router-dom";

const QmsListOpportunityAssessment = () => {
  const [assessments, setAssessments] = useState([
    {
      id: 1,
      activity: "Welding",
      potential_opportunity: "Anonymous",
      opportunity_score: "25",
      due_date: "03/12/2024",
      status: "Achieved",
      ranking: "H",
    },
    {
      id: 2,
      activity: "Welding",
      potential_opportunity: "Anonymous",
      opportunity_score: "3",
      due_date: "20/02/2025",
      status: "Not Achieved",
      ranking: "L",
    },
    {
      id: 3,
      activity: "Welding",
      potential_opportunity: "Anonymous",
      opportunity_score: "25",
      due_date: "10/03/2025",
      status: "Cancelled",
      ranking: "H",
    },
    {
      id: 4,
      activity: "Welding",
      potential_opportunity: "Anonymous",
      opportunity_score: "15",
      due_date: "15/04/2025",
      status: "Hold",
      ranking: "H",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Pagination
  const itemsPerPage = 10;
  const totalItems = assessments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = assessments.slice(indexOfFirstItem, indexOfLastItem);

  // Search functionality
  const filteredAssessments = currentItems.filter(
    (assessment) =>
      assessment.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.potential_opportunity
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      assessment.opportunity_score
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      assessment.due_date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddAssessment = () => {
    navigate("/company/qms/add-opportunity-assessment");
  };

  const handleViewAssessment = (id) => {
    navigate(`/company/qms/view-opportunity-assessment/${id}`);
  };

  const handleEditAssessment = (id) => {
    navigate(`/company/qms/edit-opportunity-assessment/${id}`);
  };

  // Handle delete
  const openDeleteModal = (assessment) => {
    setAssessments(assessments.filter((item) => item.id !== assessment.id));
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
            {filteredAssessments.length > 0 ? (
              filteredAssessments.map((assessment, index) => (
                <tr
                  key={assessment.id}
                  className="border-b border-[#383840] hover:bg-[#1a1a20] h-[50px] cursor-pointer"
                >
                  <td className="pl-5 pr-2 add-manual-datas">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="px-2 add-manual-datas">
                    {assessment.activity}
                  </td>
                  <td className="px-2 add-manual-datas">
                    {assessment.potential_opportunity}
                  </td>
                  <td className="pl-2 pr-1 add-manual-datas">
                    {assessment.opportunity_score}
                  </td>
                  <td className="pl-1 pr-10 add-manual-datas -ml-4">
                    <span
                      className={`inline-block rounded-[4px] px-[15px] py-[5px] text-xs ${
                        assessment.ranking === "H"
                          ? "bg-[#dd363611] text-[#dd3636]"
                          : "bg-[#36DDAE11] text-[#36DDAE]"
                      }`}
                    >
                      {assessment.ranking}
                    </span>
                  </td>

                  <td className="px-2 add-manual-datas">
                    {assessment.due_date}
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
                      {assessment.status}
                    </span>
                  </td>
                  <td className="px-2 add-manual-datas !text-center">
                    <button
                     onClick={() => handleViewAssessment(assessment.id)}
                    >
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
                    <button
                    onClick={() => handleEditAssessment(assessment.id)}
                    >
                      <img src={editIcon} alt="Edit Icon" />
                    </button>
                  </td>
                  <td className="px-2 add-manual-datas !text-center">
                    <button onClick={() => openDeleteModal(assessment)}>
                      <img src={deleteIcon} alt="Delete Icon" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="py-4 text-center not-found">
                  No Opportunity Assessments Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
    </div>
  );
};

export default QmsListOpportunityAssessment;
