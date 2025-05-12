import React, { useState, useEffect } from 'react';
import deletes from "../../../../assets/images/Company Documentation/delete.svg";
import { BASE_URL } from "../../../../Utils/Config";
import axios from 'axios';


const ReviewTypeModal = ({ isOpen, onClose, onAddReview }) => {
    const [animateClass, setAnimateClass] = useState('');
    const [review, setReview] = useState([]);
    const [newReviewTitle, setNewReviewTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Animation effect when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setAnimateClass('opacity-100 scale-100');
            fethReview();
        } else {
            setAnimateClass('opacity-0 scale-95');
        }
    }, [isOpen]);

    const fethReview = async () => {
        setLoading(true);
        try {
            const companyId = getUserCompanyId();
            if (!companyId) {
                setError('Company ID not found. Please log in again.');
                return;
            }

            const response = await axios.get(`${BASE_URL}/qms/baseline-reviewtype/company/${companyId}/`);
            setReview(response.data);
        } catch (error) {
            console.error('Error fetching review:', error);
            setError('Failed to load review. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Get company ID from local storage
    const getUserCompanyId = () => {
        const storedCompanyId = localStorage.getItem("company_id");
        if (storedCompanyId) return storedCompanyId;

        const userRole = localStorage.getItem("role");
        if (userRole === "user") {
            const userData = localStorage.getItem("user_company_id");
            if (userData) {
                try {
                    return JSON.parse(userData);
                } catch (e) {
                    console.error("Error parsing user company ID:", e);
                    return null;
                }
            }
        }
        return null;
    };

    // Handle delete cause
    const handleDelete = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/qms/baseline-reviewtype/${id}/`);
            setReview(review.filter(item => item.id !== id));
            setSuccessMessage('Cause deleted successfully');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error deleting cause:', error);
            setError('Failed to delete cause. Please try again.');
            setTimeout(() => setError(''), 3000);
        }
    };

    // Handle save new cause
    const handleSave = async () => {
        if (!newReviewTitle.trim()) return;

        setIsAdding(true);
        try {
            const companyId = getUserCompanyId();

            if (!companyId) {
                setError('Company ID not found. Please log in again.');
                setIsAdding(false);
                return;
            }

            const response = await axios.post(`${BASE_URL}/qms/baseline-reviewtype/`, {
                company: companyId,
                title: newReviewTitle.trim()
            });

            setReview([...review, response.data]);

            if (onAddReview && typeof onAddReview === 'function') {
                onAddReview(response.data);
            }

            setNewReviewTitle('');
            setSuccessMessage('Review added successfully');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error adding cause:', error);
            setError('Failed to add cause. Please try again.');
            setTimeout(() => setError(''), 3000);
        } finally {
            setIsAdding(false);
        }
    };

    // Handle selecting a cause
    const handleSelectCause = (cause) => {
        if (onAddReview && typeof onAddReview === 'function') {
            onAddReview(cause);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
            <div className={`bg-[#13131A] text-white rounded-[4px] w-[563px] p-5 transform transition-all duration-300 ${animateClass}`}>
                {/* Success or error messages */}
                {successMessage && (
                    <div className="bg-green-800 text-white p-2 mb-4 rounded">
                        {successMessage}
                    </div>
                )}
                {error && (
                    <div className="bg-red-800 text-white p-2 mb-4 rounded">
                        {error}
                    </div>
                )}

                {/* Causes List Section */}
                <div className="bg-[#1C1C24] rounded-[4px] p-5 mb-6 max-h-[350px]">
                    <h2 className="agenda-list-head pb-5">Review List</h2>
                    {loading ? (
                        <div className="text-center py-4">Loading...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-gray-400">
                                <thead className="bg-[#24242D] h-[48px]">
                                    <tr className="rounded-[4px]">
                                        <th className="px-3 w-[10%] agenda-thead">No</th>
                                        <th className="px-3 w-[60%] agenda-thead">Title</th>
                                        <th className="px-3 text-center w-[15%] agenda-thead">Delete</th>
                                    </tr>
                                </thead>
                            </table>
                            <div className="max-h-[230px] overflow-y-auto">
                                <table className="w-full text-left text-gray-400">
                                    <tbody>
                                        {review.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="text-center py-4 not-found">No Review Found</td>
                                            </tr>
                                        ) : (
                                            review.map((item, index) => (
                                                <tr key={item.id} className="border-b border-[#383840] h-[42px]">
                                                    <td className="px-3 agenda-data w-[10%]">{index + 1}</td>
                                                    <td className="px-3 agenda-data w-[60%]">{item.title}</td>
                                                    <td className="px-3 agenda-data text-center w-[15%]">
                                                        <div className="flex items-center justify-center h-[42px]">
                                                            <button onClick={() => handleDelete(item.id)}>
                                                                <img src={deletes} alt="Delete Icon" className="w-[16px] h-[16px]" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Add Cause Section */}
                <div className="bg-[#1C1C24] rounded-[4px]">
                    <h3 className="agenda-list-head border-b border-[#383840] px-5 py-6">Add Review</h3>

                    <div className="mb-4 px-5">
                        <label className="block mb-3 agenda-list-label">
                            Review <span className="text-[#F9291F]">*</span>
                        </label>
                        <input
                            type="text"
                            value={newReviewTitle}
                            onChange={(e) => setNewReviewTitle(e.target.value)}
                            className="w-full add-agenda-inputs bg-[#24242D] h-[49px] px-5 border-none outline-none"
                            placeholder="Enter Review Title"
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
                            disabled={!newReviewTitle.trim() || isAdding}
                        >
                            {isAdding ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default ReviewTypeModal
