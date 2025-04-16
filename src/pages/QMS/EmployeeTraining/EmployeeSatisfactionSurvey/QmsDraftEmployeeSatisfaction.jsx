import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import viewIcon from "../../../../assets/images/Companies/view.svg";
import deleteIcon from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from 'react-router-dom';

const QmsDraftEmployeeSatisfaction = () => {
    const initialData = [
        { id: 1, title: 'Anonymous', validTill: '03-12-2024', email: 'employee1@company.com' },
        { id: 2, title: 'Anonymous', validTill: '03-12-2024', email: 'employee2@company.com' },
    ];

    // State for data management
    const [employees, setEmployees] = useState(initialData);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // Modal states
    const [evaluationModal, setEvaluationModal] = useState({ isOpen: false, employee: null });
    const [questionsModal, setQuestionsModal] = useState({ isOpen: false });

    // Handle search
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filter employees based on search term
    const filteredEmployees = employees.filter(employee =>
        employee.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCloseDraftEmployeeSatisfaction = () => {
        navigate('/company/qms/list-satisfaction-survey')
    }

    const handleView = () => {
        navigate('/company/qms/view-draft-satisfaction-survey')
    }

    // Edit employee
    const handleEditDraft = () => {
        navigate('/company/qms/edit-draft-satisfaction-survey')
    };

    // Delete employee
    const handleDelete = (id) => {
        // Implementation
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
                <h1 className="employee-performance-head">Draft Employee Satisfaction Survey</h1>

                <div className="flex w-full md:w-auto gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-[#1C1C24] text-white px-[10px] h-[42px] rounded-md w-[180px] border border-[#383840] outline-none"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <div className='absolute right-[1px] top-[1px] text-white bg-[#24242D] p-[11px]  rounded-tr-[6px] rounded-br-[6px] flex justify-center items-center'>
                            <Search size={18} />
                        </div>
                    </div>
                    <button
                        className="text-white bg-[#24242D] px-2 rounded-md"
                        onClick={handleCloseDraftEmployeeSatisfaction}
                    >
                        <X className='text-white' />
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
                            {/* <th className="px-2 text-left add-manual-theads">Email</th> */}
                            {/* <th className="px-2 text-left add-manual-theads">Evaluation</th> */}
                            {/* <th className="px-2 text-left add-manual-theads">See Result Graph</th> */}
                            {/* <th className="px-2 text-left add-manual-theads">Add Questions</th> */}
                            <th className="px-2 text-left add-manual-theads">Action</th>
                            <th className="px-2 text-center add-manual-theads">View</th>
                            <th className="px-2 text-center add-manual-theads">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((employee) => (
                            <tr key={employee.id} className="border-b border-[#383840] hover:bg-[#1a1a20] h-[50px] cursor-pointer">
                                <td className="pl-5 pr-2 add-manual-datas">{employee.id}</td>
                                <td className="px-2 add-manual-datas">{employee.title}</td>
                                <td className="px-2 add-manual-datas">{employee.validTill}</td>
                                {/* <td className="px-2 add-manual-datas">
                    <button className="text-[#1E84AF]">Send Mail</button>
                  </td> */}
                                {/* <td className="px-2 add-manual-datas">
                    <button
                      className="text-[#1E84AF] hover:text-[#176d8e] transition-colors"
                      onClick={() => openEvaluationModal(employee)}
                    >
                      Click to Evaluate
                    </button>
                  </td> */}
                                {/* <td className="px-2 add-manual-datas">
                    <button className="text-[#1E84AF]">See Result Graph</button>
                  </td> */}
                                {/* <td className="px-2 add-manual-datas">
                    <button
                      className="text-[#1E84AF] hover:text-[#176d8e] transition-colors"
                      onClick={() => openQuestionsModal(employee)}
                    >
                      Add Questions
                    </button>
                  </td> */}
                                <td className="px-2 add-manual-datas !text-left !text-[#1E84AF]">
                                    <button onClick={() => handleEditDraft()}>
                                        Click to Continue
                                    </button>
                                </td>
                                <td className="px-2 add-manual-datas !text-center">
                                    <button onClick={() => handleView()}>
                                        <img src={viewIcon} alt="View Icon" className='action-btn' />
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
export default QmsDraftEmployeeSatisfaction
