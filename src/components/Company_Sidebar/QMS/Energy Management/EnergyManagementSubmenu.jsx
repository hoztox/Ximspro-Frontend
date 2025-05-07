import React from 'react'
import policy from "../../../../assets/images/Company-Sidebar/policy.svg";
import manual from "../../../../assets/images/Company-Sidebar/manual.svg";
import procedure from "../../../../assets/images/Company-Sidebar/manual.svg";
import record from "../../../../assets/images/Company-Sidebar/record-format.svg";
import parties from "../../../../assets/images/Company-Sidebar/interested parties.svg";
import { useNavigate, useLocation } from "react-router-dom";

const EnergyManagementSubmenu = (props) => {
    const navigate = useNavigate();
    const location = useLocation();

    const categories = [
        {
            id: "energy-review",
            label: "Energy Review",
            icon: <img src={policy} alt="Policy" className="w-[15px] h-[15px]" />,
            path: "/company/qms/list-energy-review",
            relatedPaths: [
                "/company/qms/add-energy-review",
                "/company/qms/edit-energy-review",
                "/company/qms/view-energy-review",
                "/company/qms/draft-energy-review",
                "/company/qms/edit-draft-energy-review",
                "/company/qms/view-draft-energy-review",
            ]
        },
        {
            id: "energy-baselines",
            label: "Energy Baselines",
            icon: <img src={manual} alt="Manual" className="w-[15px] h-[15px]" />,
            path: "/company/qms/list-energy-baselines",
            relatedPaths: [
                "/company/qms/add-energy-baselines",
                "/company/qms/edit-energy-baselines",
                "/company/qms/view-energy-baselines",
                "/company/qms/draft-energy-baselines",
                "/company/qms/edit-draft-energy-baselines",
                "/company/qms/view-draft-energy-baselines",
            ]
        },
        {
            id: "significants-energy-use-and-consumptions",
            label: "Significants Energy Use and Consumptions",
            icon: (
                <img src={procedure} alt="Procedure" className="w-[15px] h-[15px]" />
            ),
            path: "/company/qms/list-significant-energy",
            relatedPaths: [
                "/company/qms/add-significant-energy",
                "/company/qms/edit-significant-energy",
                "/company/qms/view-significant-energy",
                "/company/qms/draft-significant-energy",
                "/company/qms/edit-draft-significant-energy",
                "/company/qms/view-draft-significant-energy",
            ]
        },
        {
            id: "energy-improvement-opportunities",
            label: "Energy Improvement Opportunities",
            icon: (
                <img src={record} alt="Record Format" className="w-[15px] h-[15px]" />
            ),
            path: "/company/qms/list-energy-improvement-opportunities",
            relatedPaths: [
                "/company/qms/add-energy-improvement-opportunities",
                "/company/qms/edit-energy-improvement-opportunities",
                "/company/qms/view-energy-improvement-opportunities",
                "/company/qms/draft-energy-improvement-opportunities",
                "/company/qms/edit-draft-energy-improvement-opportunities",
                "/company/qms/view-draft-energy-improvement-opportunities",
            ]
        },
        {
            id: "energy-action-plans",
            label: "Energy Action Plans",
            icon: (
                <img src={parties} alt="Interested Parties" className="w-[15px] h-[15px]" />
            ),
            path: "/company/qms/list-energy-action-plan",
            relatedPaths: [
                // "/company/qms/add-energy-improvement-opportunities",
                // "/company/qms/edit-energy-improvement-opportunities",
                // "/company/qms/view-energy-improvement-opportunities",
                // "/company/qms/draft-energy-improvement-opportunities",
                // "/company/qms/edit-draft-energy-improvement-opportunities",
                // "/company/qms/view-draft-energy-improvement-opportunities",
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
            props.handleItemClick(category.id, category.path, "qmsenergymanagement");
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

export default EnergyManagementSubmenu
