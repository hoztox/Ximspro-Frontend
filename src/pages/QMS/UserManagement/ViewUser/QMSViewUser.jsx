import React, { useState } from 'react';
import "./qmsviewuser.css"
import { X, Eye, Trash, Edit } from 'lucide-react';
import edits from "../../../../assets/images/Company User Management/edits.svg"
import deletes from "../../../../assets/images/Company User Management/deletes.svg"
import { useNavigate } from "react-router-dom";

const QMSViewUser = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        username: 'Anonymous',
        // password: 'Test',
        firstName: 'Anonymous',
        lastName: 'Anonymous',
        gender: 'Male',
        dob: '02-02-2024',
        address: 'Anonymous',
        city: 'Anonymous',
        province: 'Anonymous',
        zipCode: 'Anonymous',
        businessSector: 'Anonymous',
        country: 'Anonymous',
        department: 'Anonymous',
        email: 'Anonymous@gmail.com',
        phone: '8592147565',
        officePhone: '8592147565',
        mobilePhone: '8592147565',
        fax: 'Anonymous',
        secretQuestion: 'Anonymous',
        answer: 'Anonymous',
        notes: 'Anonymous',
        status: 'Active',
        permissions: 'QMS, EMS, EnMS',
        logo: 'Click to view file'
    });

    const closePanel = () => {
        navigate('/company/qms/listuser')
    };

    return (
        <div className="flex items-center justify-center">
            <div className="bg-[#1C1C24] text-white rounded-lg  w-full ">
                <div className="mx-5 mt-5 flex justify-between items-center border-b border-[#383840] pb-[21px]">
                    <h2 className="user-info-head">User Information</h2>
                    <button onClick={closePanel} className="text-white bg-[#24242D] h-[36px] w-[36px] flex justify-center items-center rounded-md">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Left Column */}
                    <div className="space-y-[40px] border-r border-[#383840]">
                        <div>
                            <label className="block view-user-labels text-[#AAAAAA] mb-[6px]">Username</label>
                            <div className="text-white view-user-datas">{userData.username}</div>
                        </div>

                        <div>
                            <label className="block view-user-labels text-[#AAAAAA] mb-[6px]">First Name</label>
                            <div className="text-white view-user-datas">{userData.firstName}</div>
                        </div>

                        <div>
                            <label className="block view-user-labels text-[#AAAAAA] mb-[6px]">Last Name</label>
                            <div className="text-white view-user-datas">{userData.lastName}</div>
                        </div>

                        <div>
                            <label className="block view-user-labels text-[#AAAAAA] mb-[6px]">Address</label>
                            <div className="text-white view-user-datas">{userData.address}</div>
                        </div>

                        <div>
                            <label className="block view-user-labels text-[#AAAAAA] mb-[6px]">Province/State</label>
                            <div className="text-white view-user-datas">{userData.province}</div>
                        </div>

                        <div>
                            <label className="block view-user-labels text-[#AAAAAA] mb-[6px]">Business Sector</label>
                            <div className="text-white view-user-datas">{userData.businessSector}</div>
                        </div>

                        <div>
                            <label className="block view-user-labels text-[#AAAAAA] mb-[6px]">Department/Division</label>
                            <div className="text-white view-user-datas">{userData.department}</div>
                        </div>

                        <div>
                            <label className="block view-user-labels text-[#AAAAAA] mb-[6px]">Phone</label>
                            <div className="text-white view-user-datas">{userData.phone}</div>
                        </div>

                        <div>
                            <label className="block view-user-labels text-[#AAAAAA] mb-[6px]">Mobile Phone</label>
                            <div className="text-white view-user-datas">{userData.mobilePhone}</div>
                        </div>

                        <div>
                            <label className="block view-user-labels text-[#AAAAAA] mb-[6px]">Secret Question</label>
                            <div className="text-white view-user-datas">{userData.secretQuestion}</div>
                        </div>

                        <div>
                            <label className="block view-user-labels text-[#AAAAAA] mb-[6px]">Notes</label>
                            <div className="text-white view-user-datas">{userData.notes}</div>
                        </div>

                        <div>
                            <label className="block view-user-labels text-[#AAAAAA] mb-[6px]">Permissions</label>
                            <div className="text-white view-user-datas">{userData.permissions}</div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-[40px]">
                        {/* <div>
                            <label className="block view-user-labels text-[#AAAAAA] mb-[6px]">Password</label>
                            <div className="text-white view-user-datas">{userData.password}</div>
                        </div> */}

                        <div>
                            <label className="block view-user-labels text-[#AAAAAA] mb-[6px]">Gender</label>
                            <div className="text-white view-user-datas">{userData.gender}</div>
                        </div>

                        <div>
                            <label className="block view-user-labels text-[#AAAAAA] mb-[6px]">DOB</label>
                            <div className="text-white view-user-datas">{userData.dob}</div>
                        </div>

                        <div>
                            <label className="block view-user-labels text-[#AAAAAA] mb-[6px]">City</label>
                            <div className="text-white view-user-datas">{userData.city}</div>
                        </div>

                        <div>
                            <label className="block view-user-labels text-[#AAAAAA] mb-[6px]">Zip/P.O. Box</label>
                            <div className="text-white view-user-datas">{userData.zipCode}</div>
                        </div>

                        <div>
                            <label className="block view-user-labels text-[#AAAAAA] mb-[6px]">Country</label>
                            <div className="text-white view-user-datas">{userData.country}</div>
                        </div>

                        <div>
                            <label className="block view-user-labels text-[#AAAAAA] mb-[6px]">Email</label>
                            <div className="text-white view-user-datas">{userData.email}</div>
                        </div>

                        <div>
                            <label className="block view-user-labels text-[#AAAAAA] mb-[6px]">Office Phone</label>
                            <div className="text-white view-user-datas">{userData.officePhone}</div>
                        </div>

                        <div>
                            <label className="block view-user-labels text-[#AAAAAA] mb-[6px]">Fax</label>
                            <div className="text-white view-user-datas">{userData.fax}</div>
                        </div>

                        <div>
                            <label className="block view-user-labels text-[#AAAAAA] mb-[6px]">Answer</label>
                            <div className="text-white view-user-datas">{userData.answer}</div>
                        </div>

                        <div>
                            <label className="block view-user-labels text-[#AAAAAA] mb-[6px]">Status</label>
                            <div className="text-white view-user-datas">{userData.status}</div>
                        </div>

                        <div>
                            <label className="block view-user-labels text-[#AAAAAA] mb-[6px]">Logo</label>
                            <button className="text-[#1E84AF] flex items-center view-user-logo">
                                <span>{userData.logo}</span>
                                <Eye size={18} className="ml-2" />
                            </button>
                        </div>


                        <div className="flex space-x-16">
                            <div className='flex flex-col items-center'>
                                <label className="block view-user-labels text-[#AAAAAA] mb-[8px]">Edit</label>
                                <button className="flex items-center">
                                    <img src={edits} alt="Edit icon" className='w-[18px] h-[18px]' />
                                </button>
                            </div>
                            <div className='flex flex-col items-center'>
                                <label className="block view-user-labels text-[#AAAAAA] mb-[8px]">Delete</label>
                                <button className="flex items-center">
                                    <img src={deletes} alt="Delete icon" className='w-[18px] h-[18px]' />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QMSViewUser
