import React, { useState } from 'react';
import { ChevronDown, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { countries } from 'countries-list'; // Import the countries-list package
import file from "../../../../assets/images/Company Documentation/file-icon.svg";

const QmsEditCustomer = () => {
    const navigate = useNavigate();

    // Convert countries object to a sorted array of country names
    const countryList = Object.values(countries)
        .map(country => country.name)
        .sort((a, b) => a.localeCompare(b));

    const [formData, setFormData] = useState({
        name: '',
        city: '',
        street_address: '',
        state: '',
        zip_code: '',
        country: '',
        email: '',
        contact_person: '',
        phone: '',
        alternative_phone: '',
        notes: '',
        attachment: '',
        fax: '',
    });

    const [focusedDropdown, setFocusedDropdown] = useState(null);

    const handleListCustomer = () => {
        navigate('/company/qms/list-customer')
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
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
                [name]: value,
            });
        }
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            attachment: e.target.files[0]
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form data submitted:', formData);
    };

    const handleCancel = () => {
        navigate('/company/qms/list-customer')
    };

    return (
        <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
            <div className="flex justify-between items-center border-b border-[#383840] px-[104px] pb-5">
                <h1 className="add-training-head">Edit Customer</h1>
                <button
                    className="border border-[#858585] text-[#858585] rounded w-[140px] h-[42px] list-training-btn duration-200"
                    onClick={() => handleListCustomer()}
                >
                    List Customer
                </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 px-[104px] py-5  ">
                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none"
                        required
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        City
                    </label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none"
                        required
                    />
                </div>
                <div className="flex flex-col gap-3 col-span-2">
                    <label className="add-training-label">
                        Street Address
                    </label>
                    <textarea
                        name="street_address"
                        value={formData.street_address}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none !h-[84px]"
                        required
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        State
                    </label>
                    <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none"
                        required
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Zip Code
                    </label>
                    <input
                        type="text"
                        name="zip_code"
                        value={formData.zip_code}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none"
                        required
                    />
                </div>

                <div className="flex flex-col gap-3 relative">
                    <label className="add-training-label">Country</label>
                    <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        onFocus={() => setFocusedDropdown("country")}
                        onBlur={() => setFocusedDropdown(null)}
                        className="add-training-inputs appearance-none pr-10 cursor-pointer"
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

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none"
                        required
                    />
                </div>

                <div className="flex flex-col gap-3 relative">
                    <label className="add-training-label">Contact Person</label>
                    <select
                        name="contact_person"
                        value={formData.contact_person}
                        onChange={handleChange}
                        onFocus={() => setFocusedDropdown("contact_person")}
                        onBlur={() => setFocusedDropdown(null)}
                        className="add-training-inputs appearance-none pr-10 cursor-pointer"
                    >
                        <option value="" disabled>Select</option>
                    </select>
                    <ChevronDown
                        className={`absolute right-3 top-[60%] transform transition-transform duration-300 
                          ${focusedDropdown === "contact_person" ? "rotate-180" : ""}`}
                        size={20}
                        color="#AAAAAA"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Phone
                    </label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none"
                        required
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Alternative Phone
                    </label>
                    <input
                        type="text"
                        name="alternative_phone"
                        value={formData.alternative_phone}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none"
                        required
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">
                        Fax
                    </label>
                    <input
                        type="text"
                        name="fax"
                        value={formData.fax}
                        onChange={handleChange}
                        className="add-training-inputs focus:outline-none"
                        required
                    />
                </div>

                <div className="flex flex-col gap-5 col-span-2">
                    <div className="flex flex-col gap-3">
                        <label className="add-training-label">
                            Notes
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className="add-training-inputs !h-[98px]"
                            required
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <label className="add-training-label">Upload Attachments</label>
                    <div className="flex">
                        <input
                            type="file"
                            id="file-upload"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <label
                            htmlFor="file-upload"
                            className="add-training-inputs w-full flex justify-between items-center cursor-pointer !bg-[#1C1C24] border !border-[#383840]"
                        >
                            <span className="text-[#AAAAAA] choose-file">Choose File</span>
                            <img src={file} alt="" />
                        </label>
                    </div>
                    <div className='flex justify-between items-center'>
                        <button className='flex items-center gap-2 click-view-file-btn text-[#1E84AF]'>
                            Click to view file <Eye size={17}/>
                        </button>
                        <div>
                            {formData.attachment && (
                                <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">{formData.attachment.name}</p>
                            )}
                            {!formData.attachment && (
                                <p className="no-file text-[#AAAAAA] flex justify-end !mt-0">No file chosen</p>
                            )}
                        </div>
                    </div>
                </div>


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

export default QmsEditCustomer
