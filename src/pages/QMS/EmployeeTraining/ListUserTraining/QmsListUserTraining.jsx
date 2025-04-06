import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import "./qmslistusertraining.css";
import { useNavigate } from 'react-router-dom';

const QmsListUserTraining = () => {
    const [selectedUser, setSelectedUser] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isFocused, setIsFocused] = useState(false);
    const [isOpen, setIsOpen] = useState(false); // replaces isFocused
    const navigate = useNavigate();


    const [formData, setFormData] = useState([
        { id: 1, userId: 'user1', title: 'Safety Protocol Training', type: 'Online', datePlanned: '03-12-2024', status: 'Completed' },
        { id: 2, userId: 'user2', title: 'Workplace Ethics', type: 'Online', datePlanned: '04-15-2024', status: 'Requested' },
        { id: 3, userId: 'user3', title: 'Data Security Basics', type: 'Webinar', datePlanned: '03-12-2024', status: 'Completed' },
        { id: 4, userId: 'user2', title: 'Advanced Excel Skills', type: 'Workshop', datePlanned: '04-20-2024', status: 'Requested' },
    ]);

    const [users, setUsers] = useState([
        { id: 'user1', name: 'John Doe' },
        { id: 'user2', name: 'Jane Smith' },
        { id: 'user3', name: 'Robert Johnson' },
        { id: 'user4', name: 'Emily Wilson' },
        { id: 'user5', name: 'Michael Brown' }
    ]);

    const itemsPerPage = 10;

    // Filter data by selected user
    const filteredData = selectedUser
        ? formData.filter((item) => item.userId === selectedUser)
        : formData;

    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Reset to page 1 on user change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedUser]);

    const getCurrentPageData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredData.slice(startIndex, endIndex);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleListTraining = () => {
        navigate('/company/qms/list-training')
    }

    const renderPagination = () => {
        const pages = [];
        for (let i = 1; i <= Math.min(4, totalPages); i++) {
            pages.push(
                <button
                    key={i}
                    className={`${currentPage === i ? 'pagin-active' : 'pagin-inactive'
                    }`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }

        return (
            <div className="flex items-center gap-5">
                <button
                    className={`cursor-pointer swipe-text ${currentPage === 1 ? 'opacity-50' : ''}`}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                {pages}
                <button
                    className={`cursor-pointer swipe-text ${currentPage === totalPages ? 'opacity-50' : ''}`}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        );        
    };

    return (
        <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
            <div className="flex justify-between items-center">
                <h1 className="list-user-training-head">List User Training</h1>
                <div className="flex gap-5">
                    <div className="relative w-[332px] ">
                        <select
                            className="bg-[#24242D] text-white  py-2 px-5 rounded-md appearance-none border-none pr-8 cursor-pointer select-user h-[42px]"
                            value={selectedUser}
                            onChange={(e) => {
                                setSelectedUser(e.target.value);
                                setIsOpen(false); // close on selection
                            }}
                            onMouseDown={() => setIsOpen(true)}
                            onBlur={() => setIsOpen(false)}
                        >
                            <option value="">Select User</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                        </select>

                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                            <ChevronDown
                                className={`w-[18px] h-[18px] text-[#AAAAAA] transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                                    }`}
                            />
                        </div>
                    </div>


                    <button
                        onClick={handleListTraining}
                        className="border border-[#858585] text-[#858585] rounded w-[140px] h-[42px] list-training-btn duration-200">
                        List Training
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto mt-4">
                <table className="w-full">
                    <thead className='bg-[#24242D]'>
                        <tr className="h-[48px]">
                            <th className="pl-4 pr-2 text-left add-manual-theads w-[15%]">No</th>
                            <th className="px-2 text-left add-manual-theads">Training Title</th>
                            <th className="px-2 text-left add-manual-theads w-[25%]">Type</th>
                            <th className="px-2 text-left add-manual-theads">Date Planned</th>
                            <th className="px-2 !pr-[34px] text-right add-manual-theads">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getCurrentPageData().map((item, index) => (
                            <tr key={item.id} className="border-b border-[#383840] hover:bg-[#1a1a20] h-[50px] cursor-pointer">
                                <td className="pl-5 pr-2 add-manual-datas">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                <td className="px-2 add-manual-datas">{item.title}</td>
                                <td className="px-2 add-manual-datas">{item.type}</td>
                                <td className="px-2 add-manual-datas">{item.datePlanned}</td>
                                <td className="px-2 add-manual-datas !text-right">
                                    <span className={`rounded-[4px] px-[10px] py-[3px] ${item.status === 'Completed' ? 'bg-[#36DDAE11] text-[#36DDAE]' : 'bg-[#ddd23611] text-[#ddd236]'}`}>
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {filteredData.length === 0 && (
                            <tr>
                                <td colSpan="5" className="not-found text-center p-5">No training found for selected user</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-4">
                <div className="text-white total-text">Total - {totalItems}</div>
                {renderPagination()}
            </div>
        </div>
    );
};

export default QmsListUserTraining;
