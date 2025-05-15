import React, { useState, useEffect } from 'react';
import { ChevronDown, Eye } from 'lucide-react';
import file from "../../../../assets/images/Company Documentation/file-icon.svg";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from "../../../../Utils/Config";
import EditDraftQmsManualSuccessModal from './Modals/EditDraftQmsManualSuccessModal';

const QmsEditDraftEnvironmentalImpact = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileObject, setFileObject] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [impactDetails, setImpactDetails] = useState(null);
  const [previewAttachment, setPreviewAttachment] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showEditDraftSuccessModal, setShowEditDraftSuccessModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    written_by: null,
    number: '',
    checked_by: null,
    rivision: '',
    approved_by: null,
    document_type: 'System',
    date: `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`,
    review_frequency_year: '',
    review_frequency_month: '',
    send_notification_to_checked_by: false,
    send_email_to_checked_by: false,
    send_notification_to_approved_by: false,
    send_email_to_approved_by: false,
    related_record: ''
  });

  const [openDropdowns, setOpenDropdowns] = useState({
    written_by: false,
    checked_by: false,
    approved_by: false,
    document_type: false,
    day: false,
    month: false,
    year: false
  });

  const [fieldErrors, setFieldErrors] = useState({
    title: '',
    written_by: '',
    number: '',
    checked_by: ''
  });

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

  const companyId = getUserCompanyId();

  useEffect(() => {
    if (companyId) {
      fetchUsers();
    }
    if (companyId && id) {
      fetchImpactDetails();
    }
  }, [companyId, id]);

  const fetchUsers = async () => {
    try {
      if (!companyId) return;
      const response = await axios.get(`${BASE_URL}/company/users-active/${companyId}/`);
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        setUsers([]);
        setError("Unable to load users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users. Please check your connection and try again.");
      setUsers([]);
    }
  };

  const fetchImpactDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/qms/impact-detail/${id}/`);
      setImpactDetails(response.data);
      setIsInitialLoad(false);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching environmental impact details:", err);
      setError("Failed to load draft environmental impact details");
      setIsInitialLoad(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (impactDetails) {
      setFormData({
        title: impactDetails.title || '',
        written_by: impactDetails.written_by?.id || null,
        number: impactDetails.number || '',
        checked_by: impactDetails.checked_by?.id || null,
        rivision: impactDetails.rivision || '',
        approved_by: impactDetails.approved_by?.id || null,
        document_type: impactDetails.document_type || 'System',
        date: impactDetails.date || formData.date,
        review_frequency_year: impactDetails.review_frequency_year || '',
        review_frequency_month: impactDetails.review_frequency_month || '',
        send_notification_to_checked_by: impactDetails.send_notification_to_checked_by || false,
        send_email_to_checked_by: impactDetails.send_email_to_checked_by || false,
        send_notification_to_approved_by: impactDetails.send_notification_to_approved_by || false,
        send_email_to_approved_by: impactDetails.send_email_to_approved_by || false,
        related_record: impactDetails.related_record || ''
      });
    }
  }, [impactDetails]);

  useEffect(() => {
    if (impactDetails?.upload_attachment) {
      setPreviewAttachment(impactDetails.upload_attachment);
    }
  }, [impactDetails]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file.name);
      setFileObject(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewAttachment(fileUrl);
    }
  };

  const renderAttachmentPreview = () => {
    if (previewAttachment) {
      const attachmentName = selectedFile || impactDetails?.upload_attachment_name || 'Attachment';
      return (
        <button
          onClick={() => window.open(previewAttachment, '_blank')}
          className="text-[#1E84AF] click-view-file-text !text-[14px] flex items-center gap-2 mt-[10.65px]"
        >
          Click to View File
          <Eye size={17} />
        </button>
      );
    }
    return null;
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const parseDate = () => {
    const dateObj = new Date(formData.date);
    return {
      day: dateObj.getDate(),
      month: dateObj.getMonth() + 1,
      year: dateObj.getFullYear()
    };
  };

  const dateParts = parseDate();

  const days = Array.from(
    { length: getDaysInMonth(dateParts.month, dateParts.year) },
    (_, i) => i + 1
  );

  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const years = Array.from(
    { length: 21 },
    (_, i) => currentYear - 10 + i
  );

  const documentTypes = [
    'System',
    'Paper',
    'External',
    'Work Instruction'
  ];

  const toggleDropdown = (dropdown) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown]
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...fieldErrors };

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }

    if (!formData.written_by) {
      newErrors.written_by = 'Written/Prepared By is required';
      isValid = false;
    }

    if (!formData.number.trim()) {
      newErrors.number = 'Number is required';
      isValid = false;
    }

    if (!formData.checked_by) {
      newErrors.checked_by = 'Checked/Reviewed By is required';
      isValid = false;
    }

    setFieldErrors(newErrors);
    return isValid;
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleDropdownChange = (e, dropdown) => {
    const value = e.target.value;

    if (dropdown === 'day' || dropdown === 'month' || dropdown === 'year') {
      const dateObj = parseDate();
      dateObj[dropdown] = parseInt(value, 10);
      const newDate = `${dateObj.year}-${String(dateObj.month).padStart(2, '0')}-${String(dateObj.day).padStart(2, '0')}`;
      setFormData(prev => ({
        ...prev,
        date: newDate
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [dropdown]: value
      }));

      if (fieldErrors[dropdown]) {
        setFieldErrors(prev => ({
          ...prev,
          [dropdown]: ''
        }));
      }
    }

    setOpenDropdowns(prev => ({ ...prev, [dropdown]: false }));
  };

  const handleCancelClick = () => {
    navigate('/company/qms/draft-environmantal-impact');
  }; 

  const handleUpdateClick = async () => {
    if (!validateForm()) {
      setError('Please fill in all required fields');
      return;
    }
    try {
      setLoading(true);
      const companyId = getUserCompanyId();
      if (!companyId) {
        setError('Company ID not found. Please log in again.');
        setLoading(false);
        return;
      }

      const submitData = new FormData();
      submitData.append('company', companyId);

      const apiFormData = {
        ...formData,
        send_system_checked: formData.send_notification_to_checked_by ? 'Yes' : 'No',
        send_email_checked: formData.send_email_to_checked_by ? 'Yes' : 'No',
        send_system_approved: formData.send_notification_to_approved_by ? 'Yes' : 'No',
        send_email_approved: formData.send_email_to_approved_by ? 'Yes' : 'No'
      };

      if (formData.approved_by === null || formData.approved_by === '') {
        delete apiFormData.approved_by;
      } else if (typeof formData.approved_by === 'string') {
        apiFormData.approved_by = parseInt(formData.approved_by, 10);
      }

      Object.keys(apiFormData).forEach(key => {
        if (key !== 'send_notification_to_checked_by' &&
            key !== 'send_email_to_checked_by' &&
            key !== 'send_notification_to_approved_by' &&
            key !== 'send_email_to_approved_by') {
          submitData.append(key, apiFormData[key]);
        }
      });

      if (fileObject) {
        submitData.append('upload_attachment', fileObject);
      }

      const response = await axios.put(`${BASE_URL}/qms/impact/create/${id}/`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setLoading(false);
      setShowEditDraftSuccessModal(true);
      setTimeout(() => {
        setShowEditDraftSuccessModal(false);
        navigate('/company/qms/draft-environmantal-impact');
      }, 1500);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to update draft environmental impact');
      console.error('Error updating draft environmental impact:', err);
    }
  };

  const getMonthName = (monthNum) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[monthNum - 1];
  };

  const formatUserName = (user) => {
    return `${user.first_name} ${user.last_name}`;
  };

  const errorTextClass = "text-red-500 text-sm mt-1";

  return (
    <div className="bg-[#1C1C24] rounded-lg text-white p-5">
      <div className="flex justify-between items-center border-b border-[#383840] px-[124px] pb-5">
        <h1 className="add-training-head">Edit Draft Environmental Impact Assessment</h1>
        <button
          className="border border-[#858585] text-[#858585] rounded px-3 h-[42px] list-training-btn duration-200"
          onClick={() => navigate('/company/qms/draft-environmantal-impact')}
        >
          List Draft Environmental Impact Assessments
        </button>
      </div>

      <EditDraftQmsManualSuccessModal
        showEditDraftManualSuccessModal={showEditDraftSuccessModal}
        onClose={() => setShowEditDraftSuccessModal(false)}
      />

      {error && (
        <div className="mx-[18px] px-[104px] mt-4 p-2 bg-red-500 rounded text-white">
          {error}
        </div>
      )}

      <div className="mx-[18px] pt-[22px] px-[47px] 2xl:px-[104px]">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="add-qms-manual-label">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full add-qms-manual-inputs"
            />
            {fieldErrors.title && <p className={errorTextClass}>{fieldErrors.title}</p>}
          </div>

          <div>
            <label className="add-qms-manual-label">
              Written/Prepared By <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                name="written_by"
                value={formData.written_by || ''}
                onFocus={() => toggleDropdown('written_by')}
                onChange={(e) => handleDropdownChange(e, 'written_by')}
                onBlur={() => setOpenDropdowns(prev => ({ ...prev, written_by: false }))}
              >
                <option value="">Select User</option>
                {users.map(user => (
                  <option key={`written-${user.id}`} value={user.id}>
                    {formatUserName(user)}
                  </option>
                ))}
              </select>
              <ChevronDown
                className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${openDropdowns.written_by ? 'rotate-180' : ''}`}
              />
            </div>
            {fieldErrors.written_by && <p className={errorTextClass}>{fieldErrors.written_by}</p>}
          </div>

          <div>
            <label className="add-qms-manual-label">
              Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="number"
              value={formData.number}
              onChange={handleChange}
              className="w-full add-qms-manual-inputs"
            />
            {fieldErrors.number && <p className={errorTextClass}>{fieldErrors.number}</p>}
          </div>

          <div className="flex">
            <div className="flex-grow">
              <div className='flex items-center justify-between h-[24px]'>
                <label className="add-qms-manual-label">
                  Checked/Reviewed By <span className="text-red-500">*</span>
                </label>
                <div className='flex items-end justify-end space-y-1'>
                  <div className="ml-5 flex items-center h-[24px]">
                    <div className="flex items-center h-14 justify-center gap-2">
                      <input
                        type="checkbox"
                        name="send_notification_to_checked_by"
                        checked={formData.send_notification_to_checked_by}
                        onChange={handleCheckboxChange}
                        className="cursor-pointer qms-manual-form-checkbox p-[7px]"
                      />
                      <label className="add-qms-manual-label check-label">System Notify</label>
                    </div>
                  </div>
                  <div className="ml-5 flex items-center h-[24px]">
                    <div className="flex items-center h-14 justify-center gap-2">
                      <input
                        type="checkbox"
                        name="send_email_to_checked_by"
                        checked={formData.send_email_to_checked_by}
                        onChange={handleCheckboxChange}
                        className="cursor-pointer qms-manual-form-checkbox p-[7px]"
                      />
                      <label className="add-qms-manual-label check-label">Email Notify</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <select
                  className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                  name="checked_by"
                  value={formData.checked_by || ''}
                  onFocus={() => toggleDropdown('checked_by')}
                  onChange={(e) => handleDropdownChange(e, 'checked_by')}
                  onBlur={() => setOpenDropdowns(prev => ({ ...prev, checked_by: false }))}
                >
                  <option value="">Select User</option>
                  {users.map(user => (
                    <option key={`checked-${user.id}`} value={user.id}>
                      {formatUserName(user)}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${openDropdowns.checked_by ? 'rotate-180' : ''}`}
                />
              </div>
              {fieldErrors.checked_by && <p className={errorTextClass}>{fieldErrors.checked_by}</p>}
            </div>
          </div>

          <div>
            <label className="add-qms-manual-label">
              Revision
            </label>
            <input
              type="text"
              name="rivision"
              value={formData.rivision}
              onChange={handleChange}
              className="w-full add-qms-manual-inputs"
            />
          </div>

          <div className="flex">
            <div className="flex-grow">
              <div className='flex items-center justify-between h-[24px]'>
                <label className="add-qms-manual-label">
                  Approved By
                </label>
                <div className='flex items-end justify-end space-y-1'>
                  <div className="ml-5 flex items-center h-[24px]">
                    <div className="flex items-center h-14 justify-center gap-2">
                      <input
                        type="checkbox"
                        name="send_notification_to_approved_by"
                        checked={formData.send_notification_to_approved_by}
                        onChange={handleCheckboxChange}
                        className="cursor-pointer qms-manual-form-checkbox p-[7px]"
                      />
                      <label className="add-qms-manual-label check-label">System Notify</label>
                    </div>
                  </div>
                  <div className="ml-5 flex items-center h-[24px]">
                    <div className="flex items-center h-14 justify-center gap-2">
                      <input
                        type="checkbox"
                        name="send_email_to_approved_by"
                        checked={formData.send_email_to_approved_by}
                        onChange={handleCheckboxChange}
                        className="cursor-pointer qms-manual-form-checkbox p-[7px]"
                      />
                      <label className="add-qms-manual-label check-label">Email Notify</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <select
                  className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                  name="approved_by"
                  value={formData.approved_by || ''}
                  onFocus={() => toggleDropdown('approved_by')}
                  onChange={(e) => handleDropdownChange(e, 'approved_by')}
                  onBlur={() => setOpenDropdowns(prev => ({ ...prev, approved_by: false }))}
                >
                  <option value="">Select User</option>
                  {users.map(user => (
                    <option key={`approved-${user.id}`} value={user.id}>
                      {formatUserName(user)}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${openDropdowns.approved_by ? 'rotate-180' : ''}`}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="add-qms-manual-label">
              Document Type
            </label>
            <div className="relative">
              <select
                className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                name="document_type"
                value={formData.document_type}
                onFocus={() => toggleDropdown('document_type')}
                onChange={(e) => handleDropdownChange(e, 'document_type')}
                onBlur={() => setOpenDropdowns(prev => ({ ...prev, document_type: false }))}
              >
                {documentTypes.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <ChevronDown
                className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${openDropdowns.document_type ? 'rotate-180' : ''}`}
              />
            </div>
          </div>

          <div>
            <label className="add-qms-manual-label">
              Date Entered
            </label>
            <div className="flex space-x-5">
              <div className="relative w-1/3">
                <select
                  className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                  value={dateParts.day}
                  onFocus={() => toggleDropdown('day')}
                  onChange={(e) => handleDropdownChange(e, 'day')}
                  onBlur={() => setOpenDropdowns(prev => ({ ...prev, day: false }))}
                >
                  {days.map(day => (
                    <option key={`day-${day}`} value={day}>
                      {day < 10 ? `0${day}` : day}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${openDropdowns.day ? 'rotate-180' : ''}`}
                />
              </div>
              <div className="relative w-1/3">
                <select
                  className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                  value={dateParts.month}
                  onFocus={() => toggleDropdown('month')}
                  onChange={(e) => handleDropdownChange(e, 'month')}
                  onBlur={() => setOpenDropdowns(prev => ({ ...prev, month: false }))}
                >
                  {months.map(month => (
                    <option key={`month-${month}`} value={month}>
                      {month < 10 ? `0${month}` : month} - {getMonthName(month).substring(0, 3)}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${openDropdowns.month ? 'rotate-180' : ''}`}
                />
              </div>
              <div className="relative w-1/3">
                <select
                  className="w-full add-qms-manual-inputs appearance-none cursor-pointer"
                  value={dateParts.year}
                  onFocus={() => toggleDropdown('year')}
                  onChange={(e) => handleDropdownChange(e, 'year')}
                  onBlur={() => setOpenDropdowns(prev => ({ ...prev, year: false }))}
                >
                  {years.map(year => (
                    <option key={`year-${year}`} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`absolute right-3 top-7 h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${openDropdowns.year ? 'rotate-180' : ''}`}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="add-qms-manual-label">
              Attach Document
            </label>
            <div className="relative">
              <input
                type="file"
                id="fileInput"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                className="w-full add-qmsmanual-attach"
                onClick={() => document.getElementById('fileInput').click()}
              >
                <span className="file-input">
                  {selectedFile ? selectedFile : "Choose File"}
                </span>
                <img src={file} alt="File Icon" />
              </button>
              <div className='flex justify-between items-center'>
                {renderAttachmentPreview()}
                {!selectedFile && !previewAttachment && <p className="text-right no-file">No file chosen</p>}
              </div>
            </div>
          </div>

          <div>
            <label className='add-qms-manual-label'>
              Review Frequency
            </label>
            <div className="flex space-x-5">
              <input
                type="text"
                name="review_frequency_year"
                placeholder='Years'
                value={formData.review_frequency_year}
                onChange={handleChange}
                className="w-full add-qms-manual-inputs"
              />
              <input
                type="text"
                name="review_frequency_month"
                placeholder='Months'
                value={formData.review_frequency_month}
                onChange={handleChange}
                className="w-full add-qms-manual-inputs"
              />
            </div>
          </div>

          <div>
            <label className="add-qms-manual-label">
              Related Record/Document
            </label>
            <input
              type="text"
              name="related_record"
              value={formData.related_record}
              onChange={handleChange}
              className="w-full add-qms-manual-inputs"
            />
          </div>

          <div className="flex items-end mt-[22px] justify-end">
            <div className='flex gap-[22px]'>
              <button
                className="cancel-btn duration-200"
                onClick={handleCancelClick}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="save-btn duration-200"
                onClick={handleUpdateClick}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QmsEditDraftEnvironmentalImpact;