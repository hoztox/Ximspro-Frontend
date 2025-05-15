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

const QmsListOutboxSystemMessaging = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [replyMessages, setReplyMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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

    useEffect(() => {
        const fetchAllMessages = async () => {
            try {
                const userId = getRelevantUserId();

                if (!userId) {
                    throw new Error("User ID not found");
                }

                // Fetch both outbox messages and reply messages
                const [outboxResponse, replyResponse] = await Promise.all([
                    axios.get(`${BASE_URL}/qms/messages/outbox/${userId}/`),
                    axios.get(`${BASE_URL}/qms/messages-replay/outbox/${userId}/`)
                ]);

                setMessages(outboxResponse.data);
                setReplyMessages(replyResponse.data);
                setLoading(false);
                console.log('Fetched outbox messages:', outboxResponse.data);
                console.log('Fetched reply messages:', replyResponse.data);

            } catch (err) {
                console.error("Error fetching messages:", err);
                setError(err.message || "Failed to fetch messages");
                setLoading(false);
            }
        };

        fetchAllMessages();
    }, []);

    // Format date from created_at (e.g., "2025-05-08T03:46:46.730477Z" to "08-05-2025")
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // Format time from created_at (e.g., "2025-05-08T03:46:46.730477Z" to "03:46:46am")
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        return `${hours}:${minutes}:${seconds}${ampm}`;
    };

    // Combine both regular messages and reply messages
    const allMessages = [...messages, ...replyMessages].sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
    });

    const itemsPerPage = 10;
    const totalItems = allMessages.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Filter items based on search query
    const filteredItems = allMessages.filter(item =>
        item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.to_user && item.to_user.some(user => 
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
     
    const handleOutboxReplay = (id) => {
        navigate(`/company/qms/outbox-replay/${id}`);
    };

    const handleOutboxForward = (message) => {
        navigate('/company/qms/outbox-forward', { state: { message } });
    };

    const handleView = (item) => {
        setSelectedMessage(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedMessage(null), 300);
    };

    const handleDelete = async (id) => {
        try {
            const userId = getRelevantUserId();
            if (!userId) {
                throw new Error("User ID not found");
            }

            await axios.put(`${BASE_URL}/qms/messages/${id}/trash/`, {
                is_trash: true,
                trash_user: userId
            });

            // Update local state to remove the message from the UI
            setMessages(messages.filter(msg => msg.id !== id));
            setReplyMessages(replyMessages.filter(msg => msg.id !== id));
        } catch (err) {
            console.error("Error deleting message:", err);
            setError(err.message || "Failed to delete message");
        }
    };

    // Function to determine if a message is a reply
    const isReplyMessage = (message) => {
        return replyMessages.some(reply => reply.id === message.id);
    };

    if (loading) return <div className="bg-[#1C1C24] text-white p-5 rounded-lg">Loading...</div>;
    if (error) return <div className="bg-[#1C1C24] text-white p-5 rounded-lg">Error: {error}</div>;

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
                            className="bg-[#1C1C24] rounded p-5 w-[528px] h-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {selectedMessage && (
                                <>
                                    <div className="flex justify-between items-center pb-5 border-b border-[#383840]">
                                        <h2 className="message-head">
                                            {isReplyMessage(selectedMessage) ? "Reply Message" : "Message"}
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
                                            <p className='view-page-data'>{selectedMessage.subject}</p>
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
                                            <p className='view-page-data'>{selectedMessage.message}</p>
                                        </div>

                                        {isReplyMessage(selectedMessage) && selectedMessage.original_message && (
                                            <div className="mt-4 pt-4 border-t border-[#383840]">
                                                <label className='view-page-label pb-[6px]'>In Response To</label>
                                                <p className='view-page-data text-gray-400'>
                                                    {selectedMessage.original_message.subject}
                                                </p>
                                            </div>
                                        )}
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
                            <th className="px-3 text-center list-awareness-training-thead">Replay</th>
                            <th className="px-3 text-center list-awareness-training-thead">Forward</th>
                            <th className="px-3 text-center list-awareness-training-thead">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((item, index) => (
                                <tr key={item.id} className="border-b border-[#383840] hover:bg-[#131318] cursor-pointer h-[50px]">
                                    <td className="px-3 list-awareness-training-datas">{indexOfFirstItem + index + 1}</td>
                                    <td className="px-3 list-awareness-training-datas">{item.subject || 'N/A'}</td>
                                    <td className="px-3 list-awareness-training-datas">{formatDate(item.created_at)}</td>
                                    <td className="px-3 list-awareness-training-datas">{formatTime(item.created_at)}</td>
                                    <td className="list-awareness-training-datas text-center">
                                        <button onClick={() => handleView(item)}>
                                            <img src={view} alt="View Icon" className='w-[16px] h-[16px]' />
                                        </button>
                                    </td>
                                    <td className="list-awareness-training-datas text-center">
                                        <button onClick={() => handleOutboxReplay(item.id)}>
                                            <img src={replay} alt="Replay Icon" className='w-[16px] h-[16px]' />
                                        </button>
                                    </td>
                                    <td className="list-awareness-training-datas text-center">
                                        <button onClick={() => handleOutboxForward(item)}>
                                            <img src={forward} alt="Forward Icon" className='w-[16px] h-[16px]' />
                                        </button>
                                    </td>
                                    <td className="list-awareness-training-datas text-center">
                                        <button onClick={() => handleDelete(item.id)}>
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
        </div>
    );
};

export default QmsListOutboxSystemMessaging;