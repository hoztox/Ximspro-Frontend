import React, { useState } from 'react';
import { Search } from 'lucide-react';
import plusIcon from "../../../../assets/images/Company Documentation/plus icon.svg";
import viewIcon from "../../../../assets/images/Companies/view.svg";
import editIcon from "../../../../assets/images/Company Documentation/edit.svg";
import deleteIcon from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from 'react-router-dom';

const QmsListTargets = () => {
    const initialData = [
        { id: 1, targets: 'Improve product quality', target_date: '03-12-2024', responsible: 'Quality Team', status: 'Achieved' },
        { id: 2, targets: 'Reduce production waste', target_date: '03-12-2024', responsible: 'Production Team', status: 'OnGoing' },
        { id: 3, targets: 'Implement new testing protocol', target_date: '03-12-2024', responsible: 'R&D Department', status: 'Not Achieved' },
        { id: 4, targets: 'New safety standards', target_date: '04-12-2024', responsible: 'Safety Officer', status: 'Modified' },
    ];

    // State
    const [targets, setTargets] = useState(initialData);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        targets: '',
        target_date: '',
        responsible: '',
        status: 'OnGoing'
    });

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        setSearchTerm(value);
        setCurrentPage(1);
    };

    // Pagination
    const itemsPerPage = 10;
    const totalItems = targets.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = targets.slice(indexOfFirstItem, indexOfLastItem);

    // Search functionality
    const filteredTargets = currentItems.filter(target =>
        target.targets.toLowerCase().includes(searchQuery.toLowerCase()) ||
        target.responsible.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddTargets = () => {
        navigate('/company/qms/add-targets')
    }

    const handleDraftTargets = () => {
        navigate('/company/qms/draft-targets')
    }

    const handleQmsViewTargets = () => {
        navigate('/company/qms/view-targets ')
    }

    const handleQmsEditTargets = () => {
        navigate('/company/qms/edit-targets')
    }

    // Delete target
    const handleDeleteTargets = (id) => {
        setTargets(targets.filter(target => target.id !== id));
    };

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

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
                        className="flex items-center justify-center add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white !w-[100px]"
                        onClick={handleDraftTargets}
                    >
                        <span>Drafts</span>
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
                        {filteredTargets.map((target, index) => (
                            <tr key={target.id} className="border-b border-[#383840] hover:bg-[#1a1a20] h-[50px] cursor-pointer">
                                <td className="pl-5 pr-2 add-manual-datas">{target.id}</td>
                                <td className="px-2 add-manual-datas">{target.targets}</td>
                                <td className="px-2 add-manual-datas">{target.target_date}</td>
                                <td className="px-2 add-manual-datas">{target.responsible}</td>
                                <td className="px-2 add-manual-datas !text-center">
                                    <span
                                        className={`inline-block rounded-[4px] px-[6px] py-[3px] text-xs ${target.status === 'Achieved'
                                            ? 'bg-[#36DDAE11] text-[#36DDAE]'
                                            : target.status === 'OnGoing'
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
                                    <button onClick={handleQmsViewTargets}>
                                        <img src={viewIcon} alt="View Icon" style={{ filter: 'brightness(0) saturate(100%) invert(69%) sepia(32%) saturate(4%) hue-rotate(53deg) brightness(94%) contrast(86%)' }} />
                                    </button>
                                </td>
                                <td className="px-2 add-manual-datas !text-center">
                                    <button onClick={handleQmsEditTargets}>
                                        <img src={editIcon} alt="Edit Icon" />
                                    </button>
                                </td>
                                <td className="px-2 add-manual-datas !text-center">
                                    <button onClick={() => handleDeleteTargets(target.id)}>
                                        <img src={deleteIcon} alt="Delete Icon" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
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
                            className={`${currentPage === number ? 'pagin-active' : 'pagin-inactive'
                                }`}
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
        </div>
    );
};
export default QmsListTargets
