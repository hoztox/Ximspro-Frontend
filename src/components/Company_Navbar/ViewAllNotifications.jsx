import React, { useState } from 'react';
import profile from "../../assets/images/Company-Navbar/profile.svg";
import "./viewallnotifications.css";

const NotificationItem = ({ statusStages = [], notificationDetails = {} }) => {
  return (
    <div className="bg-[#24242D] p-5 rounded-md flex flex-col md:flex-row items-center justify-between mb-5 last:mb-0">
      {/* Profile Image and Notification Details */}
      <div className='flex gap-4'>
        <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center">
          <img src={profile} alt="" />
        </div>

        <div className="flex-grow">
          <div className="notification-title mb-[6px]">{notificationDetails.title}</div>
          <div className="notification-description mb-1">{notificationDetails.description}</div>
          <div className="notification-description mb-1">Section Name/Title: {notificationDetails.sectionName}</div>
          <div className="notification-description mb-1">Section Number: {notificationDetails.sectionNumber}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full md:w-[45%] relative">
        <div className="absolute top-2 left-0 right-0 z-0 flex justify-between w-full px-[50px]">
          {statusStages.map((stage, index) => {
            // Set segment color based on previous step completion
            const isPrevCompleted = index > 0 && statusStages[index - 0].completed;
            const segmentColor = isPrevCompleted ? 'border-[#38E76C]' : 'border-[#D9D9D9]';

            return (
              index !== 0 && (
                <div key={index} className={`w-full h-[2px] border-t-2 border-dashed ${segmentColor}`}></div>
              )
            );
          })}
        </div>

        {/* Stages Container */}
        <div className="relative flex justify-between items-center">
          {statusStages.map((stage, index) => (
            <div key={stage.status} className="flex flex-col items-center z-10">
              {/* Status Point */}
              <div
                className={`w-3 h-3 mt-[2px] rounded-full border-4 ${stage.completed ? 'bg-[#38E76C] border-[#38E76C]' : 'bg-[#D9D9D9] border-[#D9D9D9]'
                  }`}
              ></div>

              {/* Stage Details */}
              <div className="text-center mt-[10px]">
                <div className="notification-status mb-1">{stage.status}</div>
                <div className="notification-status-user mb-1">{stage.user}</div>
                <div className="notification-status-timestamp">{stage.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View Button */}
      <button className="rounded px-[10px] w-[88px] h-[30px] notification-click-view whitespace-nowrap duration-200">
        Click to view
      </button>
    </div>
  );
};


const ViewAllNotifications = ({
  tabs = [
    { name: 'QMS', borderColor: 'border-[#858585]', textColor: 'text-[#858585]' },
    { name: 'EMS', borderColor: 'border-[#38E76C]', textColor: 'text-[#38E76C]' },
    { name: 'OHS', borderColor: 'border-[#F9291F]', textColor: 'text-[#F9291F]' },
    { name: 'EnMS', borderColor: 'border-[#10B8FF]', textColor: 'text-[#10B8FF]' },
    { name: 'BMS', borderColor: 'border-[#F310FF]', textColor: 'text-[#F310FF]' },
    { name: 'AMS', borderColor: 'border-[#DD6B06]', textColor: 'text-[#DD6B06]' },
    { name: 'IMS', borderColor: 'border-[#CBA301]', textColor: 'text-[#CBA301]' }
  ],
  notifications = {
    'QMS': [
      {
        statusStages: [
          { status: 'Written By', user: 'User A', timestamp: '20-04-2025 06:30am', completed: true },
          { status: 'Checked By', user: 'User B', timestamp: '20-04-2025 09:30am', completed: true },
          { status: 'Approved By', user: 'User D', timestamp: '20-04-2025 09:30am', completed: false }
        ],
        notificationDetails: {
          title: 'Notification for Checking/Review',
          description: 'User A has created a manual. Please review it.',
          sectionName: 'Quality Procedures',
          sectionNumber: 'QMS-001'
        }
      },
      {
        statusStages: [
          { status: 'Written By', user: 'User A', timestamp: '20-04-2025 06:30am', completed: true },
          { status: 'Checked By', user: 'User B', timestamp: '20-04-2025 09:30am', completed: true },
          { status: 'Approved By', user: 'User D', timestamp: '20-04-2025 09:30am', completed: true }
        ],
        notificationDetails: {
          title: 'Notification for Checking/Review',
          description: 'User A has created a manual. Please review it.',
          sectionName: 'Quality Procedures',
          sectionNumber: 'QMS-002'
        }
      },
    ],
    'EMS': [
      {
        statusStages: [
          { status: 'Written By', user: 'User E', timestamp: '15-04-2025 02:45pm', completed: true },
          { status: 'Checked By', user: 'User F', timestamp: '17-04-2025 03:15pm', completed: true },
          { status: 'Approved By', user: 'User G', timestamp: '19-04-2025 04:00pm', completed: false }
        ],
        notificationDetails: {
          title: 'Environmental Impact Assessment',
          description: 'New environmental report requires approval.',
          sectionName: 'Sustainability Initiatives',
          sectionNumber: 'EMS-101'
        }
      }
    ],
    'OHS': [],
    'EnMS': [],
    'BMS': [],
    'AMS': [],
    'IMS': []
  }
}) => {
  const [activeTab, setActiveTab] = useState(tabs[0].name);

  return (
    <div className="bg-[#1C1C24] p-5 rounded-md">
      <div>
        <div className='flex justify-between mb-5'>
          <div>
            <h1 className='notifications-head'>Notifications</h1>
          </div>
          <div className="flex space-x-[23px]">
            {tabs.map((tab) => (
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

        {/* Notification Items or No Notifications Message */}
        {notifications[activeTab].length > 0 ? (
          notifications[activeTab].map((notification, index) => (
            <NotificationItem
              key={index}
              statusStages={notification.statusStages}
              notificationDetails={notification.notificationDetails}
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