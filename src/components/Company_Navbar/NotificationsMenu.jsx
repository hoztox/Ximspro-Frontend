import React, { forwardRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import profile from "../../assets/images/Company-Navbar/profile.svg"
import "./notificationmenu.css"
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { BASE_URL } from "../../Utils/Config";

const TABS = [
    { name: 'QMS', activeColor: 'border-[#858585] text-[#858585]' },
    { name: 'EMS', activeColor: 'border-[#38E76C] text-[#38E76C]' },
    { name: 'OHS', activeColor: 'border-[#F9291F] text-[#F9291F]' },
    { name: 'EnMS', activeColor: 'border-[#10B8FF] text-[#10B8FF]' },
    { name: 'BMS', activeColor: 'border-[#F310FF] text-[#F310FF]' },
    { name: 'AMS', activeColor: 'border-[#DD6B06] text-[#DD6B06]' },
    { name: 'IMS', activeColor: 'border-[#CBA301] text-[#CBA301]' }
];

const NotificationsMenu = forwardRef(({
    onNotificationsUpdate,
    onClose
}, ref) => {
    const [activeTab, setActiveTab] = useState('QMS');
    const [notifications, setNotifications] = useState({
        QMS: [],
        EMS: [],
        OHS: [],
        EnMS: [],
        BMS: [],
        AMS: [],
        IMS: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);

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
                companyData.company_name = localStorage.getItem('company_name');
                companyData.email_address = localStorage.getItem('email_address');

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

    const fetchUnreadCount = async (userId) => {
        try {
            const response = await axios.get(`${BASE_URL}/qms/count-notifications/${userId}/`);
            setUnreadCount(response.data.unread_count);
        } catch (error) {
            console.error("Error fetching unread notification count:", error);
        }
    };

    const markNotificationAsRead = async (notificationId) => {
        try {
            const response = await axios.patch(
                `${BASE_URL}/qms/notifications/${notificationId}/read/`
            );
            return response.data; 
        } catch (error) {
            console.error("Error marking notification as read:", error);
            return null;
        }
    };

    const handleView = async (notification) => {
        if (notification.manual && notification.manual.id) {
        
            const updatedNotification = await markNotificationAsRead(notification.id);
            
      
            setNotifications(prev => ({
                ...prev,
                QMS: prev.QMS.map(n => 
                    n.id === notification.id 
                        ? { ...n, is_read: true } 
                        : n
                )
            }));

         
            navigate(`/company/qms/viewmanual/${notification.manual.id}`);
            if (onClose) {
                onClose();
            }
        } else {
            console.error("Invalid Notification or Manual ID:", notification);
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

                // Fetch unread count
                await fetchUnreadCount(user.user_id);

                const response = await axios.get(`${BASE_URL}/qms/notifications/${user.user_id}/`);
                console.log("Notifications Response:", response.data);

                setNotifications(prev => ({
                    ...prev,
                    QMS: response.data
                }));

                if (onNotificationsUpdate) {
                    onNotificationsUpdate(prev => ({
                        ...prev,
                        QMS: response.data
                    }));
                }
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
    }, [onNotificationsUpdate]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleViewAll = () => {
        navigate('/company/notifications');
        if (onClose) {
            onClose();
        }
    }

    const renderNotificationItem = (notification) => (
        <motion.div
            key={notification.id}
            initial={{ opacity: 1, y: 1 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center justify-between p-5 ${notification.is_read ? 'bg-[#1a1a22]' : 'bg-[#24242D] hover:bg-[#1a1a22]'} h-[108px] cursor-pointer border-b border-[#383840] last:border-b-0`}
        >
            <div className='flex items-start w-[81%]'>
                <img
                    src={profile}
                    alt="User"
                    className="w-10 h-10 rounded-full mr-[20px]"
                />
                <div className="flex-grow">
                    <h2 className="notification-title pb-[2px]">{notification.title}</h2>
                    <p className="notification-description pb-[3px]">{notification.message}</p>
                    <span className="notification-time">
                        {new Date(notification.created_at).toLocaleString()}
                    </span>
                </div>
            </div>
            <div className='h-[108px] py-5 flex items-end'>
                <button
                    className="click-view-btn duration-100"
                    onClick={() => handleView(notification)}
                >
                    Click to view
                </button>
            </div>
        </motion.div>
    );

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 20
            }}
            className="fixed top-[100px] right-5 w-[453px] bg-[#1C1C24] rounded-md overflow-hidden border border-[#383840] z-50"
        >
            <h2 className='notification-head'>Notifications</h2>
            {/* Tabs */}
            <div className="flex justify-between pl-5 pr-12 border-b border-[#383840]">
                {TABS.map(tab => {
                    const isActive = activeTab === tab.name;
                    return (
                        <button
                            key={tab.name}
                            onClick={() => handleTabChange(tab.name)}
                            className={`flex notification-tabs pb-1 ${isActive
                                ? `${tab.activeColor} border-b-2`
                                : 'text-white'
                                }`}
                        >
                            {tab.name}
                            {tab.name === 'QMS' && unreadCount > 0 && (
                                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto text-white">
                <AnimatePresence>
                    {isLoading ? (
                        <motion.div
                            className="text-center py-4 no-notification"
                        >
                            Loading Notifications...
                        </motion.div>
                    ) : notifications[activeTab].length > 0 ? (
                        notifications[activeTab].map(renderNotificationItem)
                    ) : (
                        <motion.div
                            className="text-center py-4 no-notification"
                        >
                            No QMS Notifications
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* View All Button - Only show if notifications exist */}
            {notifications[activeTab].length > 0 && (
                <div
                    className="px-5 h-[74px] flex items-center justify-end border-t border-[#383840]"
                >
                    <button
                        className="text-[#1E84AF] view-all-btn border rounded-md border-[#1E84AF] w-[108px] h-[34px] duration-200"
                        onClick={handleViewAll}
                    >
                        View All
                    </button>
                </div>
            )}
        </motion.div>
    );
});

export default NotificationsMenu;