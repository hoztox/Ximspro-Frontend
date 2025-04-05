import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import plusicon from "../../../../assets/images/Company Documentation/plus icon.svg";
import views from "../../../../assets/images/Companies/view.svg";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import publish from "../../../../assets/images/Modal/publish.svg"
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { BASE_URL } from "../../../../Utils/Config";

const QmsProcedure = () => {
  const [procedures, setProcedures] = useState([]);
  const [draftCount, setDraftCount] = useState(0);
  const [corrections, setCorrections] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const proceduresPerPage = 10;

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);




  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '-');
  };

  const getCurrentUser = () => {
    const role = localStorage.getItem('role');

    try {
      if (role === 'company') {
        // Retrieve company user data
        const companyData = {};
        Object.keys(localStorage)
          .filter(key => key.startsWith('company_'))
          .forEach(key => {
            const cleanKey = key.replace('company_', '');
            try {
              companyData[cleanKey] = JSON.parse(localStorage.getItem(key));
            } catch (e) {
              companyData[cleanKey] = localStorage.getItem(key);
            }
          });

        // Add additional fields from localStorage
        companyData.role = role;
        companyData.company_id = localStorage.getItem('company_id');
        companyData.company_name = localStorage.getItem('company_name');
        companyData.email_address = localStorage.getItem('email_address');

        console.log("Company User Data:", companyData);
        return companyData;
      } else if (role === 'user') {
        // Retrieve regular user data
        const userData = {};
        Object.keys(localStorage)
          .filter(key => key.startsWith('user_'))
          .forEach(key => {
            const cleanKey = key.replace('user_', '');
            try {
              userData[cleanKey] = JSON.parse(localStorage.getItem(key));
            } catch (e) {
              userData[cleanKey] = localStorage.getItem(key);
            }
          });

        // Add additional fields from localStorage
        userData.role = role;
        userData.user_id = localStorage.getItem('user_id');

        console.log("Regular User Data:", userData);
        return userData;
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
      return null;
    }
  };

  const getUserCompanyId = () => {
    const role = localStorage.getItem("role");

    if (role === "company") {
      return localStorage.getItem("company_id");
    } else if (role === "user") {

      try {
        const userCompanyId = localStorage.getItem("user_company_id");
        return userCompanyId ? JSON.parse(userCompanyId) : null;
      } catch (e) {
        console.error("Error parsing user company ID:", e);
        return null;
      }
    }

    return null;
  };

  const fetchProcedures = async () => {
    try {
      setLoading(true);
      const companyId = getUserCompanyId();
      const response = await axios.get(`${BASE_URL}/qms/procedures/${companyId}/`);

      setProcedures(response.data);
      console.log("Procedures Data:", response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching procedures:", err);    
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // First, fetch procedures
        const companyId = getUserCompanyId();
        const proceduresResponse = await axios.get(`${BASE_URL}/qms/procedures/${companyId}/`);

        // Set procedures first
        setProcedures(proceduresResponse.data);

        // Then fetch corrections for all procedures
        const correctionsPromises = proceduresResponse.data.map(async (procedure) => {
          try {
            const correctionResponse = await axios.get(`${BASE_URL}/qms/procedures/${procedure.id}/corrections/`);
            return { procedureId: procedure.id, corrections: correctionResponse.data };
          } catch (correctionError) {
            console.error(`Error fetching corrections for procedures ${procedure.id}:`, correctionError);
            return { procedureId: procedure.id, corrections: [] };
          }
        });

        // Process all corrections
        const correctionResults = await Promise.all(correctionsPromises);

        // Transform corrections into the dictionary format
        const correctionsByProcedure = correctionResults.reduce((acc, result) => {
          acc[result.procedureId] = result.corrections;
          return acc;
        }, {});

        setCorrections(correctionsByProcedure);

        // Set current user and clear loading state
        setCurrentUser(getCurrentUser());
        setLoading(false);
      } catch (error) {
        console.error("Error fetching procedures or corrections:", error);
        setLoading(false);
      }
    };

    fetchAllData();
  }, []); // Empty dependency array to run only once on component mount

  useEffect(() => {
    fetchProcedures();

    setCurrentUser(getCurrentUser());
  }, []);

  const handleClickApprove = (id) => {
    navigate(`/company/qms/viewprocedure/${id}`);
  };

  // Delete procedures
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this procedure?")) {
      try {
        await axios.delete(`${BASE_URL}/qms/procedure-detail/${id}/`);
        alert("Procedure deleted successfully");
        fetchProcedures();
      } catch (err) {
        console.error("Error deleting procedures:", err);
        alert("Failed to delete procedures");
      }
    }
  };
  useEffect(() => {
    const fetchDraftProcedures = async () => {
      try {
        const companyId = getUserCompanyId();
        const response = await axios.get(`${BASE_URL}/qms/procedures/drafts-count/${companyId}/`);
        setDraftCount(response.data.count);
      } catch (error) {
        console.error("Error fetching draft procedures:", error);
        setDraftCount(0);
      }
    };

    fetchDraftProcedures();
  }, []);

  const filteredProcedure = procedures.filter(procedure =>
    (procedure.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (procedure.no?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (procedure.approved_by?.first_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (procedure.rivision?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (formatDate(procedure.date)?.replace(/^0+/, '') || '').includes(searchQuery.replace(/^0+/, ''))
  );

  const totalPages = Math.ceil(filteredProcedure.length / proceduresPerPage);
  const paginatedProcedure = filteredProcedure.slice((currentPage - 1) * proceduresPerPage, currentPage * proceduresPerPage);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleQMSAddProcedure = () => {
    navigate('/company/qms/addprocedure');
  };

  const handleEdit = () => {
    navigate(`/company/qms/editprocedure/${id}`);
  };

  const handleView = (id) => {
    navigate(`/company/qms/viewprocedure/${id}`);
  };

  const handleProcedureDraft = () => {
    navigate('/company/qms/draftprocedure')
  }

  const handlePublish = (procedure) => {

    setShowPublishModal(true);
    setPublishSuccess(false);
  };

  const closePublishModal = () => {
    if (publishSuccess) {
      fetchProcedures();
    }

    setShowPublishModal(false);
    setTimeout(() => {

      setPublishSuccess(false);
    }, 300);
  };

  const canReview = (procedure) => {
    const currentUserId = Number(localStorage.getItem('user_id'));
    const procedureCorrections = corrections[procedure.id] || [];

    console.log('Reviewing Conditions Debug:', {
      currentUserId,
      checkedById: procedure.checked_by?.id,
      status: procedure.status,
      corrections: procedureCorrections,
      toUserId: procedureCorrections.length > 0 ? procedureCorrections[0].to_user?.id : null,
    });

    if (procedure.status === "Pending for Review/Checking") {
      return currentUserId === procedure.checked_by?.id;
    }

    if (procedure.status === "Correction Requested") {
      return procedureCorrections.some(correction =>
        correction.to_user?.id === currentUserId && currentUserId === correction.to_user?.id
      );
    }

    if (procedure.status === "Reviewed,Pending for Approval") {
      return currentUserId === procedure.approved_by?.id;
    }

    return false;
  };

  return (
    <div className="bg-[#1C1C24] list-manual-main">
      <div className="flex items-center justify-between px-[14px] pt-[24px]">
        <h1 className="list-manual-head">List Procedure Sections</h1>
        <div className="flex space-x-5">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="serach-input-manual focus:outline-none bg-transparent"
            />
            <div className='absolute right-[1px] top-[2px] text-white bg-[#24242D] p-[10.5px] w-[55px] rounded-tr-[6px] rounded-br-[6px] flex justify-center items-center'>
              <Search size={18} />
            </div>
          </div>
          <button
            className="flex items-center justify-center add-draft-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
            onClick={handleProcedureDraft}
          >
            <span>Drafts</span>
            {draftCount > 0 && (
              <span className="bg-red-500 text-white rounded-full text-xs flex justify-center items-center w-[20px] h-[20px] absolute top-[120px] right-56">
                {draftCount}
              </span>
            )}
          </button>
          <button
            className="flex items-center justify-center add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
            onClick={handleQMSAddProcedure}
          >
            <span>Add Procedure Sections</span>
            <img src={plusicon} alt="Add Icon" className='w-[18px] h-[18px] qms-add-plus' />
          </button>
        </div>
      </div>

      <div className="p-5 overflow-hidden">
        {loading ? (
          <div className="text-center py-4 text-white">Loading procedures...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : (
          <table className="w-full">
            <thead className='bg-[#24242D]'>
              <tr className="h-[48px]">
                <th className="pl-4 pr-2 text-left add-manual-theads">No</th>
                <th className="px-2 text-left add-manual-theads">Procedure Title</th>
                <th className="px-2 text-left add-manual-theads">Procedure No</th>
                <th className="px-2 text-left add-manual-theads">Approved by</th>
                <th className="px-2 text-left add-manual-theads">Revision</th>
                <th className="px-2 text-left add-manual-theads">Date</th>
                <th className="px-2 text-left add-manual-theads">Status</th>
                <th className="px-2 text-left add-manual-theads">Action</th>
                <th className="px-2 text-center add-manual-theads">View</th>
                <th className="px-2 text-center add-manual-theads">Edit</th>
                <th className="pl-2 pr-4 text-center add-manual-theads">Delete</th>
              </tr>
            </thead>
            <tbody key={currentPage}>
              {paginatedProcedure.length > 0 ? (
                paginatedProcedure.map((procedure, index) => {
                  const canApprove = canReview(procedure);

                  return (
                    <tr key={procedure.id} className="border-b border-[#383840] hover:bg-[#1a1a20] h-[46px]">
                      <td className="pl-5 pr-2 add-manual-datas">{(currentPage - 1) * procedurePerPage + index + 1}</td>
                      <td className="px-2 add-manual-datas">{procedure.title || 'N/A'}</td>
                      <td className="px-2 add-manual-datas">{procedure.no || 'N/A'}</td>
                      <td className="px-2 add-manual-datas">
                        {procedure.approved_by ?
                          `${procedure.approved_by.first_name} ${procedure.approved_by.last_name}` :
                          'N/A'}
                      </td>
                      <td className="px-2 add-manual-datas">{procedure.rivision || 'N/A'}</td>
                      <td className="px-2 add-manual-datas">{formatDate(procedure.date)}</td>
                      <td className="px-2 add-manual-datas">
                        {procedure.status}
                      </td>
                      <td className='px-2 add-manual-datas'>
                        {procedure.status === 'Approved' ? (
                          <button className="text-[#36DDAE]" onClick={handlePublish}>Click to Publish</button>
                        ) : canApprove ? (
                          <button
                            onClick={() => handleClickApprove(procedure.id,
                              procedure.status === 'Pending for Review/Checking'
                                ? 'Reviewed,Pending for Approval'
                                : (procedure.status === 'Correction Requested'
                                  ? 'Approved'
                                  : 'Approved')
                            )}
                            className="text-[#1E84AF]"
                          >
                            {procedure.status === 'Pending for Review/Checking'
                              ? 'Review'
                              : (procedure.status === 'Correction Requested'
                                ? 'Click to Approve'
                                : 'Click to Approve')}
                          </button>
                        ) : (
                          <span className="text-[#858585]">Not Authorized</span>
                        )}
                      </td>
                      <td className="px-2 add-manual-datas text-center">
                        <button
                          onClick={() =>  handleView(procedure.id)}
                          title="View"
                        >
                          <img src={views} alt="View icon" />
                        </button>
                      </td>
                      <td className="px-2 add-manual-datas text-center">
                        <button
                          onClick={() => handleEdit(procedure.id)}
                          title="Edit"
                        >
                          <img src={edits} alt="" />
                        </button>
                      </td>

                      <td className="pl-2 pr-4 add-manual-datas text-center">
                        <button
                          onClick={() => handleDelete(procedure.id)}
                          title="Delete"
                        >
                          <img src={deletes} alt="" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan="11" className="text-center py-4 not-found">No Procedures found.</td></tr>
              )}
              <tr>
                <td colSpan="11" className="pt-[15px] border-t border-[#383840]">
                  <div className="flex items-center justify-between w-full">
                    <div className="text-white total-text">Total-{filteredProcedure.length}</div>
                    <div className="flex items-center gap-5">
                      <button
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                        className={`cursor-pointer swipe-text ${currentPage === 1 ? 'opacity-50' : ''}`}
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageClick(page)}
                          className={`${currentPage === page ? 'pagin-active' : 'pagin-inactive'}`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className={`cursor-pointer swipe-text ${currentPage === totalPages || totalPages === 0 ? 'opacity-50' : ''}`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
      <AnimatePresence>
        {showPublishModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay with animation */}
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            // onClick={closePublishModal}
            />

            {/* Modal with animation */}
            <motion.div
              className="bg-[#1C1C24] rounded-md shadow-xl w-auto h-auto relative"
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{
                duration: 0.3,
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
            >
              <div className="p-6">
                <div className='flex flex-col justify-center items-center space-y-7'>
                  <img src={publish} alt="Publish Icon" className='mt-3' />
                  <div className='flex gap-[113px] mb-5'>
                    <div className="flex items-center">
                      <span className="mr-3 add-qms-manual-label">Send Notification?</span>
                      <input
                        type="checkbox"
                        className="qms-manual-form-checkbox"
                      // checked={formData.publish}
                      // onChange={() => setFormData(prev => ({ ...prev, publish: !prev.publish }))}
                      />
                    </div>
                  </div>
                  <div className='flex gap-5'>
                    <button onClick={closePublishModal} className='cancel-btn duration-200 text-white'>Cancel</button>
                    <button className='save-btn duration-200 text-white'>Save</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QmsProcedure;
