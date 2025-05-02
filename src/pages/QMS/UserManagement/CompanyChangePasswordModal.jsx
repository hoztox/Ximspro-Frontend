import React, { useState } from 'react';
import { X, Eye, EyeOff } from "lucide-react";
import axios from 'axios';
import { BASE_URL } from "../../../Utils/Config";
import { toast, Toaster } from "react-hot-toast";
import PasswordChangeSuccessModal from '../../../components/Company_Navbar/Modal/PasswordChangeSuccessModal';
import PasswordChangeErrorModal from '../../../components/Company_Navbar/Modal/PasswordChangeErrorModal';

const CompanyChangePasswordModal = ({ isOpen, onClose, userId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPasswordSuccessModal, setShowPasswordSuccessModal] = useState(false);
  const [showPasswordErrorModal, setShowPasswordErrorModal] = useState(false);

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    newPassword: false,
    confirmPassword: false
  });
  const [modalAnimation, setModalAnimation] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  const closeModal = () => {
    setModalAnimation('animate-modal-fade-out');
    setTimeout(() => {
      setFormData({ newPassword: '', confirmPassword: '' });
      setErrors({});
      onClose();
    }, 300);
  };

  const handlePasswordSubmit = async (e) => {
    // Prevent default form submission behavior which would append data to URL
    e.preventDefault();
    
    // Log the raw form data
    console.log('Raw form data:', formData);
    console.log('newPassword:', formData.newPassword);
    console.log('confirmPassword:', formData.confirmPassword);
    
    // Validation
    if (!formData.newPassword) {
      setErrors({ newPassword: "New password is required" });
      return;
    }

    if (!formData.confirmPassword) {
      setErrors({ confirmPassword: "Please confirm your new password" });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    setIsLoading(true);
    try {
      // Format the payload as expected by the backend
      const payload = {
        new_password: formData.newPassword,
        confirm_password: formData.confirmPassword
      };
      
      console.log('Sending password change request:', payload);
      
      // Use axios.post with proper JSON format - DO NOT use form data here
      const response = await axios.post(
        `${BASE_URL}/company/user/change-password/${userId}/`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Password change response:', response);

      if (response.status === 200) {
        toast.success("Password changed successfully");
        setShowPasswordSuccessModal(true);
        setTimeout(() => {
          setShowPasswordSuccessModal(false);
          closeModal();
        }, 1500);
      }

    } catch (error) {
      console.error("Error changing password:", error);
      console.error("Error response:", error.response);
      
      // Show more detailed error information
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          "Failed to change password";
      
      setErrors({
        general: errorMessage
      });
      
      toast.error(errorMessage);
      setShowPasswordErrorModal(true);
      setTimeout(() => {
        setShowPasswordErrorModal(false);
      }, 3000);
    }
    setIsLoading(false);
  };

  if (!isOpen && !modalAnimation) return null;

  const passwordFields = [
    { id: 'newPassword', label: 'New Password' },
    { id: 'confirmPassword', label: 'Confirm Password' }
  ];

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${modalAnimation}`}>
      <Toaster position="top-center" reverseOrder={false} />

      <PasswordChangeSuccessModal
        showPasswordSuccessModal={showPasswordSuccessModal}
        onClose={() => { setShowPasswordSuccessModal(false) }}
      />

      <PasswordChangeErrorModal
        showPasswordErrorModal={showPasswordErrorModal}
        onClose={() => { setShowPasswordErrorModal(false) }}
      />

      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={closeModal}></div>

      <div className={`relative w-full max-w-md p-6 rounded-lg shadow-xl bg-[#1E1E26] text-white`}>
        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-[#383840]">Change Password</h2>

        {errors.general && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.general}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} method="post" action="#">
          {passwordFields.map((field) => (
            <div key={field.id} className="mb-4">
              <label className="text-sm font-medium mb-1 text-white">
                {field.label}
              </label>
              <div className="relative">
                <input
                  type={showPasswords[field.id] ? "text" : "password"}
                  name={field.id}
                  value={formData[field.id]}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 mt-1 border outline-none rounded-md bg-[#282836] border-[#383840] ${errors[field.id] ? "border-red-500" : ""}`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => togglePasswordVisibility(field.id)}
                >
                  {showPasswords[field.id] ?
                    <EyeOff className="h-5 w-5 text-gray-500" /> :
                    <Eye className="h-5 w-5 text-gray-500" />
                  }
                </button>
              </div>
              {errors[field.id] && <p className="text-red-500 text-xs mt-1">{errors[field.id]}</p>}
            </div>
          ))}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border rounded-md hover:bg-gray-100 hover:text-black duration-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-[#1E4DA1] text-white rounded-md hover:bg-[#203e72] flex items-center duration-100"
              onClick={(e) => {
                e.preventDefault();
                handlePasswordSubmit(e);
              }}
            >
              {isLoading ? "Processing..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyChangePasswordModal;