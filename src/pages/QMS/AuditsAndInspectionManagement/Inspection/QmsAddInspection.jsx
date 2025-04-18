import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QmsAddInspection = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    inspection_body: '',
    inspector_name: '',
    check_inspector: '',
    inspection_type: '',
    area: '',
    procedures: '',
    proposedDate: {
      day: '',
      month: '',
      year: ''
    },
    dateConducted: {
      day: '',
      month: '',
      year: ''
    },
    notes: '',
  });

  const [focusedDropdown, setFocusedDropdown] = useState(null);

  const handleListInspection = () => {
    navigate('/company/qms/list-inspection')
  }


  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested objects
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form data submitted:', formData);
    // Here you would typically send the data to your backend
  };

  const handleCancel = () => {
    navigate('/company/qms/list-inspection')
  };

  // Generate options for dropdowns
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

  return (
    <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
      <div className="flex justify-between items-center border-b border-[#383840] px-[104px] pb-5">
        <h1 className="add-training-head">Add Inspection</h1>
        <button
          className="border border-[#858585] text-[#858585] rounded w-[140px] h-[42px] list-training-btn duration-200"
          onClick={() => handleListInspection()}
        >
          List Inspection
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 px-[104px] py-5  ">

        <div className="flex flex-col gap-3">
          <label className="add-training-label">
          Inspection Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="add-training-inputs focus:outline-none"
            required
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">
          Inspection Body
          </label>
          <input
            type="text"
            name="inspection_body"
            value={formData.inspection_body}
            onChange={handleChange}
            className="add-training-inputs focus:outline-none"
            required
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">
          Inspector(s) Name
          </label>
          <input
            type="text"
            name="inspector_name"
            value={formData.inspector_name}
            onChange={handleChange}
            className="add-training-inputs focus:outline-none"
            required
          />
          <div className="flex items-end justify-start">
            <label className="flex items-center">
              <span className="permissions-texts cursor-pointer pr-3">
                If not external auditor
              </span>
              <input
                type="checkbox"
                name="check_inspector"
                className="mr-2 form-checkboxes"
                checked={formData.check_inspector}
                onChange={handleChange}
              />
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-3 relative">
          <label className="add-training-label">Audit Type <span className="text-red-500">*</span></label>
          <select
            name="inspection_type"
            value={formData.inspection_type}
            onChange={handleChange}
            onFocus={() => setFocusedDropdown("inspection_type")}
            onBlur={() => setFocusedDropdown(null)}
            className="add-training-inputs appearance-none pr-10 cursor-pointer"
          >
            <option value="" disabled>Select</option>
            <option value="Manager">Manager</option>
            <option value="Employee">Employee</option>
            <option value="HR">HR</option>
          </select>
          <ChevronDown
            className={`absolute right-3 top-[45%] transform   transition-transform duration-300 
         ${focusedDropdown === "inspection_type" ? "rotate-180" : ""}`}
            size={20}
            color="#AAAAAA"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">
            Area / Function:
          </label>
          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={handleChange}
            className="add-training-inputs focus:outline-none"
            required
          />
        </div>

        <div className="flex flex-col gap-3 relative">
          <label className="add-training-label">Procedures</label>
          <select
            name="procedures"
            value={formData.procedures}
            onChange={handleChange}
            onFocus={() => setFocusedDropdown("procedures")}
            onBlur={() => setFocusedDropdown(null)}
            className="add-training-inputs appearance-none pr-10 cursor-pointer"
          >
            <option value="" disabled>Select</option>
            <option value="Manager">Manager</option>
            <option value="Employee">Employee</option>
            <option value="HR">HR</option>
          </select>
          <ChevronDown
            className={`absolute right-3 top-[45%] transform   transition-transform duration-300 
         ${focusedDropdown === "procedures" ? "rotate-180" : ""}`}
            size={20}
            color="#AAAAAA"
          />
        </div>


        <div className="flex flex-col gap-3">
          <label className="add-training-label">Proposed Date for Inspection</label>
          <div className="grid grid-cols-3 gap-5">

            {/* Day */}
            <div className="relative">
              <select
                name="proposedDate.day"
                value={formData.proposedDate.day}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("proposedDate.day")}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>dd</option>
                {generateOptions(1, 31)}
              </select>
              <ChevronDown
                className={`absolute right-3 top-1/3 transform   transition-transform duration-300
             ${focusedDropdown === "proposedDate.day" ? "rotate-180" : ""}`}
                size={20}
                color="#AAAAAA"
              />
            </div>

            {/* Month */}
            <div className="relative">
              <select
                name="proposedDate.month"
                value={formData.proposedDate.month}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("proposedDate.month")}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>mm</option>
                {generateOptions(1, 12)}
              </select>
              <ChevronDown
                className={`absolute right-3 top-1/3 transform   transition-transform duration-300
             ${focusedDropdown === "proposedDate.month" ? "rotate-180" : ""}`}
                size={20}
                color="#AAAAAA"
              />
            </div>

            {/* Year */}
            <div className="relative">
              <select
                name="proposedDate.year"
                value={formData.proposedDate.year}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("proposedDate.year")}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>yyyy</option>
                {generateOptions(2023, 2030)}
              </select>
              <ChevronDown
                className={`absolute right-3 top-1/3 transform   transition-transform duration-300
             ${focusedDropdown === "proposedDate.year" ? "rotate-180" : ""}`}
                size={20}
                color="#AAAAAA"
              />
            </div>

          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="add-training-label">Date Conducted</label>
          <div className="grid grid-cols-3 gap-5">

            {/* Day */}
            <div className="relative">
              <select
                name="dateConducted.day"
                value={formData.dateConducted.day}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("dateConducted.day")}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>dd</option>
                {generateOptions(1, 31)}
              </select>
              <ChevronDown
                className={`absolute right-3 top-1/3 transform   transition-transform duration-300
             ${focusedDropdown === "dateConducted.day" ? "rotate-180" : ""}`}
                size={20}
                color="#AAAAAA"
              />
            </div>

            {/* Month */}
            <div className="relative">
              <select
                name="dateConducted.month"
                value={formData.dateConducted.month}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("dateConducted.month")}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>mm</option>
                {generateOptions(1, 12)}
              </select>
              <ChevronDown
                className={`absolute right-3 top-1/3 transform   transition-transform duration-300
             ${focusedDropdown === "dateConducted.month" ? "rotate-180" : ""}`}
                size={20}
                color="#AAAAAA"
              />
            </div>

            {/* Year */}
            <div className="relative">
              <select
                name="dateConducted.year"
                value={formData.dateConducted.year}
                onChange={handleChange}
                onFocus={() => setFocusedDropdown("dateConducted.year")}
                onBlur={() => setFocusedDropdown(null)}
                className="add-training-inputs appearance-none pr-10 cursor-pointer"
              >
                <option value="" disabled>yyyy</option>
                {generateOptions(2023, 2030)}
              </select>
              <ChevronDown
                className={`absolute right-3 top-1/3 transform   transition-transform duration-300
             ${focusedDropdown === "dateConducted.year" ? "rotate-180" : ""}`}
                size={20}
                color="#AAAAAA"
              />
            </div>

          </div>
        </div>


        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <label className="add-training-label">
              Notes
            </label>
            <input
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="add-training-inputs"
              required
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="md:col-span-2 flex gap-4 justify-between">
          <div>
            <button className='request-correction-btn duration-200'>
              Save as Draft
            </button>
          </div>
          <div className='flex gap-5'>
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-btn duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-btn duration-200"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default QmsAddInspection
