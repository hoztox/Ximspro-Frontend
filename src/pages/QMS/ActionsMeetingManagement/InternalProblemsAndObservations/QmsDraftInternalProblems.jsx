import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import viewIcon from "../../../../assets/images/Companies/view.svg";
import deleteIcon from "../../../../assets/images/Company Documentation/delete.svg";
import { BASE_URL } from "../../../../Utils/Config";
import axios from 'axios';
import ErrorModal from "../Modals/ErrorModal";
import DeleteInternalConfirmModal from "../Modals/DeleteInternalConfirmModal";
import DeleteInternalSuccessModal from "../Modals/DeleteInternalSuccessModal";

const QmsDraftInternalProblems = () => {
    // State management
    const [internalProblems, setInternalProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const navigate = useNavigate();

    // Delete modal states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [showDeletetInternalSuccessModal, setShowDeletetInternalSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);

    // Format date function
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
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

    // Fetch internal problems
    const fetchInternalProblems = async () => {
        setLoading(true);
        setError(null);
        try {
            const id = getRelevantUserId();
            if (!id) {
                setError('User ID not found. Please log in again.');
                setLoading(false);
                return;
            }

            const response = await axios.get(
                `${BASE_URL}/qms/internal-problems-draft/${id}/`,
                {
                    params: {
                        search: searchTerm,
                        page: currentPage,
                        is_draft: true
                    }
                }
            );

            if (response.data) {
                setInternalProblems(response.data);
                setTotalItems(response.data.length);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching internal problems:', error);
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 2000);
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
            setLoading(false);
        }
    };

    // Handle search
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page on new search
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchInternalProblems();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    // Initial fetch and when page changes
    useEffect(() => {
        fetchInternalProblems();
    }, [currentPage]);

    const handleViewProblem = (id) => {
        navigate(`/company/qms/view-draft-internal-problem/${id}`);
    };

    const handleEditProblem = (id) => {
        navigate(`/company/qms/edit-draft-internal-problem/${id}`);
    };

    // Delete handlers
    const openDeleteModal = (id) => {
        setItemToDelete(id);
        setShowDeleteModal(true);
    };

    const handleDeleteProblem = async () => {
        if (!itemToDelete) return;

        try {
            await axios.delete(`${BASE_URL}/qms/internal-problems/${itemToDelete}/`);
            setShowDeleteModal(false);
            setShowDeletetInternalSuccessModal(true);
            fetchInternalProblems();
            setTimeout(() => {
                setShowDeletetInternalSuccessModal(false);
            }, 3000);
        } catch (error) {
            console.error('Error deleting internal problem:', error);
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
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 2000);
            setShowDeleteModal(false);
        }
    };

    // Close all modals
    const closeAllModals = () => {
        setShowDeleteModal(false);
        setShowDeletetInternalSuccessModal(false);
    };

    // Pagination
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    const handleClose = () => {
        navigate('/company/qms/list-internal-problem');
    };

    return (
        <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
            {/* Error Modal */}
            <ErrorModal
                showErrorModal={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                error={error}
            />

            {/* Delete confirmation modal */}
            <DeleteInternalConfirmModal
                showDeleteModal={showDeleteModal}
                onConfirm={handleDeleteProblem}
                onCancel={closeAllModals}
            />

            {/* Success modal */}
            <DeleteInternalSuccessModal
                showDeletetInternalSuccessModal={showDeletetInternalSuccessModal}
                onClose={() => setShowDeletetInternalSuccessModal(false)}
            />

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="list-manual-head">Draft Internal Problems and Observations</h1>
                <div className="flex gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="serach-input-manual focus:outline-none bg-transparent"
                        />
                        <div className="absolute right-[1px] top-[2px] text-white bg-[#24242D] p-[10.5px] w-[55px] rounded-tr-[6px] rounded-br-[6px] flex justify-center items-center">
                            <Search size={18} />
                        </div>
                    </div>
                    <button onClick={handleClose} className="bg-[#24242D] p-2 rounded-md">
                        <X className="text-white" />
                    </button>
                </div>
            </div>

            {/* Table */}
            {!loading && (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-[#24242D]">
                            <tr className="h-[48px]">
                                <th className="pl-4 pr-2 text-left add-manual-theads">No</th>
                                <th className="px-2 text-left add-manual-theads">Description</th>
                                <th className="px-2 text-left add-manual-theads">Date Problem</th>
                                <th className="px-2 text-left add-manual-theads">Corrective Action</th>
                                <th className="px-2 text-left add-manual-theads">Solved</th>
                                <th className="px-2 text-left add-manual-theads">Action</th>
                                <th className="px-2 text-center add-manual-theads">View</th>
                                <th className="pr-2 text-center add-manual-theads">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {internalProblems.length > 0 ? (
                                internalProblems.map((problem, index) => (
                                    <tr key={problem.id} className="border-b border-[#383840] hover:bg-[#1a1a20] h-[50px] cursor-pointer">
                                        <td className="pl-5 pr-2 add-manual-datas">{((currentPage - 1) * itemsPerPage) + index + 1}</td>
                                        <td className="px-2 add-manual-datas">{problem.problem ? problem.problem.substring(0, 30) + (problem.problem.length > 30 ? '...' : '') : 'N/A'}</td>
                                        <td className="px-2 add-manual-datas">{formatDate(problem.date)}</td>
                                        <td className="px-2 add-manual-datas">{problem.corrective_action_need || 'N/A'}</td>
                                        <td className="px-2 add-manual-datas">{problem.solve_after_action || 'N/A'}</td>
                                        <td className="px-2 add-manual-datas !text-left !text-[#1E84AF]">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditProblem(problem.id);
                                                }}
                                            >
                                                Click to Continue
                                            </button>
                                        </td>
                                        <td className="px-2 add-manual-datas !text-center">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleViewProblem(problem.id);
                                                }}
                                            >
                                                <img src={viewIcon} alt="" />
                                            </button>
                                        </td>
                                        <td className="px-2 add-manual-datas !text-center">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openDeleteModal(problem.id);
                                                }}
                                            >
                                                <img src={deleteIcon} alt="" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="border-b border-[#383840]">
                                    <td colSpan="8" className="py-4 text-center not-found">
                                        No draft internal problems found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 0 && (
                <div className="flex justify-between items-center mt-6 text-sm">
                    <div className="text-white total-text">Total - {totalItems}</div>
                    <div className="flex items-center gap-5">
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className={`cursor-pointer swipe-text ${currentPage === 1 ? 'opacity-50' : ''}`}
                        >
                            Previous
                        </button>

                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            // Show at most 5 page numbers centered around the current page
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else {
                                let start = Math.max(1, currentPage - 2);
                                let end = Math.min(totalPages, currentPage + 2);

                                // Adjust start and end if needed
                                if (end - start < 4) {
                                    if (start === 1) {
                                        end = Math.min(5, totalPages);
                                    } else {
                                        start = Math.max(1, end - 4);
                                    }
                                }

                                pageNum = start + i;
                                if (pageNum > end) return null;
                            }

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => paginate(pageNum)}
                                    className={`${currentPage === pageNum ? 'pagin-active' : 'pagin-inactive'}`}
                                >
                                    {pageNum}
                                </button>
                            );
                        }).filter(Boolean)}

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

export default QmsDraftInternalProblems;