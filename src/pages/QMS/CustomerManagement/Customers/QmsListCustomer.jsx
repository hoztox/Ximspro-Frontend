import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import axios from "axios";
import plusIcon from "../../../../assets/images/Company Documentation/plus icon.svg";
import edits from "../../../../assets/images/Company Documentation/edit.svg";
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import view from "../../../../assets/images/Company Documentation/view.svg";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../../Utils/Config";

const QmsListCustomer = () => {
  // State
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Get company ID function (reused from supplier component)
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

  // Fetch customers data
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/qms/customer/company/${companyId}/`
        );
        const formattedData = response.data.map((customer, index) => ({
          id: index + 1,
          customer_id: customer.id,
          name: customer.name || "Anonymous",
          email: customer.email || "N/A",
          contact_person: customer.contact_person || "N/A",
          phone: customer.phone || "N/A",
          address: customer.address || "N/A",
          city: customer.city || "N/A",
          state: customer.state || "N/A",
          country: customer.country || "N/A",
          zipcode: customer.zipcode || "N/A",
          is_draft: customer.is_draft,
          date: customer.created_at
            ? formatDate(customer.created_at)
            : formatDate(new Date()),
        }));
        setCustomers(formattedData);
        setError(null);
        console.log("customers", response);
      } catch (err) {
        setError("Failed to fetch customers data");
        console.error("Error fetching customers:", err);
        // Use demo data if API fails
        setCustomers([
          {
            id: 1,
            customer_id: 1,
            name: "Acme Corp",
            email: "contact@acme.com",
            contact_person: "John Doe",
            phone: "123-456-7890",
            address: "123 Main St",
            city: "San Francisco",
            state: "CA",
            country: "USA",
            zipcode: "94105",
            is_draft: false,
            date: "03-04-2025",
          },
          {
            id: 2,
            customer_id: 2,
            name: "Tech Solutions",
            email: "info@techsolutions.com",
            contact_person: "Jane Smith",
            phone: "987-654-3210",
            address: "456 Market St",
            city: "New York",
            state: "NY",
            country: "USA",
            zipcode: "10001",
            is_draft: true,
            date: "03-04-2025",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [companyId]);

  const formatDate = (dateInput) => {
    const date = new Date(dateInput);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const itemsPerPage = 10;
  const totalItems = customers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Filter items based on search query
  const filteredItems = customers.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.contact_person?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.state?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.country?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteItem = async (customerId) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await axios.delete(`${BASE_URL}/qms/customer/${customerId}/`);
        setCustomers(
          customers.filter((item) => item.customer_id !== customerId)
        );
      } catch (err) {
        console.error("Error deleting customer:", err);
        alert("Failed to delete customer");
      }
    }
  };

  const handleAddCustomer = () => {
    navigate("/company/qms/add-customer");
  };

  const handleDraftCustomer = () => {
    navigate("/company/qms/draft-customer");
  };

  const handleEditCustomer = (customerId) => {
    navigate(`/company/qms/edit-customer/${customerId}`);
  };

  const handleViewCustomer = (customerId) => {
    navigate(`/company/qms/view-customer/${customerId}`);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-white">
        Loading customers...
      </div>
    );
  if (error && customers.length === 0)
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        {error}
      </div>
    );

  return (
    <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="list-awareness-training-head">List Customer</h1>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="bg-[#1C1C24] text-white px-[10px] h-[42px] rounded-md w-[333px] border border-[#383840] outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-[1px] top-[1px] text-white bg-[#24242D] p-[11px] w-[55px] rounded-tr-[6px] rounded-br-[6px] flex justify-center items-center">
              <Search size={18} />
            </div>
          </div>
          <button
            className="flex items-center justify-center !w-[100px] add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
            onClick={handleDraftCustomer}
          >
            <span>Draft</span>
          </button>
          <button
            className="flex items-center justify-center !px-[20px] add-manual-btn gap-[10px] duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
            onClick={handleAddCustomer}
          >
            <span>Add Customer</span>
            <img
              src={plusIcon}
              alt="Add Icon"
              className="w-[18px] h-[18px] qms-add-plus"
            />
          </button>
        </div>
      </div>
      <div className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#24242D]">
            <tr className="h-[48px]">
              <th className="px-3 text-left list-awareness-training-thead w-[5%]">
                No
              </th>
              <th className="px-3 text-left list-awareness-training-thead w-[15%]">
                Name
              </th>
              <th className="px-3 text-left list-awareness-training-thead w-[20%]">
                Email
              </th>

              <th className="px-3 text-left list-awareness-training-thead w-[20%]">
                Mailing Address
              </th>
              <th className="px-3 text-left list-awareness-training-thead w-[10%]">
                Date
              </th>

              <th className="px-3 text-center list-awareness-training-thead">
                View
              </th>
              <th className="px-3 text-center list-awareness-training-thead">
                Edit
              </th>
              <th className="px-3 text-center list-awareness-training-thead">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <tr
                  key={item.customer_id}
                  className="border-b border-[#383840] hover:bg-[#131318] cursor-pointer h-[50px]"
                >
                  <td className="px-3 list-awareness-training-datas">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="px-3 list-awareness-training-datas">
                    {item.name}
                  </td>
                  <td className="px-3 list-awareness-training-datas">
                    {item.email}
                  </td>
                  <td className="px-3 list-awareness-training-datas">
                    {item.address}
                  </td>
                  <td className="px-3 list-awareness-training-datas">
                    {item.date}
                  </td>
                  <td className="list-awareness-training-datas text-center ">
                    <div className="flex justify-center items-center h-[50px]">
                      <button
                        onClick={() => handleViewCustomer(item.customer_id)}
                      >
                        <img
                          src={view}
                          alt="View Icon"
                          className="w-[16px] h-[16px]"
                        />
                      </button>
                    </div>
                  </td>
                  <td className="list-awareness-training-datas text-center">
                    <div className="flex justify-center items-center h-[50px]">
                      <button
                        onClick={() => handleEditCustomer(item.customer_id)}
                      >
                        <img
                          src={edits}
                          alt="Edit Icon"
                          className="w-[16px] h-[16px]"
                        />
                      </button>
                    </div>
                  </td>
                  <td className="list-awareness-training-datas text-center">
                    <div className="flex justify-center items-center h-[50px]">
                      <button
                        onClick={() => handleDeleteItem(item.customer_id)}
                      >
                        <img
                          src={deletes}
                          alt="Delete Icon"
                          className="w-[16px] h-[16px]"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-4">
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-3">
        <div className="text-white total-text">Total: {totalItems}</div>
        <div className="flex items-center gap-5">
          <button
            className={`cursor-pointer swipe-text ${
              currentPage === 1 ? "opacity-50" : ""
            }`}
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              className={`w-8 h-8 rounded-md ${
                currentPage === number ? "pagin-active" : "pagin-inactive"
              }`}
              onClick={() => handlePageChange(number)}
            >
              {number}
            </button>
          ))}

          <button
            className={`cursor-pointer swipe-text ${
              currentPage === totalPages ? "opacity-50" : ""
            }`}
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

export default QmsListCustomer;
