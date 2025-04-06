import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import plusIcon from "../../../../assets/images/Company Documentation/plus icon.svg";
import viewIcon from "../../../../assets/images/Companies/view.svg";
import editIcon from "../../../../assets/images/Company Documentation/edit.svg";
import deleteIcon from "../../../../assets/images/Company Documentation/delete.svg";
import publishIcon from "../../../../assets/images/Modal/publish.svg"
import { useNavigate } from 'react-router-dom';

const QmsProcedure = () => {
   
  // Demo data instead of fetching from API
  const demoData = [
    {
      id: 1,
      title: "Quality Control Process",
      no: "QP-001",
      approved_by: { id: 1, first_name: "John", last_name: "Doe" },
      checked_by: { id: 2, first_name: "Jane", last_name: "Smith" },
      rivision: "1.0",
      date: "2025-03-15T00:00:00Z",
      status: "Approved"
    },
    {
      id: 2,
      title: "Document Control Procedure",
      no: "QP-002",
      approved_by: { id: 1, first_name: "John", last_name: "Doe" },
      checked_by: { id: 3, first_name: "Mike", last_name: "Johnson" },
      rivision: "2.1",
      date: "2025-02-20T00:00:00Z",
      status: "Pending for Review/Checking"
    },
  ];

  // Demo corrections data
  const demoCorrections = {
    3: [
      { 
        id: 1, 
        to_user: { id: 2, first_name: "Jane", last_name: "Smith" },
        comment: "Please revise section 3.2"
      }
    ]
  };

  // State variables
  const [procedures, setProcedures] = useState(demoData);
  const [corrections, setCorrections] = useState(demoCorrections);
  const [draftCount, setDraftCount] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const navigate = useNavigate();
  
  const proceduresPerPage = 5;

  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '-');
  };

  // Mock user data
  const getCurrentUser = () => {
    return {
      id: 2,
      role: 'company',
      company_id: '12345',
      company_name: 'Demo Company',
      email_address: 'demo@example.com',
      first_name: 'Jane',
      last_name: 'Smith'
    };
  };

  const currentUser = getCurrentUser();

  // API mock functions
  const fetchProcedures = () => {
    console.log("Fetching procedures...");
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setProcedures(demoData);
      setLoading(false);
    }, 500);
  };

  // CRUD Operations (mocked)
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this procedure?")) {
      const updatedProcedures = procedures.filter(procedure => procedure.id !== id);
      setProcedures(updatedProcedures);
      alert("Procedure deleted successfully");
    }
  };

  const handleClickApprove = (id, newStatus) => {
    console.log(`Approving procedure ID: ${id} to status: ${newStatus}`);
    navigate(`/company/qms/viewprocedure/${id}`);
  };

  const handleEdit = () => {
    navigate(`/company/qms/editprocedure`);
  };

  const handleView = () => {
    navigate(`/company/qms/viewprocedure`);
  };

  const handleQMSAddProcedure = () => {
    navigate('/company/qms/addprocedure');
  };

  const handleProcedureDraft = () => {
    navigate('/company/qms/draftprocedure');
  };

  const handlePublish = (procedure) => {
    setSelectedProcedure(procedure);
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

  // Utility functions
  const canReview = (procedure) => {
    const currentUserId = currentUser.id;
    const procedureCorrections = corrections[procedure.id] || [];

    if (procedure.status === "Pending for Review/Checking") {
      return currentUserId === procedure.checked_by?.id;
    }

    if (procedure.status === "Correction Requested") {
      return procedureCorrections.some(correction =>
        correction.to_user?.id === currentUserId
      );
    }

    if (procedure.status === "Reviewed,Pending for Approval") {
      return currentUserId === procedure.approved_by?.id;
    }

    return false;
  };

  // Search and pagination functions
  const filteredProcedure = procedures.filter(procedure =>
    (procedure.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (procedure.no?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (procedure.approved_by?.first_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (procedure.rivision?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (formatDate(procedure.date)?.replace(/^0+/, '') || '').includes(searchQuery.replace(/^0+/, ''))
  );

  const totalPages = Math.ceil(filteredProcedure.length / proceduresPerPage);
  const paginatedProcedure = filteredProcedure.slice(
    (currentPage - 1) * proceduresPerPage, 
    currentPage * proceduresPerPage
  );

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

  // Mock images for demonstration
  

  return (
    <div className="bg-[#1C1C24] list-manual-main">
      <div className="flex items-center justify-between px-[14px] pt-[24px]">
        <h1 className="list-manual-head">List Procedures</h1>
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
              <span className="bg-red-500 text-white rounded-full text-xs flex justify-center items-center w-[20px] h-[20px] absolute top-[120px] right-48">
                {draftCount}
              </span>
            )}
          </button>
          <button
            className="flex items-center justify-center add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
            onClick={handleQMSAddProcedure}
          >
            <span>Add Procedure</span>
            <img src={plusIcon} alt="Add Icon" className='w-[18px] h-[18px] qms-add-plus' />
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
                      <td className="pl-5 pr-2 add-manual-datas">{(currentPage - 1) * proceduresPerPage + index + 1}</td>
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
                          <button className="text-[#36DDAE]" onClick={() => handlePublish(procedure)}>Click to Publish</button>
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
                          onClick={() => handleView(procedure.id)}
                          title="View"
                        >
                          <img src={viewIcon} alt="View icon" />
                        </button>
                      </td>
                      <td className="px-2 add-manual-datas text-center">
                        <button
                          onClick={() => handleEdit()}
                          title="Edit"
                        >
                          <img src={editIcon} alt="Edit icon" />
                        </button>
                      </td>

                      <td className="pl-2 pr-4 add-manual-datas text-center">
                        <button
                          onClick={() => handleDelete(procedure.id)}
                          title="Delete"
                        >
                          <img src={deleteIcon} alt="Delete icon" />
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
                  <img src={publishIcon} alt="Publish Icon" className='mt-3' />
                  <div className='flex gap-[113px] mb-5'>
                    <div className="flex items-center">
                      <span className="mr-3 add-qms-manual-label">Send Notification?</span>
                      <input
                        type="checkbox"
                        className="qms-manual-form-checkbox"
                      />
                    </div>
                  </div>
                  <div className='flex gap-5'>
                    <button onClick={closePublishModal} className='cancel-btn duration-200 text-white'>Cancel</button>
                    <button 
                      onClick={() => {
                        setPublishSuccess(true);
                        setTimeout(() => closePublishModal(), 500);
                      }} 
                      className='save-btn duration-200 text-white'
                    >
                      Save
                    </button>
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