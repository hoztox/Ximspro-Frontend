import React, { useState } from 'react';
import { Search } from 'lucide-react';
import plusIcon from "../../../../assets/images/Company Documentation/plus icon.svg";
import viewIcon from "../../../../assets/images/Companies/view.svg";
import editIcon from "../../../../assets/images/Company Documentation/edit.svg";
import deleteIcon from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from 'react-router-dom';

const QmsSupplierProblemLog = () => {
    const initialData = [
        { id: 1, supplier_name: 'Anonymous', problem: 'Anonymous', car: '123', date: '03-12-2024', status: 'Solved' },
        { id: 2, supplier_name: 'Anonymous', problem: 'Anonymous', car: '123', date: '03-12-2024', status: 'Not Solved' },
        { id: 3, supplier_name: 'Anonymous', problem: 'Anonymous', car: '123', date: '03-12-2024', status: 'Solved' },
    ];

    // State
    const [suppliers, setSuppliers] = useState(initialData);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        supplier_name: '',
        problem: '',
        date: '',
        car: '',
        status: 'Solved'  // Default status set to 'Requested'
    });

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        setSearchTerm(value); // Update searchTerm as well
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

    const filteredSuppliers = currentItems.filter(supplier =>
        supplier.supplier_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.problem.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.car.toLowerCase().includes(searchQuery.toLowerCase())
    );



    const handleAddSupplierProblem = () => {
        navigate('/company/qms/add-supplier-problem')
    }

    const handleDraftInternalProblems = () => {
        // navigate('/company/qms/draft-internal-problems-observations')
    }

    const handleQmsViewInternalProblems = () => {
        // navigate('/company/qms/view-internal-problems-observations')
    }

    const handleQmsEditInternalProblems = () => {
        // navigate('/company/qms/edit-internal-problems-observations')
    }


    // Delete  supplier
    const handleDeleteInternalProblems = (id) => {
        setSuppliers(suppliers.filter(supplier => supplier.id !== id));
    };

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

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
                        onClick={handleDraftInternalProblems}
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
                        {filteredSuppliers.map((supplier, index) => (
                            <tr key={supplier.id} className="border-b border-[#383840] hover:bg-[#1a1a20] h-[50px] cursor-pointer">
                                <td className="pl-5 pr-2 add-manual-datas">{supplier.id}</td>
                                <td className="px-2 add-manual-datas">{supplier.supplier_name}</td>
                                <td className="px-2 add-manual-datas">{supplier.problem}</td>
                                <td className="px-2 add-manual-datas">{supplier.date}</td>
                                <td className="px-2 add-manual-datas">{supplier.car}</td>
                                <td className="px-2 add-manual-datas !text-center">
                                    <span className={`inline-block rounded-[4px] px-[6px] py-[3px] text-xs ${supplier.status === 'Solved' ? 'bg-[#36DDAE11] text-[#36DDAE]' : 'bg-[#dd363611] text-[#dd3636]'
                                        }`}>
                                        {supplier.status}
                                    </span>
                                </td>
                                <td className="px-2 add-manual-datas !text-center">
                                    <button onClick={handleQmsViewInternalProblems}>
                                        <img src={viewIcon} alt="View Icon" style={{ filter: 'brightness(0) saturate(100%) invert(69%) sepia(32%) saturate(4%) hue-rotate(53deg) brightness(94%) contrast(86%)' }} />
                                    </button>
                                </td>
                                <td className="px-2 add-manual-datas !text-center">
                                    <button onClick={handleQmsEditInternalProblems}>
                                        <img src={editIcon} alt="Edit Icon" />
                                    </button>
                                </td>
                                <td className="px-2 add-manual-datas !text-center">
                                    <button onClick={handleDeleteInternalProblems}>
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
export default QmsSupplierProblemLog
