import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import plusIcon from "../../../../assets/images/Company Documentation/plus icon.svg";
import viewIcon from "../../../../assets/images/Companies/view.svg";
import editIcon from "../../../../assets/images/Company Documentation/edit.svg";
import deleteIcon from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from "../../../../Utils/Config";

const QmsListEnergyBaselines = () => {
    const [energyBaseLines, setEnergyBaseLines] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const getUserCompanyId = () => {
        const storedCompanyId = localStorage.getItem("company_id");
        if (storedCompanyId) return storedCompanyId;

        const userRole = localStorage.getItem("role");
        if (userRole === "user") {
            const userData = localStorage.getItem("user_company_id");
            if (userData) {
                try {
                    return JSON.parse(userData);
                } catch (e) {
                    console.error("Error parsing user company ID:", e);
                    return null;
                }
            }
        }
        return null;
    };

    const companyId = getUserCompanyId();

    const fetchBaselines = async () => {
        try {
            setIsLoading(true);
            setError('');
            if (!companyId) return;

            const response = await axios.get(`${BASE_URL}/qms/baselines/company/${companyId}/`);
            if (Array.isArray(response.data)) {
                setEnergyBaseLines(response.data);
            } else {
                setEnergyBaseLines([]);
                console.error("Unexpected response format:", response.data);
            }
        } catch (error) {
            console.error("Error fetching baselines:", error);
            setError("Failed to load baselines. Please check your connection and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBaselines();
    }, []);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        setCurrentPage(1);
    };

    // Pagination
    const itemsPerPage = 10;
    const totalItems = energyBaseLines.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = energyBaseLines.slice(indexOfFirstItem, indexOfLastItem);

    // Search functionality
    const filteredEnergyBaseLines = currentItems.filter(energyBaseLine =>
        energyBaseLine.basline_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        energyBaseLine.energy_review?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        energyBaseLine.responsible?.first_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddEnergyBaseLines = () => {
        navigate('/company/qms/add-energy-baselines');
    };

    const handleDraftEnergyBaseLines = () => {
        navigate('/company/qms/draft-energy-baselines');
    };

    const handleQmsViewEnergyBaseLines = (id) => {
        navigate(`/company/qms/view-energy-baselines/${id}`);
    };

    const handleQmsEditEnergyBaseLines = (id) => {
        navigate(`/company/qms/edit-energy-baselines/${id}`);
    };

    const handleDeleteEnergyBaseLines = async (id) => {
        try {
            setIsLoading(true);
            setError('');
            await axios.delete(`${BASE_URL}/qms/baselines/${id}/`);
            setEnergyBaseLines(energyBaseLines.filter(energyBaseLine => energyBaseLine.id !== id));
        } catch (error) {
            console.error("Error deleting baseline:", error);
            setError("Failed to delete baseline. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    return (
        <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="list-manual-head">List Base Line</h1>
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
                        onClick={handleDraftEnergyBaseLines}
                    >
                        <span>Drafts</span>
                    </button>
                    <button
                        className="flex items-center justify-center add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
                        onClick={handleAddEnergyBaseLines}
                    >
                        <span>Add Base Line</span>
                        <img src={plusIcon} alt="Add Icon" className='w-[18px] h-[18px] qms-add-plus' />
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-500 bg-opacity-20 text-red-300 px-4 py-2 mb-4 rounded">
                    {error}
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className='bg-[#24242D]'>
                        <tr className="h-[48px]">
                            <th className="pl-4 pr-2 text-left add-manual-theads">No</th>
                            <th className="px-2 text-left add-manual-theads">Title</th>
                            <th className="px-2 text-left add-manual-theads">Related Energy Review</th>
                            <th className="px-2 text-left add-manual-theads">Responsible</th>
                            <th className="px-2 text-left add-manual-theads">Date Established</th>
                            <th className="px-2 text-center add-manual-theads">View</th>
                            <th className="px-2 text-center add-manual-theads">Edit</th>
                            <th className="px-2 text-center add-manual-theads">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="9" className="text-center py-4 not-found">Loading...</td>
                            </tr>
                        ) : filteredEnergyBaseLines.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="text-center py-4 not-found">No baselines found</td>
                            </tr>
                        ) : (
                            filteredEnergyBaseLines.map((energyBaseLine, index) => (
                                <tr key={energyBaseLine.id} className="border-b border-[#383840] hover:bg-[#1a1a20] h-[50px] cursor-pointer">
                                    <td className="pl-5 pr-2 add-manual-datas">{indexOfFirstItem + index + 1}</td>
                                    <td className="px-2 add-manual-datas">{energyBaseLine.basline_title || 'No Title'}</td>
                                    <td className="px-2 add-manual-datas">{energyBaseLine.energy_review?.title || 'None'}</td>
                                    <td className="px-2 add-manual-datas">
                                        {energyBaseLine.responsible?.first_name} {energyBaseLine.responsible?.last_name || ''}
                                    </td>
                                    <td className="px-2 add-manual-datas">{formatDate(energyBaseLine.date || 'N/A')}</td>
                                    <td className="px-2 add-manual-datas !text-center">
                                        <button onClick={() => handleQmsViewEnergyBaseLines(energyBaseLine.id)}>
                                            <img src={viewIcon} alt="View Icon" style={{ filter: 'brightness(0) saturate(100%) invert(69%) sepia(32%) saturate(4%) hue-rotate(53deg) brightness(94%) contrast(86%)' }} />
                                        </button>
                                    </td>
                                    <td className="px-2 add-manual-datas !text-center">
                                        <button onClick={() => handleQmsEditEnergyBaseLines(energyBaseLine.id)}>
                                            <img src={editIcon} alt="Edit Icon" />
                                        </button>
                                    </td>
                                    <td className="px-2 add-manual-datas !text-center">
                                        <button onClick={() => handleDeleteEnergyBaseLines(energyBaseLine.id)}>
                                            <img src={deleteIcon} alt="Delete Icon" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
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
                            className={`${currentPage === number ? 'pagin-active' : 'pagin-inactive'}`}
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

export default QmsListEnergyBaselines;