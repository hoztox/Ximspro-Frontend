import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import plusIcon from "../../../../assets/images/Company Documentation/plus icon.svg";
import viewIcon from "../../../../assets/images/Companies/view.svg";
import editIcon from "../../../../assets/images/Company Documentation/edit.svg";
import deleteIcon from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../../../Utils/Config';

const QmsSupplierProblemLog = () => {
    // State
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    // Get company ID from local storage
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

    // Fetch supplier problems from API
    useEffect(() => {
        const fetchSupplierProblems = async () => {
            try {
                setLoading(true);
                if (!companyId) {
                    setError('Company ID not found. Please log in again.');
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`${BASE_URL}/qms/supplier-problems/company/${companyId}/`);
                console.log("Supplier Problems:", response.data);

                // Filter out drafts for the main view
                const activeProblems = response.data.filter(problem => !problem.is_draft);

                // Sort by date (newest first)
                activeProblems.sort((a, b) => new Date(b.date) - new Date(a.date));

                setSuppliers(activeProblems);
                setError(null);
            } catch (err) {
                setError('Failed to fetch supplier problems');
                console.error('Error fetching supplier problems:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSupplierProblems();
    }, [companyId]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        setSearchTerm(value);
        setCurrentPage(1);
    };

    // Pagination
    const itemsPerPage = 10;
    const totalItems = suppliers.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = suppliers.slice(indexOfFirstItem, indexOfLastItem);

    // Search functionality
    const filteredSuppliers = currentItems.filter(supplier => {
        const searchString = searchQuery.toLowerCase();

        const problemMatch = typeof supplier.problem === 'string' && supplier.problem.toLowerCase().includes(searchString);
        const supplierNameMatch = supplier.supplier && typeof supplier.supplier.company_name === 'string' &&
            supplier.supplier.company_name.toLowerCase().includes(searchString);

        const carMatch = supplier.no_car && typeof supplier.no_car.title === 'string' &&
            supplier.no_car.title.toLowerCase().includes(searchString);

        return problemMatch || supplierNameMatch || carMatch;
    });

    const handleAddSupplierProblem = () => {
        navigate('/company/qms/add-supplier-problem');
    };

    const handleDraftSupplierProblem = () => {
        navigate('/company/qms/drafts-supplier-problem');
    };

    const handleQmsViewSupplierProblem = (id) => {
        navigate(`/company/qms/views-supplier-problem/${id}`);
    };

    const handleQmsEditSupplierProblem = (id) => {
        navigate(`/company/qms/edits-supplier-problem/${id}`);
    };

    // Delete supplier problem
    const handleDeleteSupplierProblem = async (id) => {
        if (window.confirm("Are you sure you want to delete this supplier problem?")) {
            try {
                await axios.delete(`${BASE_URL}/qms/supplier-problems/${id}/`);
                // Update state to remove the deleted problem
                setSuppliers(suppliers.filter(supplier => supplier.id !== id));
            } catch (err) {
                console.error("Error deleting supplier problem:", err);
                alert("Failed to delete supplier problem. Please try again.");
            }
        }
    };

    // Format date to readable format
    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }).replace(/\//g, '-');
        } catch (e) {
            console.error('Error formatting date:', e);
            return dateString;
        }
    };

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    if (loading) {
        return (
            <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
                <div className="flex justify-center items-center h-64">
                    <p className="text-lg">Loading supplier problems...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
                <div className="flex justify-center items-center h-64">
                    <p className="text-lg text-red-500">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="list-manual-head">Supplier Problem Log</h1>
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
                        onClick={handleAddSupplierProblem}
                    >
                        <span>Enter Supplier Problem</span>
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
                            <th className="px-2 text-left add-manual-theads">Supplier Name</th>
                            <th className="px-2 text-left add-manual-theads">Problem</th>
                            <th className="px-2 text-left add-manual-theads">Date</th>
                            <th className="px-2 text-left add-manual-theads">CAR</th>
                            <th className="px-2 text-center add-manual-theads">Status</th>
                            <th className="px-2 text-center add-manual-theads">View</th>
                            <th className="px-2 text-center add-manual-theads">Edit</th>
                            <th className="pr-2 text-center add-manual-theads">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSuppliers.length > 0 ? (
                            filteredSuppliers.map((supplier, index) => (
                                <tr key={supplier.id} className="border-b border-[#383840] hover:bg-[#1a1a20] h-[50px] cursor-pointer">
                                    <td className="pl-5 pr-2 add-manual-datas">{indexOfFirstItem + index + 1}</td>
                                    <td className="px-2 add-manual-datas">{supplier.supplier?.company_name || 'N/A'}</td>
                                    <td className="px-2 add-manual-datas">
                                        {supplier.problem && supplier.problem.length > 50
                                            ? `${supplier.problem.substring(0, 50)}...`
                                            : supplier.problem}
                                    </td>
                                    <td className="px-2 add-manual-datas">{formatDate(supplier.date)}</td>

                                    <td className="px-2 add-manual-datas">{supplier.no_car?.action_no || 'N/A'}</td> 
                                    <td className="px-2 add-manual-datas !text-center">
                                        <span className={`inline-block rounded-[4px] px-[6px] py-[3px] text-xs ${supplier.solved === 'Yes'
                                                ? 'bg-[#36DDAE11] text-[#36DDAE]'
                                                : 'bg-[#dd363611] text-[#dd3636]'
                                            }`}>
                                            {supplier.solved === 'Yes' ? 'Solved' : 'Not Solved'}
                                        </span>
                                    </td>
                                    <td className="px-2 add-manual-datas !text-center">
                                        <button onClick={() => handleQmsViewSupplierProblem(supplier.id)}>
                                            <img
                                                src={viewIcon}
                                                alt="View Icon"
                                                style={{ filter: 'brightness(0) saturate(100%) invert(69%) sepia(32%) saturate(4%) hue-rotate(53deg) brightness(94%) contrast(86%)' }}
                                            />
                                        </button>
                                    </td>
                                    <td className="px-2 add-manual-datas !text-center">
                                        <button onClick={() => handleQmsEditSupplierProblem(supplier.id)}>
                                            <img src={editIcon} alt="Edit Icon" />
                                        </button>
                                    </td>
                                    <td className="px-2 add-manual-datas !text-center">
                                        <button onClick={() => handleDeleteSupplierProblem(supplier.id)}>
                                            <img src={deleteIcon} alt="Delete Icon" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr className="border-b border-[#383840] h-[50px]">
                                <td colSpan="9" className="text-center not-found">
                                    {searchQuery ? 'No matching supplier problems found' : 'No supplier problems available'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalItems > 0 && (
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
            )}
        </div>
    );
};

export default QmsSupplierProblemLog;