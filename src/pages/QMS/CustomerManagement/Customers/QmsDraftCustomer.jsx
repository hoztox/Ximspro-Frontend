import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, X } from 'lucide-react';
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import view from "../../../../assets/images/Company Documentation/view.svg";
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../../Utils/Config';

const QmsDraftCustomer = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const getUserCompanyId = () => {
        const role = localStorage.getItem("role");

        if (role === "company") {
            return localStorage.getItem("company_id");
        } else if (role === "user") {
            try {
                const userCompanyId = localStorage.getItem("user_company_id");
                return userCompanyId ? JSON.parse(userCompanyId) : null;
            } catch (e) {
                console.error("Error parsing user company ID:", e);
                return null;
            }
        }

        return null;
    };

    const companyId = getUserCompanyId();

    // Fetch customers data
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${BASE_URL}/qms/customers-draft/${companyId}/`);
                const formattedData = response.data.map((customer, index) => ({
                    id: customer.id,
                    name: customer.name || 'Anonymous',
                    email: customer.email || 'N/A',
                    mailing_address: customer.mailing_address || 'N/A',
                    date: customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'N/A'
                }));
                setCustomers(formattedData);
                setError(null);
                console.log('customers', response);
            } catch (err) {
                setError('Failed to fetch draft customers data');
                console.error('Error fetching draft customers:', err);
            } finally {
                setLoading(false);
            }
        };

        if (companyId) {
            fetchCustomers();
        }
    }, [companyId]);

    // Handle search
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    // Handle delete customer
    const handleDeleteCustomer = async (customerId) => {
        if (window.confirm('Are you sure you want to delete this draft customer?')) {
            try {
                await axios.delete(`${BASE_URL}/qms/customers/${customerId}/`);
                setCustomers(customers.filter(customer => customer.id !== customerId));
            } catch (err) {
                console.error('Error deleting draft customer:', err);
                alert('Failed to delete draft customer');
            }
        }
    };

    // Navigation handlers
    const handleClose = () => {
        navigate('/company/qms/list-customer');
    };

    const handleEditDraftCustomer = (customerId) => {
        navigate(`/company/qms/edit-draft-customer/${customerId}`);
    };

    const handleViewDraftCustomer = (customerId) => {
        navigate(`/company/qms/view-draft-customer/${customerId}`);
    };

    // Pagination
    const itemsPerPage = 10;
    const totalItems = customers.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Filter items based on search query
    const filteredItems = customers.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.mailing_address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Get current page items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    // Pagination handlers
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    if (loading) return <div className="flex justify-center items-center h-64 text-white">Loading draft customers...</div>;
    if (error) return <div className="flex justify-center items-center h-64 text-red-500">{error}</div>;

    return (
        <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
            <div className="flex justify-between items-center mb-6">
                <h1 className="list-awareness-training-head">List Draft Customer</h1>
                <div className="flex gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-[#1C1C24] text-white px-[10px] h-[42px] rounded-md w-[333px] border border-[#383840] outline-none"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <div className='absolute right-[1px] top-[1px] text-white bg-[#24242D] p-[11px] w-[55px] rounded-tr-[6px] rounded-br-[6px] flex justify-center items-center'>
                            <Search size={18} />
                        </div>
                    </div>
                    <button onClick={handleClose} className="bg-[#24242D] p-2 rounded-md">
                        <X className="text-white" />
                    </button>
                </div>
            </div>

            <div className="overflow-hidden">
                <table className="w-full">
                    <thead className='bg-[#24242D]'>
                        <tr className='h-[48px]'>
                            <th className="px-3 text-left list-awareness-training-thead">No</th>
                            <th className="px-3 text-left list-awareness-training-thead">Name</th>
                            <th className="px-3 text-left list-awareness-training-thead">Email</th>
                            <th className="px-3 text-left list-awareness-training-thead">Mailing Address</th>
                            <th className="px-3 text-left list-awareness-training-thead">Action</th>
                            <th className="px-3 text-center list-awareness-training-thead">View</th>
                            <th className="px-3 text-center list-awareness-training-thead">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((item, index) => (
                                <tr key={item.id} className="border-b border-[#383840] hover:bg-[#131318] cursor-pointer h-[50px]">
                                    <td className="px-3 list-awareness-training-datas">{indexOfFirstItem + index + 1}</td>
                                    <td className="px-3 list-awareness-training-datas">{item.name}</td>
                                    <td className="px-3 list-awareness-training-datas">{item.email}</td>
                                    <td className="px-3 list-awareness-training-datas">{item.mailing_address}</td>
                                    <td className="px-3 list-awareness-training-datas text-left text-[#1E84AF]">
                                        <button onClick={() => handleEditDraftCustomer(item.id)}>
                                            Click to Continue
                                        </button>
                                    </td>
                                    <td className="list-awareness-training-datas text-center ">
                                        <div className='flex justify-center items-center h-[50px]'>
                                            <button onClick={() => handleViewDraftCustomer(item.id)}>
                                                <img src={view} alt="View Icon" className='w-[16px] h-[16px]' />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="list-awareness-training-datas text-center">
                                        <div className='flex justify-center items-center h-[50px]'>
                                            <button onClick={() => handleDeleteCustomer(item.id)}>
                                                <img src={deletes} alt="Delete Icon" className='w-[16px] h-[16px]' />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-4">No draft customers found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {filteredItems.length > 0 && (
                <div className="flex justify-between items-center mt-3">
                    <div className='text-white total-text'>Total: {filteredItems.length}</div>
                    <div className="flex items-center gap-5">
                        <button
                            className={`cursor-pointer swipe-text ${currentPage === 1 ? 'opacity-50' : ''}`}
                            disabled={currentPage === 1}
                            onClick={prevPage}
                        >
                            Previous
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                            <button
                                key={number}
                                className={`w-8 h-8 rounded-md ${currentPage === number ? 'pagin-active' : 'pagin-inactive'}`}
                                onClick={() => paginate(number)}
                            >
                                {number}
                            </button>
                        ))}

                        <button
                            className={`cursor-pointer swipe-text ${currentPage === totalPages ? 'opacity-50' : ''}`}
                            disabled={currentPage === totalPages}
                            onClick={nextPage}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QmsDraftCustomer;