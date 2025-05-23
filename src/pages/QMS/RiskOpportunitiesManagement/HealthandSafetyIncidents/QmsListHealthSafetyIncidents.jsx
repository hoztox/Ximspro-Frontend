import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import plusIcon from "../../../../assets/images/Company Documentation/plus icon.svg";
import viewIcon from "../../../../assets/images/Companies/view.svg";
import editIcon from "../../../../assets/images/Company Documentation/edit.svg";
import deleteIcon from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../../Utils/Config";
import axios from "axios";

const QmsListHealthSafetyIncidents = () => {
  // State
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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
  // Fetch incidents data from the API
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setLoading(true);
        const companyId = getUserCompanyId();
        const response = await axios.get(
          `${BASE_URL}/qms/safety_incidents/company/${companyId}/`
        );
        console.log("fetch health incidents:", response.data);

        // Format and sort data by id
        const formattedData = response.data
          .map((incident) => ({
            id: incident.id,
            title: incident.title || "N/A",
            source: incident.source || "N/A",
            incident_no: incident.incident_no,
            date_raised: incident.date_raised
              ? formatDate(incident.date_raised)
              : "N/A",
            completed_by: incident.date_completed
              ? formatDate(incident.date_completed)
              : "N/A",
            reported_by: incident.reported_by
              ? `${incident.reported_by.first_name} ${incident.reported_by.last_name}`
              : "N/A",
            status: incident.status,
          }))
          .sort((a, b) => a.id - b.id); // Sort by id in ascending order

        setIncidents(formattedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching health incidents:", err);
        setError("Failed to load incidents. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  // Format date from YYYY-MM-DD to DD-MM-YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "/");
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Pagination
  const itemsPerPage = 10;
  const totalItems = incidents.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = incidents.slice(indexOfFirstItem, indexOfLastItem);

  // Search functionality
  const filteredIncidents = currentItems.filter(
    (incident) =>
      incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.reported_by.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.incident_no.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddIncident = () => {
    navigate("/company/qms/add-health-safety-incidents");
  };

  const handleDraftIncidents = () => {
    navigate("/company/qms/draft-health-safety-incidents");
  };

  const handleViewIncident = (id) => {
    navigate(`/company/qms/view-health-safety-incidents/${id}`);
  };

  const handleEditIncident = (id) => {
    navigate(`/company/qms/edit-health-safety-incidents/${id}`);
  };

  const handleDeleteIncident = async (id) => {
    if (window.confirm("Are you sure you want to delete this incident?")) {
      try {
        await axios.delete(`${BASE_URL}/qms/safety_incidents/${id}/`);
        // Update the incidents list after deletion
        setIncidents(incidents.filter((incident) => incident.id !== id));
      } catch (err) {
        console.error("Error deleting incident:", err);
        alert("Failed to delete incident. Please try again.");
      }
    }
  };

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Display loading or error states
  if (loading) {
    return (
      <div className="bg-[#1C1C24] not-found p-5 rounded-lg flex justify-center items-center">
        <p>Loading Health and Safety Incidents...</p>
      </div>
    );
  }

  // if (error) {
  //     return (
  //         <div className="bg-[#1C1C24] text-white p-5 rounded-lg flex justify-center items-center h-[400px]">
  //             <p className="text-red-400">{error}</p>
  //         </div>
  //     );
  // }

  return (
    <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="list-manual-head">List Health and Safety Incidents</h1>
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
            onClick={handleDraftIncidents}
          >
            <span>Drafts</span>
          </button>
          <button
            className="flex items-center justify-center add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
            onClick={handleAddIncident}
          >
            <span>Add Health and Safety Incidents</span>
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
              <th className="px-2 text-left add-manual-theads">Title</th>
              <th className="px-2 text-left add-manual-theads">Source</th>
              <th className="px-2 text-left add-manual-theads">Incident No</th>
              <th className="px-2 text-left add-manual-theads">Report By</th>
              <th className="px-2 text-left add-manual-theads">Date Raised</th>
              <th className="px-2 text-left add-manual-theads">Completed By</th>
              <th className="px-2 text-center add-manual-theads">Status</th>
              <th className="px-2 text-center add-manual-theads">View</th>
              <th className="px-2 text-center add-manual-theads">Edit</th>
              <th className="pr-2 text-center add-manual-theads">Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredIncidents.length > 0 ? (
              filteredIncidents.map((incident, index) => (
                <tr
                  key={incident.id}
                  className="border-b border-[#383840] hover:bg-[#1a1a20] h-[50px] cursor-pointer"
                >
                  <td className="pl-5 pr-2 add-manual-datas">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="px-2 add-manual-datas">{incident.title}</td>
                  <td className="px-2 add-manual-datas">{incident.source}</td>
                  <td className="px-2 add-manual-datas">
                    {incident.incident_no}
                  </td>
                  <td className="px-2 add-manual-datas">
                    {incident.reported_by}
                  </td>
                  <td className="px-2 add-manual-datas">
                    {incident.date_raised}
                  </td>
                  <td className="px-2 add-manual-datas">
                    {incident.completed_by}
                  </td>
                  <td className="px-2 add-manual-datas !text-center">
                    <span
                      className={`inline-block rounded-[4px] px-[6px] py-[3px] text-xs ${
                        incident.status === "Completed"
                          ? "bg-[#36DDAE11] text-[#36DDAE]"
                          : incident.status === "Pending"
                          ? "bg-[#1E84AF11] text-[#1E84AF]"
                          : "bg-[#dd363611] text-[#dd3636]"
                      }`}
                    >
                      {incident.status}
                    </span>
                  </td>
                  <td className="px-2 add-manual-datas !text-center">
                    <button onClick={() => handleViewIncident(incident.id)}>
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
                    <button onClick={() => handleEditIncident(incident.id)}>
                      <img src={editIcon} alt="Edit Icon" />
                    </button>
                  </td>
                  <td className="px-2 add-manual-datas !text-center">
                    <button onClick={() => handleDeleteIncident(incident.id)}>
                      <img src={deleteIcon} alt="Delete Icon" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="py-4 text-center not-found">
                  No Health and Safety Incidents Found
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

export default QmsListHealthSafetyIncidents;
