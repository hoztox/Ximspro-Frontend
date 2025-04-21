import React, { useState } from 'react';
import { Search } from 'lucide-react';
import plusIcon from "../../../../assets/images/Company Documentation/plus icon.svg";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import view from "../../../../assets/images/Company Documentation/view.svg";
import { useNavigate } from 'react-router-dom';
const QmsListComplaints = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();



  // Demo data
  const [customers, setCustomers] = useState([
    { id: 1, customer: 'Anonymous', entered_by: 'user@gmail.com', executor: '123 Home, Bangalore', car: '123', date: '03-04-2025' },
    { id: 2, customer: 'Anonymous', entered_by: 'user@gmail.com', executor: 'Xyz Street, Norway', car: '123', date: '03-04-2025' },
  ]);

  const itemsPerPage = 10;
  const totalItems = customers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Filter items based on search query
  const filteredItems = customers.filter(item =>
    item.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.entered_by.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.executor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.car.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteItem = (id) => {
    setCustomers(customers.filter(item => item.id !== id));
  };

  const handleAddComplaints = () => {
    navigate('/company/qms/add-complaints');
  };

  const handleDraftComplaints = () => {
    navigate('/company/qms/draft-complaints');
  };

  const handleEditComplaints = () => {
    navigate('/company/qms/edit-complaints');
  };

  const handleViewComplaints = () => {
    navigate('/company/qms/view-complaints');
  };

  return (
    <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="list-awareness-training-head">List Complaints and Feedbacks</h1>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="bg-[#1C1C24] text-white px-[10px] h-[42px] rounded-md w-[333px] border border-[#383840] outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className='absolute right-[1px] top-[1px] text-white bg-[#24242D] p-[11px] w-[55px] rounded-tr-[6px] rounded-br-[6px] flex justify-center items-center'>
              <Search size={18} />
            </div>
          </div>
          <button
            className="flex items-center justify-center !w-[100px] add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
            onClick={handleDraftComplaints}
          >
            <span>Draft</span>
          </button>
          <button
            className="flex items-center justify-center !px-[20px] add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
            onClick={handleAddComplaints}
          >
            <span> Add Complaints and Feedbacks</span>
            <img src={plusIcon} alt="Add Icon" className='w-[18px] h-[18px] qms-add-plus' />
          </button>
        </div>
      </div>
      <div className="overflow-hidden">
        <table className="w-full">
          <thead className='bg-[#24242D]'>
            <tr className='h-[48px]'>
              <th className="px-3 text-left list-awareness-training-thead">No</th>
              <th className="px-3 text-left list-awareness-training-thead">Customer</th>
              <th className="px-3 text-left list-awareness-training-thead">Entered By</th>
              <th className="px-3 text-left list-awareness-training-thead">Executor</th>
              <th className="px-3 text-left list-awareness-training-thead w-[10%]">CAR</th>
              <th className="px-3 text-left list-awareness-training-thead">Date</th>
              <th className="px-3 text-center list-awareness-training-thead">View</th>
              <th className="px-3 text-center list-awareness-training-thead">Edit</th>
              <th className="px-3 text-center list-awareness-training-thead">Delete</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={item.id} className="border-b border-[#383840] hover:bg-[#131318] cursor-pointer h-[50px]">
                <td className="px-3 list-awareness-training-datas">{indexOfFirstItem + index + 1}</td>
                <td className="px-3 list-awareness-training-datas">{item.customer}</td>
                <td className="px-3 list-awareness-training-datas">{item.entered_by}</td>
                <td className="px-3 list-awareness-training-datas">{item.executor}</td>
                <td className="px-3 list-awareness-training-datas">{item.car}</td>
                <td className="px-3 list-awareness-training-datas">{item.date}</td>
                <td className="list-awareness-training-datas text-center ">
                  <div className='flex justify-center items-center h-[50px]'>
                    <button onClick={handleViewComplaints}>
                      <img src={view} alt="View Icon" className='w-[16px] h-[16px]' />
                    </button>
                  </div>
                </td>
                <td className="list-awareness-training-datas text-center">
                  <div className='flex justify-center items-center h-[50px]'>
                    <button onClick={handleEditComplaints}>
                      <img src={edits} alt="Edit Icon" className='w-[16px] h-[16px]' />
                    </button>
                  </div>
                </td>
                <td className="list-awareness-training-datas text-center">
                  <div className='flex justify-center items-center h-[50px]'>
                    <button onClick={() => handleDeleteItem(item.id)}>
                      <img src={deletes} alt="Delete Icon" className='w-[16px] h-[16px]' />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-3">
        <div className='text-white total-text'>Total: {totalItems}</div>
        <div className="flex items-center gap-5">
          <button
            className={`cursor-pointer swipe-text ${currentPage === 1 ? 'opacity-50' : ''}`}
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
            <button
              key={number}
              className={`w-8 h-8 rounded-md ${currentPage === number ? 'pagin-active' : 'pagin-inactive'}`}
              onClick={() => handlePageChange(number)}
            >
              {number}
            </button>
          ))}

          <button
            className={`cursor-pointer swipe-text ${currentPage === totalPages ? 'opacity-50' : ''}`}
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
export default QmsListComplaints
