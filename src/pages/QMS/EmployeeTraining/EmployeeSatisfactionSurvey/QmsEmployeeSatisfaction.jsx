import React, { useState } from 'react';
import { Search, Eye, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import plusIcon from "../../../../assets/images/Company Documentation/plus icon.svg";
import viewIcon from "../../../../assets/images/Companies/view.svg";
import editIcon from "../../../../assets/images/Company Documentation/edit.svg";
import deleteIcon from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from 'react-router-dom';

const QmsEmployeeSatisfaction = () => {
    const initialData = [
        { id: 1, title: 'Anonymous', validTill: '03-12-2024', email: 'employee1@company.com' },
        { id: 2, title: 'Anonymous', validTill: '03-12-2024', email: 'employee2@company.com' },
    ];

    // State for data management
    const [employees, setEmployees] = useState(initialData);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // Handle search
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filter employees based on search term
    const filteredEmployees = employees.filter(employee =>
        employee.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Add new employee
    const handleAddEmployee = (e) => {
        navigate('/company/qms/add-satisfaction-survey')
    };

    const handleView = () => {
        navigate('/company/qms/view-satisfaction-survey')
    }

    const handleEdit = () => {
        navigate('/company/qms/edit-satisfaction-survey')
    };

    // Delete employee
    const handleDelete = (id) => {

    };

    // Pagination
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

    return (
        <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
            {/* Header and Search Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center pb-5">
                <h1 className="employee-performance-head">List Employee Satisfaction Survey</h1>

                <div className="flex w-full md:w-auto gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-[#1C1C24] text-white px-[10px] h-[42px] rounded-md w-[250px] border border-[#383840] outline-none"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <div className='absolute right-[1px] top-[1px] text-white bg-[#24242D] p-[11px] w-[55px] rounded-tr-[6px] rounded-br-[6px] flex justify-center items-center'>
                            <Search size={18} />
                        </div>
                    </div>

                    <button
                        className="flex items-center justify-center !px-[5px] add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
                        onClick={handleAddEmployee}
                    >
                        <span>Add Employee Satisfaction Survey</span>
                        <img src={plusIcon} alt="Add Icon" className='w-[18px] h-[18px] qms-add-plus' />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className='bg-[#24242D]'>
                        <tr className="h-[48px]">
                            <th className="pl-4 pr-2 text-left add-manual-theads">No</th>
                            <th className="px-2 text-left add-manual-theads">Title</th>
                            <th className="px-2 text-left add-manual-theads">Valid Till</th>
                            <th className="px-2 text-left add-manual-theads">Email</th>
                            <th className="px-2 text-left add-manual-theads">Survey</th>
                            <th className="px-2 text-left add-manual-theads">See Result Graph</th>
                            <th className="px-2 text-left add-manual-theads">Add Questions</th>
                            <th className="px-2 text-center add-manual-theads">View</th>
                            <th className="px-2 text-center add-manual-theads">Edit</th>
                            <th className="px-2 text-center add-manual-theads">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((employee) => (
                            <tr key={employee.id} className="border-b border-[#383840] hover:bg-[#1a1a20] h-[50px] cursor-pointer">
                                <td className="pl-5 pr-2 add-manual-datas">{employee.id}</td>
                                <td className="px-2 add-manual-datas">{employee.title}</td>
                                <td className="px-2 add-manual-datas">{employee.validTill}</td>
                                <td className="px-2 add-manual-datas">
                                    <button className="text-[#1E84AF]">Send Mail</button>
                                </td>
                                <td className="px-2 add-manual-datas">
                                    <button className="text-[#1E84AF]">Click to Survey</button>
                                </td>
                                <td className="px-2 add-manual-datas">
                                    <button className="text-[#1E84AF]">See Result Graph</button>
                                </td>
                                <td className="px-2 add-manual-datas">
                                    <button className="text-[#1E84AF]">Add Questions</button>
                                </td>
                                <td className="px-2 add-manual-datas !text-center">
                                    <button onClick={() => handleView()}>
                                        <img src={viewIcon} alt="View Icon" className='action-btn' />
                                    </button>
                                </td>
                                <td className="px-2 add-manual-datas !text-center">
                                    <button onClick={() => handleEdit()}>
                                        <img src={editIcon} alt="Edit Icon" className='action-btn' />
                                    </button>
                                </td>
                                <td className="px-2 add-manual-datas !text-center">
                                    <button onClick={() => handleDelete(employee.id)}>
                                        <img src={deleteIcon} alt="Delete Icon" className='action-btn' />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-3">
                <div className='text-white total-text'>Total-{filteredEmployees.length}</div>
                <div className="flex items-center gap-5">
                    <button
                        className={`cursor-pointer swipe-text ${currentPage === 1 ? 'opacity-50' : ''}`}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>

                    {Array.from({ length: Math.min(4, totalPages) }, (_, i) => {
                        // Show pages around current page
                        const pageToShow = currentPage <= 2 ? i + 1 :
                            currentPage >= totalPages - 1 ? totalPages - 3 + i :
                                currentPage - 2 + i;

                        if (pageToShow <= totalPages) {
                            return (
                                <button
                                    key={pageToShow}
                                    className={`${currentPage === pageToShow ? 'pagin-active' : 'pagin-inactive'
                                        }`}
                                    onClick={() => setCurrentPage(pageToShow)}
                                >
                                    {pageToShow}
                                </button>
                            );
                        }
                        return null;
                    })}

                    <button
                        className={`cursor-pointer swipe-text ${currentPage === totalPages ? 'opacity-50' : ''}`}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QmsEmployeeSatisfaction
