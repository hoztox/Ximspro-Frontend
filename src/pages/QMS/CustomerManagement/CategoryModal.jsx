import React, { useState, useEffect } from 'react';
import deletes from "../../../assets/images/Company Documentation/delete.svg";
import axios from 'axios';
import { BASE_URL } from "../../../Utils/Config";

const CategoryModal = ({ isOpen, onClose }) => {
    const [animateClass, setAnimateClass] = useState('');
    const [categoryItems, setCategoryItems] = useState([]);
    const [newCategoryTitle, setNewCategoryTitle] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Animation effect for modal
    useEffect(() => {
        if (isOpen) {
            setAnimateClass('opacity-100 scale-100');
        } else {
            setAnimateClass('opacity-0 scale-95');
        }
    }, [isOpen]);

    // Helper function to get company ID from localStorage
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

    // Fetch categories when modal opens
    useEffect(() => {
        if (isOpen && companyId) {
            fetchCategories();
        }
    }, [isOpen, companyId]);

    // Fetch categories from API
    const fetchCategories = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${BASE_URL}/qms/category/company/${companyId}/`);
            setCategoryItems(response.data);
        } catch (err) {
            console.error("Error fetching categories:", err);
            setError("Failed to load categories. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle category deletion
    const handleDelete = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/qms/category/${id}/`);
            // Update local state after successful deletion
            setCategoryItems(categoryItems.filter(item => item.id !== id));
        } catch (err) {
            console.error("Error deleting category:", err);
            setError("Failed to delete category. Please try again.");
        }
    };

    // Handle category creation
    const handleSave = async () => {
        if (newCategoryTitle.trim()) {
            try {
                const response = await axios.post(`${BASE_URL}/qms/category/create/`, {
                    title: newCategoryTitle,
                    company: companyId
                });
                
                // Add the new category to the list
                setCategoryItems([...categoryItems, response.data]);
                setNewCategoryTitle("");
            } catch (err) {
                console.error("Error adding category:", err);
                setError("Failed to add category. Please try again.");
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
            <div className={`bg-[#13131A] text-white rounded-[4px] w-[563px] p-5 transform transition-all duration-300 ${animateClass}`}>
                <div className="bg-[#1C1C24] rounded-[4px] p-5 mb-6 max-h-[350px]">
                    <h2 className="agenda-list-head pb-5">Category List</h2>
                    
                    {error && (
                        <div className="text-red-500 mb-4 p-2 bg-red-100 bg-opacity-10 rounded">
                            {error}
                        </div>
                    )}
                    
                    {isLoading ? (
                        <div className="text-center py-4">Loading categories...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-gray-400">
                                <thead className="bg-[#24242D] h-[48px]">
                                    <tr className="rounded-[4px]">
                                        <th className="px-3 w-[10%] agenda-thead">No</th>
                                        <th className="px-3 w-[70%] agenda-thead">Title</th>
                                        <th className="px-3 text-center w-[20%] agenda-thead">Delete</th>
                                    </tr>
                                </thead>
                            </table>
                            <div className="max-h-[230px] overflow-y-auto">
                                <table className="w-full text-left text-gray-400">
                                    <tbody>
                                        {categoryItems.length > 0 ? (
                                            categoryItems.map((item, index) => (
                                                <tr key={item.id} className="border-b border-[#383840] h-[42px]">
                                                    <td className="px-3 agenda-data w-[10%]">{index + 1}</td>
                                                    <td className="px-3 agenda-data w-[70%]">{item.title}</td>
                                                    <td className="px-3 agenda-data text-center w-[20%]">
                                                        <div className="flex items-center justify-center h-[42px]">
                                                            <button onClick={() => handleDelete(item.id)}>
                                                                <img src={deletes} alt="Delete Icon" className="w-[16px] h-[16px]" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr className="border-b border-[#383840] h-[42px]">
                                                <td colSpan="3" className="px-3 not-found text-center">
                                                    No categories found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-[#1C1C24] rounded-[4px]">
                    <h3 className="agenda-list-head border-b border-[#383840] px-5 py-6">Add Category</h3>

                    <div className="mb-4 px-5">
                        <label className="block mb-3 agenda-list-label">
                            Category Title <span className="text-[#F9291F]">*</span>
                        </label>
                        <input
                            type="text"
                            value={newCategoryTitle}
                            onChange={(e) => setNewCategoryTitle(e.target.value)}
                            className="w-full add-agenda-inputs bg-[#24242D] h-[49px] px-5 border-none outline-none"
                            placeholder="Enter category title"
                        />
                    </div>

                    <div className="flex gap-5 justify-end pb-5 px-5">
                        <button
                            onClick={onClose}
                            className="cancel-btn"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="save-btn"
                            disabled={!newCategoryTitle.trim() || isLoading}
                        >
                            {isLoading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryModal;