import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import profile from "../../assets/images/Company-Navbar/profile.svg";
import { BASE_URL } from "../../Utils/Config";
import "./viewallnotifications.css";

const TABS = [
    { name: 'QMS', borderColor: 'border-[#858585]', textColor: 'text-[#858585]' },
    { name: 'EMS', borderColor: 'border-[#38E76C]', textColor: 'text-[#38E76C]' },
    { name: 'OHS', borderColor: 'border-[#F9291F]', textColor: 'text-[#F9291F]' },
    { name: 'EnMS', borderColor: 'border-[#10B8FF]', textColor: 'text-[#10B8FF]' },
    { name: 'BMS', borderColor: 'border-[#F310FF]', textColor: 'text-[#F310FF]' },
    { name: 'AMS', borderColor: 'border-[#DD6B06]', textColor: 'text-[#DD6B06]' },
    { name: 'IMS', borderColor: 'border-[#CBA301]', textColor: 'text-[#CBA301]' }
];

const NotificationItem = ({ notification, onView }) => {
    const formatUser = (userId) => {
        // You might want to replace this with actual user name fetching logic
        return `User ${userId}`;
    };

    const getStatusStages = (manual) => {
        const formatDate = (dateString) => 
            dateString ? new Date(dateString).toLocaleString() : 'N/A';

        return [
            {
                status: 'Written By',
                user: formatUser(manual.written_by),
                timestamp: formatDate(manual.written_at),
                completed: !!manual.written_at
            },
            {
                status: 'Checked By',
                user: formatUser(manual.checked_by),
                timestamp: formatDate(manual.checked_at),
                completed: !!manual.checked_at
            },
            {
                status: 'Approved By',
                user: formatUser(manual.approved_by),
                timestamp: formatDate(manual.approved_at),
                completed: !!manual.approved_at
            }
        ];
    };

    const statusStages = getStatusStages(notification.manual);

    return (
        <div className="bg-[#24242D] p-5 rounded-md flex flex-col md:flex-row items-center justify-between mb-5 last:mb-0">
            {/* Profile and Notification Details */}
            <div className='flex gap-4 w-[33%] xl:w-[28%]'>
                <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center">
                    <img src={profile} alt="" />
                </div>
                <div className="flex-grow">
                    <div className="notification-title mb-[6px]">{notification.title}</div>
                    <div className="notification-description mb-1">{notification.message}</div>
                    <div className="notification-description mb-1">
                        Section Name/Title: {notification.manual.title}
                    </div>
                    <div className="notification-description mb-1">
                        Section Number: {notification.manual.no}
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full md:w-[45%] relative">
                {/* Dashed Line Background */}
                <div className="absolute top-2 left-0 right-0 z-0 flex justify-between w-full pl-[50px] pr-[44px]">
                    {statusStages.slice(1).map((stage, index) => {
                        const segmentColor = 
                            statusStages[index].completed 
                            ? 'border-[#38E76C]' 
                            : 'border-[#D9D9D9]';
                        
                        return (
                            <div 
                                key={index} 
                                className={`w-full h-[2px] border-t-2 border-dashed ${segmentColor}`}
                            ></div>
                        );
                    })}
                </div>

                {/* Stages Container */}
                <div className="relative flex justify-between items-center">
                    {statusStages.map((stage, index) => {
                        const shouldHighlight = 
                            (index === 0 && stage.completed) ||
                            (index === 1 && stage.completed) ||
                            (index === 2 && stage.completed);

                        return (
                            <div key={stage.status} className="flex flex-col items-center z-10">
                                {/* Status Point */}
                                <div
                                    className={`w-3 h-3 mt-[2px] rounded-full border-4 ${
                                        shouldHighlight
                                        ? 'bg-[#38E76C] border-[#38E76C]' 
                                        : 'bg-[#D9D9D9] border-[#D9D9D9]'
                                    }`}
                                ></div>
                                {/* Stage Details */}
                                <div className="text-center mt-[10px]">
                                    <div className="notification-status mb-1">{stage.status}</div>
                                    <div className="notification-status-user mb-1">{stage.user}</div>
                                    <div className="notification-status-timestamp">{stage.timestamp}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* View Button */}
            <button 
                className="rounded px-[10px] w-[88px] h-[30px] notification-click-view whitespace-nowrap duration-200"
                onClick={() => onView(notification.manual.id)}
            >
                Click to view
            </button>
        </div>
    );
};

const ViewAllNotifications = () => {
    const [activeTab, setActiveTab] = useState('QMS');
    const [notifications, setNotifications] = useState({
        QMS: [], EMS: [], OHS: [], EnMS: [], BMS: [], AMS: [], IMS: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const getCurrentUser = () => {
        const role = localStorage.getItem('role');

        try {
            if (role === 'company') {
                const companyData = {};
                Object.keys(localStorage)
                    .filter(key => key.startsWith('company_'))
                    .forEach(key => {
                        const cleanKey = key.replace('company_', '');
                        try {
                            companyData[cleanKey] = JSON.parse(localStorage.getItem(key));
                        } catch (e) {
                            companyData[cleanKey] = localStorage.getItem(key);
                        }
                    });

                companyData.role = role;
                companyData.company_id = localStorage.getItem('company_id');
                return companyData;
            } else if (role === 'user') {
                const userData = {};
                Object.keys(localStorage)
                    .filter(key => key.startsWith('user_'))
                    .forEach(key => {
                        const cleanKey = key.replace('user_', '');
                        try {
                            userData[cleanKey] = JSON.parse(localStorage.getItem(key));
                        } catch (e) {
                            userData[cleanKey] = localStorage.getItem(key);
                        }
                    });

                userData.role = role;
                userData.user_id = localStorage.getItem('user_id');
                return userData;
            }
        } catch (error) {
            console.error("Error retrieving user data:", error);
            return null;
        }
    };

    const handleView = (manualId) => {
        if (manualId && (typeof manualId === "string" || typeof manualId === "number")) {
            navigate(`/company/qms/viewmanual/${manualId}`);
        } else {
            console.error("Invalid Manual ID:", manualId);
        }
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setIsLoading(true);

                const user = getCurrentUser();
                if (!user || !user.user_id) {
                    console.error("User not found or not logged in");
                    return;
                }

                const response = await axios.get(`${BASE_URL}/qms/notifications/${user.user_id}/`);
                console.log("Notifications Response:", response.data);

                // Group notifications by their type (currently defaulting to QMS)
                const groupedNotifications = {
                    QMS: response.data,
                    EMS: [],
                    OHS: [],
                    EnMS: [],
                    BMS: [],
                    AMS: [],
                    IMS: []
                };

                setNotifications(groupedNotifications);
            } catch (error) {
                console.error("Error fetching notifications:", error);
                setNotifications(prev => ({
                    ...prev,
                    QMS: []
                }));
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    return (
        <div className="bg-[#1C1C24] p-5 rounded-md">
            <div>
                <div className='flex justify-between mb-5'>
                    <div>
                        <h1 className='notifications-head'>Notifications</h1>
                    </div>
                    <div className="flex space-x-[23px]">
                        {TABS.map((tab) => (
                            <button
                                key={tab.name}
                                className={`notifications-tabs pb-1 
                                    ${activeTab === tab.name 
                                        ? `${tab.borderColor} ${tab.textColor} border-b-2` 
                                        : 'text-white'
                                    }`}
                                onClick={() => setActiveTab(tab.name)}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </div>
                </div>
            
                {isLoading ? (
                    <div className="no-notification text-center py-10">
                        Loading Notifications...
                    </div>
                ) : notifications[activeTab].length > 0 ? (
                    notifications[activeTab].map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onView={handleView}
                        />
                    ))
                ) : (
                    <div className="no-notification text-center py-10">
                        No Notifications
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewAllNotifications;