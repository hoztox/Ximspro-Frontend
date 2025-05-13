import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import axios from 'axios';
import plusIcon from "../../../../assets/images/Company Documentation/plus icon.svg";
import viewIcon from "../../../../assets/images/Companies/view.svg";
import editIcon from "../../../../assets/images/Company Documentation/edit.svg";
import deleteIcon from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../../../../Utils/Config";

const QmsDraftTargets = () => {
    // State
    const [targets, setTargets] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Pagination
    const itemsPerPage = 10;

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

    const userId = getRelevantUserId();

    // Fetch draft targets
    const fetchDraftTargets = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/qms/targets-draft/${userId}`, {
                params: {
                    is_draft: true,
                }
            });
            setTargets(response.data);
            console.log('dddddd', response.data);
            
            setTotalItems(response.data.length);
            setError(null);
        } catch (err) {
            setError('Failed to fetch draft targets. Please try again.');
            console.error('Error fetching draft targets:', err);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchDraftTargets();
    }, []);

    // Handle search input
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        setCurrentPage(1); // Reset to first page on search
    };

    // Filter targets based on search query
    const filteredTargets = targets
        .filter(target => {
            const searchLower = searchQuery.toLowerCase();
            return (
                (target.target && target.target.toLowerCase().includes(searchLower)) ||
                (target.title && target.title.toLowerCase().includes(searchLower)) ||
                (target.associative_objective && target.associative_objective.toLowerCase().includes(searchLower)) ||
                (target.responsible && target.responsible.toLowerCase().includes(searchLower))
            );
        });

    // Get current items for pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTargets = filteredTargets.slice(indexOfFirstItem, indexOfLastItem);

    // Recalculate total pages based on filtered results
    const totalPages = Math.ceil(filteredTargets.length / itemsPerPage);

    // Navigation handlers
    const handleClose = () => {
        navigate('/company/qms/list-targets');
    };

    const handleQmsViewDraftTargets = (id) => {
        navigate(`/company/qms/view-draft-targets/${id}`);
    };

    const handleQmsEditDraftTargets = (id) => {
        navigate(`/company/qms/edit-draft-targets/${id}`);
    };

    // Delete draft target
    const handleDeleteDraftTargets = async (id) => {
        if (window.confirm('Are you sure you want to delete this draft target?')) {
            try {
                await axios.delete(`${BASE_URL}/qms/targets-get/${id}/`);
                setTargets(targets.filter(target => target.id !== id));
                // If we deleted the last item on the page, go to previous page
                if (currentTargets.length === 1 && currentPage > 1) {
                    setCurrentPage(prev => prev - 1);
                }
            } catch (err) {
                setError('Failed to delete draft target. Please try again.');
                console.error('Error deleting draft target:', err);
            }
        }
    };


    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // Pagination handlers
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    return (
        <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="list-manual-head">Draft Targets and Programs</h1>
                <div className="flex gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="serach-input-manual focus:outline-none bg-transparent"
                            disabled={loading}
                        />
                        <div className='absolute right-[1px] top-[2px] text-white bg-[#24242D] p-[10.5px] w-[55px] rounded-tr-[6px] rounded-br-[6px] flex justify-center items-center'>
                            <Search size={18} />
                        </div>
                    </div>
                    <button onClick={handleClose} className="bg-[#24242D] p-2 rounded-md">
                        <X className="text-white" />
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="text-red-500 mb-4">{error}</div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="text-center">Loading...</div>
            )}

            {/* Table */}
            {!loading && (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className='bg-[#24242D]'>
                            <tr className="h-[48px]">
                                <th className="pl-4 pr-2 text-left add-manual-theads">No</th>
                                <th className="px-2 text-left add-manual-theads">Target</th>
                                <th className="px-2 text-left add-manual-theads">Target Date</th>
                                <th className="px-2 text-left add-manual-theads">Responsible</th>
                                <th className="px-2 text-left add-manual-theads">Action</th>
                                <th className="px-2 text-center add-manual-theads">View</th>
                                <th className="pr-2 text-center add-manual-theads">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentTargets.length > 0 ? (
                                currentTargets.map((target, index) => (
                                    <tr key={target.id} className="border-b border-[#383840] hover:bg-[#1a1a20] h-[50px] cursor-pointer">
                                        <td className="pl-5 pr-2 add-manual-datas">{indexOfFirstItem + index + 1}</td>
                                        <td className="px-2 add-manual-datas">{target.target || 'N/A'}</td>
                                        <td className="px-2 add-manual-datas">{formatDate(target.target_date || 'N/A')}</td>
                                        <td className="px-2 add-manual-datas">{target.responsible?.first_name} {target.responsible?.last_name || 'N/A'}</td>
                                        <td className="px-2 add-manual-datas">
                                            <button onClick={() => handleQmsEditDraftTargets(target.id)} className='text-[#1E84AF]'>
                                                Click to continue
                                            </button>
                                        </td>
                                        <td className="px-2 add-manual-datas !text-center">
                                            <button onClick={() => handleQmsViewDraftTargets(target.id)}>
                                                <img src={viewIcon} alt="View Icon" style={{ filter: 'brightness(0) saturate(100%) invert(69%) sepia(32%) saturate(4%) hue-rotate(53deg) brightness(94%) contrast(86%)' }} />
                                            </button>
                                        </td>
                                        <td className="px-2 add-manual-datas !text-center">
                                            <button onClick={() => handleDeleteDraftTargets(target.id)}>
                                                <img src={deleteIcon} alt="Delete Icon" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="text-center py-4 not-found">No draft targets found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {!loading && filteredTargets.length > 0 && (
                <div className="flex justify-between items-center mt-6 text-sm">
                    <div className='text-white total-text'>Total-{filteredTargets.length}</div>
                    <div className="flex items-center gap-5">
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className={`cursor-pointer swipe-text ${currentPage === 1 ? 'opacity-50' : ''}`}
                        >
                            Previous
                        </button>

                        {/* Show up to 5 page numbers at a time */}
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            let pageNumber;
                            if (totalPages <= 5) {
                                pageNumber = i + 1;
                            } else {
                                if (currentPage <= 3) {
                                    pageNumber = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNumber = totalPages - 4 + i;
                                } else {
                                    pageNumber = currentPage - 2 + i;
                                }
                            }
                            return (
                                <button
                                    key={pageNumber}
                                    onClick={() => paginate(pageNumber)}
                                    className={`${currentPage === pageNumber ? 'pagin-active' : 'pagin-inactive'}`}
                                >
                                    {pageNumber}
                                </button>
                            );
                        })}

                        <button
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                            className={`cursor-pointer swipe-text ${currentPage === totalPages ? 'opacity-50' : ''}`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QmsDraftTargets;