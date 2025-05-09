import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import plusIcon from "../../../../assets/images/Company Documentation/plus icon.svg";
import viewIcon from "../../../../assets/images/Companies/view.svg";
import editIcon from "../../../../assets/images/Company Documentation/edit.svg";
import deleteIcon from "../../../../assets/images/Company Documentation/delete.svg";
import { useNavigate } from 'react-router-dom';
const QmsDraftEnvironmentalIncidents = () => {
    const initialData = [
        { id: 1, title: 'Anonymous', source: 'Anonymous', ei_no: 'EI-1', report_by: 'abc', },
        { id: 2, title: 'Anonymous', source: 'Anonymous', ei_no: 'EI-2', report_by: 'abc', },
        { id: 3, title: 'Anonymous', source: 'Anonymous', ei_no: 'EI-3', report_by: 'abc', },

    ];


    // State
    const [environmentalInceidents, setEnvironmentalInceidents] = useState(initialData);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        source: '',
        ei_no: '',
        report_by: '',
    });

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        setSearchTerm(value); // Update_raised searchTerm as well
        setCurrentPage(1);
    };


    // Pagination
    const itemsPerPage = 10;
    const totalItems = environmentalInceidents.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = environmentalInceidents.slice(indexOfFirstItem, indexOfLastItem);

    // Search functionality

    const filteredEnvironmentalInceidents = currentItems.filter(environmentalInceident =>
        environmentalInceident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        environmentalInceident.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        environmentalInceident.report_by.toLowerCase().includes(searchQuery.toLowerCase())
    );



    const handleClose = () => {
        navigate('/company/qms/list-environmantal-incident')
    }
    const handleViewDraftEnvironmentalIncident = () => {
        navigate('/company/qms/view-draft-environmantal-incident')
    }

    const handleEditDraftEnvironmentalIncident = () => {
        navigate('/company/qms/edit-draft-environmantal-incident')
    }


    const handleDeleteDraftEnvironmentalIncident = (id) => {
        setEnvironmentalInceidents(environmentalInceidents.filter(environmentalInceident => environmentalInceident.id !== id));
    };

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    return (
        <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="list-manual-head">Draft Environmental Incidents</h1>
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
                    <button onClick={handleClose} className="bg-[#24242D] p-2 rounded-md">
                        <X className="text-white" />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className='bg-[#24242D]'>
                        <tr className="h-[48px]">
                            <th className="pl-4 pr-2 text-left add-manual-theads">No</th>
                            <th className="px-2 text-left add-manual-theads">Title</th>
                            <th className="px-2 text-left add-manual-theads">Source</th>
                            <th className="px-2 text-left add-manual-theads">EI No</th>
                            <th className="px-2 text-left add-manual-theads">Report By</th>
                            <th className="px-2 text-left add-manual-theads">Action</th>
                            <th className="px-2 text-center add-manual-theads">View</th>
                            <th className="pr-2 text-center add-manual-theads">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEnvironmentalInceidents.map((environmentalInceident, index) => (
                            <tr key={environmentalInceident.id} className="border-b border-[#383840] hover:bg-[#1a1a20] h-[50px] cursor-pointer">
                                <td className="pl-5 pr-2 add-manual-datas">{environmentalInceident.id}</td>
                                <td className="px-2 add-manual-datas">{environmentalInceident.title}</td>
                                <td className="px-2 add-manual-datas">{environmentalInceident.source}</td>
                                <td className="px-2 add-manual-datas">{environmentalInceident.ei_no}</td>
                                <td className="px-2 add-manual-datas">{environmentalInceident.report_by}</td>
                                <td className="px-2 add-manual-datas">
                                    <button onClick={handleEditDraftEnvironmentalIncident} className='text-[#1E84AF]'>
                                        Click to Continue
                                    </button>
                                </td>
                                <td className="px-2 add-manual-datas !text-center">
                                    <button onClick={handleViewDraftEnvironmentalIncident}>
                                        <img src={viewIcon} alt="View Icon" style={{ filter: 'brightness(0) saturate(100%) invert(69%) sepia(32%) saturate(4%) hue-rotate(53deg) brightness(94%) contrast(86%)' }} />
                                    </button>
                                </td>
                                <td className="px-2 add-manual-datas !text-center">
                                    <button onClick={handleDeleteDraftEnvironmentalIncident}>
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
export default QmsDraftEnvironmentalIncidents
