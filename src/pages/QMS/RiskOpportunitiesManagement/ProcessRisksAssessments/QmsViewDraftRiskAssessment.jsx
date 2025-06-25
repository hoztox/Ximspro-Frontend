import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../../../Utils/Config";
import axios from "axios";

const QmsViewDraftRiskAssessment = () => {
  const navigate = useNavigate();
   const { id } = useParams();
   
   const [riskAssessmentDetails, setRiskAssessmentDetails] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
 
 
   const getUserCompanyId = () => {
     const storedCompanyId = localStorage.getItem("company_id");
     if (storedCompanyId) return storedCompanyId;
 
     const userRole = localStorage.getItem("role");
     if (userRole === "user") {
       const userData = localStorage.getItem("user_company_id");
       if (userData) {
         try {
           return JSON.parse(userData);
         } catch (e) {
           console.error("Error parsing user company ID:", e);
           return null;
         }
       }
     }
     return null;
   };
 
  
   useEffect(() => {
     fetchRiskAssessmentDetails();
   }, [id]);
 
   const fetchRiskAssessmentDetails = async () => {
     try {
       setLoading(true);
       setError(null);
 
       const response = await fetch(`${BASE_URL}/qms/process-risk-assessment/${id}/`);
       
       if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
       }
 
       const data = await response.json();
       setRiskAssessmentDetails(data);
       console.log("Risk Assessment Data:", data);
     } catch (error) {
       console.error('Error fetching risk assessment details:', error);
       setError('Failed to load risk assessment details. Please try again.');
     } finally {
       setLoading(false);
     }
   };
 
   
   const getRiskRanking = (category) => {
     switch (category) {
       case "Very High Risk":
         return "VH";
       case "High Risk":
         return "H";
       case "Moderate Risk":
         return "M";
       case "Low Risk":
         return "L";
       default:
         return "N/A";
     }
   };
 
   const getRankingColorClass = (category) => {
     switch (category) {
       case "Very High Risk":
         return "bg-[#dd363611] text-[#dd3636]";
       case "High Risk":
         return "bg-[#DD6B0611] text-[#DD6B06]";
       case "Moderate Risk":
         return "bg-[#FFD70011] text-[#FFD700]";
       case "Low Risk":
         return "bg-[#36DDAE11] text-[#36DDAE]";
       default:
         return "bg-[#85858511] text-[#858585]";
     }
   };
 
   const formatReviewDate = (dateString) => {
     if (!dateString) return "N/A";
     const date = new Date(dateString);
     return date.toLocaleDateString("en-GB", {
       day: "2-digit",
       month: "2-digit",
       year: "numeric",
     });
   };
 
   const navigateToRiskAssessmentList = () => {
     navigate("/company/qms/draft-process-risks-assessments");
   };
 
   const navigateToEditRiskAssessment = () => {
     navigate(`/company/qms/edit-draft-process-risks-assessments/${id}`);
   };
 
    const deleteRiskAssessment = async () => {
    if (!window.confirm('Are you sure you want to delete this risk assessment?')) {
      return;
    }

    try {
      // Add more detailed logging
      console.log('Attempting to delete risk assessment with ID:', id);
      console.log('Delete URL:', `${BASE_URL}/qms/process-risk-assessment/${id}/`);
      
      const response = await axios.delete(`${BASE_URL}/qms/process-risk-assessment/${id}/`, );
      
      console.log('Delete response:', response);
      alert('Risk assessment deleted successfully');
      navigate("/company/qms/list-process-risks-assessments");
    } catch (error) {
      console.error('Error deleting assessment:', error);
      
      // More detailed error logging
      if (error.response) {
        // Server responded with error status
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Response headers:', error.response.headers);
        alert(`Failed to delete: ${error.response.data?.message || error.response.statusText || 'Server error'}`);
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
        alert('Failed to delete: No response from server. Please check your connection.');
      } else {
        // Something else happened
        console.error('Error message:', error.message);
        alert(`Failed to delete: ${error.message}`);
      }
    }
  };
 
   // Loading state
   if (loading) {
     return (
       <div className="bg-[#1C1C24] p-5 rounded-lg flex justify-center items-center min-h-[400px]">
         <p className="text-white">Loading Risk Assessment Details...</p>
       </div>
     );
   }
 
   // Error state
  
 
   // No data state
   if (!riskAssessmentDetails) {
     return (
       <div className="bg-[#1C1C24] text-white p-5 rounded-lg">
         <div className="text-center">
           <p className="text-gray-400 mb-4">Risk assessment not found</p>
           <button
             onClick={navigateToRiskAssessmentList}
             className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded"
           >
             Back to List
           </button>
         </div>
       </div>
     );
   }
 
   return (
     <div className="bg-[#1C1C24] p-5 rounded-lg">
       <div className="flex justify-between items-center border-b border-[#383840] pb-[26px]">
         <h1 className="viewhead">Risk Assessment Information</h1>
         <button
           className="text-white bg-[#24242D] p-2 rounded-md"
           onClick={navigateToRiskAssessmentList}
         >
           <X size={22} />
         </button>
       </div>
       <div className="mt-8">
         <div className="grid grid-cols-2 gap-x-10 gap-y-[36px] pb-5">
           {/* Row 1: Activity and Hazard */}
           <div className="flex items-center justify-between border-b border-[#2A2B32] pb-3">
             <label className="viewlabels pr-4">Activity:</label>
             <p className="viewdatas text-right">
               {riskAssessmentDetails.activity || "N/A"}
             </p>
           </div>
 
           <div className="flex items-center justify-between border-b border-[#2A2B32] pb-3">
             <label className="viewlabels pr-4">Hazard:</label>
             <p className="viewdatas text-right">
               {riskAssessmentDetails.hazard || "N/A"}
             </p>
           </div>
 
           {/* Row 2: Risks and Risk Assessment */}
           <div className="flex items-start justify-between border-b border-[#2A2B32] pb-3">
             <label className="viewlabels pr-4">Risk(s):</label>
             <div className="viewdatas">
               {Array.isArray(riskAssessmentDetails.risks) &&
               riskAssessmentDetails.risks.length > 0 ? (
                 <ol className="list-decimal pl-5 flex flex-col items-end">
                   {riskAssessmentDetails.risks.map((risk, index) => (
                     <li key={index} className="mb-2 text-right">
                       {typeof risk === 'object' ? (risk.name || risk.risk || JSON.stringify(risk)) : risk}
                     </li>
                   ))}
                 </ol>
               ) : (
                 <p>N/A</p>
               )}
             </div>
           </div>
 
           <div className="flex items-start justify-between border-b border-[#2A2B32] pb-3 h-[33.8px]">
             <label className="viewlabels pr-4">Risk Assessment:</label>
             <div className="relative">
               <p className="viewdatas flex gap-3 absolute right-0">
                 <span className="whitespace-nowrap">
                   Likelihood: {riskAssessmentDetails.risk_likelihood || "N/A"}
                 </span>
                 <span className="whitespace-nowrap">
                   Severity: {riskAssessmentDetails.risk_severity || "N/A"}
                 </span>
                 <span className="whitespace-nowrap">
                   Risk Score: {riskAssessmentDetails.risk_score || "N/A"}
                 </span>
                 <span
                   className={`rounded flex items-center justify-center px-3 h-[21px] whitespace-nowrap ${getRankingColorClass(riskAssessmentDetails.risk_category)}`}
                 >
                   {getRiskRanking(riskAssessmentDetails.risk_category)}
                 </span>
               </p>
             </div>
           </div>
 
           {/* Row 3: Control Measures and Required Control Measures */}
           <div className="flex items-start justify-between border-b border-[#2A2B32] pb-3">
             <label className="viewlabels pr-4">Control Measures:</label>
             <div className="viewdatas">
               {Array.isArray(riskAssessmentDetails.control_risks) &&
               riskAssessmentDetails.control_risks.length > 0 ? (
                 <ol className="list-decimal pl-5 flex flex-col items-end">
                   {riskAssessmentDetails.control_risks.map((measure, index) => (
                     <li key={index} className="mb-2 text-right">
                       {typeof measure === 'object' ? (measure.name || measure.control_measure || JSON.stringify(measure)) : measure}
                     </li>
                   ))}
                 </ol>
               ) : (
                 <p>N/A</p>
               )}
             </div>
           </div>
 
           <div className="flex items-start justify-between border-b border-[#2A2B32] pb-3">
             <label className="viewlabels pr-4">Required Control Measures:</label>
             <div className="viewdatas">
               {Array.isArray(riskAssessmentDetails.required_control_risks) &&
               riskAssessmentDetails.required_control_risks.length > 0 ? (
                 <ol className="list-decimal pl-5 flex flex-col items-end">
                   {riskAssessmentDetails.required_control_risks.map((measure, index) => (
                     <li key={index} className="mb-2 text-right">
                       {typeof measure === 'object' ? (measure.name || measure.required_control_measure || measure.control_measure || JSON.stringify(measure)) : measure}
                     </li>
                   ))}
                 </ol>
               ) : (
                 <p>N/A</p>
               )}
             </div>
           </div>
 
           {/* Row 4: Action Owner and Residual Risk */}
           <div className="flex items-center justify-between border-b border-[#2A2B32] pb-3">
             <label className="viewlabels pr-4">Action Owner:</label>
             <p className="viewdatas text-right">
               {riskAssessmentDetails.owner
                 ? `${riskAssessmentDetails.owner.first_name || ''} ${riskAssessmentDetails.owner.last_name || ''}`.trim() ||
                 riskAssessmentDetails.owner.username
                 : 'N/A'}
             </p>
           </div>
 
           <div className="flex items-start justify-between border-b border-[#2A2B32] pb-3 h-[33.8px]">
             <label className="viewlabels pr-4">Residual Risk:</label>
             <div className="relative">
               <p className="viewdatas flex gap-3 absolute right-0">
                 <span className="whitespace-nowrap">
                   Likelihood: {riskAssessmentDetails.residual_likelihood || "N/A"}
                 </span>
                 <span className="whitespace-nowrap">
                   Severity: {riskAssessmentDetails.residual_severity || "N/A"}
                 </span>
                 <span className="whitespace-nowrap">
                   Risk Score: {riskAssessmentDetails.residual_score || "N/A"}
                 </span>
                 <span
                   className={`rounded flex items-center justify-center px-3 h-[21px] whitespace-nowrap ${getRankingColorClass(riskAssessmentDetails.residual_category)}`}
                 >
                   {getRiskRanking(riskAssessmentDetails.residual_category)}
                 </span>
               </p>
             </div>
           </div>
 
           {/* Row 5: Review Date and Remarks */}
           <div className="flex items-center justify-between border-b border-[#2A2B32] pb-3">
             <label className="viewlabels pr-4">Review Date:</label>
             <p className="viewdatas text-right">
               {formatReviewDate(riskAssessmentDetails.date)}
             </p>
           </div>
 
           <div className="flex items-center justify-between border-b border-[#2A2B32] pb-3">
             <label className="viewlabels pr-4">Remarks:</label>
             <p className="viewdatas text-right">
               {riskAssessmentDetails.remarks || "N/A"}
             </p>
           </div>
 
           {/* Row 6: Buttons */}
           <div></div>
           <div className="flex justify-end items-center">
             <div className="flex gap-5">
               <div className="flex flex-col justify-center items-center">
                 <button
                   className="border border-[#F9291F] rounded w-[148px] h-[41px] text-[#F9291F] hover:bg-[#F9291F] hover:text-white duration-200 buttons"
                   onClick={deleteRiskAssessment}
                 >
                   Delete
                 </button>
               </div>
               <div className="flex flex-col justify-center items-center">
                 <button
                   className="border border-[#1E84AF] rounded w-[148px] h-[41px] text-[#1E84AF] hover:bg-[#1E84AF] hover:text-white duration-200 buttons"
                   onClick={navigateToEditRiskAssessment}
                 >
                   Edit
                 </button>
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
   );
 };
export default QmsViewDraftRiskAssessment;
