
import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import plusIcon from '../../../../assets/images/Company Documentation/plus icon.svg';
import viewIcon from '../../../../assets/images/Companies/view.svg';
import editIcon from '../../../../assets/images/Company Documentation/edit.svg';
import deleteIcon from '../../../../assets/images/Company Documentation/delete.svg';
import { BASE_URL } from '../../../../Utils/Config';

const QmsDraftEnvironmentalIncidents = () => {
  const navigate = useNavigate();
  const [environmentalIncidents, setEnvironmentalIncidents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const itemsPerPage = 10;

  // Get company ID from localStorage
  const getUserCompanyId = () => {
    const storedCompanyId = localStorage.getItem('company_id');
    if (storedCompanyId) return storedCompanyId;
    const userRole = localStorage.getItem('role');
    if (userRole === 'user') {
      const userData = localStorage.getItem('user_company_id');
      if (userData) {
        try {
          return JSON.parse(userData);
        } catch (e) {
          console.error('Error parsing user company ID:', e);
          return null;
        }
      }
    }
    return null;
  };

  const getRelevantUserId = () => {
    const userRole = localStorage.getItem('role');
    if (userRole === 'user') {
        const userId = localStorage.getItem('user_id');
        if (userId) return userId;
    }
    const companyId = localStorage.getItem('company_id');
    if (companyId) return companyId;
    return null;
};
  const companyId = getUserCompanyId();
  const userId = getRelevantUserId();
  // Fetch draft incidents from API
  const fetchDraftIncidents = async (page = 1, query = '') => {
    if (!userId) {
      setError('user Id not found. Please log in again.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
        const userId = getRelevantUserId();
      const response = await axios.get(`${BASE_URL}/qms/incident/draft/${userId}/`, {
        params: {
          page: page,
          page_size: itemsPerPage,
          q: query,
          is_draft: true,
        },
      });

      // Handle flat array response or paginated response
      const incidents = Array.isArray(response.data) ? response.data : response.data.results || [];
      console.log('Fetched draft incidents:', incidents);

      // Filter drafts client-side if API doesn't
      const draftIncidents = incidents.filter((incident) => incident.is_draft);

      // Client-side pagination if API doesn't paginate
      const startIndex = (page - 1) * itemsPerPage;
      const paginatedIncidents = draftIncidents.slice(startIndex, startIndex + itemsPerPage);

      setEnvironmentalIncidents(paginatedIncidents);
      setTotalItems(draftIncidents.length);
      setTotalPages(Math.ceil(draftIncidents.length / itemsPerPage) || 1);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching draft incidents:', error);
      setError('Failed to load draft incidents. Please try again.');
      setEnvironmentalIncidents([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and refetch on search or page change
  useEffect(() => {
    fetchDraftIncidents(currentPage, searchQuery);
  }, [currentPage, searchQuery, companyId]);

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Navigation handlers
  const handleClose = () => {
    navigate('/company/qms/list-environmantal-incident');
  };

  const handleViewDraftEnvironmentalIncident = (id) => {
    navigate(`/company/qms/view-draft-environmantal-incident/${id}`);
  };

  const handleEditDraftEnvironmentalIncident = (id) => {
    navigate(`/company/qms/edit-draft-environmantal-incident/${id}`);
  };

  // Delete draft incident
  const handleDeleteDraftEnvironmentalIncident = async (id) => {
    if (!window.confirm('Are you sure you want to delete this draft incident?')) return;

    try {
      await axios.delete(`${BASE_URL}/qms/incident-get/${id}/`);
      setEnvironmentalIncidents((prev) => prev.filter((incident) => incident.id !== id));
      setTotalItems((prev) => prev - 1);
      if (environmentalIncidents.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchDraftIncidents(currentPage, searchQuery);
      }
    } catch (error) {
      console.error('Error deleting draft incident:', error);
      setError('Failed to delete draft incident. Please try again.');
    }
  };

  // Pagination handlers
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="list-manual-head">Draft Environmental Incidents</h1>
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
            onClick={handleClose}
            className="bg-[#24242D] p-2 rounded-md"
          >
            <X className="text-white" />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500 bg-opacity-20 text-red-300 px-4 py-2 mb-4 rounded">{error}</div>
      )}

      {/* Loading State */}
      {isLoading && <div className="text-center py-4">Loading...</div>}

      {/* Table */}
      {!isLoading && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-[#24242D]">
              <tr className="h-[48px]">
                <th className="pl-4 pr-2 text-left add-manual-theads">No</th>
                <th className="px-2 text-left add-manual-theads">Title</th>
                <th className="px-2 text-left add-manual-theads">Source</th>
                <th className="px-2 text-left add-manual-theads">EI No</th>
                <th className="px-2 text-left add-manual-theads">Report By</th>
                <th className="px-2 text-left add-manual-theads">Date Raised</th>
                <th className="px-2 text-left add-manual-theads">Completed By</th>
                <th className="px-2 text-center add-manual-theads">Status</th>
                <th className="px-2 text-center add-manual-theads">Action</th>
                <th className="px-2 text-center add-manual-theads">View</th>
                <th className="px-2 text-center add-manual-theads">Edit</th>
                <th className="px-2 text-center add-manual-theads">Delete</th>
              </tr>
            </thead>
            <tbody>
              {environmentalIncidents.length === 0 && (
                <tr>
                  <td colSpan="12" className="text-center py-4 not-found">
                    No draft incidents found.
                  </td>
                </tr>
              )}
              {environmentalIncidents.map((incident) => (
                <tr
                  key={incident.id}
                  className="border-b border-[#383840] hover:bg-[#1a1a20] h-[50px] cursor-pointer"
                >
                  <td className="pl-5 pr-2 add-manual-datas">{incident.id}</td>
                  <td className="px-2 add-manual-datas">{incident.title || 'Untitled'}</td>
                  <td className="px-2 add-manual-datas">{incident.source || '-'}</td>
                  <td className="px-2 add-manual-datas">{incident.incident_no || '-'}</td>
                  <td className="px-2 add-manual-datas">
                    {incident.reported_by
                      ? `${incident.reported_by.first_name} ${incident.reported_by.last_name || ''}`
                      : '-'}
                  </td>
                  <td className="px-2 add-manual-datas">
                    {incident.date_raised
                      ? new Date(incident.date_raised).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        }).replace(/\//g, '/')
                      : '-'}
                  </td>
                  <td className="px-2 add-manual-datas">
                    {incident.date_completed
                      ? new Date(incident.date_completed).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        }).replace(/\//g, '/')
                      : '-'}
                  </td>
                  <td className="px-2 add-manual-datas !text-center">
                    <span
                      className={`inline-block rounded-[4px] px-[6px] py-[3px] text-xs ${
                        incident.status === 'Completed'
                          ? 'bg-[#36DDAE11] text-[#36DDAE]'
                          : incident.status === 'Pending'
                          ? 'bg-[#1E84AF11] text-[#1E84AF]'
                          : 'bg-[#dd363611] text-[#dd3636]'
                      }`}
                    >
                      {incident.status}
                    </span>
                  </td>
                  <td className="px-2 add-manual-datas !text-center">
                    <button
                      onClick={() => handleEditDraftEnvironmentalIncident(incident.id)}
                      className="text-[#1E84AF]"
                    >
                      Click to Continue
                    </button>
                  </td>
                  <td className="px-2 add-manual-datas !text-center">
                    <button onClick={() => handleViewDraftEnvironmentalIncident(incident.id)}>
                      <img
                        src={viewIcon}
                        alt="View Icon"
                        style={{
                          filter:
                            'brightness(0) saturate(100%) invert(69%) sepia(32%) saturate(4%) hue-rotate(53deg) brightness(94%) contrast(86%)',
                        }}
                      />
                    </button>
                  </td>
                  <td className="px-2 add-manual-datas !text-center">
                    <button onClick={() => handleEditDraftEnvironmentalIncident(incident.id)}>
                      <img src={editIcon} alt="Edit Icon" />
                    </button>
                  </td>
                  <td className="px-2 add-manual-datas !text-center">
                    <button onClick={() => handleDeleteDraftEnvironmentalIncident(incident.id)}>
                      <img src={deleteIcon} alt="Delete Icon" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalItems > 0 && (
        <div className="flex justify-between items-center mt-6 text-sm">
          <div className="text-white total-text">Total-{totalItems}</div>
          <div className="flex items-center gap-5">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`cursor-pointer swipe-text ${currentPage === 1 ? 'opacity-50' : ''}`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`${currentPage === number ? 'pagin-active' : 'pagin-inactive'}`}
              >
                {number}
              </button>
            ))}
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`cursor-pointer swipe-text ${currentPage === totalPages ? 'opacity-50' : ''}`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QmsDraftEnvironmentalIncidents;
