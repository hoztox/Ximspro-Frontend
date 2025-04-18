import React, { useState } from 'react';
import { Search } from 'lucide-react';
import plusIcon from "../../../../assets/images/Company Documentation/plus icon.svg";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import view from "../../../../assets/images/Company Documentation/view.svg";
import { useNavigate } from 'react-router-dom';
import AddInspectionReportModal from './AddInspectionReportModal';
import ViewInspectionReportModal from './ViewInspectionReportModal';


const QmsListInspection = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    // Modal visibility and animation states
    const [addInspectionReport, setAddInspectionReport] = useState(false);
    const [viewInspectionReport, setViewInspectionReport] = useState(false);

    // Animation states
    const [addInspectionReportAnimating, setAddInspectionReportAnimating] = useState(false);
    const [viewInspectionReportAnimating, setViewInspectionReportAnimating] = useState(false);
    const [addInspectionReportExiting, setAddInspectionReportExiting] = useState(false);
    const [viewInspectionReportExiting, setViewInspectionReportExiting] = useState(false);

    const [selectedMeeting, setSelectedMeeting] = useState(null);

    // Demo data
    const [trainingItems, setTrainingItems] = useState([
        { id: 1, title: 'Anonymous', inspection_type: 'Anonymous', date_planned: '03-04-2025', area: 'Test', date_conducted: '03-04-2025' },
        { id: 2, title: 'Anonymous', inspection_type: 'Anonymous', date_planned: '03-04-2025', area: 'Test', date_conducted: '03-04-2025' },
    ]);

    const itemsPerPage = 10;
    const totalItems = trainingItems.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Filter items based on search query
    const filteredItems = trainingItems.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.inspection_type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Get current page items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDeleteItem = (id) => {
        setTrainingItems(trainingItems.filter(item => item.id !== id));
    };

    const handleAddInspection = () => {
        navigate('/company/qms/add-inspection');
    };

    const handleDraftInspection = () => {
        // navigate('/company/qms/draft-audit');
    };

    const handleEditInspection = () => {
        navigate('/company/qms/edit-inspection');
    };

    const handleViewInspection = () => {
        navigate('/company/qms/view-inspection');
    };

    // Modal handlers with animations
    const openAddInspectionReportModal = (item) => {
        setSelectedMeeting(item);
        setAddInspectionReport(true);
        setAddInspectionReportAnimating(true);
        setTimeout(() => setAddInspectionReportAnimating(false), 300);
    };

    const openViewInspectionReportModal = (item) => {
        setSelectedMeeting(item);
        setViewInspectionReport(true);
        setViewInspectionReportAnimating(true);
        setTimeout(() => setViewInspectionReportAnimating(false), 300);
    };

    const closeAddInspectionReportModal = () => {
        setAddInspectionReportExiting(true);
        setTimeout(() => {
            setAddInspectionReport(false);
            setAddInspectionReportExiting(false);
        }, 200);
    };

    const closeViewInspectionReportModal = () => {
        setViewInspectionReportExiting(true);
        setTimeout(() => {
            setViewInspectionReport(false);
            setViewInspectionReportExiting(false);
        }, 200);
    };

    const handleSaveMinutes = (minutesData) => {
        // Logic to save minutes to the selected meeting
        if (selectedMeeting && minutesData.minutes) {
            const updatedItems = trainingItems.map(item => {
                if (item.id === selectedMeeting.id) {
                    return { ...item, minutes: minutesData.minutes };
                }
                return item;
            });
            setTrainingItems(updatedItems);
            closeAddInspectionReportModal();
        }
    };

    return (
        <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
            <div className="flex justify-between items-center mb-6">
                <h1 className="list-awareness-training-head">Inspections</h1>
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
                        onClick={handleDraftInspection}
                    >
                        <span>Draft</span>
                    </button>
                    <button
                        className="flex items-center justify-center !px-[20px] add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
                        onClick={handleAddInspection}
                    >
                        <span>Add Inspection</span>
                        <img src={plusIcon} alt="Add Icon" className='w-[18px] h-[18px] qms-add-plus' />
                    </button>
                </div>
            </div>
            <div className="overflow-hidden">
                <table className="w-full">
                    <thead className='bg-[#24242D]'>
                        <tr className='h-[48px]'>
                            <th className="px-3 text-left list-awareness-training-thead">No</th>
                            <th className="px-3 text-left list-awareness-training-thead">Title</th>
                            <th className="px-3 text-left list-awareness-training-thead">Inspection Type</th>
                            <th className="px-3 text-left list-awareness-training-thead">Date Planned</th>
                            <th className="px-3 text-left list-awareness-training-thead">Area/Function</th>
                            <th className="px-3 text-left list-awareness-training-thead">Date Conducted</th>
                            <th className="px-3 text-center list-awareness-training-thead">Add / View Reports</th>
                            <th className="px-3 text-center list-awareness-training-thead">View</th>
                            <th className="px-3 text-center list-awareness-training-thead">Edit</th>
                            <th className="px-3 text-center list-awareness-training-thead">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item, index) => (
                            <tr key={item.id} className="border-b border-[#383840] hover:bg-[#131318] cursor-pointer h-[50px]">
                                <td className="px-3 list-awareness-training-datas">{indexOfFirstItem + index + 1}</td>
                                <td className="px-3 list-awareness-training-datas">{item.title}</td>
                                <td className="px-3 list-awareness-training-datas">{item.inspection_type}</td>
                                <td className="px-3 list-awareness-training-datas">{item.date_planned}</td>
                                <td className="px-3 list-awareness-training-datas">{item.area}</td>
                                <td className="px-3 list-awareness-training-datas">{item.date_conducted}</td>
                                <td className="px-3 list-awareness-training-datas text-center flex items-center justify-center gap-6 h-[53px] text-[#1E84AF]">
                                    <button
                                        onClick={() => openAddInspectionReportModal(item)}
                                        className="hover:text-blue-400 transition-colors duration-200"
                                    >
                                        Add
                                    </button>
                                    <button
                                        onClick={() => openViewInspectionReportModal(item)}
                                        className="hover:text-blue-400 transition-colors duration-200"
                                    >
                                        View
                                    </button>
                                </td>
                                <td className="list-awareness-training-datas text-center ">
                                    <div className='flex justify-center items-center h-[50px]'>
                                        <button onClick={handleViewInspection}>
                                            <img src={view} alt="View Icon" className='w-[16px] h-[16px]' />
                                        </button>
                                    </div>
                                </td>
                                <td className="list-awareness-training-datas text-center">
                                    <div className='flex justify-center items-center h-[50px]'>
                                        <button onClick={handleEditInspection}>
                                            <img src={edits} alt="Edit Icon" className='w-[16px] h-[16px]' />
                                        </button>
                                    </div>
                                </td>
                                <td className="list-awareness-training-datas text-center">
                                    <div className='flex justify-center items-center h-[50px]'>
                                        <button onClick={() => handleDeleteItem(item.id)}>
                                            <img src={deletes} alt="Delete Icon" className='w-[16px] h-[16px]' />
                                        </button>
                                    </div>
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

            {/* Use the separate modal components */}
            <AddInspectionReportModal
                isVisible={addInspectionReport}
                isExiting={addInspectionReportExiting}
                isAnimating={addInspectionReportAnimating}
                selectedMeeting={selectedMeeting}
                onClose={closeAddInspectionReportModal}
                onSave={handleSaveMinutes}
            />

            <ViewInspectionReportModal
                isVisible={viewInspectionReport}
                isExiting={viewInspectionReportExiting}
                isAnimating={viewInspectionReportAnimating}
                selectedMeeting={selectedMeeting}
                onClose={closeViewInspectionReportModal}
            />
        </div>
    );
};
export default QmsListInspection
