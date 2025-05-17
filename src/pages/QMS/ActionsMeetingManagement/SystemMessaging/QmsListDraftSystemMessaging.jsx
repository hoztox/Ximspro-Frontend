import React, { useState, useEffect } from 'react';
import { Search, X, Eye } from 'lucide-react';
import view from "../../../../assets/images/ActionMeetings/view.svg";
import deletes from "../../../../assets/images/ActionMeetings/delete.svg";
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../../../../Utils/Config";
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import DeleteConfimModal from "../Modals/DeleteConfimModal";
import SuccessModal from "../Modals/SuccessModal";
import ErrorModal from "../Modals/ErrorModal";

const QmsListDraftSystemMessaging = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const itemsPerPage = 10;

    // Delete modal states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const getRelevantUserId = () => {
        const userRole = localStorage.getItem("role");
        if (userRole === "user") {
            const userId = localStorage.getItem("user_id");
            if (userId) return userId;
        }
        const companyId = localStorage.getItem("company_id");
        return companyId || null;
    };

    // Fetch draft messages from the backend
    useEffect(() => {
        const fetchDrafts = async () => {
            try {
                const userId = getRelevantUserId();
                if (!userId) {
                    console.error('No user or company ID found');
                    return;
                }
                const response = await axios.get(`${BASE_URL}/qms/messages/drafts/${userId}/`);
                const drafts = Array.isArray(response.data) ? response.data : [];
                setMessages(drafts);
                setTotalItems(drafts.length);
            } catch (error) {
                console.error('Error fetching drafts:', error);
                setError(error.message || "Failed to fetch drafts");
                setShowErrorModal(true);
            }
        };
        fetchDrafts();
    }, [currentPage]);

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Format created_at to date and time
    const formatDateTime = (createdAt) => {
        const date = new Date(createdAt);
        const dateStr = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).split('/').join('-');
        const timeStr = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        }).toLowerCase();
        return { date: dateStr, time: timeStr };
    };

    // Format to_user array for display
    const formatToUser = (toUser) => {
        if (!Array.isArray(toUser)) return 'N/A';
        return toUser
            .map(user => {
                const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ');
                return fullName || 'Unknown';
            })
            .join(', ');
    };

    // Filter items for client-side search
    const filteredItems = messages.filter(item =>
        item.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Get current page items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleInbox = () => {
        navigate('/company/qms/list-inbox');
    };

    const handleEditDraft = (id) => {
        navigate(`/company/qms/edit-draft/${id}`);
    };

    const handleView = (item) => {
        setSelectedMessage(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedMessage(null), 300);
    };

    // Open delete confirmation modal
    const openDeleteModal = (message) => {
        setMessageToDelete(message);
        setShowDeleteModal(true);
        setDeleteMessage('Draft Message');
    };

    // Close all modals
    const closeAllModals = () => {
        setShowDeleteModal(false);
        setShowSuccessModal(false);
        setShowErrorModal(false);
    };

    // Handle delete confirmation
    const confirmDelete = async () => {
        if (!messageToDelete) return;

        try {
            await axios.delete(`${BASE_URL}/qms/messages/delete/${messageToDelete.id}/`);
            setMessages(messages.filter(item => item.id !== messageToDelete.id));
            setTotalItems(totalItems - 1);
            setShowDeleteModal(false);
            setShowSuccessModal(true);
            setSuccessMessage("Draft deleted successfully");
            setTimeout(() => {
                setShowSuccessModal(false);
            }, 3000);
        } catch (error) {
            console.error('Error deleting draft:', error);
            setShowErrorModal(true);
            setError(error.message || "Failed to delete draft");
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
        }
    };

    // Handle file view
    const handleViewFile = (fileUrl) => {
        if (fileUrl) {
            window.open(fileUrl, '_blank');
        }
    };

    return (
        <div className="bg-[#1C1C24] text-white p-5 rounded-lg relative">
            {/* Modal Backdrop */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
                        onClick={closeModal}
                    >
                        {/* Modal Content */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-[#1C1C24] rounded p-5 w-[528px] h-[449px]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {selectedMessage && (
                                <>
                                    <div className="flex justify-between items-center pb-5 border-b border-[#383840]">
                                        <h2 className="message-head">Message</h2>
                                        <button
                                            onClick={closeModal}
                                            className="text-white bg-[#24242D] h-[36px] w-[36px] flex justify-center items-center rounded-md"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <div className='space-y-[40px] pt-5'>
                                        <div>
                                            <label className='view-page-label pb-[6px]'>To</label>
                                            <p className='view-page-data'>
                                                {formatToUser(selectedMessage.to_user)}
                                            </p>
                                        </div>

                                        <div>
                                            <label className='view-page-label pb-[6px]'>Subject</label>
                                            <p className='view-page-data'>{selectedMessage.subject}</p>
                                        </div>

                                        <div className='flex flex-col items-start'>
                                            <label className='view-page-label pb-[6px]'>Document</label>
                                            {selectedMessage.file ? (
                                                <button
                                                    className='flex items-center gap-2 click-view-file-btn text-[#1E84AF]'
                                                    onClick={() => handleViewFile(selectedMessage.file)}
                                                >
                                                    Click to view file <span><Eye size={17} /></span>
                                                </button>
                                            ) : (
                                                <p className='view-page-data'>No file attached</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className='view-page-label pb-[6px]'>Message</label>
                                            <p className='view-page-data'>{selectedMessage.message}</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex justify-between items-center mb-6">
                <h1 className="list-awareness-training-head">Draft</h1>
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
                    <button
                        className="flex items-center justify-center !px-[20px] add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white !w-[98px]"
                        onClick={handleInbox}
                    >
                        <span>Inbox</span>
                    </button>
                </div>
            </div>

            <div className="overflow-hidden">
                <table className="w-full">
                    <thead className='bg-[#24242D]'>
                        <tr className='h-[48px]'>
                            <th className="px-3 text-left list-awareness-training-thead w-[10%]">No</th>
                            <th className="px-3 text-left list-awareness-training-thead w-[20%]">Subject</th>
                            <th className="px-3 text-left list-awareness-training-thead w-[20%]">Date</th>
                            <th className="px-3 text-left list-awareness-training-thead w-[20%]">Time</th>
                            <th className="px-3 text-left list-awareness-training-thead">Continue</th>
                            <th className="px-3 text-center list-awareness-training-thead">View</th>
                            <th className="px-3 text-center list-awareness-training-thead">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item, index) => {
                            const { date, time } = formatDateTime(item.created_at);
                            return (
                                <tr key={item.id} className="border-b border-[#383840] hover:bg-[#131318] cursor-pointer h-[50px]">
                                    <td className="px-3 list-awareness-training-datas">{indexOfFirstItem + index + 1}</td>
                                    <td className="px-3 list-awareness-training-datas">{item.subject}</td>
                                    <td className="px-3 list-awareness-training-datas">{date}</td>
                                    <td className="px-3 list-awareness-training-datas">{time}</td>
                                    <td className="px-3 list-awareness-training-datas text-[#1E84AF]">
                                        <button onClick={() => handleEditDraft(item.id)}>
                                            Click to Continue
                                        </button>
                                    </td>
                                    <td className="list-awareness-training-datas text-center">
                                        <button onClick={() => handleView(item)}>
                                            <img src={view} alt="View Icon" className='w-[16px] h-[16px]' />
                                        </button>
                                    </td>
                                    <td className="list-awareness-training-datas text-center">
                                        <button onClick={() => openDeleteModal(item)}>
                                            <img src={deletes} alt="Delete Icon" className='w-[16px] h-[16px]' />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

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

export default QmsListDraftSystemMessaging;