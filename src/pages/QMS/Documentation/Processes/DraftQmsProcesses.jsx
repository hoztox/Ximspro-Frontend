import React, { useState } from "react";
import { X } from "lucide-react";
import edits from "../../../../assets/images/Company Documentation/edit.svg"
import deletes from '../../../../assets/images/Company Documentation/delete.svg'
import views from "../../../../assets/images/Company Documentation/view.svg"
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
const DraftQmsProcesses = () => {
    const [formData, setFormData] = useState([
        { id: 1, name: "Anonymous", identification: "Anonymous", type: "Anonymous", expectations: "Anonymous", date: "03-12-2024" },
        { id: 2, name: "Anonymous", identification: "Anonymous", type: "Anonymous", expectations: "Anonymous", date: "03-12-2024" },
        // You can add more initial data here
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const recordsPerPage = 10;
    const filteredData = formData.filter(item =>
        Object.values(item).some(
            value => typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    const totalRecords = filteredData.length;
    const totalPages = Math.ceil(totalRecords / recordsPerPage);


    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const handleViewProcesses = () => {
        navigate('/company/qms/view-processes')
    }

    const handleCloseDraftQmsProcesses = () => {
        navigate('/company/qms/processes')
    }

    const handleEditDraftProcesses = () => {
        navigate('/company/qms/edit-draft-processes')
    }

    const handleDelete = (id) => {
        setFormData(formData.filter(item => item.id !== id));
    };

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Function to determine which page numbers to display
    const getPageNumbers = () => {
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            // If we have less than max pages to show, show all pages
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        } else {
            // Always show current page and some pages before and after
            let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
            let endPage = startPage + maxPagesToShow - 1;

            // Adjust if we're near the end
            if (endPage > totalPages) {
                endPage = totalPages;
                startPage = Math.max(1, endPage - maxPagesToShow + 1);
            }

            return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
        }
    };

    // Filter data based on search term

    // Get current records for the current page
    const currentRecords = filteredData.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
    );

    return (
        <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
            <div className="flex justify-between items-center mb-5">
                <h1 className="interested-parties-head">Draft Processes</h1>
                <div className="flex space-x-5">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="serach-input-manual focus:outline-none bg-transparent"
                        />
                        <div className='absolute right-[1px] top-[2px] text-white bg-[#24242D] p-[10.5px] w-[55px] rounded-tr-[6px] rounded-br-[6px] flex justify-center items-center'>
                            <Search size={18} />
                        </div>
                    </div>
                    <button
                        className="text-white bg-[#24242D] p-1 rounded-md h-[42px] w-[42px] flex justify-center items-center"
                        onClick={handleCloseDraftQmsProcesses}
                    >
                        <X className='text-white' />
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-[#24242D]">
                        <tr className="h-[48px]">
                            <th className="px-4 qms-interested-parties-thead text-left">No</th>
                            <th className="px-4 qms-interested-parties-thead text-left">Name</th>
                            <th className="px-4 qms-interested-parties-thead text-left">No/Identification</th>
                            <th className="px-4 qms-interested-parties-thead text-left">Type</th>
                            <th className="px-4 qms-interested-parties-thead text-left">Date</th>
                            <th className="px-4 qms-interested-parties-thead text-left">Edit</th>
                            <th className="px-4 qms-interested-parties-thead text-center">View</th>
                            <th className="px-4 qms-interested-parties-thead text-center">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRecords.length > 0 ? (
                            currentRecords.map((item) => (
                                <tr key={item.id} className="border-b border-[#383840] hover:bg-[#1a1a20] h-[50px] cursor-pointer">
                                    <td className="px-4 text-left qms-interested-parties-data">{item.id}</td>
                                    <td className="px-4 text-left qms-interested-parties-data">{item.name}</td>
                                    <td className="px-4 text-left qms-interested-parties-data">{item.identification}</td>
                                    <td className="px-4 text-left qms-interested-parties-data">{item.type}</td>
                                    <td className="px-4 text-left qms-interested-parties-data">{item.date}</td>
                                    <td className="px-4 text-left qms-interested-parties-data">
                                        <button className="text-[#1E84AF]"
                                         onClick={() => handleEditDraftProcesses()}
                                        >
                                           Click to Continue
                                        </button>
                                    </td>
                                    <td className="px-4 text-center qms-interested-parties-data">
                                        <button className="text-gray-300 hover:text-white"
                                            onClick={() => handleViewProcesses()}
                                        >
                                            <img src={views} alt="View Icon" className="w-[16px] h-[16px]" />
                                        </button>
                                    </td>
                                    <td className="px-4 text-center qms-interested-parties-data">
                                        <button
                                            className="text-gray-300 hover:text-white"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            <img src={deletes} alt="Delete Icon" className="w-[16px] h-[16px]" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center py-4">No data found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-4 text-sm">
                <div className="text-white total-text">Total: {filteredData.length}</div>
                <div className="flex items-center space-x-5">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`cursor-pointer swipe-text ${currentPage === 1 ? 'opacity-50' : ''}`}
                    >

                        <span>Previous</span>
                    </button>

                    {getPageNumbers().map(page => (
                        <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`${currentPage === page ? 'pagin-active' : 'pagin-inactive'}`}
                        >
                            {page}
                        </button>
                    ))}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                            {currentPage < totalPages - 3 && <span className="px-1">...</span>}
                            <button
                                onClick={() => goToPage(totalPages)}
                                className="px-3 py-1 rounded pagin-inactive"
                            >
                                {totalPages}
                            </button>
                        </>
                    )}

                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className={`cursor-pointer swipe-text ${currentPage === totalPages || totalPages === 0 ? 'opacity-50' : ''}`}
                    >
                        <span>Next</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
export default DraftQmsProcesses
