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
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [totalItems, setTotalItems] = useState(0);

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
                const response = await axios.get(`${BASE_URL}/qms/supplier-problems/company/${companyId}/`, {
                    params: {
                        page: currentPage,
                        search: searchQuery
                    }
                });
                console.log('Supplier Problmsssss:', response);


                setSuppliers(response.data.results);
                setTotalItems(response.data.count);
                setError(null);
            } catch (err) {
                setError('Failed to fetch supplier problems');
                console.error('Error fetching supplier problems:', err);
            } finally {
                setLoading(false);
            }
        };

        if (companyId) {
            fetchSupplierProblems();
        }
    }, [companyId, currentPage, searchQuery]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        setSearchTerm(value);
        setCurrentPage(1); // Reset to first page on new search
    };

    // Pagination
    const itemsPerPage = 10;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

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
        if (window.confirm('Are you sure you want to delete this supplier problem?')) {
            try {
                await axios.delete(`${BASE_URL}/qms/supplier-problems/${id}/`);
                setSuppliers(suppliers.filter(supplier => supplier.id !== id));
                alert('Supplier problem deleted successfully');
            } catch (err) {
                console.error('Error deleting supplier problem:', err);
                alert('Failed to delete supplier problem');
            }
        }
    };

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    if (loading) return <div className="bg-[#1C1C24] text-white p-5 rounded-lg flex justify-center items-center h-64">Loading supplier problems...</div>;
    if (error) return <div className="bg-[#1C1C24] text-white p-5 rounded-lg flex justify-center items-center h-64">{error}</div>;

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
                        {suppliers && suppliers.length > 0 ? (
                            suppliers.map((supplier, index) => (
                                <tr key={supplier.id} className="border-b border-[#383840] hover:bg-[#1a1a20] h-[50px] cursor-pointer">
                                    <td className="pl-5 pr-2 add-manual-datas">{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                                    <td className="px-2 add-manual-datas">{supplier.supplier_name || 'N/A'}</td>
                                    <td className="px-2 add-manual-datas">{supplier.problem_description || 'N/A'}</td>
                                    <td className="px-2 add-manual-datas">{new Date(supplier.problem_date).toLocaleDateString() || 'N/A'}</td>
                                    <td className="px-2 add-manual-datas">
                                        {supplier.car_numbers && supplier.car_numbers.length > 0 ?
                                            supplier.car_numbers.join(', ') : 'N/A'}
                                    </td>
                                    <td className="px-2 add-manual-datas !text-center">
                                        <span className={`inline-block rounded-[4px] px-[6px] py-[3px] text-xs ${supplier.is_solved ? 'bg-[#36DDAE11] text-[#36DDAE]' : 'bg-[#dd363611] text-[#dd3636]'}`}>
                                            {supplier.is_solved ? 'Solved' : 'Not Solved'}
                                        </span>
                                    </td>
                                    <td className="px-2 add-manual-datas !text-center">
                                        <button onClick={() => handleQmsViewSupplierProblem(supplier.id)}>
                                            <img src={viewIcon} alt="View Icon" style={{ filter: 'brightness(0) saturate(100%) invert(69%) sepia(32%) saturate(4%) hue-rotate(53deg) brightness(94%) contrast(86%)' }} />
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
                            <tr>
                                <td colSpan="9" className="text-center py-4">No supplier problems found</td>
                            </tr>
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

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                            pageNum = i + 1;
                        } else if (currentPage <= 3) {
                            pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                        } else {
                            pageNum = currentPage - 2 + i;
                        }
                        return (
                            <button
                                key={pageNum}
                                onClick={() => paginate(pageNum)}
                                className={`${currentPage === pageNum ? 'pagin-active' : 'pagin-inactive'}`}
                            >
                                {pageNum}
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
        </div>
    );
};

export default QmsSupplierProblemLog;