import React from 'react'
import policy from "../../../../assets/images/Company-Sidebar/policy.svg";
import manual from "../../../../assets/images/Company-Sidebar/manual.svg";
import procedure from "../../../../assets/images/Company-Sidebar/manual.svg";
import record from "../../../../assets/images/Company-Sidebar/record-format.svg";
import parties from "../../../../assets/images/Company-Sidebar/interested parties.svg";
import { useNavigate, useLocation } from "react-router-dom";

const CustomerManagementSubmenu = (props) => {
    const navigate = useNavigate();
    const location = useLocation();

    const categories = [
        {
            id: "add-customer ",
            label: "Add Customer ",
            icon: <img src={policy} alt="Policy" className="w-[15px] h-[15px]" />,
            path: "/company/qms/add-customer",
        },
        {
            id: "list-customer",
            label: "List Customer",
            icon: <img src={manual} alt="Manual" className="w-[15px] h-[15px]" />,
            path: "/company/qms/list-customer",
            relatedPaths: [
                "/company/qms/edit-customer",
                "/company/qms/view-customer",
                "/company/qms/draft-customer",
                "/company/qms/edit-draft-customer",
                "/company/qms/view-draft-customer",
            ]
        },
        {
            id: "add-complaints-feedback",
            label: "Add Complaints and Feedback",
            icon: (
                <img src={procedure} alt="Procedure" className="w-[15px] h-[15px]" />
            ),
            path: "/company/qms/add-complaints",
        },
        {
            id: "list-complaints-feedback",
            label: "List Complaints and Feedback",
            icon: (
                <img src={record} alt="Record Format" className="w-[15px] h-[15px]" />
            ),
            path: "/company/qms/list-complaints",
            relatedPaths: [
                "/company/qms/edit-complaints",
                "/company/qms/view-complaints",
                "/company/qms/draft-complaints",
                "/company/qms/edit-draft-complaints",
                "/company/qms/view-draft-complaints",
            ]
        },
        {
            id: "customer-satisfaction-survey",
            label: "Customer Satisfaction Survey",
            icon: (
                <img
                    src={parties}
                    alt="Interested Parties"
                    className="w-[15px] h-[15px]"
                />
            ),
            path: "/company/qms/list-customer-survey",
            relatedPaths: [
                "/company/qms/add-customer-survey",
                "/company/qms/edits-customer-survey",
                "/company/qms/view-customer-survey",
                "/company/qms/drafts-customer-survey",
                "/company/qms/edit-draft-customer-survey",
                "/company/qms/view-draft-customer-survey",
            ]
        },
    ]

    const isActive = (category) => {
        const currentPath = location.pathname;
        return currentPath === category.path ||
            (category.relatedPaths &&
                category.relatedPaths.some(path => currentPath.startsWith(path)));
    };

    const handleCategoryClick = (category) => {
        if (props && props.handleItemClick) {
            props.handleItemClick(category.id, category.path, "qmscustomermanagement");
        } else {
            navigate(category.path);
        }
    };
    return (
        <div className="grid grid-cols-3 gap-[10px] bg-[#1C1C24] p-5 w-[555px] absolute top-16 border-t border-r border-b border-[#383840]">
            {categories.map((category) => {
                const active = isActive(category);
                return (
                    <div
                        key={category.id}
                        className="flex flex-col items-center justify-center py-[10px] rounded-md bg-[#85858515] transition-colors duration-200 cursor-pointer h-[100px] gap-[10px] documentation-submenu-cards"
                        onClick={() => handleCategoryClick(category)}
                    >
                        <div className="bg-[#5B5B5B] rounded-full p-[5px] w-[26px] h-[26px] flex justify-center items-center">
                            {category.icon}
                        </div>
                        <span
                            className={`text-center ${active ? "text-white" : "text-[#5B5B5B]"
                                } documentation-submenu-label duration-200`}
                        >
                            {category.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default CustomerManagementSubmenu
