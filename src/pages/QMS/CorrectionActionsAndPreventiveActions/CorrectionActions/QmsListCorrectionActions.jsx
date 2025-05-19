import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import plusIcon from "../../../../assets/images/Company Documentation/plus icon.svg";
import viewIcon from "../../../../assets/images/Companies/view.svg";
import editIcon from "../../../../assets/images/Company Documentation/edit.svg";
import deleteIcon from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../../../../Utils/Config";
import axios from 'axios';
import DeleteConfimModal from "../DeleteConfimModal";
import SuccessModal from "../SuccessModal";
import ErrorModal from "../ErrorModal";

const QmsListCorrectionActions = () => {
    // Retrieve company ID from localStorage
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

    // State
    const [corrections, setCorrections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Modal states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [correctionToDelete, setCorrectionToDelete] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [draftCount, setDraftCount] = useState(0);

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            if (!companyId) {
                setError("Company ID not found");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${BASE_URL}/qms/car_no/company/${companyId}/`);
                console.log('car list:', response);

                setCorrections(response.data);

                const draftResponse = await axios.get(
                    `${BASE_URL}/qms/car/drafts-count/${userId}/`
                );
                setDraftCount(draftResponse.data.count);

                setLoading(false);
            } catch (err) {
                console.error("Error fetching correction actions:", err);
                let errorMsg = err.message;

                if (err.response) {
                    if (err.response.data.date) {
                        errorMsg = err.response.data.date[0];
                    }
                    else if (err.response.data.detail) {
                        errorMsg = err.response.data.detail;
                    }
                    else if (err.response.data.message) {
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
                setLoading(false);
            }
        };

        fetchData();
    }, [companyId, BASE_URL]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        setCurrentPage(1);
    };

    // Pagination
    const itemsPerPage = 10;
    const totalItems = corrections.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = corrections.slice(indexOfFirstItem, indexOfLastItem);

    // Search functionality
    const filteredCorrections = currentItems.filter(correction =>
        (correction.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (correction.source?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (correction.action_no?.toString() || '').includes(searchQuery.toLowerCase()) ||
        (correction.executor?.name?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    // Navigation handlers
    const handleAddCorrectionActions = () => {
        navigate('/company/qms/add-correction-actions');
    };

    const handleDraftCorrectionActions = () => {
        navigate('/company/qms/draft-correction-actions');
    };

    const handleQmsViewCorrectionAction = (id) => {
        navigate(`/company/qms/view-correction-actions/${id}`);
    };

    const handleQmsEditCorrectionAction = (id) => {
        navigate(`/company/qms/edit-correction-actions/${id}`);
    };

    // Open delete confirmation modal
    const openDeleteModal = (correction) => {
        setCorrectionToDelete(correction);
        setShowDeleteModal(true);
        setDeleteMessage('Correction Action');
    };

    // Close all modals
    const closeAllModals = () => {
        setShowDeleteModal(false);
        setShowSuccessModal(false);
    };

    // Handle delete confirmation
    const confirmDelete = async () => {
        if (!correctionToDelete) return;

        try {
            await axios.delete(`${BASE_URL}/qms/car-numbers/${correctionToDelete.id}/`);
            setCorrections(corrections.filter(correction => correction.id !== correctionToDelete.id));
            setShowDeleteModal(false);
            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
            }, 3000);
            setSuccessMessage("Correction Action Deleted Successfully");
        } catch (err) {
            console.error("Error deleting correction action:", err);
            let errorMsg = err.message;

            if (err.response) {
                if (err.response.data.date) {
                    errorMsg = err.response.data.date[0];
                }
                else if (err.response.data.detail) {
                    errorMsg = err.response.data.detail;
                }
                else if (err.response.data.message) {
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
            setShowDeleteModal(false);
        }
    };

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    // Get status class
    const getStatusClass = (status) => {
        switch (status) {
            case 'Completed':
                return 'bg-[#36DDAE11] text-[#36DDAE]';
            case 'Pending':
                return 'bg-[#f5a62311] text-[#f5a623]';
            case 'Deleted':
                return 'bg-[#dd363611] text-[#dd3636]';
            default:
                return 'bg-[#1E84AF11] text-[#1E84AF]';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    if (loading) return <div className="not-found text-center p-5">Loading...</div>;

    return (
        <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="list-manual-head">List Correction/Corrective Action</h1>
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
                        className="flex items-center justify-center add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white !w-[100px]"
                        onClick={handleDraftCorrectionActions}
                    >
                        <span>Drafts</span>
                        {draftCount > 0 && (
                            <span className="bg-red-500 text-white rounded-full text-xs flex justify-center items-center w-[20px] h-[20px] absolute top-[115px] right-[302px]">
                                {draftCount}
                            </span>
                        )}
                    </button>
                    <button
                        className="flex items-center justify-center add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
                        onClick={handleAddCorrectionActions}
                    >
                        <span>Add Correction/Corrective Action</span>
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
                            <th className="px-2 text-left add-manual-theads">Title</th>
                            <th className="px-2 text-left add-manual-theads">Source</th>
                            <th className="px-2 text-left add-manual-theads">CAR No</th>
                            <th className="px-2 text-left add-manual-theads">Executor</th>
                            <th className="px-2 text-left add-manual-theads">Date Raised</th>
                            <th className="px-2 text-left add-manual-theads">Completed By</th>
                            <th className="px-2 text-center add-manual-theads">Status</th>
                            <th className="px-2 text-center add-manual-theads">View</th>
                            <th className="px-2 text-center add-manual-theads">Edit</th>
                            <th className="pr-2 text-center add-manual-theads">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCorrections.length > 0 ? (
                            filteredCorrections.map((correction, index) => (
                                <tr key={correction.id} className="border-b border-[#383840] hover:bg-[#1a1a20] h-[50px] cursor-pointer">
                                    <td className="pl-5 pr-2 add-manual-datas">{indexOfFirstItem + index + 1}</td>
                                    <td className="px-2 add-manual-datas">{correction.title || 'N/A'}</td>
                                    <td className="px-2 add-manual-datas">{correction.source || 'N/A'}</td>
                                    <td className="px-2 add-manual-datas">{correction.action_no || 'N/A'}</td>
                                    <td className="px-2 add-manual-datas">{correction.executor?.first_name && correction.executor?.last_name ?
                                        `${correction.executor.first_name} ${correction.executor.last_name}` : "N/A"}
                                    </td> 
                                    <td className="px-2 add-manual-datas">
                                        {correction.date_raised ? formatDate(correction.date_raised) : 'N/A'}
                                    </td>
                                    <td className="px-2 add-manual-datas">
                                        {correction.date_completed ? formatDate(correction.date_completed) : 'N/A'}
                                    </td>
                                    <td className="px-2 add-manual-datas !text-center">
                                        <span
                                            className={`inline-block rounded-[4px] px-[6px] py-[3px] text-xs ${getStatusClass(correction.status)}`}
                                        >
                                            {correction.status || 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-2 add-manual-datas !text-center">
                                        <button onClick={() => handleQmsViewCorrectionAction(correction.id)}>
                                            <img src={viewIcon} alt="View Icon" style={{ filter: 'brightness(0) saturate(100%) invert(69%) sepia(32%) saturate(4%) hue-rotate(53deg) brightness(94%) contrast(86%)' }} />
                                        </button>
                                    </td>
                                    <td className="px-2 add-manual-datas !text-center">
                                        <button onClick={() => handleQmsEditCorrectionAction(correction.id)}>
                                            <img src={editIcon} alt="Edit Icon" />
                                        </button>
                                    </td>
                                    <td className="px-2 add-manual-datas !text-center">
                                        <button onClick={() => openDeleteModal(correction)}>
                                            <img src={deleteIcon} alt="Delete Icon" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="11" className="text-center py-4 not-found">No correction actions found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalItems > 0 && (
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

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
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

export default QmsListCorrectionActions;