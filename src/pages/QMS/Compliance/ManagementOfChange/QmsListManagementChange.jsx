import React, { useState } from 'react';
import { Search } from 'lucide-react';
import plusicon from '../../../../assets/images/Company Documentation/plus icon.svg'
import edits from '../../../../assets/images/Company Documentation/edit.svg'
import deletes from '../../../../assets/images/Company Documentation/delete.svg'
import view from '../../../../assets/images/Company Documentation/view.svg'
import { useNavigate } from 'react-router-dom';


const QmsListManagementChange = () => {
    const initialData = [
        { id: 1, title: "Safety Protocol 2025", mocno: "SP-2025-001", revision: "Revision", date: "03-12-2024" },
        { id: 2, title: "Environmental Compliance", mocno: "EC-2025-042", revision: "Revision", date: "03-12-2024" },
    ];

    // State for form data management
    const [complianceData, setComplianceData] = useState(initialData);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const [itemsPerPage] = useState(10);

    const handleAddManagementChange = () => {
        navigate('/company/qms/add-management-change')
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleEditManagementChange = () => {
        navigate('/company/qms/edit-management-change')
    }

    const handleViewManagementChange = () => {
        navigate('/company/qms/view-management-change')
    }

    const handleDelete = (id) => {
        setComplianceData(complianceData.filter(item => item.id !== id));
    };

    // Filter and pagination
    const filteredData = complianceData.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.mocno.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.revision.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return (
        <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="list-compliance-head">List Management of Change</h1>
                    <div className="flex gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="serach-input-manual focus:outline-none bg-transparent !w-[230px]"
                            />
                            <div className='absolute right-[1px] top-[2px] text-white bg-[#24242D] p-[10.5px] w-[55px] rounded-tr-[6px] rounded-br-[6px] flex justify-center items-center'>
                                <Search size={18} />
                            </div>
                        </div>
                        <button
                            className="flex items-center justify-center !px-5 add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
                             
                        >
                            <span>Drafts</span>
                        </button>
                        <button
                            className="flex items-center justify-center add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
                            onClick={() => handleAddManagementChange()}
                        >
                            <span>Add Management of Change</span>
                            <img src={plusicon} alt="Add Icon" className='w-[18px] h-[18px] qms-add-plus' />
                        </button>
                    </div>
                </div>

                <div className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className='bg-[#24242D]'>
                                <tr className="h-[48px]">
                                    <th className="px-4 qms-list-compliance-thead text-left w-24">No</th>
                                    <th className="px-4 qms-list-compliance-thead text-left">Title</th>
                                    <th className="px-4 qms-list-compliance-thead text-left">MOC No</th>
                                    <th className="px-4 qms-list-compliance-thead text-left">Revision</th>
                                    <th className="px-4 qms-list-compliance-thead text-left">Date</th>
                                    <th className="px-4 qms-list-compliance-thead text-center">View</th>
                                    <th className="px-4 qms-list-compliance-thead text-center">Edit</th>
                                    <th className="px-4 qms-list-compliance-thead text-center">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item) => (
                                    <tr key={item.id} className="border-b border-[#383840] hover:bg-[#1a1a20] h-[50px] cursor-pointer">
                                        <td className="px-4 qms-list-compliance-data">{item.id}</td>
                                        <td className="px-4 qms-list-compliance-data">{item.title}</td>
                                        <td className="px-4 qms-list-compliance-data">{item.mocno}</td>
                                        <td className="px-4 qms-list-compliance-data">
                                            <span className="text-[#1E84AF]">{item.revision}</span>
                                        </td>
                                        <td className="px-4 qms-list-compliance-data">{item.date}</td>
                                        <td className="px-4 qms-list-compliance-data text-center">
                                            <button
                                                onClick={handleViewManagementChange}
                                            >
                                                <img src={view} alt="View Icon" className='w-[16px] h-[16px] mt-1' />
                                            </button>
                                        </td>
                                        <td className="px-4 qms-list-compliance-data text-center">
                                            <button
                                                onClick={handleEditManagementChange}
                                            >
                                                <img src={edits} alt="Edit icon" className='w-[16px] h-[16px]' />
                                            </button>
                                        </td>
                                        <td className="px-4 qms-list-compliance-data text-center">
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <img src={deletes} alt="Deletes icon" className='w-[16px] h-[16px]' />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-4 pt-3 flex items-center justify-between">
                        <div className="text-white total-text">
                            Total-{filteredData.length}
                        </div>
                        <div className="flex items-center gap-5">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`cursor-pointer swipe-text ${currentPage === 1 ? 'opacity-50' : ''}`}
                            >
                                Previous
                            </button>

                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                const pageNum = i + 1;
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`${currentPage === pageNum ? 'pagin-active' : 'pagin-inactive'}`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className={`cursor-pointer swipe-text ${currentPage === totalPages || totalPages === 0 ? 'opacity-50' : ''}`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default QmsListManagementChange
