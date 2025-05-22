
import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../../../Utils/Config';
import RootCauseModal from './RootCauseModal';

const QmsDraftEditEnvironmentalIncidents = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isRootCauseModalOpen, setIsRootCauseModalOpen] = useState(false);
  const [rootCauses, setRootCauses] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const sourceOptions = ['Internal', 'External', 'Customer', 'Regulatory'];

  const [formData, setFormData] = useState({
    source: '',
    title: '',
    incident_no: '',
    status: '',
    root_cause: '',
    reported_by: '',
    description: '',
    action: '',
    date_raised: { day: '', month: '', year: '' },
    date_completed: { day: '', month: '', year: '' },
    remarks: '',
    send_notification: false,
    is_draft: true,
  });
  const [focusedDropdown, setFocusedDropdown] = useState(null);

  const getUserCompanyId = () => {
    const storedCompanyId = localStorage.getItem('company_id');
    if (storedCompanyId) return storedCompanyId;
    const userRole = localStorage.getItem('role');
    if (userRole === 'user') {
      const userData = localStorage.getItem('user_company_id');
      if (userData) {
        try {
          return JSON.parse(userData);
        } catch (e) {
          console.error('Error parsing user company ID:', e);
          return null;
        }
      }
    }
    return null;
  };

  const companyId = getUserCompanyId();

  useEffect(() => {
    if (id && companyId) {
      fetchIncidentData();
      fetchRootCauses();
      fetchUsers();
    } else {
      setError('Invalid incident ID or company ID.');
      setIsLoading(false);
    }
  }, [id, companyId]);

  const fetchIncidentData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/qms/incident-get/${id}/`);
      const data = response.data;
      if (!data.is_draft) {
        setError('This incident is not a draft.');
        return;
      }

      const dateRaised = data.date_raised ? new Date(data.date_raised) : null;
      const dateCompleted = data.date_completed ? new Date(data.date_completed) : null;

      setFormData({
        source: data.source || '',
        title: data.title || '',
        incident_no: data.incident_no || '',
        status: data.status || 'Pending',
        root_cause: data.root_cause?.id || '',
        reported_by: data.reported_by?.id || '',
        description: data.description || '',
        action: data.action || '',
        date_raised: dateRaised
          ? {
              day: String(dateRaised.getDate()).padStart(2, '0'),
              month: String(dateRaised.getMonth() + 1).padStart(2, '0'),
              year: String(dateRaised.getFullYear()),
            }
          : { day: '', month: '', year: '' },
        date_completed: dateCompleted
          ? {
              day: String(dateCompleted.getDate()).padStart(2, '0'),
              month: String(dateCompleted.getMonth() + 1).padStart(2, '0'),
              year: String(dateRaised.getFullYear()),
            }
          : { day: '', month: '', year: '' },
        remarks: data.remarks || '',
        send_notification: data.send_notification || false,
        is_draft: data.is_draft || true,
      });
    } catch (error) {
      console.error('Error fetching incident data:', error);
      setError('Failed to load incident data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRootCauses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/qms/root-cause/company/${companyId}/`);
      setRootCauses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching root causes:', error);
      setError('Failed to load root causes. Please try again.');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/company/users-active/${companyId}/`);
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again.');
    }
  };

  const handleOpenRootCauseModal = () => {
    setIsRootCauseModalOpen(true);
  };

  const handleCloseRootCauseModal = (newCauseAdded = false) => {
    setIsRootCauseModalOpen(false);
    if (newCauseAdded) {
      fetchRootCauses();
    }
  };

  const handleListEnvironmentalIncidents = () => {
    navigate('/company/qms/draft-environmantal-incident');
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.source) errors.source = 'Source is required';
    if (!formData.title) errors.title = 'Incident Title is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'incident_no') return;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }

    setFormErrors((prev) => ({ ...prev, [name.split('.')[0]]: '' }));
  };

  const formatDate = (dateObj) => {
    if (!dateObj.year || !dateObj.month || !dateObj.day) return null;
    const date = new Date(`${dateObj.year}-${dateObj.month}-${dateObj.day}`);
    if (isNaN(date.getTime())) return null;
    return `${dateObj.year}-${dateObj.month}-${dateObj.day}`;
  };

  const handleSubmit = async (e, asDraft = false) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!companyId) {
      setError('Company ID not found. Please log in again.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const dateRaised = formatDate(formData.date_raised);
      const dateCompleted = formatDate(formData.date_completed);

      // if ((formData.date_raised.day || formData.date_raised.month || formData.date_raised.year) && !dateRaised) {
      //   setFormErrors({ date_raised: 'Invalid Date Raised. Please enter a valid date.' });
      //   setIsLoading(false);
      //   return;
      // }
      // if ((formData.date_completed.day || formData.date_completed.month || formData.date_completed.year) && !dateCompleted) {
      //   setFormErrors({ date_completed: 'Invalid Complete By date. Please enter a valid date.' });
      //   setIsLoading(false);
      //   return;
      // }

      const submissionData = {
        company: companyId,
        source: formData.source || null,
        title: formData.title || null,
        incident_no: formData.incident_no || null,
        status: formData.status || 'Pending',
        root_cause: formData.root_cause || null,
        reported_by: formData.reported_by || null,
        description: formData.description || null,
        action: formData.action || null,
        date_raised: dateRaised || null,
        date_completed: dateCompleted || null,
        remarks: formData.remarks || null,
        send_notification: formData.send_notification || false,
        is_draft: asDraft,
      };

      const response = await axios.put(`${BASE_URL}/qms/incident-draft/update/${id}/`, submissionData);
    console.log('Updated EI:', response.data);
    navigate('/company/qms/list-environmantal-incident');
  } catch (error) {
    console.error('Error updating incident:', error);
    setError(error.response?.data?.detail || 'Failed to save incident. Please check your inputs and try again.');
  } finally {
    setIsLoading(false);
  }
};

  const generateOptions = (start, end, prefix = '') => {
    const options = [];
    for (let i = start; i <= end; i++) {
      const value = i < 10 ? `0${i}` : `${i}`;
      options.push(
        <option key={i} value={value}>
          {prefix}{value}
        </option>
      );
    }
    return options;
  };

  if (error && !formData.incident_no) {
    return (
      <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
        <div className="flex justify-between items-center border-b border-[#383840] px-[104px] pb-5">
          <h1 className="add-training-head">Edit Draft Environmental Incidents</h1>
          <button
            className="border border-[#858585] text-[#858585] rounded px-3 h-[42px] list-training-btn duration-200"
            onClick={handleListEnvironmentalIncidents}
          >
            List Draft Environmental Incidents
          </button>
        </div>
        <div className="p-5 text-red-300 px-[104px]">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
      <div className="flex justify-between items-center border-b border-[#383840] px-[104px] pb-5">
        <h1 className="add-training-head">Edit Draft Environmental Incidents</h1>
        <button
          className="border border-[#858585] text-[#858585] rounded px-3 h-[42px] list-training-btn duration-200"
          onClick={handleListEnvironmentalIncidents}
        >
          List Draft Environmental Incidents
        </button>
      </div>

      {error && (
        <div className="bg-red-500 bg-opacity-20 text-red-300 px-[104px] py-2 my-2">{error}</div>
      )}

      <RootCauseModal isOpen={isRootCauseModalOpen} onClose={handleCloseRootCauseModal} />

      <form onSubmit={(e) => handleSubmit(e, false)} className="grid grid-cols-1 md:grid-cols-2 gap-6 px-[104px] py-5">
        <div className="flex flex-col gap-3 relative">
          <label className="add-training-label">
            Source <span className="text-red-500">*</span>
          </label>
          <select
            name="source"
            value={formData.source}
            onChange={handleChange}
            onFocus={() => setFocusedDropdown('source')}
            onBlur={() => setFocusedDropdown(null)}
            className="add-training-inputs appearance-none pr-10 cursor-pointer"
             
          >
            <option value="" disabled>
              Select Source
            </option>
            {sourceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {formErrors.source && <span className="text-red-500 text-sm">{formErrors.source}</span>}
          <ChevronDown
            className={`absolute right-3 top-[55px] transform transition-transform duration-300
              ${focusedDropdown === 'source' ? 'rotate-180' : ''}`}
            size={20}
            color="#AAAAAA"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">
            Incident Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="add-training-inputs focus:outline-none"
             
          />
          {formErrors.title && <span className="text-red-500 text-sm">{formErrors.title}</span>}
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Incident No</label>
          <input
            type="text"
            name="incident_no"
            value={formData.incident_no}
            className="add-training-inputs focus:outline-none cursor-not-allowed bg-gray-800"
            readOnly
            title="Incident number cannot be changed"
          />
        </div>

        <div className="flex flex-col gap-3 relative">
          <label className="add-training-label">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            onFocus={() => setFocusedDropdown('status')}
            onBlur={() => setFocusedDropdown(null)}
            className="add-training-inputs appearance-none pr-10 cursor-pointer"
          >
            <option value="" disabled>
              Select Status
            </option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Deleted">Deleted</option>
          </select>
          <ChevronDown
            className={`absolute right-3 top-[60%] transform transition-transform duration-300 
              ${focusedDropdown === 'status' ? 'rotate-180' : ''}`}
            size={20}
            color="#AAAAAA"
          />
        </div>

        <div className="flex flex-col gap-3 relative">
          <label className="add-training-label">Root Cause</label>
          <select
            name="root_cause"
            value={formData.root_cause}
            onChange={handleChange}
            onFocus={() => setFocusedDropdown('root_cause')}
            onBlur={() => setFocusedDropdown(null)}
            className="add-training-inputs appearance-none pr-10 cursor-pointer"
          >
            <option value="" disabled>
              {rootCauses.length === 0 ? 'No root causes found' : 'Select Root Cause'}
            </option>
            {rootCauses.map((cause) => (
              <option key={cause.id} value={cause.id}>
                {cause.title}
              </option>
            ))}
          </select>
          <ChevronDown
            className={`absolute right-3 top-[40%] transform transition-transform duration-300 
              ${focusedDropdown === 'root_cause' ? 'rotate-180' : ''}`}
            size={20}
            color="#AAAAAA"
          />
          <button
            className="flex justify-start add-training-label !text-[#1E84AF] mt-1"
            onClick={handleOpenRootCauseModal}
            type="button"
          >
            View / Add Root Cause
          </button>
        </div>

        <div className="flex flex-col gap-3 relative">
          <label className="add-training-label">Reported By</label>
          <select
            name="reported_by"
            value={formData.reported_by}
            onChange={handleChange}
            onFocus={() => setFocusedDropdown('reported_by')}
            onBlur={() => setFocusedDropdown(null)}
            className="add-training-inputs appearance-none pr-10 cursor-pointer"
          >
            <option value="" disabled>
              {users.length === 0 ? 'No users found' : 'Select Executor'}
            </option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.first_name} {user.last_name || ''}
              </option>
            ))}
          </select>
          <ChevronDown
            className={`absolute right-3 top-[40%] transform transition-transform duration-300 
              ${focusedDropdown === 'reported_by' ? 'rotate-180' : ''}`}
            size={20}
            color="#AAAAAA"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Incident Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="add-training-inputs focus:outline-none !h-[98px]"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Action or Corrections</label>
          <textarea
            name="action"
            value={formData.action}
            onChange={handleChange}
            className="add-training-inputs focus:outline-none !h-[98px]"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Date Raised</label>
          <div className="grid grid-cols-3 gap-5">
            <div className="relative">
              <select
                name="date_raised.day"
                value={formData.date_raised.day}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown('date_raised.day')}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>
                  dd
                </option>
                {generateOptions(1, 31)}
              </select>
              <ChevronDown
                className={`absolute right-3 top-[35%] transform transition-transform duration-300
                  ${focusedDropdown === 'date_raised.day' ? 'rotate-180' : ''}`}
                size={20}
                color="#AAAAAA"
              />
            </div>
            <div className="relative">
              <select
                name="date_raised.month"
                value={formData.date_raised.month}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown('date_raised.month')}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>
                  mm
                </option>
                {generateOptions(1, 12)}
              </select>
              <ChevronDown
                className={`absolute right-3 top-[35%] transform transition-transform duration-300
                  ${focusedDropdown === 'date_raised.month' ? 'rotate-180' : ''}`}
                size={20}
                color="#AAAAAA"
              />
            </div>
            <div className="relative">
              <select
                name="date_raised.year"
                value={formData.date_raised.year}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown('date_raised.year')}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>
                  yyyy
                </option>
                {generateOptions(2023, 2030)}
              </select>
              <ChevronDown
                className={`absolute right-3 top-[35%] transform transition-transform duration-300
                  ${focusedDropdown === 'date_raised.year' ? 'rotate-180' : ''}`}
                size={20}
                color="#AAAAAA"
              />
            </div>
          </div>
          {formErrors.date_raised && <span className="text-red-500 text-sm">{formErrors.date_raised}</span>}
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Complete By</label>
          <div className="grid grid-cols-3 gap-5">
            <div className="relative">
              <select
                name="date_completed.day"
                value={formData.date_completed.day}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown('date_completed.day')}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>
                  dd
                </option>
                {generateOptions(1, 31)}
              </select>
              <ChevronDown
                className={`absolute right-3 top-[35%] transform transition-transform duration-300
                  ${focusedDropdown === 'date_completed.day' ? 'rotate-180' : ''}`}
                size={20}
                color="#AAAAAA"
              />
            </div>
            <div className="relative">
              <select
                name="date_completed.month"
                value={formData.date_completed.month}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown('date_completed.month')}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>
                  mm
                </option>
                {generateOptions(1, 12)}
              </select>
              <ChevronDown
                className={`absolute right-3 top-[35%] transform transition-transform duration-300
                  ${focusedDropdown === 'date_completed.month' ? 'rotate-180' : ''}`}
                size={20}
                color="#AAAAAA"
              />
            </div>
            <div className="relative">
              <select
                name="date_completed.year"
                value={formData.date_completed.year}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown('date_completed.year')}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>
                  yyyy
                </option>
                {generateOptions(2023, 2030)}
              </select>
              <ChevronDown
                className={`absolute right-3 top-[35%] transform transition-transform duration-300
                  ${focusedDropdown === 'date_completed.year' ? 'rotate-180' : ''}`}
                size={20}
                color="#AAAAAA"
              />
            </div>
          </div>
          {formErrors.date_completed && <span className="text-red-500 text-sm">{formErrors.date_completed}</span>}
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Remarks</label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            className="add-training-inputs focus:outline-none !h-[98px]"
          />
        </div>

        <div className="flex items-end justify-end mt-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="send_notification"
              className="mr-2 form-checkboxes"
              checked={formData.send_notification}
              onChange={handleChange}
            />
            <span className="permissions-texts cursor-pointer">Send Notification</span>
          </label>
        </div>

        <div className="md:col-span-2 flex gap-4 justify-end">
          <div className="flex gap-5">
            <button
              type="button"
              onClick={handleListEnvironmentalIncidents}
              className="cancel-btn duration-200"
            >
              Cancel
            </button>
            <button type="submit" className="save-btn duration-200" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update'}
            </button>

          
          </div>
        </div>
      </form>
    </div>
  );
};

export default QmsDraftEditEnvironmentalIncidents;
