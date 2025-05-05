import React, { useState } from 'react';
import { Search, X, Eye } from 'lucide-react';
import view from "../../../../assets/images/ActionMeetings/view.svg"
import replay from "../../../../assets/images/ActionMeetings/replay.svg"
import forward from "../../../../assets/images/ActionMeetings/forward.svg"
import deletes from "../../../../assets/images/ActionMeetings/delete.svg"
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // For animations

const QmsListOutboxSystemMessaging = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedMessage, setSelectedMessage] = useState(null); // Track which message is being viewed
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
    const navigate = useNavigate();

    // Demo data with added content
    const [trainingItems, setTrainingItems] = useState([
        {
            id: 1,
            title: 'Anonymous',
            date: '03-04-2025',
            time: '09:00:24am',
            to: 'user123',
            message: 'abcd',
            subject: 'xyz'
        },
        {
            id: 2,
            title: 'Anonymous',
            date: '03-04-2025',
            time: '09:00:24am',
            to: 'user123',
            message: 'abcd',
            subject: 'xyz'
        },
    ]);

    const itemsPerPage = 10;
    const totalItems = trainingItems.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Filter items based on search query
    const filteredItems = trainingItems.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Get current page items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleInbox = () => {
        navigate('/company/qms/list-inbox')
    }

    const handleOutboxReplay = () => {
        navigate('/company/qms/outbox-replay')
    }

    const handleOutboxForward = () => {
        navigate('/company/qms/outbox-forward')
    }

    // Handle view button click
    const handleView = (item) => {
        setSelectedMessage(item);
        setIsModalOpen(true);
    }

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        // Small delay to allow animation to complete before clearing selected message
        setTimeout(() => setSelectedMessage(null), 300);
    }

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
                                            <p className='view-page-data'>{selectedMessage.to}</p>
                                        </div>

                                        <div>
                                            <label className='view-page-label pb-[6px]'>Subject</label>
                                            <p className='view-page-data'>{selectedMessage.subject}</p>
                                        </div>

                                        <div className='flex flex-col items-start'>
                                            <label className='view-page-label pb-[6px]'>Document</label>
                                            <button className='flex items-center gap-2 click-view-file-btn text-[#1E84AF]'>
                                                Click to view file <Eye size={17} />
                                            </button>
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
                <h1 className="list-awareness-training-head">Outbox</h1>
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
                            <th className="px-3 text-left list-awareness-training-thead w-[20%]">Title</th>
                            <th className="px-3 text-left list-awareness-training-thead w-[20%]">Date</th>
                            <th className="px-3 text-left list-awareness-training-thead w-[20%]">Time</th>
                            <th className="px-3 text-center list-awareness-training-thead">View</th>
                            <th className="px-3 text-center list-awareness-training-thead">Replay</th>
                            <th className="px-3 text-center list-awareness-training-thead">Forward</th>
                            <th className="px-3 text-center list-awareness-training-thead">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item, index) => (
                            <tr key={item.id} className="border-b border-[#383840] hover:bg-[#131318] cursor-pointer h-[50px]">
                                <td className="px-3 list-awareness-training-datas">{indexOfFirstItem + index + 1}</td>
                                <td className="px-3 list-awareness-training-datas">{item.title}</td>
                                <td className="px-3 list-awareness-training-datas">{item.date}</td>
                                <td className="px-3 list-awareness-training-datas">{item.time}</td>
                                <td className="list-awareness-training-datas text-center">
                                    <button onClick={() => handleView(item)}>
                                        <img src={view} alt="View Icon" className='w-[16px] h-[16px]' />
                                    </button>
                                </td>
                                <td className="list-awareness-training-datas text-center">
                                    <button onClick={handleOutboxReplay}>
                                        <img src={replay} alt="Replay Icon" className='w-[16px] h-[16px]' />
                                    </button>
                                </td>
                                <td className="list-awareness-training-datas text-center">
                                    <button onClick={handleOutboxForward}>
                                        <img src={forward} alt="Forward Icon" className='w-[16px] h-[16px]' />
                                    </button>
                                </td>
                                <td className="list-awareness-training-datas text-center">
                                    <button>
                                        <img src={deletes} alt="Deletes Icon" className='w-[16px] h-[16px]' />
                                    </button>
                                </td>
                            </tr>
                        ))}
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
                            className={`w-8 h-8 rounded-md ${currentPage === number ? 'pagin-active' : 'pagin-inactive'
                                }`}
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
}

export default QmsListOutboxSystemMessaging;