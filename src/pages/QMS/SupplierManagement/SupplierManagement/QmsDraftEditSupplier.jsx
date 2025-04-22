import React, { useState } from 'react';
import { ChevronDown, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { countries } from 'countries-list'; // Import the countries-list package
import file from "../../../../assets/images/Company Documentation/file-icon.svg";

const QmsDraftEditSupplier = () => {
    const countryList = Object.values(countries)
        .map(country => country.name)
        .sort((a, b) => a.localeCompare(b));


    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        company_name: '',
        website: '',
        email: '',
        city: '',
        address: '',
        state: '',
        postal_code: '',
        country: '',
        phone: '',
        alternate_phone: '',
        fax: '',
        contact_person: '',
        qualified_supply: '',
        notes: '',
        analysis_needed: '',
        approved_by: '',
        status: '',
        selection_criteria: '',
        approval_date: {
            day: '',
            month: '',
            year: ''
        },

    });

    const [focusedDropdown, setFocusedDropdown] = useState(null);

    const handleListDraftSupplier = () => {
        navigate('/company/qms/draft-supplier')
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Handle checkboxes
        if (type === 'checkbox') {
            setFormData({
                ...formData,
                [name]: checked
            });
            return;
        }

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

    const handleFileChange = (e) => {
        const { name, files } = e.target;

        setFormData({
            ...formData,
            [name]: files[0]
        });
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form data submitted:', formData);
        // Here you would typically send the data to your backend
    };

    const handleCancel = () => {
        navigate('/company/qms/draft-supplier')
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
                <h1 className="add-training-head">Edit Draft Supplier</h1>
                <button
                    className="border border-[#858585] text-[#858585] rounded px-3 h-[42px] w-[140px] list-training-btn duration-200"
                    onClick={() => handleListDraftSupplier()}
                >
                    List Draft Supplier
                </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 px-[104px] py-5">

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type='text'
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleChange}
                        className="add-training-inputs"
                        required
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Web Site
                    </label>
                    <input
                        type='text'
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="add-training-inputs"
                        required
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Email
                    </label>
                    <input
                        type='email'
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="add-training-inputs"
                        required
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        City
                    </label>
                    <input
                        type='text'
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="add-training-inputs"
                        required
                    />
                </div>

                <div className="flex flex-col gap-3 col-span-2">
                    <label className="add-training-label">
                        Address
                    </label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="add-training-inputs !h-[84px]"
                        required
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        State
                    </label>
                    <input
                        type='text'
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="add-training-inputs"
                        required
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Postal Code
                    </label>
                    <input
                        type='text'
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={handleChange}
                        className="add-training-inputs"
                        required
                    />
                </div>

                <div className="flex flex-col gap-5">
                    <div className='flex flex-col gap-3 relative'>
                        <label className="add-training-label">
                            Country
                        </label>
                        <select
                            name="country"
                            value={formData.namcountrye}
                            onChange={handleChange}
                            onFocus={() => setFocusedDropdown("country")}
                            onBlur={() => setFocusedDropdown(null)}
                            className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            required
                        >
                            <option value="" disabled>Select Country</option>
                            {countryList.map((country, index) => (
                                <option key={index} value={country}>
                                    {country}
                                </option>
                            ))}
                        </select>
                        <ChevronDown
                            className={`absolute right-3 top-[60%] transform transition-transform duration-300 
                                    ${focusedDropdown === "country" ? "rotate-180" : ""}`}
                            size={20}
                            color="#AAAAAA"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Phone
                    </label>
                    <input
                        type='text'
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="add-training-inputs"
                        required
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Alternate Phone
                    </label>
                    <input
                        type='text'
                        name="alternate_phone"
                        value={formData.alternate_phone}
                        onChange={handleChange}
                        className="add-training-inputs"
                        required
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Fax
                    </label>
                    <input
                        type='text'
                        name="fax"
                        value={formData.fax}
                        onChange={handleChange}
                        className="add-training-inputs"
                        required
                    />
                </div>


                <div className="flex flex-col gap-3 relative">
                    <div className='flex justify-between'>
                        <label className="add-training-label">Contact Person</label>
                    </div>
                    <div className="relative">
                        <select
                            name="contact_person"
                            value={formData.contact_person}
                            onChange={handleChange}
                            onFocus={() => setFocusedDropdown("contact_person")}
                            onBlur={() => setFocusedDropdown(null)}
                            className="add-training-inputs appearance-none pr-10 cursor-pointer"
                        >
                            <option value="User 1">User 1</option>
                            <option value="user 2">User 2</option>
                        </select>
                        <ChevronDown
                            className={`absolute right-3 top-1/3 transform transition-transform duration-300 
                                    ${focusedDropdown === "contact_person" ? "rotate-180" : ""}`}
                            size={20}
                            color="#AAAAAA"
                        />
                    </div>
                </div>
                <div></div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">Qualified To Supply</label>
                    <textarea
                        name="qualified_supply"
                        value={formData.qualified_supply}
                        onChange={handleChange}
                        className="add-training-inputs !h-[98px]"
                    >
                    </textarea>

                    <div className="flex items-end justify-start">
                        <label className="flex items-center">
                            <span className="add-training-label cursor-pointer pr-3">
                                Analysis Needed?
                            </span>
                            <input
                                type="checkbox"
                                name="analysis_needed"
                                className="mr-2 form-checkboxes"
                                checked={formData.analysis_needed}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">Notes</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="add-training-inputs !h-[98px]"
                    >
                    </textarea>
                </div>

                <div className='flex flex-col gap-3 relative'>
                    <label className="add-training-label">
                        Approved By
                    </label>
                    <select
                        name="approved_by"
                        value={formData.approved_by}
                        onChange={handleChange}
                        onFocus={() => setFocusedDropdown("approved_by")}
                        onBlur={() => setFocusedDropdown(null)}
                        className="add-training-inputs appearance-none pr-10 cursor-pointer"
                        required
                    >
                        <option value="" disabled>Select Approved By</option>
                        <option value="User1">User 1</option>
                        <option value="User2">User 2</option>
                    </select>
                    <ChevronDown
                        className={`absolute right-3 top-[60%] transform transition-transform duration-300 
                                    ${focusedDropdown === "approved_by" ? "rotate-180" : ""}`}
                        size={20}
                        color="#AAAAAA"
                    />
                </div>

                <div className='flex flex-col gap-3 relative'>
                    <label className="add-training-label">
                        Status
                    </label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        onFocus={() => setFocusedDropdown("status")}
                        onBlur={() => setFocusedDropdown(null)}
                        className="add-training-inputs appearance-none pr-10 cursor-pointer"
                        required
                    >
                        <option value="" disabled>Select Status</option>
                        <option value="approved">Approved</option>
                        <option value="provisional">Provisional</option>
                        <option value="not approved">Not Approved</option>
                    </select>
                    <ChevronDown
                        className={`absolute right-3 top-[60%] transform transition-transform duration-300 
                                    ${focusedDropdown === "status" ? "rotate-180" : ""}`}
                        size={20}
                        color="#AAAAAA"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Selection Criteria
                    </label>
                    <input
                        type='text'
                        name="selection_criteria"
                        value={formData.selection_criteria}
                        onChange={handleChange}
                        className="add-training-inputs"
                        required
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">Approval Date</label>
                    <div className="grid grid-cols-3 gap-5">

                        {/* Day */}
                        <div className="relative">
                            <select
                                name="approval_date.day"
                                value={formData.approval_date.day}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown("approval_date.day")}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            >
                                <option value="" disabled>dd</option>
                                {generateOptions(1, 31)}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-1/3 transform transition-transform duration-300
                                            ${focusedDropdown === "approval_date.day" ? "rotate-180" : ""}`}
                                size={20}
                                color="#AAAAAA"
                            />
                        </div>

                        {/* Month */}
                        <div className="relative">
                            <select
                                name="approval_date.month"
                                value={formData.approval_date.month}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown("approval_date.month")}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            >
                                <option value="" disabled>mm</option>
                                {generateOptions(1, 12)}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-1/3 transform transition-transform duration-300
                                            ${focusedDropdown === "approval_date.month" ? "rotate-180" : ""}`}
                                size={20}
                                color="#AAAAAA"
                            />
                        </div>

                        {/* Year */}
                        <div className="relative">
                            <select
                                name="approval_date.year"
                                value={formData.approval_date.year}
                                onChange={handleChange}
                                onFocus={() => setFocusedDropdown("approval_date.year")}
                                onBlur={() => setFocusedDropdown(null)}
                                className="add-training-inputs appearance-none pr-10 cursor-pointer"
                            >
                                <option value="" disabled>yyyy</option>
                                {generateOptions(2023, 2030)}
                            </select>
                            <ChevronDown
                                className={`absolute right-3 top-1/3 transform transition-transform duration-300
                                            ${focusedDropdown === "approval_date.year" ? "rotate-180" : ""}`}
                                size={20}
                                color="#AAAAAA"
                            />
                        </div>
                    </div>
                </div>


                <div className="flex flex-col gap-3">
                    <label className="add-training-label">Pre-qualification</label>
                    <div className="flex">
                        <input
                            type="file"
                            id="prequalification-upload"
                            name="prequalification_attachment"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <label
                            htmlFor="prequalification-upload"
                            className="add-training-inputs w-full flex justify-between items-center cursor-pointer !bg-[#1C1C24] border !border-[#383840]"
                        >
                            <span className="text-[#AAAAAA] choose-file">Choose File</span>
                            <img src={file} alt="" />
                        </label>
                    </div>
                    <div className='flex justify-between items-center'>
                        <button className='click-view-file-btn text-[#1E84AF] flex items-center gap-2'>
                            Click to view file <Eye size={18} />
                        </button>
                        {formData.prequalification_attachment ? (
                            <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">
                                {formData.prequalification_attachment.name}
                            </p>
                        ) : (
                            <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">No file chosen</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">Upload Documents</label>
                    <div className="flex">
                        <input
                            type="file"
                            id="documents-upload"
                            name="documents_attachment"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <label
                            htmlFor="documents-upload"
                            className="add-training-inputs w-full flex justify-between items-center cursor-pointer !bg-[#1C1C24] border !border-[#383840]"
                        >
                            <span className="text-[#AAAAAA] choose-file">Choose File</span>
                            <img src={file} alt="" />
                        </label>
                    </div>
                    <div className='flex justify-between items-center'>
                        <button className='click-view-file-btn text-[#1E84AF] flex items-center gap-2'>
                            Click to view file <Eye size={18} />
                        </button>
                        {formData.documents_attachment ? (
                            <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">
                                {formData.documents_attachment.name}
                            </p>
                        ) : (
                            <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">No file chosen</p>
                        )}
                    </div>
                </div>

                {/* Form Actions */}
                <div className="md:col-span-2 flex gap-4 justify-end">

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
export default QmsDraftEditSupplier
