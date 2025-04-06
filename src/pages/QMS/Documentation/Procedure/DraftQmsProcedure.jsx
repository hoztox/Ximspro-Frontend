import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import views from "../../../../assets/images/Companies/view.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";

const DraftQmsProcedure = () => {
    // Demo data instead of fetching from API
    const demoData = [
        {
            id: 1,
            title: "Quality Management Process",
            no: "QMS-001",
            approved_by: { first_name: "John", last_name: "Doe" },
            rivision: "1.0",
            date: "2025-01-15"
        },
        {
            id: 2,
            title: "Document Control Procedure",
            no: "QMS-002",
            approved_by: { first_name: "Jane", last_name: "Smith" },
            rivision: "2.1",
            date: "2025-02-20"
        },
    ];

    const [procedures] = useState(demoData);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const procedurePerPage = 10;
    const navigate = useNavigate();
    
    // Format date function
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '-');
    };

    // Navigation functions
    const handleEditDraft = () => {
        navigate(`/company/qms/editdraftprocedure/`);
        console.log(`Navigating to edit draft procedure with ID: `);
    };

    const handleCloseProcedureDraft = () => {
        navigate('/company/qms/procedure');
        console.log("Navigating back to procedure page");
    };

    const handleView = () => {
        navigate(`/company/qms/viewprocedure`);
    };

    // Delete function (with mock implementation)
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this procedure?")) {
            alert("Procedure deleted successfully");
        }
    };

    // Search and pagination functions
    const filteredProcedure = procedures.filter(procedure =>
        (procedure.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (procedure.no?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (procedure.approved_by?.first_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (procedure.rivision?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (formatDate(procedure.date)?.replace(/^0+/, '') || '').includes(searchQuery.replace(/^0+/, ''))
    );

    const totalPages = Math.ceil(filteredProcedure.length / procedurePerPage);
    const paginatedProcedure = filteredProcedure.slice((currentPage - 1) * procedurePerPage, currentPage * procedurePerPage);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);  
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
            window.scrollTo(0, 0);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    return (
        <div className="bg-[#1C1C24] list-manual-main">
            {/* Header section */}
            <div className="flex items-center justify-between px-[14px] pt-[24px]">
                <h1 className="list-manual-head">Draft Procedure Sections</h1>
                <div className="flex space-x-5 items-center">
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
                        className="text-white bg-[#24242D] p-1 rounded-md"
                        onClick={handleCloseProcedureDraft}
                    >
                        <X className='text-white' />
                    </button>
                </div>
            </div>
            {/* Table section */}
            <div className="p-5 overflow-hidden">
                <table className="w-full">
                    <thead className='bg-[#24242D]'>
                        <tr className="h-[48px]">
                            <th className="pl-4 pr-2 text-left add-manual-theads">No</th>
                            <th className="px-2 text-left add-manual-theads">Procedure Title</th>
                            <th className="px-2 text-left add-manual-theads">Procedure No</th>
                            <th className="px-2 text-left add-manual-theads">Approved by</th>
                            <th className="px-2 text-left add-manual-theads">Revision</th>
                            <th className="px-2 text-left add-manual-theads">Date</th>
                            <th className="px-2 text-left add-manual-theads">Action</th>
                            <th className="px-2 text-center add-manual-theads">View</th>
                            <th className="pl-2 pr-4 text-center add-manual-theads">Delete</th>
                        </tr>
                    </thead>
                    <tbody key={currentPage}>
                        {paginatedProcedure.length > 0 ? (
                            paginatedProcedure.map((procedure, index) => (
                                <tr key={procedure.id} className="border-b border-[#383840] hover:bg-[#1a1a20] h-[46px]">
                                    <td className="pl-5 pr-2 add-manual-datas">{(currentPage - 1) * procedurePerPage + index + 1}</td>
                                    <td className="px-2 add-manual-datas">{procedure.title || 'N/A'}</td>
                                    <td className="px-2 add-manual-datas">{procedure.no || 'N/A'}</td>
                                    <td className="px-2 add-manual-datas">
                                        {procedure.approved_by ?
                                            `${procedure.approved_by.first_name} ${procedure.approved_by.last_name}` :
                                            'N/A'}
                                    </td>
                                    <td className="px-2 add-manual-datas">{procedure.rivision || 'N/A'}</td>
                                    <td className="px-2 add-manual-datas">{formatDate(procedure.date)}</td>
                                    <td className='px-2 add-manual-datas'>
                                    <button className='text-[#1E84AF]'
                                        onClick={() => handleEditDraft()}
                                        >
                                            Click to Continue
                                        </button>
                                    </td>
                                    <td className="px-2 add-manual-datas text-center">
                                        <button
                                            onClick={() => handleView()}
                                            title="View"
                                        >
                                            <img src={views} alt="View Icon" />
                                        </button>
                                    </td>
                                    <td className="pl-2 pr-4 add-manual-datas text-center">
                                        <button
                                            onClick={() => handleDelete(procedure.id)}
                                            title="Delete"
                                        >
                                            <img src={deletes} alt="Delete Icon" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="11" className="text-center py-4 not-found">No Procedure found.</td></tr>
                        )}
                        {/* Pagination row */}
                        <tr>
                            <td colSpan="11" className="pt-[15px] border-t border-[#383840]">
                                <div className="flex items-center justify-between w-full">
                                    <div className="text-white total-text">Total-{filteredProcedure.length}</div>
                                    <div className="flex items-center gap-5">
                                        <button
                                            onClick={handlePrevious}
                                            disabled={currentPage === 1}
                                            className={`cursor-pointer swipe-text ${currentPage === 1 ? 'opacity-50' : ''}`}
                                        >
                                            Previous
                                        </button>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageClick(page)}
                                                className={`${currentPage === page ? 'pagin-active' : 'pagin-inactive'}`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                        <button
                                            onClick={handleNext}
                                            disabled={currentPage === totalPages || totalPages === 0}
                                            className={`cursor-pointer swipe-text ${currentPage === totalPages || totalPages === 0 ? 'opacity-50' : ''}`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DraftQmsProcedure;