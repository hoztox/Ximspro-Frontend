import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { BASE_URL } from "../../../../Utils/Config";
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import choosefile from "../../../../assets/images/Company User Management/choosefile.svg"

const QMSEditUser = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [companyPermissions, setCompanyPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [userId, setUserId] = useState(null);

    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        gender: '',
        date_of_birth: { day: '', month: '', year: '' },
        address: '',
        city: '',
        zip_po_box: '',
        province_state: '',
        country: '',
        department_division: '',
        email: '',
        confirm_email: '',
        phone: '',
        office_phone: '',
        mobile_phone: '',
        fax: '',
        secret_question: '',
        answer: '',
        notes: '',
        status: 'live',
        user_logo: '',
    });

    const { id } = useParams();
    console.log("User ID from params:", id);

  
    const fetchUserPermissions = async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/company/user/permissions/${id}/`);
            
            if (response.status === 200 && response.data) {
                let userPermissions = [];
                
                // Handle different API response formats
                if (Array.isArray(response.data)) {
                    userPermissions = response.data.map(p => p.name || p);
                } else if (response.data.permissions && Array.isArray(response.data.permissions)) {
                    userPermissions = response.data.permissions.map(p => p.name || p);
                } else if (typeof response.data === 'object') {
                    // Try to extract permissions from the object if it has them
                    const permissionsArr = Object.values(response.data).find(v => Array.isArray(v));
                    if (permissionsArr) {
                        userPermissions = permissionsArr.map(p => p.name || p);
                    }
                }
                
                console.log("Fetched user permissions:", userPermissions);
                setSelectedPermissions(userPermissions);
            }
        } catch (err) {
            console.error("Error fetching user permissions:", err);
        }
    };

    useEffect(() => {
        if (id) {
            setUserId(id);
            fetchUserDetails(id);
        } else {
            toast.error("No user selected for editing");
            navigate('/company/qms/listuser');
        }

        fetchLatestPermissions();
    }, [location]);

    const fetchUserDetails = async (id) => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${BASE_URL}/company/user/${id}/`);

            if (response.status === 200 && response.data) {
                let userData;
                if (Array.isArray(response.data)) {
                    userData = response.data.find(user => user.id === parseInt(id));
                    if (!userData) {
                        userData = response.data[0];
                    }
                } else {
                    userData = response.data;
                }

                console.log('User datasssssssssssssss:', userData);

           
                let day = '';
                let month = '';
                let year = '';

                if (userData.date_of_birth) {
                    const dateParts = userData.date_of_birth.split('-');
                    if (dateParts.length === 3) {
                        year = dateParts[0];
                        month = dateParts[1];
                        day = dateParts[2];
                    }
                }

        
                setFormData({
                    id: userData.id || '', 
                    username: userData.username || '',
                    first_name: userData.first_name || '',
                    last_name: userData.last_name || '',
                    gender: userData.gender || '',
                    date_of_birth: { day, month, year },
                    address: userData.address || '',
                    city: userData.city || '',
                    zip_po_box: userData.zip_po_box || '',
                    province_state: userData.province_state || '',
                    country: userData.country || '',
                    department_division: userData.department_division || '',
                    email: userData.email || '',
                    confirm_email: userData.email || '', 
                    phone: userData.phone || '',
                    office_phone: userData.office_phone || '',
                    mobile_phone: userData.mobile_phone || '',
                    fax: userData.fax || '',
                    secret_question: userData.secret_question || '',
                    answer: userData.answer || '',
                    notes: userData.notes || '',
                    status: userData.status || 'live',
                    user_logo: userData.user_logo || '',
                });
                
           
                if (userData.permissions && Array.isArray(userData.permissions)) {
                    const permissionNames = userData.permissions.map(p => p.name);
                    console.log("Setting permissions from permissions:", permissionNames);
                    setSelectedPermissions(permissionNames);
                
                } else if (userData.permissions && Array.isArray(userData.permissions)) {
                    console.log("Setting permissions from permissions:", userData.permissions);
                    setSelectedPermissions(userData.permissions);
                } else {
                
                    console.log("Fetching user permissions separately...");
                    fetchUserPermissions(id);
                }
            }
        } catch (err) {
            console.error("Error fetching user details:", err);
            toast.error("Failed to load user details");
            setError("Failed to load user details. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

 

    const fetchLatestPermissions = async () => {
        try {
            const companyId = getUserCompanyId();
            if (!companyId) {
                console.error("Company ID not found");
                return;
            }

            const response = await axios.get(`${BASE_URL}/accounts/permissions/${companyId}/`);
            console.log("Company permissions response:", response.data);

            if (response.status === 200) {
                if (response.data && response.data.permissions && Array.isArray(response.data.permissions)) {
                    setCompanyPermissions(response.data.permissions);
                } else {
                    console.error("Permissions not found or not in expected format");
                }
            }
        } catch (err) {
            console.error("Error fetching latest permissions:", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleDobChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            date_of_birth: {
                ...formData.date_of_birth,
                [name]: value
            }
        });
    };

    const handlePermissionChange = (e) => {
        const { value, checked } = e.target;
        console.log(`Permission ${value} changed to ${checked}`);

        if (checked) {
            setSelectedPermissions(prev => [...prev, value]);
        } else {
            setSelectedPermissions(prev => prev.filter(permission => permission !== value));
        }
    };

    const handleListUsers = () => {
        navigate('/company/qms/listuser');
    };

    const handleCancel = () => {
        navigate('/company/qms/listuser');
    };

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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                user_logo: file
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const companyId = getUserCompanyId();
            if (!companyId) {
                setError('Company ID not found. Please log in again.');
                setIsLoading(false);
                return;
            }
    
            let formattedDob = "";
            if (formData.date_of_birth.day && formData.date_of_birth.month && formData.date_of_birth.year) {
                formattedDob = `${formData.date_of_birth.year}-${formData.date_of_birth.month.padStart(2, "0")}-${formData.date_of_birth.day.padStart(2, "0")}`;
            }
    
            // Create regular data object first (not FormData)
            const dataToSubmit = {
                company_id: companyId,
                username: formData.username,
                first_name: formData.first_name,
                last_name: formData.last_name,
                gender: formData.gender,
                date_of_birth: formattedDob,
                address: formData.address,
                city: formData.city,
                zip_po_box: formData.zip_po_box,
                province_state: formData.province_state,
                country: formData.country,
                department_division: formData.department_division,
                email: formData.email,
                confirm_email: formData.confirm_email,
                phone: formData.phone,
                office_phone: formData.office_phone,
                mobile_phone: formData.mobile_phone,
                fax: formData.fax,
                secret_question: formData.secret_question,
                answer: formData.answer,
                notes: formData.notes,
                status: formData.status,
                // Add permissions as an array of objects in the format the backend expects
                permissions: selectedPermissions.map(perm => ({ name: perm }))
            };
    
            if (formData.password) {
                dataToSubmit.password = formData.password;
                dataToSubmit.confirm_password = formData.confirm_password;
            }
    
            console.log("Data to submit with permissions:", dataToSubmit);
    
            // If we have a file to upload, we need to use FormData
            if (formData.user_logo && typeof formData.user_logo !== 'string') {
                const formDataToSubmit = new FormData();
                
                // Add all regular data
                Object.keys(dataToSubmit).forEach(key => {
                    if (key === 'permissions') {
                        // Handle permissions specially
                        formDataToSubmit.append('permissions', JSON.stringify(dataToSubmit.permissions));
                    } else {
                        formDataToSubmit.append(key, dataToSubmit[key]);
                    }
                });
                
                // Add the file
                formDataToSubmit.append('user_logo', formData.user_logo);
                
                const response = await axios.put(`${BASE_URL}/company/users/update/${userId}/`, formDataToSubmit, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                
                if (response.status === 200) {
                    console.log("User updated successfully", response.data);
                    toast.success("User updated successfully!");
                    navigate("/company/qms/listuser");
                }
            } else {
                // No file to upload, use regular JSON request
                const response = await axios.put(`${BASE_URL}/company/users/update/${userId}/`, dataToSubmit);
                
                if (response.status === 200) {
                    console.log("User updated successfully", response.data);
                    toast.success("User updated successfully!");
                    navigate("/company/qms/listuser");
                }
            }
        } catch (err) {
            console.error("Error updating user:", err);
            toast.error("Failed to update user");
            if (err.response && err.response.data) {
                setError(err.response.data.message || "Failed to update user");
            } else {
                setError("Failed to update user. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };
    const renderUserLogo = () => {
        if (typeof formData.user_logo === 'string' && formData.user_logo) {
            return (
                <div className="mt-3 flex items-end">
                    <img
                        src={formData.user_logo}
                        alt="User Logo"
                        className="h-[49px] rounded-lg object-cover"
                    />
                </div>
            );
        }
        return null;
    };

    // Helper function to check if a permission is selected
    const isPermissionSelected = (permission) => {
        return selectedPermissions.includes(permission);
    };

    return (
        <div className="bg-[#1C1C24]">
            <Toaster position="top-center" />
            <div className="flex justify-between items-center add-user-header">
                <h1 className="add-user-text">Edit User</h1>
                <button
                    className="list-user-btn duration-200 border border-[#858585] text-[#858585] hover:bg-[#858585] hover:text-white"
                    onClick={handleListUsers}
                >
                    List Users
                </button>
            </div>

            {error && (
                <div className="mx-[122px] mt-4 p-3 bg-red-500 text-white rounded">
                    {error}
                </div>
            )}

            {isLoading && !formData.username ? (
                <div className="flex justify-center items-center h-64">
                    <div className="text-white text-lg">Loading user details...</div>
                </div>
            ) : (
                <form className="add-user-form" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-[122px] py-[23px]">
                        <div>
                            <label className="add-user-label">User Name <span className='required-field'>*</span></label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full add-user-inputs"
                            />
                        </div>
                        <div></div> {/* Empty div for alignment */}

                        <div>
                            <label className="add-user-label">First Name <span className='required-field'>*</span></label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="w-full add-user-inputs"
                            />
                        </div>
                        <div>
                            <label className="add-user-label">Last Name <span className='required-field'>*</span></label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="w-full add-user-inputs"
                            />
                        </div>

                        <div>
                            <label className="add-user-label">Gender</label>
                            <div className="relative">
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full add-user-inputs appearance-none"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 top-3 flex items-center px-2 pointer-events-none">
                                    <svg className="w-5 h-5 fill-current text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="add-user-label">DOB</label>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="relative">
                                    <select
                                        name="day"
                                        value={formData.date_of_birth.day}
                                        onChange={handleDobChange}
                                        className="w-full add-user-inputs appearance-none"
                                    >
                                        <option value="">dd</option>
                                        {[...Array(31)].map((_, i) => (
                                            <option key={i} value={(i + 1).toString()}>{i + 1}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 top-3 flex items-center px-2 pointer-events-none">
                                        <svg className="w-5 h-5 fill-current text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="relative">
                                    <select
                                        name="month"
                                        value={formData.date_of_birth.month}
                                        onChange={handleDobChange}
                                        className="w-full add-user-inputs appearance-none"
                                    >
                                        <option value="">mm</option>
                                        {[...Array(12)].map((_, i) => (
                                            <option key={i} value={(i + 1).toString()}>{i + 1}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 top-3 flex items-center px-2 pointer-events-none">
                                        <svg className="w-5 h-5 fill-current text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="relative">
                                    <select
                                        name="year"
                                        value={formData.date_of_birth.year}
                                        onChange={handleDobChange}
                                        className="w-full add-user-inputs appearance-none"
                                    >
                                        <option value="">yyyy</option>
                                        {[...Array(100)].map((_, i) => {
                                            const year = new Date().getFullYear() - i;
                                            return <option key={i} value={year.toString()}>{year}</option>;
                                        })}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 top-3 flex items-center px-2 pointer-events-none">
                                        <svg className="w-5 h-5 fill-current text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="add-user-label">Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full add-user-inputs add-user-address"
                            />
                        </div>

                        <div>
                            <label className="add-user-label">City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full add-user-inputs"
                            />
                        </div>
                        <div>
                            <label className="add-user-label">Province/State</label>
                            <input
                                type="text"
                                name="province_state"
                                value={formData.province_state}
                                onChange={handleChange}
                                className="w-full add-user-inputs"
                            />
                        </div>

                        <div>
                            <label className="add-user-label">Zip/P.O.Box</label>
                            <input
                                type="text"
                                name="zip_po_box"
                                value={formData.zip_po_box}
                                onChange={handleChange}
                                className="w-full add-user-inputs"
                            />
                        </div>
                        <div></div> {/* Empty div for alignment */}

                        <div>
                            <label className="add-user-label">Country <span className='required-field'>*</span></label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full add-user-inputs"
                            />
                        </div>
                        <div>
                            <label className="add-user-label">Department / Division</label>
                            <input
                                type="text"
                                name="department_division"
                                value={formData.department_division}
                                onChange={handleChange}
                                className="w-full add-user-inputs"
                            />
                        </div>

                        <div>
                            <label className="add-user-label">Email <span className='required-field'>*</span></label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full add-user-inputs"
                            />
                        </div>
                        <div>
                            <label className="add-user-label">Confirm Email <span className='required-field'>*</span></label>
                            <input
                                type="email"
                                name="confirm_email"
                                value={formData.confirm_email}
                                onChange={handleChange}
                                className="w-full add-user-inputs"
                            />
                        </div>

                        <div>
                            <label className="add-user-label">Phone <span className='required-field'>*</span></label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full add-user-inputs"
                            />
                        </div>
                        <div>
                            <label className="add-user-label">Office Phone</label>
                            <input
                                type="tel"
                                name="office_phone"
                                value={formData.office_phone}
                                onChange={handleChange}
                                className="w-full add-user-inputs"
                            />
                        </div>

                        <div>
                            <label className="add-user-label">Mobile Phone</label>
                            <input
                                type="tel"
                                name="mobile_phone"
                                value={formData.mobile_phone}
                                onChange={handleChange}
                                className="w-full add-user-inputs"
                            />
                        </div>
                        <div>
                            <label className="add-user-label">Fax</label>
                            <input
                                type="tel"
                                name="fax"
                                value={formData.fax}
                                onChange={handleChange}
                                className="w-full add-user-inputs"
                            />
                        </div>

                        <div>
                            <label className="add-user-label">Secret Question <span className='required-field'>*</span></label>
                            <input
                                type="text"
                                name="secret_question"
                                value={formData.secret_question}
                                onChange={handleChange}
                                className="w-full add-user-inputs"
                            />
                        </div>
                        <div>
                            <label className="add-user-label">Answer <span className='required-field'>*</span></label>
                            <input
                                type="text"
                                name="answer"
                                value={formData.answer}
                                onChange={handleChange}
                                className="w-full add-user-inputs"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="add-user-label">Notes</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows="3"
                                className="w-full add-user-inputs add-user-notes"
                            ></textarea>
                        </div>

                        <div>
                            <label className="add-user-label">Status</label>
                            <div className="relative">
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full add-user-inputs appearance-none"
                                >
                                    <option value="live">Live</option>
                                    <option value="blocked">Blocked</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 top-3 flex items-center px-2 pointer-events-none">
                                    <svg className="w-5 h-5 fill-current text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <label className="add-user-label">Logo</label>
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                <div className="relative flex items-center w-full">
                                    <input
                                        type="file"
                                        name="user_logo"
                                        id="user_logo"
                                        onChange={handleFileChange}
                                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                                    />
                                    <div className="flex items-center h-[49px] px-3 bg-[#24242D] text-white border border-[#24242D] rounded-[5px] cursor-pointer min-w-[450px] add-user-inputs gap-3">
                                        <img src={choosefile} alt="Choose File" />
                                        <span className="text-white text-base truncate">
                                            {formData.user_logo && typeof formData.user_logo !== 'string'
                                                ? formData.user_logo.name
                                                : "Choose file..."}
                                        </span>
                                    </div>
                                </div>
                                {renderUserLogo()}
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="permissions-texts cursor-pointer">Permissions <span className='required-field'>*</span></label>
                            <div className="flex flex-wrap gap-5 mt-3">
                                {companyPermissions && companyPermissions.length > 0 ? (
                                    companyPermissions.map((permission) => (
                                        <label key={permission} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="permissions"
                                                value={permission}
                                                checked={isPermissionSelected(permission)}
                                                onChange={handlePermissionChange}
                                                className="mr-2 form-checkboxes"
                                            />
                                            <span className="permissions-texts cursor-pointer">{permission}</span>
                                        </label>
                                    ))
                                ) : (
                                    <p className="text-yellow-500">Loading permissions...</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-[22px] mt-5 mx-[122px] pb-[22px]">
                        <button
                            type="button"
                            className="cancel-btns duration-200"
                            onClick={handleCancel}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="save-btns duration-200"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default QMSEditUser;