import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import axios from 'axios';
import plusIcon from "../../../../assets/images/Company Documentation/plus icon.svg";
import viewIcon from "../../../../assets/images/Companies/view.svg";
import editIcon from "../../../../assets/images/Company Documentation/edit.svg";
import deleteIcon from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../../../../Utils/Config";
import DeleteConfimModal from "../Modals/DeleteConfimModal";
import SuccessModal from "../Modals/SuccessModal";
import ErrorModal from "../Modals/ErrorModal";

const QmsListTargets = () => {
    // State
    const [targets, setTargets] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Modal states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [targetToDelete, setTargetToDelete] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [draftCount, setDraftCount] = useState(0);

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

    const companyId = getUserCompanyId();
    const userId = getRelevantUserId();

    // Fetch targets from backend
    const fetchTargets = async () => {
        if (!companyId) {
            setError("Company ID not found");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/qms/targets/${companyId}`);
            setTargets(response.data);

            // Fetch draft count
            const draftResponse = await axios.get(
                `${BASE_URL}/qms/targets/drafts-count/${userId}/`
            );
            setDraftCount(draftResponse.data.count);

            setLoading(false);
        } catch (err) {
            handleError('Failed to fetch targets. Please try again.', err);
            setLoading(false);
        }
    };

    // Handle errors consistently
    const handleError = (defaultMsg, error) => {
        let errorMsg = defaultMsg;

        if (error.response) {
            if (error.response.data.date) {
                errorMsg = error.response.data.date[0];
            }
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
        setShowErrorModal(true);
        setTimeout(() => {
            setShowErrorModal(false);
        }, 3000);
    };

    // Initial fetch
    useEffect(() => {
        fetchTargets();
    }, [companyId]);

    // Handle search input
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        setCurrentPage(1); // Reset to first page on search
    };

    // Pagination
    const itemsPerPage = 10;
    const totalItems = targets.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Filter targets based on search query
    const filteredTargets = targets
        .filter(target => {
            const searchLower = searchQuery.toLowerCase();
            return (
                (target.target && target.target.toLowerCase().includes(searchLower)) ||
                (target.responsible && target.responsible.toLowerCase().includes(searchLower)) ||
                (target.status && target.status.toLowerCase().includes(searchLower))
            );
        })
        .slice(indexOfFirstItem, indexOfLastItem);

    // Navigation handlers
    const handleAddTargets = () => {
        navigate('/company/qms/add-targets');
    };

    const handleDraftTargets = () => {
        navigate('/company/qms/draft-targets');
    };

    const handleQmsViewTargets = (id) => {
        navigate(`/company/qms/view-targets/${id}`);
    };

    const handleQmsEditTargets = (id) => {
        navigate(`/company/qms/edit-targets/${id}`);
    };

    // Open delete confirmation modal
    const openDeleteModal = (target) => {
        setTargetToDelete(target);
        setShowDeleteModal(true);
        setDeleteMessage('Target');
    };

    // Close all modals
    const closeAllModals = () => {
        setShowDeleteModal(false);
        setShowSuccessModal(false);
    };

    // Delete target
    const confirmDelete = async () => {
        if (!targetToDelete) return;

        try {
            await axios.delete(`${BASE_URL}/qms/targets-get/${targetToDelete.id}/`);
            setTargets(targets.filter(target => target.id !== targetToDelete.id));

            // If we deleted the last item on the page, go to previous page
            if (filteredTargets.length === 1 && currentPage > 1) {
                setCurrentPage(prev => prev - 1);
            }

            setShowDeleteModal(false);
            setShowSuccessModal(true);
            setSuccessMessage("Target Deleted Successfully");
            setTimeout(() => {
                setShowSuccessModal(false);
            }, 3000);
        } catch (err) {
            handleError('Failed to delete target. Please try again.', err);
            setShowDeleteModal(false);
            let errorMsg = err.message;

            if (err.response) {
                // Check for field-specific errors first
                if (err.response.data.date) {
                    errorMsg = err.response.data.date[0];
                }
                // Check for non-field errors
                else if (err.response.data.email) {
                    errorMsg = err.response.data.email[0];
                } else if (err.response.data.message) {
                    errorMsg = err.response.data.message;
                }
            } else if (err.message) {
                errorMsg = err.message;
            }

            setError(errorMsg);
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // Pagination handlers
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    if (loading) {
        return (
            <div className="flex justify-center items-center">
                <div className="not-found">Loading...</div>
            </div>
        );
    }

    return (
        <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="list-manual-head">List Targets and Programs</h1>
                <div className="flex gap-4">
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
                        className="flex items-center justify-center add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white !w-[100px] relative"
                        onClick={handleDraftTargets}
                    >
                        <span>Drafts</span>
                        {draftCount > 0 && (
                            <span className="bg-red-500 text-white rounded-full text-xs flex justify-center items-center w-[20px] h-[20px] absolute -top-[10px] -right-[10px]">
                                {draftCount}
                            </span>
                        )}
                    </button>
                    <button
                        className="flex items-center justify-center add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
                        onClick={handleAddTargets}
                    >
                        <span>Add Targets and Programs</span>
                        <img src={plusIcon} alt="Add Icon" className='w-[18px] h-[18px] qms-add-plus' />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className='bg-[#24242D]'>
                        <tr className="h-[48px]">
                            <th className="pl-4 pr-2 text-left add-manual-theads">No</th>
                            <th className="px-2 text-left add-manual-theads">Target</th>
                            <th className="px-2 text-left add-manual-theads">Target Date</th>
                            <th className="px-2 text-left add-manual-theads">Responsible</th>
                            <th className="px-2 text-center add-manual-theads">Status</th>
                            <th className="px-2 text-center add-manual-theads">View</th>
                            <th className="px-2 text-center add-manual-theads">Edit</th>
                            <th className="pr-2 text-center add-manual-theads">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTargets.length > 0 ? (
                            filteredTargets.map((target, index) => (
                                <tr key={target.id} className="border-b border-[#383840] hover:bg-[#1a1a20] h-[50px] cursor-pointer">
                                    <td className="pl-5 pr-2 add-manual-datas">{indexOfFirstItem + index + 1}</td>
                                    <td className="px-2 add-manual-datas">{target.target || 'N/A'}</td>
                                    <td className="px-2 add-manual-datas">{formatDate(target.target_date)}</td>
                                    <td className="px-2 add-manual-datas"> {target.responsible?.first_name} {target.responsible?.last_name || 'N/A'}</td>
                                    <td className="px-2 add-manual-datas !text-center">
                                        <span
                                            className={`inline-block rounded-[4px] px-[6px] py-[3px] text-xs ${target.status === 'Achieved'
                                                ? 'bg-[#36DDAE11] text-[#36DDAE]'
                                                : target.status === 'On Going'
                                                    ? 'bg-[#1E84AF11] text-[#1E84AF]'
                                                    : target.status === 'Not Achieved'
                                                        ? 'bg-[#dd363611] text-[#dd3636]'
                                                        : 'bg-[#FFA50011] text-[#FFA500]' // Modified status
                                                }`}
                                        >
                                            {target.status}
                                        </span>
                                    </td>
                                    <td className="px-2 add-manual-datas !text-center">
                                        <button onClick={() => handleQmsViewTargets(target.id)}>
                                            <img src={viewIcon} alt="View Icon" style={{ filter: 'brightness(0) saturate(100%) invert(69%) sepia(32%) saturate(4%) hue-rotate(53deg) brightness(94%) contrast(86%)' }} />
                                        </button>
                                    </td>
                                    <td className="px-2 add-manual-datas !text-center">
                                        <button onClick={() => handleQmsEditTargets(target.id)}>
                                            <img src={editIcon} alt="Edit Icon" />
                                        </button>
                                    </td>
                                    <td className="px-2 add-manual-datas !text-center">
                                        <button onClick={() => openDeleteModal(target)}>
                                            <img src={deleteIcon} alt="Delete Icon" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center py-4 not-found">No targets found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {targets.length > 0 && (
                <div className="flex justify-between items-center mt-6 text-sm">
                    <div className='text-white total-text'>Total-{totalItems}</div>
                    <div className="flex items-center gap-5">
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className={`cursor-pointer swipe-text ${currentPage === 1 ? 'opacity-50' : ''}`}
                        >
                            Previous
                        </button>

                        {/* Show up to 5 page numbers at a time */}
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            let pageNumber;
                            if (totalPages <= 5) {
                                pageNumber = i + 1;
                            } else {
                                if (currentPage <= 3) {
                                    pageNumber = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNumber = totalPages - 4 + i;
                                } else {
                                    pageNumber = currentPage - 2 + i;
                                }
                            }
                            return (
                                <button
                                    key={pageNumber}
                                    onClick={() => paginate(pageNumber)}
                                    className={`${currentPage === pageNumber ? 'pagin-active' : 'pagin-inactive'}`}
                                >
                                    {pageNumber}
                                </button>
                            );
                        })}

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

            {/* Delete Confirmation Modal */}
            <DeleteConfimModal
                showDeleteModal={showDeleteModal}
                onConfirm={confirmDelete}
                onCancel={closeAllModals}
                deleteMessage={deleteMessage}
            />

            {/* Success Modal */}
            <SuccessModal
                showSuccessModal={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                successMessage={successMessage}
            />

            {/* Error Modal */}
            <ErrorModal
                showErrorModal={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                error={error}
            />
        </div>
    );
};

export default QmsListTargets;