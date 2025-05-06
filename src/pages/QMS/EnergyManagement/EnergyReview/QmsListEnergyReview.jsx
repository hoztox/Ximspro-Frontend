import React, { useState } from 'react';
import { Search } from 'lucide-react';
import plusIcon from "../../../../assets/images/Company Documentation/plus icon.svg";
import viewIcon from "../../../../assets/images/Companies/view.svg";
import editIcon from "../../../../assets/images/Company Documentation/edit.svg";
import deleteIcon from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from 'react-router-dom';

const QmsListEnergyReview = () => {
    const initialData = [
        { id: 1, title: 'Improve product quality', date: '03-12-2024', energy_review_no: 'ER-1' },
        { id: 2, title: 'Reduce production waste', date: '03-12-2024', energy_review_no: 'ER-2' },
        { id: 3, title: 'Implement new testing protocol', date: '03-12-2024', energy_review_no: 'ER-3' },
        { id: 4, title: 'New safety standards', date: '04-12-2024', energy_review_no: 'ER-4' },
    ];

    // State
    const [energyReviews, setEnergyReviews] = useState(initialData);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        energy_review_no: '',
        
    });

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        setSearchTerm(value);
        setCurrentPage(1);
    };    

    // Pagination
    const itemsPerPage = 10;
    const totalItems = energyReviews.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = energyReviews.slice(indexOfFirstItem, indexOfLastItem);

    // Search functionality
    const filteredEnergyReviews = currentItems.filter(energyReview =>
        energyReview.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        energyReview.energy_review_no .toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddEnergyReview = () => {
        navigate('/company/qms/add-energy-review')
    }

    const handleDraftEnergyReview = () => {
        // navigate('/company/qms/draft-energyReviews')
    }

    const handleQmsViewEnergyReview = () => {
        // navigate('/company/qms/view-energyReviews ')
    }

    const handleQmsEditEnergyReview = () => {
        navigate('/company/qms/edit-energy-review')
    }

    // Delete energyReview
    const handleDeleteEnergyReview = (id) => {
        setEnergyReviews(energyReviews.filter(energyReview => energyReview.id !== id));
    };

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    return (
        <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="list-manual-head">List Energy Review</h1>
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
                        onClick={handleDraftEnergyReview}
                    >
                        <span>Drafts</span>
                    </button>
                    <button
                        className="flex items-center justify-center add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
                        onClick={handleAddEnergyReview}
                    >
                        <span>Add Energy Review</span>
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
                            <th className="px-2 text-left add-manual-theads">Energy Review No</th>
                            <th className="px-2 text-left add-manual-theads">Date</th>
                            <th className="px-2 text-center add-manual-theads">View</th>
                            <th className="px-2 text-center add-manual-theads">Edit</th>
                            <th className="pr-2 text-center add-manual-theads">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEnergyReviews.map((energyReview, index) => (
                            <tr key={energyReview.id} className="border-b border-[#383840] hover:bg-[#1a1a20] h-[50px] cursor-pointer">
                                <td className="pl-5 pr-2 add-manual-datas">{energyReview.id}</td>
                                <td className="px-2 add-manual-datas">{energyReview.title}</td>
                                <td className="px-2 add-manual-datas">{energyReview.energy_review_no }</td>
                                <td className="px-2 add-manual-datas">{energyReview.date}</td>
                                <td className="px-2 add-manual-datas !text-center">
                                    <button onClick={handleQmsViewEnergyReview}>
                                        <img src={viewIcon} alt="View Icon" style={{ filter: 'brightness(0) saturate(100%) invert(69%) sepia(32%) saturate(4%) hue-rotate(53deg) brightness(94%) contrast(86%)' }} />
                                    </button>
                                </td>
                                <td className="px-2 add-manual-datas !text-center">
                                    <button onClick={handleQmsEditEnergyReview}>
                                        <img src={editIcon} alt="Edit Icon" />
                                    </button>
                                </td>
                                <td className="px-2 add-manual-datas !text-center">
                                    <button onClick={() => handleDeleteEnergyReview(energyReview.id)}>
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
export default QmsListEnergyReview
