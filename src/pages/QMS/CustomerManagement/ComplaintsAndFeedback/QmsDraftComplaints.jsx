import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../../Utils/Config';
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import view from "../../../../assets/images/Company Documentation/view.svg";
import DeleteConfimModal from "../Modals/DeleteConfimModal";
import SuccessModal from "../Modals/SuccessModal";
import ErrorModal from "../Modals/ErrorModal";

const QmsDraftComplaints = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // State for complaints data
    const [complaints, setComplaints] = useState([]);

    // Modal states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [complaintToDelete, setComplaintToDelete] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showErrorModal, setShowErrorModal] = useState(false);

    // Get user ID from localStorage
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

    const userId = getRelevantUserId();

    // Fetch complaints data
    useEffect(() => {
        const fetchComplaints = async () => {
            if (!userId) {
                setError("User ID not found");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await axios.get(`${BASE_URL}/qms/complaints-draft/${userId}/`);
                setComplaints(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching complaints:", err);
                let errorMsg = err.message;

                if (err.response) {
                    // Check for field-specific errors first
                    if (err.response.data.date) {
                        errorMsg = err.response.data.date[0];
                    }
                    // Check for non-field errors
                    else if (err.response.data.detail) {
                        errorMsg = err.response.data.detail;
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
                setLoading(false);
            }
        };

        fetchComplaints();
    }, [userId]);

    const itemsPerPage = 10;
    const totalItems = complaints.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Filter items based on search query
    const filteredItems = complaints.filter(item =>
        (item.customer?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.user?.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.executor?.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.no_car?.car_number || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Get current page items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Open delete confirmation modal
    const openDeleteModal = (complaint) => {
        setComplaintToDelete(complaint);
        setShowDeleteModal(true);
        setDeleteMessage('Draft Complaint');
    };

    // Close all modals
    const closeAllModals = () => {
        setShowDeleteModal(false);
        setShowSuccessModal(false);
    };

    // Handle delete confirmation
    const confirmDelete = async () => {
        if (!complaintToDelete) return;

        try {
            await axios.delete(`${BASE_URL}/qms/complaints/${complaintToDelete.id}/`);
            setComplaints(complaints.filter(item => item.id !== complaintToDelete.id));
            setShowDeleteModal(false);
            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
            }, 3000);
            setSuccessMessage("Draft Complaint Deleted Successfully");
        } catch (err) {
            console.error("Error deleting complaint:", err);
            let errorMsg = err.message;

            if (err.response) {
                // Check for field-specific errors first
                if (err.response.data.date) {
                    errorMsg = err.response.data.date[0];
                }
                // Check for non-field errors
                else if (err.response.data.detail) {
                    errorMsg = err.response.data.detail;
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
            setShowDeleteModal(false);
        }
    };

    const handleClose = () => {
        navigate('/company/qms/list-complaints');
    };

    const handleEditDraftComplaints = (id) => {
        navigate(`/company/qms/edit-draft-complaints/${id}`);
    };

    const handleViewDraftComplaints = (id) => {
        navigate(`/company/qms/view-draft-complaints/${id}`);
    };

    // Format date to DD-MM-YYYY
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '-');
    };

    if (loading) return <div className="bg-[#1C1C24] text-white p-5 rounded-lg">Loading...</div>;
    if (error && !showErrorModal) return <div className="bg-[#1C1C24] text-white p-5 rounded-lg">Error: {error}</div>;

    return (
        <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
            <div className="flex justify-between items-center mb-6">
                <h1 className="list-awareness-training-head">Draft Complaints and Feedbacks</h1>
                <div className="flex gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-[#1C1C24] text-white px-[10px] h-[42px] rounded-md w-[333px] border border-[#383840] outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className='absolute right-[1px] top-[1px] text-white bg-[#24242D] p-[11px] w-[55px] rounded-tr-[6px] rounded-br-[6px] flex justify-center items-center'>
                            <Search size={18} />
                        </div>
                    </div>

                    <button onClick={handleClose} className="bg-[#24242D] p-2 rounded-md">
                        <X className="text-white" />
                    </button>
                </div>
            </div>
            <div className="overflow-hidden">
                <table className="w-full">
                    <thead className='bg-[#24242D]'>
                        <tr className='h-[48px]'>
                            <th className="px-3 text-left list-awareness-training-thead">No</th>
                            <th className="px-3 text-left list-awareness-training-thead">Customer</th>
                            <th className="px-3 text-left list-awareness-training-thead">Entered By</th>
                            <th className="px-3 text-left list-awareness-training-thead">Executor</th>
                            <th className="px-3 text-left list-awareness-training-thead w-[10%]">CAR</th>
                            <th className="px-3 text-left list-awareness-training-thead">Date</th>
                            <th className="px-3 text-left list-awareness-training-thead">Action</th>
                            <th className="px-3 text-center list-awareness-training-thead">View</th>
                            <th className="px-3 text-center list-awareness-training-thead">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((item, index) => (
                                <tr key={item.id} className="border-b border-[#383840] hover:bg-[#131318] cursor-pointer h-[50px]">
                                    <td className="px-3 list-awareness-training-datas">{indexOfFirstItem + index + 1}</td>
                                    <td className="px-3 list-awareness-training-datas">{item.customer?.name || 'Anonymous'}</td>
                                    <td className="px-3 list-awareness-training-datas">
                                        {item.user ? `${item.user.first_name || ''} ${item.user.last_name || ''}`.trim() || item.user.username || "N/A" : "N/A"}
                                    </td>
                                    <td className="px-3 list-awareness-training-datas">
                                        {item.executor ? `${item.executor.first_name || ''} ${item.executor.last_name || ''}`.trim() || item.executor.username || "N/A" : "N/A"}
                                    </td>
                                    <td className="px-3 list-awareness-training-datas">{item.no_car?.car_number || 'N/A'}</td>
                                    <td className="px-3 list-awareness-training-datas">{formatDate(item.date)}</td>
                                    <td className="px-3 list-awareness-training-datas text-left text-[#1E84AF]">
                                        <button onClick={() => handleEditDraftComplaints(item.id)}>
                                            Click to Continue
                                        </button>
                                    </td>
                                    <td className="list-awareness-training-datas text-center ">
                                        <div className='flex justify-center items-center h-[50px]'>
                                            <button onClick={() => handleViewDraftComplaints(item.id)}>
                                                <img src={view} alt="View Icon" className='w-[16px] h-[16px]' />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="list-awareness-training-datas text-center">
                                        <div className='flex justify-center items-center h-[50px]'>
                                            <button onClick={() => openDeleteModal(item)}>
                                                <img src={deletes} alt="Delete Icon" className='w-[16px] h-[16px]' />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr className="border-b border-[#383840] h-[50px]">
                                <td colSpan="9" className="px-3 not-found text-center">No draft complaints found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalItems > 0 && (
                <div className="flex justify-between items-center mt-3">
                    <div className='text-white total-text'>Total: {totalItems}</div>
                    <div className="flex items-center gap-5">
                        <button
                            className={`cursor-pointer swipe-text ${currentPage === 1 ? 'opacity-50' : ''}`}
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            Previous
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                            <button
                                key={number}
                                className={`w-8 h-8 rounded-md ${currentPage === number ? 'pagin-active' : 'pagin-inactive'}`}
                                onClick={() => handlePageChange(number)}
                            >
                                {number}
                            </button>
                        ))}

                        <button
                            className={`cursor-pointer swipe-text ${currentPage === totalPages ? 'opacity-50' : ''}`}
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
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

export default QmsDraftComplaints;