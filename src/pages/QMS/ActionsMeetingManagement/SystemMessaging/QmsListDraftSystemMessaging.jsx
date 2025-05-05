import React, { useState } from 'react';
import { Search } from 'lucide-react';
import view from "../../../../assets/images/ActionMeetings/view.svg"
import deletes from "../../../../assets/images/ActionMeetings/delete.svg"
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // For animations

const QmsListDraftSystemMessaging = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedMessage, setSelectedMessage] = useState(null); // Track which message is being viewed
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
    const navigate = useNavigate();
    
    // Demo data with added content
    const [trainingItems, setTrainingItems] = useState([
        { 
            id: 1, 
            title: 'Quarterly Report Draft', 
            date: '03-04-2025', 
            time: '09:00:24am',
            content: 'This is your draft message for the quarterly report. You can continue editing or view the current content.',
            recipients: 'Management Team',
            attachments: 'report_draft_v1.docx'
        },
        { 
            id: 2, 
            title: 'Project Update', 
            date: '03-04-2025', 
            time: '09:00:24am',
            content: 'Draft message for the project status update. Contains preliminary findings and next steps.',
            recipients: 'Project Team',
            attachments: 'project_update_april.pdf'
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

    const handleEditDraft = (item) => {
        // You might want to pass the draft ID or data to the edit page
        navigate('/company/qms/edit-draft', { state: { draftData: item } })
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
                            className="bg-[#2A2A36] rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {selectedMessage && (
                                <>
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className="text-xl font-semibold">Draft: {selectedMessage.title}</h2>
                                        <button 
                                            onClick={closeModal}
                                            className="text-gray-400 hover:text-white text-2xl"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                    
                                    <div className="flex gap-4 mb-4 text-sm text-gray-300">
                                        <div>Last Saved: {selectedMessage.date}</div>
                                        <div>Time: {selectedMessage.time}</div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="text-gray-400 mb-1">Recipients:</div>
                                        <div>{selectedMessage.recipients}</div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="text-gray-400 mb-1">Attachments:</div>
                                        <div>{selectedMessage.attachments}</div>
                                    </div>
                                    
                                    <div className="border-t border-[#383840] pt-4 mb-4">
                                        <div className="text-gray-400 mb-2">Message Content:</div>
                                        <p className="whitespace-pre-line bg-[#1E1E28] p-3 rounded">{selectedMessage.content}</p>
                                    </div>
                                    
                                    <div className="mt-6 flex justify-end gap-3">
                                        <button 
                                            onClick={() => handleEditDraft(selectedMessage)}
                                            className="px-4 py-2 bg-[#1E84AF] rounded hover:bg-[#2A9BC7] transition"
                                        >
                                            Continue Editing
                                        </button>
                                        <button 
                                            onClick={closeModal}
                                            className="px-4 py-2 bg-[#383840] rounded hover:bg-[#4A4A5A] transition"
                                        >
                                            Close
                                        </button>
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
                            <th className="px-3 text-left list-awareness-training-thead w-[20%]">Title</th>
                            <th className="px-3 text-left list-awareness-training-thead w-[20%]">Date</th>
                            <th className="px-3 text-left list-awareness-training-thead w-[20%]">Time</th>
                            <th className="px-3 text-left list-awareness-training-thead">Continue</th>
                            <th className="px-3 text-center list-awareness-training-thead">View</th>
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
                                <td className="px-3 list-awareness-training-datas text-[#1E84AF]">
                                    <button onClick={() => handleEditDraft(item)}>
                                        Click to Continue
                                    </button>
                                </td>
                                <td className="list-awareness-training-datas text-center">
                                    <button onClick={() => handleView(item)}>
                                        <img src={view} alt="View Icon" className='w-[16px] h-[16px]' />
                                    </button>
                                </td>
                                <td className="list-awareness-training-datas text-center">
                                    <button>
                                        <img src={deletes} alt="Delete Icon" className='w-[16px] h-[16px]' />
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

export default QmsListDraftSystemMessaging;