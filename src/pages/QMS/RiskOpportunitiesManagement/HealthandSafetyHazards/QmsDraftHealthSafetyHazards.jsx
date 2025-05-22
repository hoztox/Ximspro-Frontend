import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import views from "../../../../assets/images/Companies/view.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { BASE_URL } from "../../../../Utils/Config";
import DeleteQmsManualDraftConfirmModal from './Modals/DeleteQmsManualDraftConfirmModal';
import DeleteQmsManualDraftSucessModal from './Modals/DeleteQmsManualDraftSucessModal';
import DeleteQmsManualDraftErrorModal from './Modals/DeleteQmsManualDraftErrorModal';

const QmsDraftHealthSafetyHazards = () => {
    const [hazards, setHazards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const hazardsPerPage = 10;

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [hazardToDelete, setHazardToDelete] = useState(null);
    const [showDeleteDraftHazardSuccessModal, setShowDeleteDraftHazardSuccessModal] = useState(false);
    const [showDeleteDraftHazardErrorModal, setShowDeleteDraftHazardErrorModal] = useState(false);

    const handleDeleteClick = (id) => {
        setHazardToDelete(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (hazardToDelete) {
            axios
                .delete(`${BASE_URL}/qms/health-detail/${hazardToDelete}/`)
                .then((response) => {
                    setHazards(hazards.filter((hazard) => hazard.id !== hazardToDelete));
                    setShowDeleteDraftHazardSuccessModal(true);
                    setTimeout(() => {
                        setShowDeleteDraftHazardSuccessModal(false);
                    }, 3000);
                    console.log("Hazard deleted successfully:", response.data);
                })
                .catch((error) => {
                    let errorMsg = error.message;

                    if (error.response) {
                        // Check for field-specific errors first
                        if (error.response.data.date) {
                            errorMsg = error.response.data.date[0];
                        }
                        // Check for non-field errors
                        else if (error.response.data.detail) {
                            errorMsg = error.response.data.detail;
                        }
                        else if (error.response.data.message) {
                            errorMsg = error.response.data.message;
                        }
                    } else if (error.message) {
                        errorMsg = error.message;
                    }

                    setError(errorMsg);
                    setShowDeleteDraftHazardErrorModal(true);
                    setTimeout(() => {
                        setShowDeleteDraftHazardErrorModal(false);
                    }, 3000);
                    console.error("Error deleting hazard:", error);
                });
        }
        setShowDeleteModal(false);
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '/');
    };

    const handleEditDraft = (id) => {
        navigate(`/company/qms/edit-draft-health-safety-hazards/${id}`);
    };

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

    const companyId = getUserCompanyId();
    console.log("Stored Company ID:", companyId);

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

    const fetchHazards = async () => {
        try {
            setLoading(true);
            const id = getRelevantUserId();
            const response = await axios.get(`${BASE_URL}/qms/health-draft/${id}/`);
            setHazards(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching Health and Safety Hazards:", err);
            // setError("Failed to load Health and Safety Hazards. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHazards();
    }, []);

    const filteredHazards = hazards.filter(hazard =>
        (hazard.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (hazard.no?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (hazard.approved_by?.first_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (formatDate(hazard.date)?.replace(/^0+/, '') || '').includes(searchQuery.replace(/^0+/, ''))
    );

    const totalPages = Math.ceil(filteredHazards.length / hazardsPerPage);
    const paginatedHazards = filteredHazards.slice((currentPage - 1) * hazardsPerPage, currentPage * hazardsPerPage);

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

    const handleCloseHealthSafetyHazardsDraft = () => {
        navigate('/company/qms/list-health-safety-hazards');
    };

    const handleView = (id) => {
        navigate(`/company/qms/view-draft-health-safety-hazards/${id}`);
    };

    return (
        <div className="bg-[#1C1C24] list-manual-main">
            <div className="flex items-center justify-between px-[14px] pt-[24px]">
                <h1 className="list-manual-head">Draft Health and Safety Hazards</h1>

                <DeleteQmsManualDraftConfirmModal
                    showDeleteModal={showDeleteModal}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
                <DeleteQmsManualDraftSucessModal
                    showDeleteDraftManualSuccessModal={showDeleteDraftHazardSuccessModal}
                    onClose={() => setShowDeleteDraftHazardSuccessModal(false)}
                />
                <DeleteQmsManualDraftErrorModal
                    showDeleteDraftManualErrorModal={showDeleteDraftHazardErrorModal}
                    onClose={() => setShowDeleteDraftHazardErrorModal(false)}
                    error={error}
                />

                <div className="flex space-x-5 items-center">
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
                        className="text-white bg-[#24242D] p-1 rounded-md"
                        onClick={handleCloseHealthSafetyHazardsDraft}
                    >
                        <X className='text-white' />
                    </button>
                </div>
            </div>
            <div className="p-5 overflow-hidden">
                {loading ? (
                    <div className="text-center py-4 not-found">Loading Health and Safety Hazards...</div>
                ) : (
                    <table className="w-full">
                        <thead className='bg-[#24242D]'>
                            <tr className="h-[48px]">
                                <th className="pl-4 pr-2 text-left add-manual-theads">No</th>
                                <th className="px-2 text-left add-manual-theads">Title</th>
                                <th className="px-2 text-left add-manual-theads">Hazard No</th>
                                <th className="px-2 text-left add-manual-theads">Approved by</th>
                                <th className="px-2 text-left add-manual-theads">Date</th>
                                <th className="px-2 text-left add-manual-theads">Action</th>
                                <th className="px-2 text-center add-manual-theads">View</th>
                                <th className="pl-2 pr-4 text-center add-manual-theads">Delete</th>
                            </tr>
                        </thead>
                        <tbody key={currentPage}>
                            {paginatedHazards.length > 0 ? (
                                paginatedHazards.map((hazard, index) => (
                                    <tr key={hazard.id} className="border-b border-[#383840] hover:bg-[#1a1a20] h-[46px]">
                                        <td className="pl-5 pr-2 add-manual-datas">{(currentPage - 1) * hazardsPerPage + index + 1}</td>
                                        <td className="px-2 add-manual-datas">{hazard.title || 'N/A'}</td>
                                        <td className="px-2 add-manual-datas">{hazard.hazard_no || 'N/A'}</td>
                                        <td className="px-2 add-manual-datas">
                                            {hazard.approved_by ?
                                                `${hazard.approved_by.first_name} ${hazard.approved_by.last_name}` :
                                                'N/A'}
                                        </td>
                                        <td className="px-2 add-manual-datas">{formatDate(hazard.date)}</td>
                                        <td className='px-2 add-manual-datas'>
                                            <button
                                                className='text-[#1E84AF]'
                                                onClick={() => handleEditDraft(hazard.id)}
                                            >
                                                Click to Continue
                                            </button>
                                        </td>
                                        <td className="px-2 add-manual-datas text-center">
                                            <button
                                                onClick={() => handleView(hazard.id)}
                                                title="View"
                                            >
                                                <img src={views} alt="View Icon" />
                                            </button>
                                        </td>
                                        <td className="pl-2 pr-4 add-manual-datas text-center">
                                            <button
                                                onClick={() => handleDeleteClick(hazard.id)}
                                                title="Delete"
                                            >
                                                <img src={deletes} alt="Delete Icon" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="8" className="text-center py-4 not-found">No Draft Health and Safety Hazards found.</td></tr>
                            )}
                            <tr>
                                <td colSpan="8" className="pt-[15px] border-t border-[#383840]">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="text-white total-text">Total-{filteredHazards.length}</div>
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
        </div>
    );
};

export default QmsDraftHealthSafetyHazards;