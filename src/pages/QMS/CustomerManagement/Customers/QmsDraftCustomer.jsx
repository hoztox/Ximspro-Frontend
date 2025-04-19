import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import view from "../../../../assets/images/Company Documentation/view.svg";
import { useNavigate } from 'react-router-dom';
 

const QmsDraftCustomer = () => {
  const [searchQuery, setSearchQuery] = useState('');
      const [currentPage, setCurrentPage] = useState(1);
      const navigate = useNavigate();
   
   
  
      // Demo data
      const [customers, setCustomers] = useState([
          { id: 1, name: 'Anonymous', email: 'user@gmail.com', mailing_address: '123 Home, Bangalore',   date: '03-04-2025' },
          { id: 2, name: 'Anonymous', email: 'user@gmail.com', mailing_address: 'Xyz Street, Norway',   date: '03-04-2025' },
      ]);
  
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
  
      const handlePageChange = (pageNumber) => {
          setCurrentPage(pageNumber);
      };
  
      const handleDeleteItem = (id) => {
          setCustomers(customers.filter(item => item.id !== id));
      };
  
      const handleClose = () => {
          navigate('/company/qms/list-customer');
      };
  
      const handleEditDraftCustomer = () => {
          navigate('/company/qms/edit-draft-customer');
      };
  
      const handleViewDraftCustomer = () => {
          navigate('/company/qms/view-draft-customer');
      };
  
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
                              onChange={(e) => setSearchQuery(e.target.value)}
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
                          {currentItems.map((item, index) => (
                              <tr key={item.id} className="border-b border-[#383840] hover:bg-[#131318] cursor-pointer h-[50px]">
                                  <td className="px-3 list-awareness-training-datas">{indexOfFirstItem + index + 1}</td>
                                  <td className="px-3 list-awareness-training-datas">{item.name}</td>
                                  <td className="px-3 list-awareness-training-datas">{item.email}</td>
                                  <td className="px-3 list-awareness-training-datas">{item.mailing_address}</td>
                                  <td className="px-3 list-awareness-training-datas text-left text-[#1E84AF]">
                                      <button onClick={handleEditDraftCustomer}>
                                        Click to Continue
                                      </button>
                                  </td>
                                  <td className="list-awareness-training-datas text-center ">
                                      <div className='flex justify-center items-center h-[50px]'>
                                          <button onClick={handleViewDraftCustomer}>
                                              <img src={view} alt="View Icon" className='w-[16px] h-[16px]' />
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
export default QmsDraftCustomer
