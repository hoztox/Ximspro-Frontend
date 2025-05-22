import React, { forwardRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import profile from "../../assets/images/Company-Navbar/profile.svg";
import "./notificationmenu.css";
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
    onClose,
    onNotificationRead
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
            const manualResponse = await axios.get(`${BASE_URL}/qms/count-notifications/${userId}/`);
            const procedureResponse = await axios.get(`${BASE_URL}/qms/procedure/count-notifications/${userId}/`);
            const conformityResponse = await axios.get(`${BASE_URL}/qms/conformity/count-notifications/${userId}/`);
            const carResponse = await axios.get(`${BASE_URL}/qms/car/count-notifications/${userId}/`);
            const preventiveResponse = await axios.get(`${BASE_URL}/qms/preventive/count-notifications/${userId}/`);
            const enaegy_reviewResponse = await axios.get(`${BASE_URL}/qms/energy-review/count-notifications/${userId}/`);
            const recordResponse = await axios.get(`${BASE_URL}/qms/record/count-notifications/${userId}/`);
            const complianceResponse = await axios.get(`${BASE_URL}/qms/compliances/count-notifications/${userId}/`);
            const interested_partyResponse = await axios.get(`${BASE_URL}/qms/interst/count-notifications/${userId}/`);
            const processResponse = await axios.get(`${BASE_URL}/qms/processes/count-notifications/${userId}/`);
            const legalResponse = await axios.get(`${BASE_URL}/qms/legal/count-notifications/${userId}/`);
            const evaluationResponse = await axios.get(`${BASE_URL}/qms/evaluation/count-notifications/${userId}/`);
            const changesResponse = await axios.get(`${BASE_URL}/qms/changes/count-notifications/${userId}/`);
            const sustainabilityResponse = await axios.get(`${BASE_URL}/qms/sustainability/count-notifications/${userId}/`);
            const trainingResponse = await axios.get(`${BASE_URL}/qms/training/count-notifications/${userId}/`);

            const totalUnread =
                manualResponse.data.unread_count +
                procedureResponse.data.unread_count +
                conformityResponse.data.unread_count +
                carResponse.data.unread_count +
                preventiveResponse.data.unread_count +
                enaegy_reviewResponse.data.unread_count +
                recordResponse.data.unread_count +
                complianceResponse.data.unread_count +
                interested_partyResponse.data.unread_count +
                processResponse.data.unread_count +
                legalResponse.data.unread_count +
                evaluationResponse.data.unread_count +
                changesResponse.data.unread_count +
                sustainabilityResponse.data.unread_count +
                trainingResponse.data.unread_count

            setUnreadCount(totalUnread);
        } catch (error) {
            console.error("Error fetching unread notification count:", error);
        }
    };

    const markNotificationAsRead = async (notificationId, type) => {
        try {
            let endpoint;
            if (type === 'manual') {
                endpoint = `${BASE_URL}/qms/notifications/${notificationId}/read/`;

            } else if (type === 'training') {
                endpoint = `${BASE_URL}/qms/training/notifications/${notificationId}/read/`;

            } else if (type === 'sustainability') {
                endpoint = `${BASE_URL}/qms/notifications-sustainability/${notificationId}/read/`;
            } else if (type === 'changes') {
                endpoint = `${BASE_URL}/qms/changes/notifications/${notificationId}/read/`;
            } else if (type === 'procedure') {
                endpoint = `${BASE_URL}/qms/notifications-procedure/${notificationId}/read/`;
            } else if (type === 'conformity') {
                endpoint = `${BASE_URL}/qms/conformity/notifications/${notificationId}/read/`;
            } else if (type === 'car') {
                endpoint = `${BASE_URL}/qms/car/notifications/${notificationId}/read/`;
            } else if (type === 'preventive') {
                endpoint = `${BASE_URL}/qms/preventive/notifications/${notificationId}/read/`;
            } else if (type === 'energy_review') {
                endpoint = `${BASE_URL}/qms/energy-review/notifications/${notificationId}/read/`;
            } else if (type === 'record') {
                endpoint = `${BASE_URL}/qms/notifications-record/${notificationId}/read/`;
            } else if (type === 'compliance') {
                endpoint = `${BASE_URL}/qms/compliances/notifications/${notificationId}/read/`;
            } else if (type === 'interested_party') {
                endpoint = `${BASE_URL}/qms/interst/notifications/${notificationId}/read/`;
            } else if (type === 'process') {
                endpoint = `${BASE_URL}/qms/processes/notifications/${notificationId}/read/`;
            } else if (type === 'legal') {
                endpoint = `${BASE_URL}/qms/legal/notifications/${notificationId}/read/`;
            } else if (type === 'evaluation') {
                endpoint = `${BASE_URL}/qms/notifications-evaluation/${notificationId}/read/`;
            } else {
                throw new Error(`Invalid notification type: ${type}`);
            }

            const response = await axios.patch(endpoint);
            return response.data;
        } catch (error) {
            console.error(`Error marking ${type} notification as read:`, error);
            return null;
        }
    };

    const handleView = async (notification) => {
        let notificationType, navigationUrl;

        if (notification.manual && notification.manual.id) {
            notificationType = 'manual';
            navigationUrl = `/company/qms/viewmanual/${notification.manual.id}`;
        } else if (notification.training && notification.training.id) {
            notificationType = 'training';
            navigationUrl = `/company/qms/view-training/${notification.training.id}`;

        } else if (notification.sustainability && notification.sustainability.id) {
            notificationType = 'sustainability';
            navigationUrl = `/company/qms/view-sustainability/${notification.sustainability.id}`;
        } else if (notification.changes && notification.changes.id) {
            notificationType = 'changes';
            navigationUrl = `/company/qms/view-management-change/${notification.changes.id}`;
        } else if (notification.procedure && notification.procedure.id) {
            notificationType = 'procedure';
            navigationUrl = `/company/qms/viewprocedure/${notification.procedure.id}`;
        } else if (notification.conformity && notification.conformity.id) {
            notificationType = 'conformity';
            navigationUrl = `/company/qms/view-nonconformity/${notification.conformity.id}`;
        } else if (notification.car && notification.car.id) {
            notificationType = 'car';
            navigationUrl = `/company/qms/view-correction-actions/${notification.car.id}`;
        } else if (notification.preventive && notification.preventive.id) {
            notificationType = 'preventive';
            navigationUrl = `/company/qms/view-preventive-actions/${notification.preventive.id}`;
        } else if (notification.record && notification.record.id) {
            notificationType = 'record';
            navigationUrl = `/company/qms/viewrecordformat/${notification.record.id}`;
        } else if (notification.compliance && notification.compliance.id) {
            notificationType = 'compliance';
            navigationUrl = `/company/qms/view-compliance/${notification.compliance.id}`;
        } else if (notification.interested_party && notification.interested_party.id) {
            notificationType = 'interested_party';
            navigationUrl = `/company/qms/view-interested-parties/${notification.interested_party.id}`;
        } else if (notification.interest && notification.interest.id) {
            // Handle the case where it's an interested party notification but stored in 'interest' field
            notificationType = 'interested_party';
            navigationUrl = `/company/qms/view-interested-parties/${notification.interest.id}`;
        } else if (notification.processes && notification.processes.id) {
            notificationType = 'process';
            navigationUrl = `/company/qms/view-processes/${notification.processes.id}`;

        } else if (notification.legal && notification.legal.id) {
            notificationType = 'legal';
            navigationUrl = `/company/qms/view-legal-requirements/${notification.legal.id}`;
        } else if (notification.evaluation && notification.evaluation.id) {
            notificationType = 'evaluation';
            navigationUrl = `/company/qms/view-evaluation-compliance/${notification.evaluation.id}`;

        } else if (notification.energy_review && notification.energy_review.id) {
            notificationType = 'energy_review';
            navigationUrl = `/company/qms/view-energy-review/${notification.energy_review.id}`;
        } else if (notification.notificationType === 'energy_review') {
            notificationType = 'energy_review';
            const energyReviewId = notification.energy_review?.id || notification.id;
            navigationUrl = `/company/qms/view-energy-review/${energyReviewId}`;

        } else {
            console.error("Invalid Notification: Missing required data", notification);
            console.log("Notification type:", notification.notificationType);
            console.log("Available fields:", Object.keys(notification));
            return;
        }

        try {
            await markNotificationAsRead(notification.id, notificationType);

            setNotifications(prev => ({
                ...prev,
                QMS: prev.QMS.map(n =>
                    n.id === notification.id
                        ? { ...n, is_read: true }
                        : n
                )
            }));

            if (!notification.is_read && onNotificationRead) {
                onNotificationRead();
            }

            navigate(navigationUrl);

            if (onClose) {
                onClose();
            }
        } catch (error) {
            console.error(`Error handling view for ${notificationType} notification:`, error);
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

                await fetchUnreadCount(user.user_id);

                const manualNotificationsPromise = axios.get(`${BASE_URL}/qms/notifications/${user.user_id}/`);
                const procedureNotificationsPromise = axios.get(`${BASE_URL}/qms/notifications-procedure/${user.user_id}/`);
                const conformityNotificationsPromise = axios.get(`${BASE_URL}/qms/conformity/notifications/${user.user_id}/`);
                const carNotificationsPromise = axios.get(`${BASE_URL}/qms/car/notifications/${user.user_id}/`);
                const preventiveNotificationsPromise = axios.get(`${BASE_URL}/qms/preventive/notifications/${user.user_id}/`);
                const energyReviewNotificationsPromise = axios.get(`${BASE_URL}/qms/energy-review/notifications/${user.user_id}/`);
                const recordNotificationsPromise = axios.get(`${BASE_URL}/qms/notifications-record/${user.user_id}/`);
                const complianceNotificationsPromise = axios.get(`${BASE_URL}/qms/compliances/notifications/${user.user_id}/`);
                const interested_partyNotificationsPromise = axios.get(`${BASE_URL}/qms/interst/notifications/${user.user_id}/`);
                const processNotificationsPromise = axios.get(`${BASE_URL}/qms/processes/notifications/${user.user_id}/`);
                const legalNotificationsPromise = axios.get(`${BASE_URL}/qms/legal/notifications/${user.user_id}/`);
                const evaluationNotificationsPromise = axios.get(`${BASE_URL}/qms/notifications-evaluation/${user.user_id}/`);
                const changesNotificationsPromise = axios.get(`${BASE_URL}/qms/changes/notifications/${user.user_id}/`);
                const sustainabilityNotificationsPromise = axios.get(`${BASE_URL}/qms/notifications-sustainability/${user.user_id}/`);
                const trainingNotificationsPromise = axios.get(`${BASE_URL}/qms/training/notifications/${user.user_id}/`);
                const meetingNotificationsPromise = axios.get(`${BASE_URL}/qms/meeting/count-notifications/${user.user_id}/`);

                const [manualResponse, meetingResponse, trainingResponse, sustainabilityResponse, changesResponse, legalResponse, evaluationResponse, procedureResponse, conformityResponse, carResponse, preventiveResponse, energyReviewResponse, recordResponse, complianceResponse, interested_partyResponse, processResponse] = await Promise.all([
                    manualNotificationsPromise,
                    procedureNotificationsPromise,
                    conformityNotificationsPromise,
                    carNotificationsPromise,
                    preventiveNotificationsPromise,
                    energyReviewNotificationsPromise,
                    recordNotificationsPromise,
                    complianceNotificationsPromise,
                    interested_partyNotificationsPromise,
                    processNotificationsPromise,
                    legalNotificationsPromise,
                    evaluationNotificationsPromise,
                    changesNotificationsPromise,
                    sustainabilityNotificationsPromise,
                    trainingNotificationsPromise,
                    meetingNotificationsPromise
                ]);

                const meetingNotifications = meetingResponse.data.map(notification => ({
                    ...notification,
                    notificationType: 'meeting'
                }));
                const trainingNotifications = trainingResponse.data.map(notification => ({
                    ...notification,
                    notificationType: 'training'
                }));
                const sustainabilityNotifications = sustainabilityResponse.data.map(notification => ({
                    ...notification,
                    notificationType: 'sustainability'
                }));
                const changesNotifications = changesResponse.data.map(notification => ({
                    ...notification,
                    notificationType: 'changes'
                }));
                const evaluationNotifications = evaluationResponse.data.map(notification => ({
                    ...notification,
                    notificationType: 'evaluation'
                }));
                const manualNotifications = manualResponse.data.map(notification => ({
                    ...notification,
                    notificationType: 'manual'
                }));
                const legalNotifications = legalResponse.data.map(notification => ({
                    ...notification,
                    notificationType: 'legal'
                }));

                const interested_partyNotifications = interested_partyResponse.data.map(notification => ({
                    ...notification,
                    notificationType: 'interested_party'

                }));
                const complianceNotifications = complianceResponse.data.map(notification => ({
                    ...notification,
                    notificationType: 'compliance'
                }));
                const procedureNotifications = procedureResponse.data.map(notification => ({
                    ...notification,
                    notificationType: 'procedure'
                }));
                const recordNotifications = recordResponse.data.map(notification => ({
                    ...notification,
                    notificationType: 'record'
                }));
                const conformityNotifications = conformityResponse.data.map(notification => ({
                    ...notification,
                    notificationType: 'conformity'
                }));
                const processNotifications = processResponse.data.map(notification => ({
                    ...notification,
                    notificationType: 'process'
                }));

                const carNotifications = carResponse.data.map(notification => ({
                    ...notification,
                    notificationType: 'car',
                    car: notification.carnumber || {}
                }));

                const preventiveNotifications = preventiveResponse.data.map(notification => ({
                    ...notification,
                    notificationType: 'preventive',
                    preventive: notification.preventivenumber || notification.preventive || notification.preventive_action || {}
                }));

                const energyReviewNotifications = energyReviewResponse.data.map(notification => ({
                    ...notification,
                    notificationType: 'energy_review',
                    energy_review: notification.energy_review || {}
                }));

                const combinedNotifications = [
                    ...manualNotifications,
                    ...procedureNotifications,
                    ...conformityNotifications,
                    ...carNotifications,
                    ...preventiveNotifications,
                    ...energyReviewNotifications,
                    ...recordNotifications,
                    ...complianceNotifications,
                    ...interested_partyNotifications,
                    ...processNotifications,
                    ...legalNotifications,
                    ...evaluationNotifications,
                    ...changesNotifications,
                    ...sustainabilityNotifications,
                    ...trainingNotifications,
                    ...meetingNotifications

                ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

                setNotifications(prev => ({
                    ...prev,
                    QMS: combinedNotifications,
                    energy_review: energyReviewNotifications
                }));

                if (onNotificationsUpdate) {
                    onNotificationsUpdate(prev => ({
                        ...prev,
                        QMS: combinedNotifications,
                        energy_review: energyReviewNotifications
                    }));
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
                setNotifications(prev => ({
                    ...prev,
                    QMS: [],
                    energy_review: []
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
    };

    const renderNotificationItem = (notification) => {
        let notificationType = 'Unknown';

        if (notification.notificationType === 'manual') {
            notificationType = 'Manual';
        } else if (notification.notificationType === 'meeting') {
            notificationType = 'meeting';
        } else if (notification.notificationType === 'training') {
            notificationType = 'training';
        } else if (notification.notificationType === 'sustainability') {
            notificationType = 'sustainability';
        } else if (notification.notificationType === 'changes') {
            notificationType = 'changes';
        } else if (notification.notificationType === 'procedure') {
            notificationType = 'Procedure';
        } else if (notification.notificationType === 'conformity') {
            notificationType = 'Conformity';
        } else if (notification.notificationType === 'car') {
            notificationType = 'CAR';
        } else if (notification.notificationType === 'preventive') {
            notificationType = 'Preventive';
        } else if (notification.notificationType === 'energy_review') {
            notificationType = 'Energy Review';
        } else if (notification.notificationType === 'record') {
            notificationType = 'Record';
        } else if (notification.notificationType === 'compliance') {
            notificationType = 'Compliance';
        } else if (notification.notificationType === 'interested_party') {
            notificationType = 'Interested Party';
        } else if (notification.notificationType === 'process') {
            notificationType = 'Process';
        } else if (notification.notificationType === 'legal') {
            notificationType = 'legal';
        }

        return (
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
                        <h2 className="notification-title pb-[2px]">
                            {notification.title}
                            <span className="ml-2 text-xs text-gray-400">
                                [{notificationType}]
                            </span>
                        </h2>
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
    };

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
                            No {activeTab} Notifications
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
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