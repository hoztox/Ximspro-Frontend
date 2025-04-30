import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import plusIcon from "../../../../assets/images/Company Documentation/plus icon.svg";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import view from "../../../../assets/images/Company Documentation/view.svg";
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../../../../Utils/Config";
import axios from 'axios';

const QmsListComplaints = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get company ID from localStorage
  const getUserCompanyId = () => {
    const role = localStorage.getItem("role");

    if (role === "company") {
      return localStorage.getItem("company_id");
    } else if (role === "user") {
      try {
        const userCompanyId = localStorage.getItem("user_company_id");
        return userCompanyId ? JSON.parse(userCompanyId) : null;
      } catch (e) {
        console.error("Error parsing user company ID:", e);
        return null;
      }
    }
    return null;
  };

  const companyId = getUserCompanyId();

  // Fetch complaints data
  useEffect(() => {
    const fetchComplaints = async () => {
      if (!companyId) {
        setError("Company ID not found");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/qms/complaints/company/${companyId}/`);
        console.log('complaints:', response.data);

        setComplaints(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching complaints:", error);
        setError("Failed to fetch complaints data");
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [companyId]);

  const getRelevantUserId = () => {
    const userRole = localStorage.getItem("role");

    if (userRole === "user") {
      const userId = localStorage.getItem("user_id");
      if (userId) return userId;
    }

    const companyId = localStorage.getItem("company_id");
    if (companyId) return companyId;

    return null;
  };

  const userId = getRelevantUserId();

  // Handle delete
  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/qms/complaints/${id}/`);
      setComplaints(complaints.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting complaint:", error);
    }
  };

  const itemsPerPage = 10;
  const totalItems = complaints.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Filter items based on search query
  const filteredItems = complaints.filter(item => {
    const customerName = item.customer?.name || "Anonymous";
    const userEmail = item.user?.email || "";
    const executorName = item.executor?.name || "";
    const carNumber = item.no_car?.number || "";

    return customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      executorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      carNumber.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAddComplaints = () => {
    navigate('/company/qms/add-complaints');
  };

  const handleDraftComplaints = () => {
    navigate('/company/qms/draft-complaints');
  };

  const handleEditComplaints = (id) => {
    navigate(`/company/qms/edit-complaints/${id}`);
  };

  const handleViewComplaints = (id) => {
    navigate(`/company/qms/view-complaints/${id}`);
  };

  if (loading) {
    return <div className="bg-[#1C1C24] text-white p-5 rounded-lg">Loading complaints data...</div>;
  }

  if (error) {
    return <div className="bg-[#1C1C24] text-white p-5 rounded-lg">{error}</div>;
  }

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
            <span>Add Complaints and Feedbacks</span>
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
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <tr key={item.id} className="border-b border-[#383840] hover:bg-[#131318] cursor-pointer h-[50px]">
                  <td className="px-3 list-awareness-training-datas">{indexOfFirstItem + index + 1}</td>
                  <td className="px-3 list-awareness-training-datas">
                    {item.customer?.name || "Anonymous"}
                  </td>
                  <td className="px-3 list-awareness-training-datas">
                    {userId || "N/A"}
                  </td>

                  <td className="px-3 list-awareness-training-datas">
                    {item.executor ? `${item.executor.first_name} ${item.executor.last_name || ""}` : "N/A"}
                  </td>

                  <td className="px-3 list-awareness-training-datas">{item.no_car?.action_no || "N/A"}</td>
                  <td className="px-3 list-awareness-training-datas">{item.date || "N/A"}</td>
                  <td className="list-awareness-training-datas text-center">
                    <div className='flex justify-center items-center h-[50px]'>
                      <button onClick={() => handleViewComplaints(item.id)}>
                        <img src={view} alt="View Icon" className='w-[16px] h-[16px]' />
                      </button>
                    </div>
                  </td>
                  <td className="list-awareness-training-datas text-center">
                    <div className='flex justify-center items-center h-[50px]'>
                      <button onClick={() => handleEditComplaints(item.id)}>
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
              ))
            ) : (
              <tr className="border-b border-[#383840]">
                <td colSpan="10" className="px-3 py-4 text-center list-awareness-training-datas">
                  No complaints found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalItems > 0 && (
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
      )}
    </div>
  );
};

export default QmsListComplaints;