import React from "react";
import policy from "../../../../assets/images/Company-Sidebar/policy.svg";
import manual from "../../../../assets/images/Company-Sidebar/manual.svg";
import procedure from "../../../../assets/images/Company-Sidebar/manual.svg";
import record from "../../../../assets/images/Company-Sidebar/record-format.svg";
import parties from "../../../../assets/images/Company-Sidebar/interested parties.svg";
import process from "../../../../assets/images/Company-Sidebar/interested parties.svg";
import scope from "../../../../assets/images/Company-Sidebar/record-format.svg";
import { useNavigate, useLocation } from "react-router-dom";

const RiskOpportunitiesSubmenu = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const categories = [
    {
      id: "environmantal-aspect",
      label: "Environmantal Aspect",
      icon: <img src={policy} alt="Policy" className="w-[15px] h-[15px]" />,
      path: "/company/qms/list-environmantal-aspect",
      relatedPaths: [
        "/company/qms/add-environmantal-aspect",
        "/company/qms/edit-environmantal-aspect",
        "/company/qms/view-environmantal-aspect",
        "/company/qms/draft-environmantal-aspect",
        "/company/qms/edit-draft-environmantal-aspect",
        "/company/qms/view-draft-environmantal-aspect",
      ],
    },
    {
      id: "environmetal-impact-assesments",
      label: "Environmetal Impact Assesments",
      icon: <img src={manual} alt="Manual" className="w-[15px] h-[15px]" />,
      path: "/company/qms/list-environmantal-impact",
      relatedPaths: [
        "/company/qms/add-environmantal-impact",
        "/company/qms/edit-environmantal-impact",
        "/company/qms/view-environmantal-impact",
        "/company/qms/draft-environmantal-impact",
        "/company/qms/edit-draft-environmantal-impact",
        "/company/qms/view-draft-environmantal-impact",
      ],
    },
    {
      id: "environmental-incidents",
      label: "Environmental Incidents",
      icon: (
        <img src={procedure} alt="Procedure" className="w-[15px] h-[15px]" />
      ),
      path: "/company/qms/list-environmantal-incident",
      relatedPaths: [
        "/company/qms/add-environmantal-incident",
        "/company/qms/edit-environmantal-incident",
        "/company/qms/view-environmantal-incident",
        "/company/qms/draft-environmantal-incident",
        "/company/qms/edit-draft-environmantal-incident",
        "/company/qms/view-draft-environmantal-incident",
      ],
    },
    {
      id: "environmental-waste-management",
      label: "Environmental Waste Management",
      icon: (
        <img src={record} alt="Record Format" className="w-[15px] h-[15px]" />
      ),
      path: "/company/qms/list-environmantal-waste-management",
      relatedPaths: [
        "/company/qms/add-environmantal-waste-management",
        "/company/qms/edit-environmantal-waste-management",
        "/company/qms/view-environmantal-waste-management",
        "/company/qms/draft-environmantal-waste-management",
        "/company/qms/edit-draft-environmantal-waste-management",
        "/company/qms/view-draft-environmantal-waste-management",
      ],
    },
    {
      id: "health-and-safety-hazards",
      label: "Health and Safety Hazards",
      icon: (
        <img
          src={parties}
          alt="Interested Parties"
          className="w-[15px] h-[15px]"
        />
      ),
      path: "/company/qms/list-health-safety-hazards",
      relatedPaths: [
        "/company/qms/add-health-safety-hazards",
        "/company/qms/edit-health-safety-hazards",
        "/company/qms/view-health-safety-hazards",
        "/company/qms/draft-health-safety-hazards",
        "/company/qms/edit-draft-health-safety-hazards",
        "/company/qms/view-draft-health-safety-hazards",
      ],
    },
    {
      id: "health-and-safety-risk-assessments",
      label: "Health and Safety Risk Assessments",
      icon: <img src={process} alt="Processes" className="w-[15px] h-[15px]" />,
      path: "/company/qms/list-health-safety-assessments",
      relatedPaths: [
        "/company/qms/add-health-safety-assessments",
        "/company/qms/edit-health-safety-assessments",
        "/company/qms/view-health-safety-assessments",
        "/company/qms/draft-health-safety-assessments",
        "/company/qms/edit-draft-health-safety-assessments",
        "/company/qms/view-draft-health-safety-assessments",
      ],
    },
    {
      id: "health-and-safety-incidents",
      label: "Health and Safety Incidents",
      icon: (
        <img src={scope} alt="Scope Statements" className="w-[15px] h-[15px]" />
      ),
      path: "/company/qms/list-health-safety-incidents",
      relatedPaths: [
        "/company/qms/add-health-safety-incidents",
        "/company/qms/edit-health-safety-incidents",
        "/company/qms/view-health-safety-incidents",
        "/company/qms/draft-health-safety-incidents",
        "/company/qms/edit-draft-health-safety-incidents",
        "/company/qms/view-draft-health-safety-incidents",
      ],
    },
    {
      id: "process-risks-assessments",
      label: "Process Risks Assessments",
      icon: <img src={policy} alt="Policy" className="w-[15px] h-[15px]" />,
      path: "/company/qms/list-process-risks-assessments",
    },
    {
      id: "process-opportunities-assessment",
      label: "Process Opportunities Assessment",
      icon: <img src={manual} alt="Manual" className="w-[15px] h-[15px]" />,
      path: "/company/qms/list-opportunity-assessment",
      relatedPaths: [
        "/company/qms/add-opportunity-assessment",
        "/company/qms/edit-opportunity-assessment",
        "/company/qms/view-opportunity-assessment",
      ],
    },
    {
      id: "accident-and-incident-investigations",
      label: "Accident and Incident Investigations",
      icon: (
        <img src={procedure} alt="Procedure" className="w-[15px] h-[15px]" />
      ),
      // path: "/company/qms/procedure",
    },
  ];

  const isActive = (category) => {
    const currentPath = location.pathname;
    return (
      currentPath === category.path ||
      (category.relatedPaths &&
        category.relatedPaths.some((path) => currentPath.startsWith(path)))
    );
  };

  const handleCategoryClick = (category) => {
    if (props && props.handleItemClick) {
      props.handleItemClick(category.id, category.path, "qmsriskmanagement");
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
              className={`text-center ${
                active ? "text-white" : "text-[#5B5B5B]"
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

export default RiskOpportunitiesSubmenu;
