import React, { useState } from 'react';
import { Search } from 'lucide-react';
import plusIcon from "../../../../assets/images/Company Documentation/plus icon.svg";
import viewIcon from "../../../../assets/images/Companies/view.svg";
import editIcon from "../../../../assets/images/Company Documentation/edit.svg";
import deleteIcon from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from 'react-router-dom';
const QmsListCorrectionActions = () => {
    const initialData = [
        { id: 1, title: 'Anonymous', source: 'Anonymous', car: '123', date_raised: '03-12-2024', completed_by: '04-12-2024', executor: 'abc', status: 'Solved' },
        { id: 2, title: 'Anonymous', source: 'Anonymous', car: '123', date_raised: '03-12-2024', completed_by: '04-12-2024', executor: 'abc', status: 'Not Solved' },
        { id: 3, title: 'Anonymous', source: 'Anonymous', car: '123', date_raised: '03-12-2024', completed_by: '04-12-2024', executor: 'abc', status: 'Solved' },
        { id: 4, title: 'New Issue', source: 'Internal', car: '456', date_raised: '04-12-2024', completed_by: '04-12-2024', executor: 'xyz', status: 'Pending' },
    ];


    // State
    const [corrections, setCorrections] = useState(initialData);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        source: '',
        date_raised: '',
        completed_by: '',
        car: '',
        executor: '',
        status: 'Solved'  // Default status set to 'Requested'
    });

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        setSearchTerm(value); // Update_raised searchTerm as well
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
        correction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        correction.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        correction.car.toLowerCase().includes(searchQuery.toLowerCase()) ||
        correction.executor.toLowerCase().includes(searchQuery.toLowerCase())
    );



    const handleAddCorrectionActions = () => {
        navigate('/company/qms/add-correction-actions')
    }

    const handleDraftSupplierProblem = () => {
        // navigate('/company/qms/drafts-correction-source')
    }

    const handleQmsViewCorrectionAction = () => {
        navigate('/company/qms/view-correction-actions')
    }

    const handleQmsEditCorrectionAction = () => {
        navigate('/company/qms/edit-correction-actions')
    }


    // Delete  correction
    const handleDeleteSupplierProblem = (id) => {
        setCorrections(corrections.filter(correction => correction.id !== id));
    };

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

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
                        onClick={handleDraftSupplierProblem}
                    >
                        <span>Drafts</span>

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
                        {filteredCorrections.map((correction, index) => (
                            <tr key={correction.id} className="border-b border-[#383840] hover:bg-[#1a1a20] h-[50px] cursor-pointer">
                                <td className="pl-5 pr-2 add-manual-datas">{correction.id}</td>
                                <td className="px-2 add-manual-datas">{correction.title}</td>
                                <td className="px-2 add-manual-datas">{correction.source}</td>
                                <td className="px-2 add-manual-datas">{correction.car}</td>
                                <td className="px-2 add-manual-datas">{correction.executor}</td>
                                <td className="px-2 add-manual-datas">{correction.date_raised}</td>
                                <td className="px-2 add-manual-datas">{correction.completed_by}</td>
                                <td className="px-2 add-manual-datas !text-center">
                                    <span
                                        className={`inline-block rounded-[4px] px-[6px] py-[3px] text-xs ${correction.status === 'Solved'
                                            ? 'bg-[#36DDAE11] text-[#36DDAE]'
                                            : correction.status === 'Pending'
                                                ? 'bg-[#1E84AF11] text-[#1E84AF]' // yellow-ish color
                                                : 'bg-[#dd363611] text-[#dd3636]'
                                            }`}
                                    >
                                        {correction.status}
                                    </span>

                                </td>
                                <td className="px-2 add-manual-datas !text-center">
                                    <button onClick={handleQmsViewCorrectionAction}>
                                        <img src={viewIcon} alt="View Icon" style={{ filter: 'brightness(0) saturate(100%) invert(69%) sepia(32%) saturate(4%) hue-rotate(53deg) brightness(94%) contrast(86%)' }} />
                                    </button>
                                </td>
                                <td className="px-2 add-manual-datas !text-center">
                                    <button onClick={handleQmsEditCorrectionAction}>
                                        <img src={editIcon} alt="Edit Icon" />
                                    </button>
                                </td>
                                <td className="px-2 add-manual-datas !text-center">
                                    <button onClick={handleDeleteSupplierProblem}>
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

export default QmsListCorrectionActions
