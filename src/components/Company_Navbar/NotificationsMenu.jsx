import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import profile from "../../assets/images/Company-Navbar/profile.svg"
import "./notificationmenu.css"

// Notification tabs with their unique colors
const TABS = [
    { name: 'QMS', activeColor: 'border-[#858585] text-[#858585]' },
    { name: 'EMS', activeColor: 'border-[#38E76C] text-[#38E76C]' },
    { name: 'OHS', activeColor: 'border-[#F9291F] text-[#F9291F]' },
    { name: 'EnMS', activeColor: 'border-[#10B8FF] text-[#10B8FF]' },
    { name: 'BMS', activeColor: 'border-[#F310FF] text-[#F310FF]' },
    { name: 'AMS', activeColor: 'border-[#DD6B06] text-[#DD6B06]' },
    { name: 'IMS', activeColor: 'border-[#CBA301] text-[#CBA301]' }
];

const NotificationsMenu = ({ 
  initialNotifications, 
  onNotificationsUpdate 
}) => {
    const [activeTab, setActiveTab] = useState('QMS'); // Default active tab
    const [notifications, setNotifications] = useState(initialNotifications);

    // Use effect to notify parent component about notifications
    useEffect(() => {
        if (onNotificationsUpdate) {
            onNotificationsUpdate(notifications);
        }
    }, [notifications, onNotificationsUpdate]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const renderNotificationItem = (notification) => (
        <motion.div
            key={notification.id}
            initial={{ opacity: 1, y: 1 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between p-5 bg-[#24242D] hover:bg-[#1a1a22] h-[108px] cursor-pointer border-b border-[#383840] last:border-b-0"
        >
            <div className='flex items-start'>
                <img
                    src={profile}
                    alt="User"
                    className="w-10 h-10 rounded-full mr-[20px]"
                />
                <div className="flex-grow">
                    <h2 className="notification-title pb-[2px]">{notification.title}</h2>
                    <p className="notification-description pb-[3px]">{notification.description}</p>
                    <span className="notification-time">{notification.timestamp}</span>
                </div>
            </div>
            <div className='h-[108px] py-5 flex items-end'>
                <button className="click-view-btn duration-100">Click to view</button>
            </div>
        </motion.div>
    );

    return (
        <motion.div
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
                        </button>
                    );
                })}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto text-white">
                <AnimatePresence>
                    {notifications[activeTab].length > 0 ? (
                        notifications[activeTab].map(renderNotificationItem)
                    ) : (
                        <motion.div
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 1 }}
                            className="text-center py-4 no-notification"
                        >
                            No Notifications
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* View All Button - Only show if notifications exist */}
            {notifications[activeTab].length > 0 && (
                <div
                    className="px-5 h-[74px] flex items-center justify-end border-t border-[#383840]"
                >
                    <button className="text-[#1E84AF] view-all-btn border rounded-md border-[#1E84AF] w-[108px] h-[34px] duration-200">View All</button>
                </div>
            )}
        </motion.div>
    );
};

export default NotificationsMenu;