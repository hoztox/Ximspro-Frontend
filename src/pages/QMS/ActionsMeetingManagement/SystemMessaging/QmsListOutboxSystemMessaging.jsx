import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, Search, X } from 'lucide-react';
import replay from "../../../../assets/images/ActionMeetings/replay.svg";
import view from "../../../../assets/images/ActionMeetings/view.svg";
import forward from "../../../../assets/images/ActionMeetings/forward.svg";
import deletes from "../../../../assets/images/ActionMeetings/delete.svg";
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../../../../Utils/Config";
import "./viewpage.css";
import { motion, AnimatePresence } from 'framer-motion';
import DeleteConfimModal from "../Modals/DeleteConfimModal";
import SuccessModal from "../Modals/SuccessModal";
import ErrorModal from "../Modals/ErrorModal";

const QmsListOutboxSystemMessaging = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [allMessages, setAllMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    // Get the relevant user ID for API calls
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

    // Fetch all sent messages (outbox)
    useEffect(() => {
        const fetchMessages = async () => {
            setLoading(true);
            const userId = getRelevantUserId();

            if (!userId) {
                setError("User ID or Company ID not found");
                setShowErrorModal(true);
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${BASE_URL}/qms/messages/outbox/${userId}/`);

                if (response.data && Array.isArray(response.data)) {
                    // Process messages to determine their type (original, reply, forward)
                    const processedMessages = response.data.map(msg => {
                        let messageType = 'original';

                        // Check if message is a reply or forward based on parent and thread_root
                        if (msg.parent) {
                            // If it has both parent and is in a thread, it's likely a reply
                            messageType = 'reply';
                        }

                        return {
                            ...msg,
                            messageType
                        };
                    });

                    setAllMessages(processedMessages);
                } else {
                    setAllMessages([]);
                }
            } catch (err) {
                console.error("Error fetching outbox messages:", err);
                setError("Failed to load messages. Please try again.");
                setShowErrorModal(true);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, []);

    // Format date from created_at
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // Format time from created_at
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${hours}:${minutes}:${seconds}${ampm}`;
    };

    // Open delete confirmation modal
    const openDeleteModal = (message) => {
        setMessageToDelete(message);
        setShowDeleteModal(true);
        setDeleteMessage('Message');
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
            const userId = getRelevantUserId();
            if (!userId) {
                throw new Error("User ID not found");
            }

            await axios.patch(`${BASE_URL}/qms/messages/trash/${messageToDelete.id}/`, {
                user_id: userId,
            });

            setAllMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageToDelete.id));
            setShowDeleteModal(false);
            setShowSuccessModal(true);
            setSuccessMessage("Message moved to trash successfully");
            setTimeout(() => {
                setShowSuccessModal(false);
            }, 3000);
        } catch (error) {
            console.error("Error moving message to trash:", error);
            setShowErrorModal(true);
            setError(error.message || "Failed to move message to trash");
            setTimeout(() => {
                setShowErrorModal(false);
            }, 3000);
        }
    };

    const itemsPerPage = 10;
    const totalItems = allMessages.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Filter items based on search query
    const filteredItems = allMessages.filter(item =>
        item.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.to_user && Array.isArray(item.to_user) && item.to_user.some(user =>
            user.first_name && user.last_name &&
            `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())))
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

    const handleOutboxReplay = (id, messageType) => {
        navigate(`/company/qms/outbox-replay/${id}`, { state: { messageType } });
    };

    const handleOutboxForward = (id, messageType) => {
        navigate(`/company/qms/outbox-forward/${id}`, { state: { messageType } });
    };

    const handleView = (item) => {
        setSelectedMessage(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedMessage(null), 300);
    };

    // Determine message type for display
    const getMessageTypeLabel = (message) => {
        switch (message.messageType) {
            case 'reply':
                return "Reply Message";
            case 'forward':
                return "Forwarded Message";
            default:
                return "Message";
        }
    };

    if (loading) return <div className="bg-[#1C1C24] text-white p-5 rounded-lg">Loading...</div>;

    return (
        <div className="bg-[#1C1C24] text-white p-5 rounded-lg relative">
            {/* Message View Modal */}
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
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-[#1C1C24] rounded p-5 w-[528px] h-auto max-h-[80vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {selectedMessage && (
                                <>
                                    <div className="flex justify-between items-center pb-5 border-b border-[#383840]">
                                        <h2 className="message-head">
                                            {getMessageTypeLabel(selectedMessage)}
                                        </h2>
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
                                            <ul className='view-page-data list-disc list-inside space-y-1'>
                                                {selectedMessage.to_user?.length > 0 ? (
                                                    selectedMessage.to_user.map(user => (
                                                        <li key={user.id}>
                                                            {user.first_name} {user.last_name}
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li>Anonymous</li>
                                                )}
                                            </ul>
                                        </div>

                                        <div>
                                            <label className='view-page-label pb-[6px]'>Subject</label>
                                            <p className='view-page-data'>{selectedMessage.subject || 'No Subject'}</p>
                                        </div>

                                        {selectedMessage.file && (
                                            <div className='flex flex-col items-start'>
                                                <label className='view-page-label pb-[6px]'>Document</label>
                                                <a
                                                    href={selectedMessage.file}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className='flex items-center gap-2 click-view-file-btn text-[#1E84AF]'
                                                >
                                                    Click to view file <Eye size={17} />
                                                </a>
                                            </div>
                                        )}

                                        <div>
                                            <label className='view-page-label pb-[6px]'>Message</label>
                                            <p className='view-page-data'>{selectedMessage.message || 'No message content'}</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex justify-between items-center mb-6">
                <h1 className="list-awareness-training-head">Sent Items</h1>
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
                        className="flex items-center justify-center !w-[100px] add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
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
                            <th className="px-3 text-left list-awareness-training-thead w-[20%]">Title</th>
                            <th className="px-3 text-left list-awareness-training-thead w-[15%]">Date</th>
                            <th className="px-3 text-left list-awareness-training-thead w-[10%]">Time</th>
                            <th className="px-3 text-center list-awareness-training-thead">View</th>
                            <th className="px-3 text-center list-awareness-training-thead">Reply</th>
                            <th className="px-3 text-center list-awareness-training-thead">Forward</th>
                            <th className="px-3 text-center list-awareness-training-thead">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((item, index) => (
                                <tr key={`${item.id}-${item.messageType}`} className="border-b border-[#383840] hover:bg-[#131318] cursor-pointer h-[50px]">
                                    <td className="px-3 list-awareness-training-datas">{indexOfFirstItem + index + 1}</td>
                                    <td className="px-3 list-awareness-training-datas">{item.subject || 'No Subject'}</td>
                                    <td className="px-3 list-awareness-training-datas">{formatDate(item.created_at)}</td>
                                    <td className="px-3 list-awareness-training-datas">{formatTime(item.created_at)}</td>
                                    <td className="list-awareness-training-datas text-center">
                                        <button onClick={() => handleView(item)}>
                                            <img src={view} alt="View Icon" className='w-[16px] h-[16px]' />
                                        </button>
                                    </td>
                                    <td className="list-awareness-training-datas text-center">
                                        <button onClick={() => handleOutboxReplay(item.id, item.messageType)}>
                                            <img src={replay} alt="Reply Icon" className='w-[16px] h-[16px]' />
                                        </button>
                                    </td>
                                    <td className="list-awareness-training-datas text-center">
                                        <button onClick={() => handleOutboxForward(item.id, item.messageType)}>
                                            <img src={forward} alt="Forward Icon" className='w-[16px] h-[16px]' />
                                        </button>
                                    </td>
                                    <td className="list-awareness-training-datas text-center">
                                        <button onClick={() => openDeleteModal(item)}>
                                            <img src={deletes} alt="Delete Icon" className='w-[16px] h-[16px]' />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center py-4 not-found">No Outbox Messages Found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 0 && (
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

export default QmsListOutboxSystemMessaging;