import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import { ThemeProvider, useTheme } from "./ThemeContext";
import AdminLogin from "./pages/AdminLogin/AdminLogin";
import Password from "./pages/ForgotPassword/Password";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Companies from "./pages/Companies/Companies";
import AddCompany from "./pages/AddCompany/AddCompany";
import ViewCompany from "./pages/ViewCompany/ViewCompany";
import EditCompany from "./pages/EditCompany/EditCompany";
import AddSubscriber from "./pages/Subscribers/AddSubscriber/AddSubscriber";
import ManageSubscriber from "./pages/Subscribers/ManageSubscriber/ManageSubscriber";
import ChangeSubscription from "./pages/Subscribers/ChangeSubscription/ChangeSubscription";
import AddSubscriptionPlan from "./pages/Subscriptions/AddSubscriptionPlan/AddSubscriptionPlan";
import ManageSubscription from "./pages/Subscriptions/ManageSubscription/ManageSubscription";
import EditSubscription from "./pages/Subscriptions/EditSubscription.jsx/EditSubscription";
import ChangePassword from "./pages/ChangePassowrd/ChangePassword";
import CompanyLogin from "./pages/CompanyLogin/CompanyLogin";
import CompanyLayout from "./pages/CompanyLayout"; 
import CompanyDashboard from "./pages/Company Dashboard/CompanyDashboard";
import CompanyBackup from "./pages/Company Backup/CompanyBackup";
import QmsPolicy from "./pages/QMS/Documentation/Policy/QmsPolicy";
import QmsManual from "./pages/QMS/Documentation/Manual/QmsManual";
import QmsProcedure from "./pages/QMS/Documentation/Procedure/QmsProcedure";
import QmsRecordFormat from "./pages/QMS/Documentation/Record Format/QmsRecordFormat";
import QmsProcesses from "./pages/QMS/Documentation/Processes/QmsProcesses";
import EmsPolicy from "./pages/EMS/Documentation/Policy/EmsPolicy";
import AddQmsPolicy from "./pages/QMS/Documentation/Policy/AddQmsPolicy";
import AddQmsManual from "./pages/QMS/Documentation/Manual/AddQmsManual";
import AddQmsProcedure from "./pages/QMS/Documentation/Procedure/AddQmsProcedure";
import AddQmsRecordFormat from "./pages/QMS/Documentation/Record Format/AddQmsRecordFormat";
import AddEmspolicy from "./pages/EMS/Documentation/Policy/AddEmspolicy";
import EmsManual from "./pages/EMS/Documentation/Manual/EmsManual";
import AddEmsManual from "./pages/EMS/Documentation/Manual/AddEmsManual";
import EmsProcedure from "./pages/EMS/Documentation/Procedure/EmsProcedure";
import AddEmsProcedure from "./pages/EMS/Documentation/Procedure/AddEmsProcedure";
import EmsRecordFormat from "./pages/EMS/Documentation/Record Format/EmsRecordFormat";
import AddEmsRecordFormat from "./pages/EMS/Documentation/Record Format/AddEmsRecordFormat";
import OhsPolicy from "./pages/OHS/Documentation/Policy/OhsPolicy";
import AddOhsPolicy from "./pages/OHS/Documentation/Policy/AddOhsPolicy";
import OhsManual from "./pages/OHS/Documentation/Manual/OhsManual";
import AddOhsManual from "./pages/OHS/Documentation/Manual/AddOhsManual";
import OhsProcedure from "./pages/OHS/Documentation/Procedure/OhsProcedure";
import AddOhsProcedure from "./pages/OHS/Documentation/Procedure/AddOhsProcedure";
import OhsRecordFormat from "./pages/OHS/Documentation/Record Format/OhsRecordFormat";
import AddOhsRecordFormat from "./pages/OHS/Documentation/Record Format/AddOhsRecordFormat";
import EnMSPolicy from "./pages/EnMS/Documentation/Policy/EnMSPolicy";
import AddEnMSPolicy from "./pages/EnMS/Documentation/Policy/AddEnMSPolicy";
import EnMSManual from "./pages/EnMS/Documentation/Manual/EnMSManual";
import AddEnMSManual from "./pages/EnMS/Documentation/Manual/AddEnMSManual";
import EnMSProcedure from "./pages/EnMS/Documentation/Procedure/EnMSProcedure";
import AddEnMSProcedure from "./pages/EnMS/Documentation/Procedure/AddEnMSProcedure";
import EnMSRecordFormat from "./pages/EnMS/Documentation/Record Format/EnMSRecordFormat";
import AddEnMSRecordFormat from "./pages/EnMS/Documentation/Record Format/AddEnMSRecordFormat";
import BMSPolicy from "./pages/BMS/Documentation/Policy/BMSPolicy";
import AddBMSPolicy from "./pages/BMS/Documentation/Policy/AddBMSPolicy";
import BmsManual from "./pages/BMS/Documentation/Manual/BmsManual";
import AddBmsManual from "./pages/BMS/Documentation/Manual/AddBmsManual";
import BmsProcedure from "./pages/BMS/Documentation/Procedure/BmsProcedure";
import AddBmsProcedure from "./pages/BMS/Documentation/Procedure/AddBmsProcedure";
import BmsRecordFormat from "./pages/BMS/Documentation/Record Format/BmsRecordFormat";
import AddBmsRecordFormat from "./pages/BMS/Documentation/Record Format/AddBmsRecordFormat";
import AMSPolicy from "./pages/AMS/Documentation/Policy/AMSPolicy";
import AddAMSPolicy from "./pages/AMS/Documentation/Policy/AddAMSPolicy";
import AmsManual from "./pages/AMS/Documentation/Manual/AmsManual";
import AddAmsManual from "./pages/AMS/Documentation/Manual/AddAmsManual";
import AmsProcedure from "./pages/AMS/Documentation/Procedure/AmsProcedure";
import AddAmsProcedure from "./pages/AMS/Documentation/Procedure/AddAmsProcedure";
import AmsRecordFormat from "./pages/AMS/Documentation/Record Format/AmsRecordFormat";
import AddAmsRecordFormat from "./pages/AMS/Documentation/Record Format/AddAmsRecordFormat";
import QMSAddUser from "./pages/QMS/UserManagement/AddUser/QMSAddUser";
import QMSListUser from "./pages/QMS/UserManagement/ListUser/QMSListUser";
import EMSAddUser from "./pages/EMS/UserManagement/AddUser/EMSAddUser";
import EMSListUser from "./pages/EMS/UserManagement/ListUser/EMSListUser";
import OHSAddUser from "./pages/OHS/UserManagement/AddUser/OHSAddUser"
import OHSListUser from "./pages/OHS/UserManagement/ListUser/OHSListUser";
import EnMSAddUser from "./pages/EnMS/UserManagement/AddUser/EnMSAddUser"
import EnMSListUser from "./pages/EnMS/UserManagement/ListUser/EnMSListUser";
import BMSAddUser from "./pages/BMS/UserManagement/AddUser/BMSAddUser";
import BMSListUser from "./pages/BMS/UserManagement/ListUser/BMSListUser";
import AMSAddUser from "./pages/AMS/UserManagement/AddUser/AMSAddUser";
import AMSListUser from "./pages/AMS/UserManagement/ListUser/AMSListUser";
import EditQmsPolicy from "./pages/QMS/Documentation/Policy/EditQmsPolicy";
import ViewQmsManual from "./pages/QMS/Documentation/Manual/ViewQmsManual";
import EditQmsmanual from "./pages/QMS/Documentation/Manual/EditQmsmanual";
import ViewAllNotifications from "./components/Company_Navbar/ViewAllNotifications";
import DraftQmsManual from "./pages/QMS/Documentation/Manual/DraftQmsManual";
import EditDraftQmsManual from "./pages/QMS/Documentation/Manual/EditDraftQmsManual";
import QMSEditUser from "./pages/QMS/UserManagement/EditUser/QMSEditUser";
import QMSViewUser from "./pages/QMS/UserManagement/ViewUser/QMSViewUser";
import DraftQmsProcedure from "./pages/QMS/Documentation/Procedure/DraftQmsProcedure";
import ViewQmsProcedure from "./pages/QMS/Documentation/Procedure/ViewQmsProcedure";
import EditQmsProcedure from "./pages/QMS/Documentation/Procedure/EditQmsProcedure";
import EditDraftQmsProcedure from "./pages/QMS/Documentation/Procedure/EditDraftQmsProcedure";
import ViewQmsRecordFormat from "./pages/QMS/Documentation/Record Format/ViewQmsRecordFormat";
import EditQmsRecordFormat from "./pages/QMS/Documentation/Record Format/EditQmsRecordFormat";
import DraftQmsRecordFormat from "./pages/QMS/Documentation/Record Format/DraftQmsRecordFormat";
import EditDraftQmsRecordFormat from "./pages/QMS/Documentation/Record Format/EditDraftQmsRecordFormat";
import QmsListTraining from "./pages/QMS/EmployeeTraining/ListTraining/QmsListTraining";
import QmsAddTraining from "./pages/QMS/EmployeeTraining/AddTraining/QmsAddTraining"
import QmsEditTraining from "./pages/QMS/EmployeeTraining/EditTraining/QmsEditTraining";
import QmsViewTraining from "./pages/QMS/EmployeeTraining/ViewTraining/QmsViewTraining";
import QmsListUserTraining from "./pages/QMS/EmployeeTraining/ListUserTraining/QmsListUserTraining";
import QmsTrainingEvaluation from "./pages/QMS/EmployeeTraining/TrainingEvaluation/QmsTrainingEvaluation";
import QmsEmployeePerformance from "./pages/QMS/EmployeeTraining/EmployeePerformanceEvaluation/QmsEmployeePerformance";
import AddQmsEmployeePerformance from "./pages/QMS/EmployeeTraining/EmployeePerformanceEvaluation/AddQmsEmployeePerformance";
import EditQmsEmployeePerformance from "./pages/QMS/EmployeeTraining/EmployeePerformanceEvaluation/EditQmsEmployeePerformance";
import ViewQmsEmployeePerformance from "./pages/QMS/EmployeeTraining/EmployeePerformanceEvaluation/ViewQmsEmployeePerformance";
import QmsEmployeeSatisfaction from "./pages/QMS/EmployeeTraining/EmployeeSatisfactionSurvey/QmsEmployeeSatisfaction";
import AddQmsEmployeeSatisfaction from "./pages/QMS/EmployeeTraining/EmployeeSatisfactionSurvey/AddQmsEmployeeSatisfaction";
import EditQmsEmployeeSatisfaction from "./pages/QMS/EmployeeTraining/EmployeeSatisfactionSurvey/EditQmsEmployeeSatisfaction";
import ViewQmsEmployeeSatisfaction from "./pages/QMS/EmployeeTraining/EmployeeSatisfactionSurvey/ViewQmsEmployeeSatisfaction";
import QmsListAwarenessTraining from "./pages/QMS/EmployeeTraining/AwarenessTraining/QmsListAwarenessTraining";
import QmsAddAwarenessTraining from "./pages/QMS/EmployeeTraining/AwarenessTraining/QmsAddAwarenessTraining";
import QmsListCompliance from "./pages/QMS/Compliance/Compliance/QmsListCompliance";
import QmsInterestedParties from "./pages/QMS/Documentation/InterestedParties/QmsInterestedParties";
import AddQmsInterestedParties from "./pages/QMS/Documentation/InterestedParties/AddQmsInterestedParties";
import EditQmsInterestedParties from "./pages/QMS/Documentation/InterestedParties/EditQmsInterestedParties";
import ViewQmsInterestedParties from "./pages/QMS/Documentation/InterestedParties/ViewQmsInterestedParties";
import DraftQmsInterestedParties from "./pages/QMS/Documentation/InterestedParties/DraftQmsInterestedParties";
import EditDraftQmsInterestedParties from "./pages/QMS/Documentation/InterestedParties/EditDraftQmsInterestedParties";
import AddQmsProcesses from "./pages/QMS/Documentation/Processes/AddQmsProcesses";
import ViewQmsProcesses from "./pages/QMS/Documentation/Processes/ViewQmsProcesses";
import EditQmsProcesses from "./pages/QMS/Documentation/Processes/EditQmsProcesses";
import QmsAddCompliance from "./pages/QMS/Compliance/Compliance/QmsAddCompliance";
import DraftQmsProcesses from "./pages/QMS/Documentation/Processes/DraftQmsProcesses";
import EditQmsDraftProcesses from "./pages/QMS/Documentation/Processes/EditQmsDraftProcesses";
import ViewQmsDraftInterestedParties from "./pages/QMS/Documentation/InterestedParties/ViewQmsDraftInterestedParties";
import ViewQmsDraftProcesses from "./pages/QMS/Documentation/Processes/ViewQmsDraftProcesses";
import QmsEditAwarenessTraining from "./pages/QMS/EmployeeTraining/AwarenessTraining/QmsEditAwarenessTraining";
import QmsViewAwarenessTraining from "./pages/QMS/EmployeeTraining/AwarenessTraining/QmsViewAwarenessTraining";
import QmsEditCompliance from "./pages/QMS/Compliance/Compliance/QmsEditCompliance";
import QmsViewCompliance from "./pages/QMS/Compliance/Compliance/QmsViewCompliance";
import QmsListLegalRequirements from "./pages/QMS/Compliance/LegalAndOtherRequirements/QmsListLegalRequirements";
import QmsAddLegalRequirements from "./pages/QMS/Compliance/LegalAndOtherRequirements/QmsAddLegalRequirements";
import QmsEditLegalRequirements from "./pages/QMS/Compliance/LegalAndOtherRequirements/QmsEditLegalRequirements";
import QmsViewLegalRequirements from "./pages/QMS/Compliance/LegalAndOtherRequirements/QmsViewLegalRequirements";
import QmsListEvaluationCompliance from "./pages/QMS/Compliance/EvaluationOfCompliance/QmsListEvaluationCompliance";
import QmsAddEvaluationCompliance from "./pages/QMS/Compliance/EvaluationOfCompliance/QmsAddEvaluationCompliance";
import QmsEditEvaluationCompliance from "./pages/QMS/Compliance/EvaluationOfCompliance/QmsEditEvaluationCompliance";
import QmsViewEvaluationCompliance from "./pages/QMS/Compliance/EvaluationOfCompliance/QmsViewEvaluationCompliance";
import QmsDraftEvaluationCompliance from "./pages/QMS/Compliance/EvaluationOfCompliance/QmsDraftEvaluationCompliance";
import QmsEditDraftEvaluationCompliance from "./pages/QMS/Compliance/EvaluationOfCompliance/QmsEditDraftEvaluationCompliance";
import QmsDraftCompliance from "./pages/QMS/Compliance/Compliance/QmsDraftCompliance";
import QmsListManagementChange from "./pages/QMS/Compliance/ManagementOfChange/QmsListManagementChange";
import QmsAddmanagementChange from "./pages/QMS/Compliance/ManagementOfChange/QmsAddmanagementChange";
import QmsDraftViewCompliance from "./pages/QMS/Compliance/Compliance/QmsDraftViewCompliance";
import QmsDraftLegalRequirements from "./pages/QMS/Compliance/LegalAndOtherRequirements/QmsDraftLegalRequirements";
import QmsEditDraftCompliance from "./pages/QMS/Compliance/Compliance/QmsEditDraftCompliance";
import QmsDraftViewLegalRequirements from "./pages/QMS/Compliance/LegalAndOtherRequirements/QmsDraftViewLegalRequirements";
import QmsDraftEditLegalRequirements from "./pages/QMS/Compliance/LegalAndOtherRequirements/QmsDraftEditLegalRequirements";
import QmsEditManagementChange from "./pages/QMS/Compliance/ManagementOfChange/QmsEditManagementChange";
import QmsViewManagementChange from "./pages/QMS/Compliance/ManagementOfChange/QmsViewManagementChange";
import QmsDraftManagementChange from "./pages/QMS/Compliance/ManagementOfChange/QmsDraftManagementChange";
import QmsEditDraftManagementChange from "./pages/QMS/Compliance/ManagementOfChange/QmsEditDraftManagementChange";
import QmsViewDraftManagementChange from "./pages/QMS/Compliance/ManagementOfChange/QmsViewDraftManagementChange";
import QmsViewDraftEvaluationCompliance from "./pages/QMS/Compliance/EvaluationOfCompliance/QmsViewDraftEvaluationCompliance";
import QmsListSustainability from "./pages/QMS/Compliance/Sustainability/QmsListSustainability";
import QmsAddSustainability from "./pages/QMS/Compliance/Sustainability/QmsAddSustainability";
import QmsEditSustainability from "./pages/QMS/Compliance/Sustainability/QmsEditSustainability";
import QmsViewSustainability from "./pages/QMS/Compliance/Sustainability/QmsViewSustainability";
import QmsDraftSustainability from "./pages/QMS/Compliance/Sustainability/QmsDraftSustainability";
import QmsEditDraftSustainability from "./pages/QMS/Compliance/Sustainability/QmsEditDraftSustainability";
import QmsViewDraftSustainability from "./pages/QMS/Compliance/Sustainability/QmsViewDraftSustainability";
import QmsDraftListTraining from "./pages/QMS/EmployeeTraining/ListTraining/QmsDraftListTraining";
import QmsEditDraftListTraining from "./pages/QMS/EmployeeTraining/ListTraining/QmsEditDraftListTraining";
import QmsViewDraftTraining from "./pages/QMS/EmployeeTraining/ListTraining/QmsViewDraftTraining";
import QmsDraftEmployeePerformance from "./pages/QMS/EmployeeTraining/EmployeePerformanceEvaluation/QmsDraftEmployeePerformance";
import QmsEditDraftEmployeePerformance from "./pages/QMS/EmployeeTraining/EmployeePerformanceEvaluation/QmsEditDraftEmployeePerformance";
import QmsViewDraftEmployeePerformance from "./pages/QMS/EmployeeTraining/EmployeePerformanceEvaluation/QmsViewDraftEmployeePerformance";
import QmsDraftEmployeeSatisfaction from "./pages/QMS/EmployeeTraining/EmployeeSatisfactionSurvey/QmsDraftEmployeeSatisfaction";
import QmsEditDraftEmployeeSatisfaction from "./pages/QMS/EmployeeTraining/EmployeeSatisfactionSurvey/QmsEditDraftEmployeeSatisfaction";
import QmsViewDraftEmployeeSatisfaction from "./pages/QMS/EmployeeTraining/EmployeeSatisfactionSurvey/QmsViewDraftEmployeeSatisfaction";
import QmsDraftAwarenessTraining from "./pages/QMS/EmployeeTraining/AwarenessTraining/QmsDraftAwarenessTraining";
import QmsEditDraftAwarenessTraining from "./pages/QMS/EmployeeTraining/AwarenessTraining/QmsEditDraftAwarenessTraining";
import QmsViewDraftAwarenessTraining from "./pages/QMS/EmployeeTraining/AwarenessTraining/QmsViewDraftAwarenessTraining";
import QmsListMeeting from "./pages/QMS/ActionsMeetingManagement/ListMeeting/QmsListMeeting";
import QmsAddMeeting from "./pages/QMS/ActionsMeetingManagement/AddMeeting/QmsAddMeeting";
import QmsEditMeeting from "./pages/QMS/ActionsMeetingManagement/ListMeeting/QmsEditMeeting";
import QmsViewMeeting from "./pages/QMS/ActionsMeetingManagement/ListMeeting/QmsViewMeeting";
import QmsDraftMeeting from "./pages/QMS/ActionsMeetingManagement/ListMeeting/QmsDraftMeeting";
import QmsEditDraftMeeting from "./pages/QMS/ActionsMeetingManagement/ListMeeting/QmsEditDraftMeeting";
import QmsViewDraftMeeting from "./pages/QMS/ActionsMeetingManagement/ListMeeting/QmsViewDraftMeeting";
import QmsListInboxSystemMessaging from "./pages/QMS/ActionsMeetingManagement/SystemMessaging/QmsListInboxSystemMessaging";
import QmsListTrashSystemMessaging from "./pages/QMS/ActionsMeetingManagement/SystemMessaging/QmsListTrashSystemMessaging";
import QmsListOutboxSystemMessaging from "./pages/QMS/ActionsMeetingManagement/SystemMessaging/QmsListOutboxSystemMessaging";
import QmsListDraftSystemMessaging from "./pages/QMS/ActionsMeetingManagement/SystemMessaging/QmsListDraftSystemMessaging";
import QmsComposeSystemMessaging from "./pages/QMS/ActionsMeetingManagement/SystemMessaging/QmsComposeSystemMessaging";
import QmsListInternalProblems from "./pages/QMS/ActionsMeetingManagement/InternalProblemsAndObservations/QmsListInternalProblems";
import QmsAddInternalProblems from "./pages/QMS/ActionsMeetingManagement/InternalProblemsAndObservations/QmsAddInternalProblems";
import QmsEditInternalProblems from "./pages/QMS/ActionsMeetingManagement/InternalProblemsAndObservations/QmsEditInternalProblems";
import QmsViewInternalProblems from "./pages/QMS/ActionsMeetingManagement/InternalProblemsAndObservations/QmsViewInternalProblems";
import QmsDraftInternalProblems from "./pages/QMS/ActionsMeetingManagement/InternalProblemsAndObservations/QmsDraftInternalProblems";
import QmsEditDraftInternalProblems from "./pages/QMS/ActionsMeetingManagement/InternalProblemsAndObservations/QmsEditDraftInternalProblems";
import QmsViewDraftInternalProblems from "./pages/QMS/ActionsMeetingManagement/InternalProblemsAndObservations/QmsViewDraftInternalProblems";
import QmsListAudit from "./pages/QMS/AuditsAndInspectionManagement/Audits/QmsListAudit";
import QmsAddAudit from "./pages/QMS/AuditsAndInspectionManagement/Audits/QmsAddAudit";
import QmsEditAudit from "./pages/QMS/AuditsAndInspectionManagement/Audits/QmsEditAudit";
import QmsViewAudit from "./pages/QMS/AuditsAndInspectionManagement/Audits/QmsViewAudit";
import QmsDraftAudit from "./pages/QMS/AuditsAndInspectionManagement/Audits/QmsDraftAudit";
import QmsEditDraftAudit from "./pages/QMS/AuditsAndInspectionManagement/Audits/QmsEditDraftAudit";
import QmsViewDraftAudit from "./pages/QMS/AuditsAndInspectionManagement/Audits/QmsViewDraftAudit";
import QmsListInspection from "./pages/QMS/AuditsAndInspectionManagement/Inspection/QmsListInspection";
import QmsAddInspection from "./pages/QMS/AuditsAndInspectionManagement/Inspection/QmsAddInspection";
import QmsEditInspection from "./pages/QMS/AuditsAndInspectionManagement/Inspection/QmsEditInspection";
import QmsViewInspection from "./pages/QMS/AuditsAndInspectionManagement/Inspection/QmsViewInspection";
import QmsDraftInspection from "./pages/QMS/AuditsAndInspectionManagement/Inspection/QmsDraftInspection";
import QmsEditDraftInspections from "./pages/QMS/AuditsAndInspectionManagement/Inspection/QmsEditDraftInspections";
import QmsViewDraftInspection from "./pages/QMS/AuditsAndInspectionManagement/Inspection/QmsViewDraftInspection";
import QmsAddCustomer from "./pages/QMS/CustomerManagement/Customers/QmsAddCustomer";
import QmsListCustomer from "./pages/QMS/CustomerManagement/Customers/QmsListCustomer";
import QmsEditCustomer from "./pages/QMS/CustomerManagement/Customers/QmsEditCustomer";
import QmsViewCustomer from "./pages/QMS/CustomerManagement/Customers/QmsViewCustomer";
import QmsDraftCustomer from "./pages/QMS/CustomerManagement/Customers/QmsDraftCustomer";
import QmsEditDraftCustomer from "./pages/QMS/CustomerManagement/Customers/QmsEditDraftCustomer";
import QmsViewDraftCustomer from "./pages/QMS/CustomerManagement/Customers/QmsViewDraftCustomer";
import QmsAddComplaints from "./pages/QMS/CustomerManagement/ComplaintsAndFeedback/QmsAddComplaints";
import QmsListComplaints from "./pages/QMS/CustomerManagement/ComplaintsAndFeedback/QmsListComplaints";
import QmsEditComplaints from "./pages/QMS/CustomerManagement/ComplaintsAndFeedback/QmsEditComplaints";
import QmsReviewTraining from "./pages/QMS/EmployeeTraining/ReviewTraining/QmsReviewTraining";
import QmsViewComplaints from "./pages/QMS/CustomerManagement/ComplaintsAndFeedback/QmsViewComplaints";
import QmsDraftComplaints from "./pages/QMS/CustomerManagement/ComplaintsAndFeedback/QmsDraftComplaints";
import QmsDraftEditComplaints from "./pages/QMS/CustomerManagement/ComplaintsAndFeedback/QmsDraftEditComplaints";
import QmsDraftViewComplaints from "./pages/QMS/CustomerManagement/ComplaintsAndFeedback/QmsDraftViewComplaints";
import QmsListCustomerSurvey from "./pages/QMS/CustomerManagement/CustomerSatisfactionSurvey/QmsListCustomerSurvey";
import QmsAddCustomerSurvey from "./pages/QMS/CustomerManagement/CustomerSatisfactionSurvey/QmsAddCustomerSurvey";
import QmsEditCustomerSurvey from "./pages/QMS/CustomerManagement/CustomerSatisfactionSurvey/QmsEditCustomerSurvey";
import QmsViewCustomerSurvey from "./pages/QMS/CustomerManagement/CustomerSatisfactionSurvey/QmsViewCustomerSurvey";
import QmsDraftCustomerSurvey from "./pages/QMS/CustomerManagement/CustomerSatisfactionSurvey/QmsDraftCustomerSurvey";
import QmsEditDraftCustomerSurvey from "./pages/QMS/CustomerManagement/CustomerSatisfactionSurvey/QmsEditDraftCustomerSurvey";
import QmsViewDraftCustomerSurvey from "./pages/QMS/CustomerManagement/CustomerSatisfactionSurvey/QmsViewDraftCustomerSurvey";
import QmsAddSupplier from "./pages/QMS/SupplierManagement/SupplierManagement/QmsAddSupplier";
import QmsListSupplier from "./pages/QMS/SupplierManagement/SupplierManagement/QmsListSupplier";
import QmsEditSupplier from "./pages/QMS/SupplierManagement/SupplierManagement/QmsEditSupplier";
import QmsViewSupplier from "./pages/QMS/SupplierManagement/SupplierManagement/QmsViewSupplier";
import QmsDraftSupplier from "./pages/QMS/SupplierManagement/SupplierManagement/QmsDraftSupplier";
import QmsDraftEditSupplier from "./pages/QMS/SupplierManagement/SupplierManagement/QmsDraftEditSupplier";
import QmsDraftViewSupplier from "./pages/QMS/SupplierManagement/SupplierManagement/QmsDraftViewSupplier";
import QmsAddSupplierProblem from "./pages/QMS/SupplierManagement/SupplierProblems/QmsAddSupplierProblem";
import QmsSupplierProblemLog from "./pages/QMS/SupplierManagement/SupplierProblems/QmsSupplierProblemLog";
import QmsEditSupplierProblem from "./pages/QMS/SupplierManagement/SupplierProblems/QmsEditSupplierProblem";
import QmsViewSupplierProblem from "./pages/QMS/SupplierManagement/SupplierProblems/QmsViewSupplierProblem";
import QmsDraftSupplierProblem from "./pages/QMS/SupplierManagement/SupplierProblems/QmsDraftSupplierProblem";
import QmsEditDraftSupplierProblem from "./pages/QMS/SupplierManagement/SupplierProblems/QmsEditDraftSupplierProblem";
import QmsViewDraftSupplierProblem from "./pages/QMS/SupplierManagement/SupplierProblems/QmsViewDraftSupplierProblem";
import QmsSupplierPerformace from "./pages/QMS/SupplierManagement/SupplierPerformanceEvaluation/QmsSupplierPerformace";
import QmsAddSupplierPerformance from "./pages/QMS/SupplierManagement/SupplierPerformanceEvaluation/QmsAddSupplierPerformance";
import QmsEditSupplierPerformance from "./pages/QMS/SupplierManagement/SupplierPerformanceEvaluation/QmsEditSupplierPerformance";
import QmsViewSupplierPerformance from "./pages/QMS/SupplierManagement/SupplierPerformanceEvaluation/QmsViewSupplierPerformance";
import QmsDraftSupplierPerformance from "./pages/QMS/SupplierManagement/SupplierPerformanceEvaluation/QmsDraftSupplierPerformance";
import QmsEditDraftSupplierPerformance from "./pages/QMS/SupplierManagement/SupplierPerformanceEvaluation/QmsEditDraftSupplierPerformance";
import QmsViewDraftSupplierPerformance from "./pages/QMS/SupplierManagement/SupplierPerformanceEvaluation/QmsViewDraftSupplierPerformance";
import QmsEmployeePerformanceGraph from "./pages/QMS/EmployeeTraining/EmployeePerformanceEvaluation/QmsEmployeePerformanceGraph";
import QmsScope from "./pages/QMS/Documentation/Scope Statements/QmsScope";
import AddScope from "./pages/QMS/Documentation/Scope Statements/AddScope";
import EditScope from "./pages/QMS/Documentation/Scope Statements/EditScope";
import QmsListCorrectionActions from "./pages/QMS/CorrectionActionsAndPreventiveActions/CorrectionActions/QmsListCorrectionActions";
import QmsAddCorrectionActions from "./pages/QMS/CorrectionActionsAndPreventiveActions/CorrectionActions/QmsAddCorrectionActions";
import QmsEditCorrectionActions from "./pages/QMS/CorrectionActionsAndPreventiveActions/CorrectionActions/QmsEditCorrectionActions";
import QmsViewCorrectionActions from "./pages/QMS/CorrectionActionsAndPreventiveActions/CorrectionActions/QmsViewCorrectionActions";
import QmsDraftCorrectionActions from "./pages/QMS/CorrectionActionsAndPreventiveActions/CorrectionActions/QmsDraftCorrectionActions";
import QmsEditDraftCorrectionActions from "./pages/QMS/CorrectionActionsAndPreventiveActions/CorrectionActions/QmsEditDraftCorrectionActions";
import QmsViewDraftCorrectionActions from "./pages/QMS/CorrectionActionsAndPreventiveActions/CorrectionActions/QmsViewDraftCorrectionActions";
import QmsListPreventiveActions from "./pages/QMS/CorrectionActionsAndPreventiveActions/PreventiveActions/QmsListPreventiveActions";
import QmsAddPreventiveActions from "./pages/QMS/CorrectionActionsAndPreventiveActions/PreventiveActions/QmsAddPreventiveActions";
import QmsEditPreventiveActions from "./pages/QMS/CorrectionActionsAndPreventiveActions/PreventiveActions/QmsEditPreventiveActions";
import QmsViewPreventiveActions from "./pages/QMS/CorrectionActionsAndPreventiveActions/PreventiveActions/QmsViewPreventiveActions";
import QmsDraftPreventiveActions from "./pages/QMS/CorrectionActionsAndPreventiveActions/PreventiveActions/QmsDraftPreventiveActions";
import QmsEditDraftPreventiveActions from "./pages/QMS/CorrectionActionsAndPreventiveActions/PreventiveActions/QmsEditDraftPreventiveActions";
import QmsViewDraftPreventiveActions from "./pages/QMS/CorrectionActionsAndPreventiveActions/PreventiveActions/QmsViewDraftPreventiveActions";
import QmsListObjectives from "./pages/QMS/ObjectivesAndTargets/Objectives/QmsListObjectives";
import AddQmsTrainingEvaluation from "./pages/QMS/EmployeeTraining/TrainingEvaluation/AddQmsTrainingEvaluation";
import EditQmsTrainingEvaluation from "./pages/QMS/EmployeeTraining/TrainingEvaluation/EditQmsTrainingEvaluation";
import ViewQmsTrainingEvaluation from "./pages/QMS/EmployeeTraining/TrainingEvaluation/ViewQmsTrainingEvaluation";
import DraftQmsTrainingEvaluation from "./pages/QMS/EmployeeTraining/TrainingEvaluation/DraftQmsTrainingEvaluation";
import EditsQmsDraftTrainingEvaluation from "./pages/QMS/EmployeeTraining/TrainingEvaluation/EditsQmsDraftTrainingEvaluation";
import ViewsQmsDraftTrainingEvaluation from "./pages/QMS/EmployeeTraining/TrainingEvaluation/ViewsQmsDraftTrainingEvaluation";
import QmsTrainingEvaluationGraph from "./pages/QMS/EmployeeTraining/TrainingEvaluation/QmsTrainingEvaluationGraph";
import QmsInboxReplay from "./pages/QMS/ActionsMeetingManagement/SystemMessaging/QmsInboxReplay";
import QmsInboxForward from "./pages/QMS/ActionsMeetingManagement/SystemMessaging/QmsInboxForward";
import QmsOutboxReplay from "./pages/QMS/ActionsMeetingManagement/SystemMessaging/QmsOutboxReplay";
import QmsEditDraftSystemMessaging from "./pages/QMS/ActionsMeetingManagement/SystemMessaging/QmsEditDraftSystemMessaging";
import QmsListNonconformityReport from "./pages/QMS/NonConformityReportManagement/QmsListNonconformityReport";
import QmsAddNonConformityReport from "./pages/QMS/NonConformityReportManagement/QmsAddNonConformityReport";
import QmsEditNonConformityReport from "./pages/QMS/NonConformityReportManagement/QmsEditNonConformityReport";
import QmsViewNonConformityReport from "./pages/QMS/NonConformityReportManagement/QmsViewNonConformityReport";
import QmsDraftNonConformityReport from "./pages/QMS/NonConformityReportManagement/QmsDraftNonConformityReport";
import QmsViewDraftNonConformity from "./pages/QMS/NonConformityReportManagement/QmsViewDraftNonConformity";
import QmsEditDraftNonConformity from "./pages/QMS/NonConformityReportManagement/QmsEditDraftNonConformity";
import QmsAddObjectives from "./pages/QMS/ObjectivesAndTargets/Objectives/QmsAddObjectives";
import QmsEditObjectives from "./pages/QMS/ObjectivesAndTargets/Objectives/QmsEditObjectives";
import QmsViewObjectives from "./pages/QMS/ObjectivesAndTargets/Objectives/QmsViewObjectives";
import QmsDraftObjectives from "./pages/QMS/ObjectivesAndTargets/Objectives/QmsDraftObjectives";
import QmsEditDraftObjectives from "./pages/QMS/ObjectivesAndTargets/Objectives/QmsEditDraftObjectives";
import QmsViewDraftObjectives from "./pages/QMS/ObjectivesAndTargets/Objectives/QmsViewDraftObjectives";
import QmsListTargets from "./pages/QMS/ObjectivesAndTargets/Targetss/QmsListTargets";
import QmsAddTargets from "./pages/QMS/ObjectivesAndTargets/Targetss/QmsAddTargets";
import QmsEditTargets from "./pages/QMS/ObjectivesAndTargets/Targetss/QmsEditTargets";
import QmsViewTargets from "./pages/QMS/ObjectivesAndTargets/Targetss/QmsViewTargets";
import QmsDraftTargets from "./pages/QMS/ObjectivesAndTargets/Targetss/QmsDraftTargets";
import QmsEditDraftTargets from "./pages/QMS/ObjectivesAndTargets/Targetss/QmsEditDraftTargets";
import QmsViewDraftTargets from "./pages/QMS/ObjectivesAndTargets/Targetss/QmsViewDraftTargets";
import QmsListEnergyReview from "./pages/QMS/EnergyManagement/EnergyReview/QmsListEnergyReview"
import QmsListEnvironmentalAspect from "./pages/QMS/RiskOpportunitiesManagement/EnvironmantalAspect/QmsListEnvironmentalAspect";
import QmsAddEnvironmentalAspect from "./pages/QMS/RiskOpportunitiesManagement/EnvironmantalAspect/QmsAddEnvironmentalAspect";
import QmsAddEnergyReview from "./pages/QMS/EnergyManagement/EnergyReview/QmsAddEnergyReview";
import QmsEditEnergyReview from "./pages/QMS/EnergyManagement/EnergyReview/QmsEditEnergyReview";
import QmsViewEnergyReview from "./pages/QMS/EnergyManagement/EnergyReview/QmsViewEnergyReview";
import QmsDraftEnergyReview from "./pages/QMS/EnergyManagement/EnergyReview/QmsDraftEnergyReview";
import QmsDraftEditEnergyReview from "./pages/QMS/EnergyManagement/EnergyReview/QmsDraftEditEnergyReview";
import QmsDraftViewEnergyReview from "./pages/QMS/EnergyManagement/EnergyReview/QmsDraftViewEnergyReview";
import QmsListEnergyBaselines from "./pages/QMS/EnergyManagement/EnergyBaselines/QmsListEnergyBaselines";
import QmsAddEnergyBaseLines from "./pages/QMS/EnergyManagement/EnergyBaselines/QmsAddEnergyBaseLines";
import QmsEditEnergyBaseLines from "./pages/QMS/EnergyManagement/EnergyBaselines/QmsEditEnergyBaseLines";
import QmsViewEnergyBaseLines from "./pages/QMS/EnergyManagement/EnergyBaselines/QmsViewEnergyBaseLines";
import QmsDraftEnergyBaseLines from "./pages/QMS/EnergyManagement/EnergyBaselines/QmsDraftEnergyBaseLines";
import QmsEditDraftEnergyBaseLines from "./pages/QMS/EnergyManagement/EnergyBaselines/QmsEditDraftEnergyBaseLines";
import QmsViewDraftEnergyBaseLines from "./pages/QMS/EnergyManagement/EnergyBaselines/QmsViewDraftEnergyBaseLines";
import QmsListSignificantEnergy from "./pages/QMS/EnergyManagement/SignificantEnergyUse/QmsListSignificantEnergy";
import QmsAddSignificantEnergy from "./pages/QMS/EnergyManagement/SignificantEnergyUse/QmsAddSignificantEnergy";
import QmsEditSignificantEnergy from "./pages/QMS/EnergyManagement/SignificantEnergyUse/QmsEditSignificantEnergy";
import QmsViewSignificantEnergy from "./pages/QMS/EnergyManagement/SignificantEnergyUse/QmsViewSignificantEnergy";
import QmsDraftSignificantEnergy from "./pages/QMS/EnergyManagement/SignificantEnergyUse/QmsDraftSignificantEnergy";
import QmsEditDraftSignificantEnergy from "./pages/QMS/EnergyManagement/SignificantEnergyUse/QmsEditDraftSignificantEnergy";
import QmsViewDraftSignificantEnergy from "./pages/QMS/EnergyManagement/SignificantEnergyUse/QmsViewDraftSignificantEnergy";
import QmsListEnergyImprovement from "./pages/QMS/EnergyManagement/EnergyImprovementOpportunities/QmsListEnergyImprovement";
import QmsAddEnergyImprovement from "./pages/QMS/EnergyManagement/EnergyImprovementOpportunities/QmsAddEnergyImprovement";
import QmsEditEnergyImprovement from "./pages/QMS/EnergyManagement/EnergyImprovementOpportunities/QmsEditEnergyImprovement";
import QmsViewEnergyImprovement from "./pages/QMS/EnergyManagement/EnergyImprovementOpportunities/QmsViewEnergyImprovement";
import QmsDraftEnergyImprovements from "./pages/QMS/EnergyManagement/EnergyImprovementOpportunities/QmsDraftEnergyImprovements";
import QmsEditDraftEnergyImprovement from "./pages/QMS/EnergyManagement/EnergyImprovementOpportunities/QmsEditDraftEnergyImprovement";
import QmsViewDraftEnergyImprovement from "./pages/QMS/EnergyManagement/EnergyImprovementOpportunities/QmsViewDraftEnergyImprovement";
import QmsListEnergyAction from "./pages/QMS/EnergyManagement/EnergyActionPlans/QmsListEnergyAction";
import QmsAddEnergyAction from "./pages/QMS/EnergyManagement/EnergyActionPlans/QmsAddEnergyAction";
import QmsEditEnergyAction from "./pages/QMS/EnergyManagement/EnergyActionPlans/QmsEditEnergyAction";
import QmsViewEnergyAction from "./pages/QMS/EnergyManagement/EnergyActionPlans/QmsViewEnergyAction";
import QmsDraftEnergyAction from "./pages/QMS/EnergyManagement/EnergyActionPlans/QmsDraftEnergyAction";
import QmsDraftEditEnergyAction from "./pages/QMS/EnergyManagement/EnergyActionPlans/QmsDraftEditEnergyAction";
import QmsDraftViewEnergyAction from "./pages/QMS/EnergyManagement/EnergyActionPlans/QmsDraftViewEnergyAction";
import QmsEditEnvironmentalAspect from "./pages/QMS/RiskOpportunitiesManagement/EnvironmantalAspect/QmsEditEnvironmentalAspect";
import QmsViewEnvironmentalAspect from "./pages/QMS/RiskOpportunitiesManagement/EnvironmantalAspect/QmsViewEnvironmentalAspect";
import QmsDraftEnvironmentalAspect from "./pages/QMS/RiskOpportunitiesManagement/EnvironmantalAspect/QmsDraftEnvironmentalAspect";
import QmsEditDraftEnvironmentalAspect from "./pages/QMS/RiskOpportunitiesManagement/EnvironmantalAspect/QmsEditDraftEnvironmentalAspect";
import QmsViewDraftEnvironmentalAspect from "./pages/QMS/RiskOpportunitiesManagement/EnvironmantalAspect/QmsViewDraftEnvironmentalAspect";
import QmsListEnvironmentalImpact from "./pages/QMS/RiskOpportunitiesManagement/EnvironmetalImpactAssesments/QmsListEnvironmentalImpact";
import QmsAddEnvironmentalImpact from "./pages/QMS/RiskOpportunitiesManagement/EnvironmetalImpactAssesments/QmsAddEnvironmentalImpact";
import QmsEditEnvironmentalImpact from "./pages/QMS/RiskOpportunitiesManagement/EnvironmetalImpactAssesments/QmsEditEnvironmentalImpact";
import QmsViewEnvironmentalImpact from "./pages/QMS/RiskOpportunitiesManagement/EnvironmetalImpactAssesments/QmsViewEnvironmentalImpact";
import QmsDraftEnvironmentalImpact from "./pages/QMS/RiskOpportunitiesManagement/EnvironmetalImpactAssesments/QmsDraftEnvironmentalImpact";
import QmsEditDraftEnvironmentalImpact from "./pages/QMS/RiskOpportunitiesManagement/EnvironmetalImpactAssesments/QmsEditDraftEnvironmentalImpact";
import QmsViewDraftEnvironmentalImpact from "./pages/QMS/RiskOpportunitiesManagement/EnvironmetalImpactAssesments/QmsViewDraftEnvironmentalImpact";
import QmsListEnvironmentalIncidents from "./pages/QMS/RiskOpportunitiesManagement/EnvironmentalIncidents/QmsListEnvironmentalIncidents";
import QmsAddEnvironmentalIncidents from "./pages/QMS/RiskOpportunitiesManagement/EnvironmentalIncidents/QmsAddEnvironmentalIncidents";
import QmsEditEnvironmentalIncidents from "./pages/QMS/RiskOpportunitiesManagement/EnvironmentalIncidents/QmsEditEnvironmentalIncidents";
import QmsViewEnvironmentalIncidents from "./pages/QMS/RiskOpportunitiesManagement/EnvironmentalIncidents/QmsViewEnvironmentalIncidents";
import QmsDraftEnvironmentalIncidents from "./pages/QMS/RiskOpportunitiesManagement/EnvironmentalIncidents/QmsDraftEnvironmentalIncidents";
import QmsDraftViewEnvironmentalIncidents from "./pages/QMS/RiskOpportunitiesManagement/EnvironmentalIncidents/QmsDraftViewEnvironmentalIncidents";
import QmsDraftEditEnvironmentalIncidents from "./pages/QMS/RiskOpportunitiesManagement/EnvironmentalIncidents/QmsDraftEditEnvironmentalIncidents";
import QmsListEnvironmentalWasteManagement from "./pages/QMS/RiskOpportunitiesManagement/EnvironmentalWasteManagement/QmsListEnvironmentalWasteManagement";
import QmsAddEnvironmentalWasteManagement from "./pages/QMS/RiskOpportunitiesManagement/EnvironmentalWasteManagement/QmsAddEnvironmentalWasteManagement";
import QmsEditEnvironmentalWasteManagement from "./pages/QMS/RiskOpportunitiesManagement/EnvironmentalWasteManagement/QmsEditEnvironmentalWasteManagement";
import QmsViewEnvironmentalWasteManagement from "./pages/QMS/RiskOpportunitiesManagement/EnvironmentalWasteManagement/QmsViewEnvironmentalWasteManagement";
import QmsDraftEnvironmentalWasteManagement from "./pages/QMS/RiskOpportunitiesManagement/EnvironmentalWasteManagement/QmsDraftEnvironmentalWasteManagement";
import QmsDraftEditEnvironmentalWasteManagement from "./pages/QMS/RiskOpportunitiesManagement/EnvironmentalWasteManagement/QmsDraftEditEnvironmentalWasteManagement";
import QmsDraftViewEnvironmentalWasteManagement from "./pages/QMS/RiskOpportunitiesManagement/EnvironmentalWasteManagement/QmsDraftViewEnvironmentalWasteManagement";
import QmsListHealthSafetyHazards from "./pages/QMS/RiskOpportunitiesManagement/HealthandSafetyHazards/QmsListHealthSafetyHazards";
import QmsAddHealthSafetyHazards from "./pages/QMS/RiskOpportunitiesManagement/HealthandSafetyHazards/QmsAddHealthSafetyHazards";
import QmsEditHealthSafetyHazards from "./pages/QMS/RiskOpportunitiesManagement/HealthandSafetyHazards/QmsEditHealthSafetyHazards";
import QmsViewHealthSafetyHazards from "./pages/QMS/RiskOpportunitiesManagement/HealthandSafetyHazards/QmsViewHealthSafetyHazards";
import QmsDraftHealthSafetyHazards from "./pages/QMS/RiskOpportunitiesManagement/HealthandSafetyHazards/QmsDraftHealthSafetyHazards";
import QmsDraftEditHealthSafetyHazards from "./pages/QMS/RiskOpportunitiesManagement/HealthandSafetyHazards/QmsDraftEditHealthSafetyHazards";
import QmsDraftViewHealthSafetyHazards from "./pages/QMS/RiskOpportunitiesManagement/HealthandSafetyHazards/QmsDraftViewHealthSafetyHazards";
import QmsListHealthSafetyRiskAssessments from "./pages/QMS/RiskOpportunitiesManagement/HealthandSafetyRiskAssessments/QmsListHealthSafetyRiskAssessments";
import QmsAddHealthSafetyRiskAssessments from "./pages/QMS/RiskOpportunitiesManagement/HealthandSafetyRiskAssessments/QmsAddHealthSafetyRiskAssessments";
import QmsEditHealthSafetyRiskAssessments from "./pages/QMS/RiskOpportunitiesManagement/HealthandSafetyRiskAssessments/QmsEditHealthSafetyRiskAssessments";
import QmsViewHealthSafetyRiskAssessments from "./pages/QMS/RiskOpportunitiesManagement/HealthandSafetyRiskAssessments/QmsViewHealthSafetyRiskAssessments";
import QmsDraftHealthSafetyRiskAssessments from "./pages/QMS/RiskOpportunitiesManagement/HealthandSafetyRiskAssessments/QmsDraftHealthSafetyRiskAssessments";
import QmsEditDraftHealthSafetyRiskAssessments from "./pages/QMS/RiskOpportunitiesManagement/HealthandSafetyRiskAssessments/QmsEditDraftHealthSafetyRiskAssessments";
import QmsViewDraftHealthSafetyRiskAssessments from "./pages/QMS/RiskOpportunitiesManagement/HealthandSafetyRiskAssessments/QmsViewDraftHealthSafetyRiskAssessments";
import QmsListHealthSafetyIncidents from "./pages/QMS/RiskOpportunitiesManagement/HealthandSafetyIncidents/QmsListHealthSafetyIncidents";
import QmsAddHealthSafetyIncidents from "./pages/QMS/RiskOpportunitiesManagement/HealthandSafetyIncidents/QmsAddHealthSafetyIncidents";
import QmsEditHealthSafetyIncidents from "./pages/QMS/RiskOpportunitiesManagement/HealthandSafetyIncidents/QmsEditHealthSafetyIncidents";
import QmsViewHealthSafetyIncidents from "./pages/QMS/RiskOpportunitiesManagement/HealthandSafetyIncidents/QmsViewHealthSafetyIncidents";
import QmsDraftHealthSafetyIncidents from "./pages/QMS/RiskOpportunitiesManagement/HealthandSafetyIncidents/QmsDraftHealthSafetyIncidents";
import QmsDraftEditHealthSafetyIncidents from "./pages/QMS/RiskOpportunitiesManagement/HealthandSafetyIncidents/QmsDraftEditHealthSafetyIncidents";
import QmsDraftViewHealthSafetyIncidents from "./pages/QMS/RiskOpportunitiesManagement/HealthandSafetyIncidents/QmsDraftViewHealthSafetyIncidents";
import QmsOutboxForward from "./pages/QMS/ActionsMeetingManagement/SystemMessaging/QmsOutboxForward";
import QmsListRiskAssessment from "./pages/QMS/RiskOpportunitiesManagement/ProcessRisksAssessments/QmsListRiskAssessment";
import QmsListOpportunityAssessment from "./pages/QMS/RiskOpportunitiesManagement/ProcessOpportunitiesAssessment/QmsListOpportunityAssessment";
import QmsAddOpportunityAssessment from "./pages/QMS/RiskOpportunitiesManagement/ProcessOpportunitiesAssessment/QmsAddOpportunityAssessment";
import QmsEditOpportunityAssessment from "./pages/QMS/RiskOpportunitiesManagement/ProcessOpportunitiesAssessment/QmsEditOpportunityAssessment";
import QmsViewOpportunityAssessment from "./pages/QMS/RiskOpportunitiesManagement/ProcessOpportunitiesAssessment/QmsViewOpportunityAssessment";

const ThemedApp = () => {
  const { theme } = useTheme();

  // Apply the theme class to the body
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/">
          <Route index element={<AdminLogin />} />
          <Route path="forgotpassword" element={<Password />} />
          <Route path="changepassword" element={<ChangePassword />} />
        </Route>


        <Route path="/company-login">
          <Route index element={<CompanyLogin />} />
        </Route>

        <Route path="/company" element={<CompanyLayout />}>  
          <Route path="dashboard" element={<CompanyDashboard />} />

          {/* QMS Documentation */}
          <Route path="qms/policy" element={<QmsPolicy />} />
          <Route path="qms/addpolicy" element={<AddQmsPolicy />} />
          <Route path="qms/editpolicy/:id" element={<EditQmsPolicy />} />

          <Route path="qms/manual" element={<QmsManual />} />
          <Route path="qms/addmanual" element={<AddQmsManual />} />
          <Route path="qms/viewmanual/:id" element={<ViewQmsManual />} />
          <Route path="qms/editmanual/:id" element={<EditQmsmanual />} />
          <Route path="qms/draftmanual" element={<DraftQmsManual />} />
          <Route path="qms/editdraftmanual/:id" element={<EditDraftQmsManual />} />
          <Route path="notifications" element={<ViewAllNotifications />} />


          <Route path="qms/procedure" element={<QmsProcedure />} />
          <Route path="qms/addprocedure" element={<AddQmsProcedure />} />
          <Route path="qms/viewprocedure/:id" element={<ViewQmsProcedure />} />
          <Route path="qms/editprocedure/:id" element={<EditQmsProcedure />} />
          <Route path="qms/draftprocedure" element={<DraftQmsProcedure />} />
          <Route path="qms/editdraftprocedure/:id" element={<EditDraftQmsProcedure />} />

          <Route path="qms/record-format" element={<QmsRecordFormat />} />
          <Route path="qms/addrecordformat" element={<AddQmsRecordFormat />} />
          <Route path="qms/viewrecordformat/:id" element={<ViewQmsRecordFormat />} />
          <Route path="qms/editrecordformat/:id" element={<EditQmsRecordFormat />} />
          <Route path="qms/draftrecordformat" element={<DraftQmsRecordFormat />} />
          <Route path="qms/editdraftrecordformat/:id" element={<EditDraftQmsRecordFormat />} />

          <Route path="qms/interested-parties" element={<QmsInterestedParties />} />
          <Route path="qms/add-interested-parties" element={<AddQmsInterestedParties />} />
          <Route path="qms/edit-interested-parties/:id" element={<EditQmsInterestedParties />} />
          <Route path="qms/view-interested-parties/:id" element={<ViewQmsInterestedParties />} />
          <Route path="qms/draft-interested-parties" element={<DraftQmsInterestedParties />} />
          <Route path="qms/edit-draft-interested-parties/:id" element={<EditDraftQmsInterestedParties />} />
          <Route path="qms/view-draft-interested-parties/:id" element={<ViewQmsDraftInterestedParties />} />



          <Route path="qms/processes" element={<QmsProcesses />} />
          <Route path="qms/add-processes" element={<AddQmsProcesses />} />
          <Route path="qms/view-processes/:id" element={<ViewQmsProcesses />} />
          <Route path="qms/edit-processes/:id" element={<EditQmsProcesses />} />
          <Route path="qms/draft-processes" element={<DraftQmsProcesses />} />
          <Route path="qms/edit-draft-processes/:id" element={<EditQmsDraftProcesses />} />
          <Route path="qms/view-draft-processes/:id" element={<ViewQmsDraftProcesses />} />


          <Route path="qms/scope" element={<QmsScope />} />
          <Route path="qms/addscope" element={<AddScope />} />
          <Route path="qms/editscope/:id" element={<EditScope />} />


          {/* QMS Employee Training */}
          <Route path="qms/add-training" element={<QmsAddTraining />} />

          <Route path="qms/list-training" element={<QmsListTraining />} />
          <Route path="qms/edit-training/:id" element={<QmsEditTraining />} />
          <Route path="qms/view-training/:id" element={<QmsViewTraining />} />
          <Route path="qms/review-training/:id" element={<QmsReviewTraining />} />
          <Route path="qms/draft-training" element={<QmsDraftListTraining />} />
          <Route path="qms/edit-draft-training/:id" element={<QmsEditDraftListTraining />} />
          <Route path="qms/view-draft-training/:id" element={<QmsViewDraftTraining />} />

          <Route path="qms/listuser-training" element={<QmsListUserTraining />} />

          <Route path="qms/training-evaluation" element={<QmsTrainingEvaluation />} />
          <Route path="qms/add-training-evaluation" element={<AddQmsTrainingEvaluation />} />
          <Route path="qms/edits-training-evaluation/:id" element={<EditQmsTrainingEvaluation />} />
          <Route path="qms/views-training-evaluation/:id" element={<ViewQmsTrainingEvaluation />} />
          <Route path="qms/drafts-training-evaluation" element={<DraftQmsTrainingEvaluation />} />
          <Route path="qms/edits-drafts-training-evaluation/:id" element={<EditsQmsDraftTrainingEvaluation />} />
          <Route path="qms/views-drafts-training-evaluation/:id" element={<ViewsQmsDraftTrainingEvaluation />} />
          <Route path="qms/training-evaluation-graph" element={<QmsTrainingEvaluationGraph />} />

          <Route path="qms/employee-performance" element={<QmsEmployeePerformance />} />
          <Route path="qms/add-employee-performance" element={<AddQmsEmployeePerformance />} />
          <Route path="qms/edit-employee-performance/:id" element={<EditQmsEmployeePerformance />} />
          <Route path="qms/view-employee-performance/:id" element={<ViewQmsEmployeePerformance />} />
          <Route path="qms/draft-employee-performance" element={<QmsDraftEmployeePerformance />} />
          <Route path="qms/edit-draft-employee-performance/:id" element={<QmsEditDraftEmployeePerformance />} />
          <Route path="qms/view-draft-employee-performance/:id" element={<QmsViewDraftEmployeePerformance />} />
          <Route path="qms/employees-performance-graph" element={<QmsEmployeePerformanceGraph />} />

          <Route path="qms/list-satisfaction-survey" element={<QmsEmployeeSatisfaction />} />
          <Route path="qms/add-satisfaction-survey" element={<AddQmsEmployeeSatisfaction />} />
          <Route path="qms/edit-satisfaction-survey/:id" element={<EditQmsEmployeeSatisfaction />} />
          <Route path="qms/view-satisfaction-survey/:id" element={<ViewQmsEmployeeSatisfaction />} />
          <Route path="qms/draft-satisfaction-survey" element={<QmsDraftEmployeeSatisfaction />} />
          <Route path="qms/edit-draft-satisfaction-survey/:id" element={<QmsEditDraftEmployeeSatisfaction />} />
          <Route path="qms/view-draft-satisfaction-survey/:id" element={<QmsViewDraftEmployeeSatisfaction />} />

          <Route path="qms/list-awareness-training" element={<QmsListAwarenessTraining />} />
          <Route path="qms/add-awareness-training" element={<QmsAddAwarenessTraining />} />
          <Route path="qms/edit-awareness-training/:id" element={<QmsEditAwarenessTraining />} />
          <Route path="qms/view-awareness-training/:id" element={<QmsViewAwarenessTraining />} />
          <Route path="qms/draft-awareness-training" element={<QmsDraftAwarenessTraining />} />
          <Route path="qms/edit-draft-awareness-training/:id" element={<QmsEditDraftAwarenessTraining />} />
          <Route path="qms/view-draft-awareness-training/:id" element={<QmsViewDraftAwarenessTraining />} />





          {/* QMS Actions, Meeting and Communication Management */}
          <Route path="qms/list-meeting" element={<QmsListMeeting />} />
          <Route path="qms/add-meeting" element={<QmsAddMeeting />} />
          <Route path="qms/edit-meeting/:id" element={<QmsEditMeeting />} />
          <Route path="qms/view-meeting/:id" element={<QmsViewMeeting />} />
          <Route path="qms/draft-meeting" element={<QmsDraftMeeting />} />
          <Route path="qms/edit-draft-meeting/:id" element={<QmsEditDraftMeeting />} />
          <Route path="qms/view-draft-meeting/:id" element={<QmsViewDraftMeeting />} />

          <Route path="qms/list-inbox" element={<QmsListInboxSystemMessaging />} />
          <Route path="qms/list-trash" element={<QmsListTrashSystemMessaging />} />
          <Route path="qms/list-outbox" element={<QmsListOutboxSystemMessaging />} />
          <Route path="qms/list-draft" element={<QmsListDraftSystemMessaging />} />
          <Route path="qms/compose" element={<QmsComposeSystemMessaging />} />
          <Route path="qms/inbox-replay/:id" element={<QmsInboxReplay />} /> 
          <Route path="qms/inbox-forward/:id" element={<QmsInboxForward />} />
          <Route path="qms/outbox-replay/:id" element={<QmsOutboxReplay />} />
          <Route path="qms/outbox-forward/:id" element={<QmsOutboxForward />} />
          <Route path="qms/edit-draft/:id" element={<QmsEditDraftSystemMessaging />} />

          <Route path="qms/list-internal-problem" element={<QmsListInternalProblems />} />
          <Route path="qms/add-internal-problem" element={<QmsAddInternalProblems />} />

          <Route path="qms/edit-internal-problem/:id" element={<QmsEditInternalProblems />} />
          <Route path="qms/view-internal-problem/:id" element={<QmsViewInternalProblems />} />
          <Route path="qms/draft-internal-problem" element={<QmsDraftInternalProblems />} />
          <Route path="qms/edit-draft-internal-problem/:id" element={<QmsEditDraftInternalProblems />} />
          <Route path="qms/view-draft-internal-problem/:id" element={<QmsViewDraftInternalProblems />} />






          {/* QMS Audits & Inspection management */}
          <Route path="qms/list-audit" element={<QmsListAudit />} />
          <Route path="qms/add-audit" element={<QmsAddAudit />} />
          <Route path="qms/edit-audit/:id" element={<QmsEditAudit />} />
          <Route path="qms/view-audit/:id" element={<QmsViewAudit />} />
          <Route path="qms/draft-audit" element={<QmsDraftAudit />} />
          <Route path="qms/edit-draft-audit/:id" element={<QmsEditDraftAudit />} />
          <Route path="qms/view-draft-audit/:id" element={<QmsViewDraftAudit />} />

          <Route path="qms/list-inspection" element={<QmsListInspection />} />
          <Route path="qms/add-inspection" element={<QmsAddInspection />} />
          <Route path="qms/edit-inspection/:id" element={<QmsEditInspection />} />
          <Route path="qms/view-inspection/:id" element={<QmsViewInspection />} />
          <Route path="qms/draft-inspection" element={<QmsDraftInspection />} />
          <Route path="qms/edit-draft-inspection/:id" element={<QmsEditDraftInspections />} />
          <Route path="qms/view-draft-inspection/:id" element={<QmsViewDraftInspection />} />






          {/* QMS Customer Management */}
          <Route path="qms/add-customer" element={<QmsAddCustomer />} />

          <Route path="qms/list-customer" element={<QmsListCustomer />} />
          <Route path="qms/edit-customer/:id" element={<QmsEditCustomer />} />
          <Route path="qms/view-customer/:id" element={<QmsViewCustomer />} />
          <Route path="qms/draft-customer" element={<QmsDraftCustomer />} />
          <Route path="qms/edit-draft-customer/:id" element={<QmsEditDraftCustomer />} />
          <Route path="qms/view-draft-customer/:id" element={<QmsViewDraftCustomer />} />

          <Route path="qms/add-complaints" element={<QmsAddComplaints />} />
          <Route path="qms/list-complaints" element={<QmsListComplaints />} />
          <Route path="qms/edit-complaints/:id" element={<QmsEditComplaints />} />
          <Route path="qms/view-complaints/:id" element={<QmsViewComplaints />} />
          <Route path="qms/draft-complaints" element={<QmsDraftComplaints />} />
          <Route path="qms/edit-draft-complaints/:id" element={<QmsDraftEditComplaints />} />
          <Route path="qms/view-draft-complaints/:id" element={<QmsDraftViewComplaints />} />

          <Route path="qms/list-customer-survey" element={<QmsListCustomerSurvey />} />
          <Route path="qms/add-customer-survey" element={<QmsAddCustomerSurvey />} />
          <Route path="qms/edits-customer-survey/:id" element={<QmsEditCustomerSurvey />} />
          <Route path="qms/view-customer-survey/:id" element={<QmsViewCustomerSurvey />} />
          <Route path="qms/drafts-customer-survey" element={<QmsDraftCustomerSurvey />} />
          <Route path="qms/edit-draft-customer-survey/:id" element={<QmsEditDraftCustomerSurvey />} />
          <Route path="qms/view-draft-customer-survey/:id" element={<QmsViewDraftCustomerSurvey />} />






          {/* QMS Supplier Management*/}
          <Route path="qms/add-supplier" element={<QmsAddSupplier />} />
          <Route path="qms/list-supplier" element={<QmsListSupplier />} />
          <Route path="qms/edit-supplier/:id" element={<QmsEditSupplier />} />
          <Route path="qms/view-supplier/:id" element={<QmsViewSupplier />} />
          <Route path="qms/draft-supplier" element={<QmsDraftSupplier />} />
          <Route path="qms/draft-edit-supplier/:id" element={<QmsDraftEditSupplier />} />
          <Route path="qms/draft-view-supplier/:id" element={<QmsDraftViewSupplier />} />

          <Route path="qms/add-supplier-problem" element={<QmsAddSupplierProblem />} />
          <Route path="qms/supplier-problem-log" element={<QmsSupplierProblemLog />} />
          <Route path="qms/edits-supplier-problem/:id" element={<QmsEditSupplierProblem />} />
          <Route path="qms/views-supplier-problem/:id" element={<QmsViewSupplierProblem />} />
          <Route path="qms/drafts-supplier-problem" element={<QmsDraftSupplierProblem />} />
          <Route path="qms/edit-drafts-supplier-problem/:id" element={<QmsEditDraftSupplierProblem />} />
          <Route path="qms/view-drafts-supplier-problem/:id" element={<QmsViewDraftSupplierProblem />} />

          <Route path="qms/lists-supplier-evaluation" element={<QmsSupplierPerformace />} />
          <Route path="qms/add-supplier-evaluation" element={<QmsAddSupplierPerformance />} />
          <Route path="qms/edits-supplier-evaluation/:id" element={<QmsEditSupplierPerformance />} />
          <Route path="qms/views-supplier-evaluation/:id" element={<QmsViewSupplierPerformance />} />
          <Route path="qms/drafts-supplier-evaluation" element={<QmsDraftSupplierPerformance />} />
          <Route path="qms/edits-drafts-supplier-evaluation/:id" element={<QmsEditDraftSupplierPerformance />} />
          <Route path="qms/views-drafts-supplier-evaluation/:id" element={<QmsViewDraftSupplierPerformance />} />





          {/* QMS Compliance*/}
          <Route path="qms/list-compliance" element={<QmsListCompliance />} />
          <Route path="qms/add-compliance" element={<QmsAddCompliance />} />
          <Route path="qms/edit-compliance/:id" element={<QmsEditCompliance />} />
          <Route path="qms/draft-compliance" element={<QmsDraftCompliance />} />
          <Route path="qms/view-compliance/:id" element={<QmsViewCompliance />} />
          <Route path="qms/edit-draft-compliance/:id" element={<QmsEditDraftCompliance />} />
          <Route path="qms/view-draft-compliance/:id" element={<QmsDraftViewCompliance />} />

          <Route path="qms/list-legal-requirements" element={<QmsListLegalRequirements />} />
          <Route path="qms/add-legal-requirements" element={<QmsAddLegalRequirements />} />
          <Route path="qms/edit-legal-requirements/:id" element={<QmsEditLegalRequirements />} />
          <Route path="qms/view-legal-requirements/:id" element={<QmsViewLegalRequirements />} />
          <Route path="qms/draft-legal-requirements" element={<QmsDraftLegalRequirements />} />
          <Route path="qms/view-draft-legal-requirements/:id" element={<QmsDraftViewLegalRequirements />} />
          <Route path="qms/edit-draft-legal-requirements/:id" element={<QmsDraftEditLegalRequirements />} />

          <Route path="qms/list-evaluation-compliance" element={<QmsListEvaluationCompliance />} />
          <Route path="qms/add-evaluation-compliance" element={<QmsAddEvaluationCompliance />} />
          <Route path="qms/edit-evaluation-compliance/:id" element={<QmsEditEvaluationCompliance />} />
          <Route path="qms/view-evaluation-compliance/:id" element={<QmsViewEvaluationCompliance />} />
          <Route path="qms/draft-evaluation-compliance" element={<QmsDraftEvaluationCompliance />} />
          <Route path="qms/edit-draft-evaluation-compliance/:id" element={<QmsEditDraftEvaluationCompliance />} />
          <Route path="qms/view-draft-evaluation-compliance/:id" element={<QmsViewDraftEvaluationCompliance />} />

          <Route path="qms/list-management-change" element={<QmsListManagementChange />} />
          <Route path="qms/add-management-change" element={<QmsAddmanagementChange />} />
          <Route path="qms/edit-management-change/:id" element={<QmsEditManagementChange />} />
          <Route path="qms/view-management-change/:id" element={<QmsViewManagementChange />} />
          <Route path="qms/draft-management-change" element={<QmsDraftManagementChange />} />
          <Route path="qms/edit-draft-management-change/:id" element={<QmsEditDraftManagementChange />} />
          <Route path="qms/view-draft-management-change/:id" element={<QmsViewDraftManagementChange />} />

          <Route path="qms/list-sustainability" element={<QmsListSustainability />} />
          <Route path="qms/add-sustainability" element={<QmsAddSustainability />} />
          <Route path="qms/edit-sustainability/:id" element={<QmsEditSustainability />} />
          <Route path="qms/view-sustainability/:id" element={<QmsViewSustainability />} />
          <Route path="qms/draft-sustainability" element={<QmsDraftSustainability />} />
          <Route path="qms/edit-draft-sustainability/:id" element={<QmsEditDraftSustainability />} />
          <Route path="qms/view-draft-sustainability/:id" element={<QmsViewDraftSustainability />} />




          {/* QMS Risk & Opportunities Management*/}
          <Route path="qms/list-environmantal-aspect" element={<QmsListEnvironmentalAspect />} />
          <Route path="qms/add-environmantal-aspect" element={<QmsAddEnvironmentalAspect />} />
          <Route path="qms/edit-environmantal-aspect/:id" element={<QmsEditEnvironmentalAspect />} />
          <Route path="qms/view-environmantal-aspect/:id" element={<QmsViewEnvironmentalAspect />} />
          <Route path="qms/draft-environmantal-aspect" element={<QmsDraftEnvironmentalAspect />} />
          <Route path="qms/edit-draft-environmantal-aspect/:id" element={<QmsEditDraftEnvironmentalAspect />} />
          <Route path="qms/view-draft-environmantal-aspect/:id" element={<QmsViewDraftEnvironmentalAspect />} />

          <Route path="qms/list-environmantal-impact" element={<QmsListEnvironmentalImpact />} />
          <Route path="qms/add-environmantal-impact" element={<QmsAddEnvironmentalImpact />} />
          <Route path="qms/edit-environmantal-impact/:id" element={<QmsEditEnvironmentalImpact />} />
          <Route path="qms/view-environmantal-impact/:id" element={<QmsViewEnvironmentalImpact />} />
          <Route path="qms/draft-environmantal-impact" element={<QmsDraftEnvironmentalImpact />} />
          <Route path="qms/edit-draft-environmantal-impact/:id" element={<QmsEditDraftEnvironmentalImpact />} />
          <Route path="qms/view-draft-environmantal-impact/:id" element={<QmsViewDraftEnvironmentalImpact />} />

          <Route path="qms/list-environmantal-incident" element={<QmsListEnvironmentalIncidents />} />
          <Route path="qms/add-environmantal-incident" element={<QmsAddEnvironmentalIncidents />} />
          <Route path="qms/edit-environmantal-incident/:id" element={<QmsEditEnvironmentalIncidents />} />
          <Route path="qms/view-environmantal-incident/:id" element={<QmsViewEnvironmentalIncidents />} />
          <Route path="qms/draft-environmantal-incident" element={<QmsDraftEnvironmentalIncidents />} />
          <Route path="qms/edit-draft-environmantal-incident/:id" element={<QmsDraftEditEnvironmentalIncidents />} />
          <Route path="qms/view-draft-environmantal-incident/:id" element={<QmsDraftViewEnvironmentalIncidents />} />

          <Route path="qms/list-environmantal-waste-management" element={<QmsListEnvironmentalWasteManagement />} />
          <Route path="qms/add-environmantal-waste-management" element={<QmsAddEnvironmentalWasteManagement />} />
          <Route path="qms/edit-environmantal-waste-management/:id" element={<QmsEditEnvironmentalWasteManagement />} />
          <Route path="qms/view-environmantal-waste-management/:id" element={<QmsViewEnvironmentalWasteManagement />} />
          <Route path="qms/draft-environmantal-waste-management" element={<QmsDraftEnvironmentalWasteManagement />} />
          <Route path="qms/edit-draft-environmantal-waste-management/:id" element={<QmsDraftEditEnvironmentalWasteManagement />} />
          <Route path="qms/view-draft-environmantal-waste-management/:id" element={<QmsDraftViewEnvironmentalWasteManagement />} />

          <Route path="qms/list-health-safety-hazards" element={<QmsListHealthSafetyHazards />} />
          <Route path="qms/add-health-safety-hazards" element={<QmsAddHealthSafetyHazards />} />
          <Route path="qms/edit-health-safety-hazards/:id" element={<QmsEditHealthSafetyHazards />} />
          <Route path="qms/view-health-safety-hazards/:id" element={<QmsViewHealthSafetyHazards />} />
          <Route path="qms/draft-health-safety-hazards" element={<QmsDraftHealthSafetyHazards />} />
          <Route path="qms/edit-draft-health-safety-hazards/:id" element={<QmsDraftEditHealthSafetyHazards />} />
          <Route path="qms/view-draft-health-safety-hazards/:id" element={<QmsDraftViewHealthSafetyHazards />} />

          <Route path="qms/list-health-safety-assessments" element={<QmsListHealthSafetyRiskAssessments />} />
          <Route path="qms/add-health-safety-assessments" element={<QmsAddHealthSafetyRiskAssessments />} />
          <Route path="qms/edit-health-safety-assessments/:id" element={<QmsEditHealthSafetyRiskAssessments />} />
          <Route path="qms/view-health-safety-assessments/:id" element={<QmsViewHealthSafetyRiskAssessments />} />
          <Route path="qms/draft-health-safety-assessments" element={<QmsDraftHealthSafetyRiskAssessments />} />
          <Route path="qms/edit-draft-health-safety-assessments/:id" element={<QmsEditDraftHealthSafetyRiskAssessments />} />
          <Route path="qms/view-draft-health-safety-assessments/:id" element={<QmsViewDraftHealthSafetyRiskAssessments />} />

          <Route path="qms/list-health-safety-incidents" element={<QmsListHealthSafetyIncidents />} />
          <Route path="qms/add-health-safety-incidents" element={<QmsAddHealthSafetyIncidents />} />
          <Route path="qms/edit-health-safety-incidents/:id" element={<QmsEditHealthSafetyIncidents />} />
          <Route path="qms/view-health-safety-incidents/:id" element={<QmsViewHealthSafetyIncidents />} />  
          <Route path="qms/draft-health-safety-incidents" element={<QmsDraftHealthSafetyIncidents />} />
          <Route path="qms/edit-draft-health-safety-incidents/:id" element={<QmsDraftEditHealthSafetyIncidents />} />
          <Route path="qms/view-draft-health-safety-incidents/:id" element={<QmsDraftViewHealthSafetyIncidents />} />

          <Route path="qms/list-process-risks-assessments" element={<QmsListRiskAssessment />} />

          <Route path="qms/list-opportunity-assessment" element={<QmsListOpportunityAssessment />} />
          <Route path="qms/add-opportunity-assessment" element={<QmsAddOpportunityAssessment />} />
          <Route path="qms/edit-opportunity-assessment/:id" element={<QmsEditOpportunityAssessment />} />
          <Route path="qms/view-opportunity-assessment/:id" element={<QmsViewOpportunityAssessment />} />








          {/* QMS Energy Management*/}
          <Route path="qms/list-energy-review" element={<QmsListEnergyReview />} />
          <Route path="qms/add-energy-review" element={<QmsAddEnergyReview />} />
          <Route path="qms/edit-energy-review/:id" element={<QmsEditEnergyReview />} />
          <Route path="qms/view-energy-review/:id" element={<QmsViewEnergyReview />} />
          <Route path="qms/draft-energy-review" element={<QmsDraftEnergyReview />} />
          <Route path="qms/edit-draft-energy-review/:id" element={<QmsDraftEditEnergyReview />} />
          <Route path="qms/view-draft-energy-review/:id" element={<QmsDraftViewEnergyReview />} />

          <Route path="qms/list-energy-baselines" element={<QmsListEnergyBaselines />} />
          <Route path="qms/add-energy-baselines" element={<QmsAddEnergyBaseLines />} />
          <Route path="qms/edit-energy-baselines/:id" element={<QmsEditEnergyBaseLines />} />
          <Route path="qms/view-energy-baselines/:id" element={<QmsViewEnergyBaseLines />} />
          <Route path="qms/draft-energy-baselines" element={<QmsDraftEnergyBaseLines />} />
          <Route path="qms/edit-draft-energy-baselines/:id" element={<QmsEditDraftEnergyBaseLines />} />
          <Route path="qms/view-draft-energy-baselines/:id" element={<QmsViewDraftEnergyBaseLines />} />

          <Route path="qms/list-significant-energy" element={<QmsListSignificantEnergy />} />
          <Route path="qms/add-significant-energy" element={<QmsAddSignificantEnergy />} />
          <Route path="qms/edit-significant-energy/:id" element={<QmsEditSignificantEnergy />} />
          <Route path="qms/view-significant-energy/:id" element={<QmsViewSignificantEnergy />} />
          <Route path="qms/draft-significant-energy" element={<QmsDraftSignificantEnergy />} />
          <Route path="qms/edit-draft-significant-energy/:id" element={<QmsEditDraftSignificantEnergy />} />
          <Route path="qms/view-draft-significant-energy/:id" element={<QmsViewDraftSignificantEnergy />} />

          <Route path="qms/list-energy-improvement-opportunities" element={<QmsListEnergyImprovement />} />
          <Route path="qms/add-energy-improvement-opportunities" element={<QmsAddEnergyImprovement />} />
          <Route path="qms/edit-energy-improvement-opportunities/:id" element={<QmsEditEnergyImprovement />} />
          <Route path="qms/view-energy-improvement-opportunities/:id" element={<QmsViewEnergyImprovement />} />
          <Route path="qms/draft-energy-improvement-opportunities" element={<QmsDraftEnergyImprovements />} />
          <Route path="qms/edit-draft-energy-improvement-opportunities/:id" element={<QmsEditDraftEnergyImprovement />} />
          <Route path="qms/view-draft-energy-improvement-opportunities/:id" element={<QmsViewDraftEnergyImprovement />} />

          <Route path="qms/list-energy-action-plan" element={<QmsListEnergyAction />} />
          <Route path="qms/add-energy-action-plan" element={<QmsAddEnergyAction />} />
          <Route path="qms/edit-energy-action-plan/:id" element={<QmsEditEnergyAction />} />
          <Route path="qms/view-energy-action-plan/:id" element={<QmsViewEnergyAction />} />
          <Route path="qms/draft-energy-action-plan" element={<QmsDraftEnergyAction />} />
          <Route path="qms/edit-draft-energy-action-plan/:id" element={<QmsDraftEditEnergyAction />} />
          <Route path="qms/view-draft-energy-action-plan/:id" element={<QmsDraftViewEnergyAction />} />









          {/* QMS Correction Corrective Actions & Preventive Actions*/}
          <Route path="qms/list-correction-actions" element={<QmsListCorrectionActions />} />
          <Route path="qms/add-correction-actions" element={<QmsAddCorrectionActions />} />
          <Route path="qms/edit-correction-actions/:id" element={<QmsEditCorrectionActions />} />
          <Route path="qms/view-correction-actions/:id" element={<QmsViewCorrectionActions />} />
          <Route path="qms/draft-correction-actions" element={<QmsDraftCorrectionActions />} />
          <Route path="qms/edit-draft-correction-actions/:id" element={<QmsEditDraftCorrectionActions />} />
          <Route path="qms/view-draft-correction-actions/:id" element={<QmsViewDraftCorrectionActions />} />

          <Route path="qms/list-preventive-actions" element={<QmsListPreventiveActions />} />
          <Route path="qms/add-preventive-actions" element={<QmsAddPreventiveActions />} />
          <Route path="qms/edit-preventive-actions/:id" element={<QmsEditPreventiveActions />} />
          <Route path="qms/view-preventive-actions/:id" element={<QmsViewPreventiveActions />} />
          <Route path="qms/draft-preventive-actions" element={<QmsDraftPreventiveActions />} />
          <Route path="qms/edit-draft-preventive-actions/:id" element={<QmsEditDraftPreventiveActions />} />
          <Route path="qms/view-draft-preventive-actions/:id" element={<QmsViewDraftPreventiveActions />} />






          {/* QMS Objectives & Targets*/}
          <Route path="qms/list-objectives" element={<QmsListObjectives />} />
          <Route path="qms/add-objectives" element={<QmsAddObjectives />} />
          <Route path="qms/edit-objectives/:id" element={<QmsEditObjectives />} />
          <Route path="qms/view-objectives/:id" element={<QmsViewObjectives />} />
          <Route path="qms/draft-objectives" element={<QmsDraftObjectives />} />
          <Route path="qms/edit-draft-objectives/:id" element={<QmsEditDraftObjectives />} />
          <Route path="qms/view-draft-objectives/:id" element={<QmsViewDraftObjectives />} />

          <Route path="qms/list-targets" element={<QmsListTargets />} />
          <Route path="qms/add-targets" element={<QmsAddTargets />} />
          <Route path="qms/edit-targets/:id" element={<QmsEditTargets />} />
          <Route path="qms/view-targets/:id" element={<QmsViewTargets />} />
          <Route path="qms/draft-targets" element={<QmsDraftTargets />} />
          <Route path="qms/edit-draft-targets/:id" element={<QmsEditDraftTargets />} />
          <Route path="qms/view-draft-targets/:id" element={<QmsViewDraftTargets />} /> 











          {/* QMS User Management */}
          <Route path="qms/adduser" element={<QMSAddUser />} />
          <Route path="qms/listuser" element={<QMSListUser />} />
          <Route path="qms/edituser/:id" element={<QMSEditUser />} />
          <Route path="qms/user-details/:id" element={<QMSViewUser />} />







          {/* QMS Non Conformity Report Management */}
          <Route path="qms/list-nonconformity" element={<QmsListNonconformityReport />} />
          <Route path="qms/add-nonconformity" element={<QmsAddNonConformityReport />} />
          <Route path="qms/edit-nonconformity/:id" element={<QmsEditNonConformityReport />} />
          <Route path="qms/view-nonconformity/:id" element={<QmsViewNonConformityReport />} />
          <Route path="qms/draft-nonconformity" element={<QmsDraftNonConformityReport />} />
          <Route path="qms/edit-draft-nonconformity/:id" element={<QmsEditDraftNonConformity />} />
          <Route path="qms/view-draft-nonconformity/:id" element={<QmsViewDraftNonConformity />} />











          {/* EMS Documentation */}
          <Route path="ems/policy" element={<EmsPolicy />} />
          <Route path="ems/addpolicy" element={<AddEmspolicy />} />

          <Route path="ems/manual" element={<EmsManual />} />
          <Route path="ems/addmanual" element={<AddEmsManual />} />

          <Route path="ems/procedure" element={<EmsProcedure />} />
          <Route path="ems/addprocedure" element={<AddEmsProcedure />} />

          <Route path="ems/record-format" element={<EmsRecordFormat />} />
          <Route path="ems/addrecordformat" element={<AddEmsRecordFormat />} />


          {/* EMS User Management */}
          <Route path="ems/adduser" element={<EMSAddUser />} />
          <Route path="ems/listuser" element={<EMSListUser />} />




          {/* OHS Documentation */}
          <Route path="ohs/policy" element={<OhsPolicy />} />
          <Route path="ohs/addpolicy" element={<AddOhsPolicy />} />

          <Route path="ohs/manual" element={<OhsManual />} />
          <Route path="ohs/addmanual" element={<AddOhsManual />} />

          <Route path="ohs/procedure" element={<OhsProcedure />} />
          <Route path="ohs/addprocedure" element={<AddOhsProcedure />} />

          <Route path="ohs/record-format" element={<OhsRecordFormat />} />
          <Route path="ohs/addrecordformat" element={<AddOhsRecordFormat />} />


          {/* OHS User Management */}
          <Route path="ohs/adduser" element={<OHSAddUser />} />
          <Route path="ohs/listuser" element={<OHSListUser />} />




          {/* EnMS Documentation */}
          <Route path="enms/policy" element={<EnMSPolicy />} />
          <Route path="enms/addpolicy" element={<AddEnMSPolicy />} />

          <Route path="enms/manual" element={<EnMSManual />} />
          <Route path="enms/addmanual" element={<AddEnMSManual />} />

          <Route path="enms/procedure" element={<EnMSProcedure />} />
          <Route path="enms/addprocedure" element={<AddEnMSProcedure />} />

          <Route path="enms/record-format" element={<EnMSRecordFormat />} />
          <Route path="enms/addrecordformat" element={<AddEnMSRecordFormat />} />


          {/* EnMS User Management */}
          <Route path="enms/adduser" element={<EnMSAddUser />} />
          <Route path="enms/listuser" element={<EnMSListUser />} />




          {/* BMS Documentation */}
          <Route path="bms/policy" element={<BMSPolicy />} />
          <Route path="bms/addpolicy" element={<AddBMSPolicy />} />

          <Route path="bms/manual" element={<BmsManual />} />
          <Route path="bms/addmanual" element={<AddBmsManual />} />

          <Route path="bms/procedure" element={<BmsProcedure />} />
          <Route path="bms/addprocedure" element={<AddBmsProcedure />} />

          <Route path="bms/record-format" element={<BmsRecordFormat />} />
          <Route path="bms/addrecordformat" element={<AddBmsRecordFormat />} />


          {/* BMS User Management */}
          <Route path="bms/adduser" element={<BMSAddUser />} />
          <Route path="bms/listuser" element={<BMSListUser />} />





          {/* AMS Documentation */}
          <Route path="ams/policy" element={<AMSPolicy />} />
          <Route path="ams/addpolicy" element={<AddAMSPolicy />} />

          <Route path="ams/manual" element={<AmsManual />} />
          <Route path="ams/addmanual" element={<AddAmsManual />} />

          <Route path="ams/procedure" element={<AmsProcedure />} />
          <Route path="ams/addprocedure" element={<AddAmsProcedure />} />

          <Route path="ams/record-format" element={<AmsRecordFormat />} />
          <Route path="ams/addrecordformat" element={<AddAmsRecordFormat />} />


          {/* AMS User Management */}
          <Route path="ams/adduser" element={<AMSAddUser />} />
          <Route path="ams/listuser" element={<AMSListUser />} />






          <Route path="backup" element={<CompanyBackup />} />
        </Route>

        {/* Admin Routes with Layout */}
        <Route path="/admin" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="companies" element={<Companies />} />

          <Route path="add-subscriber" element={<AddSubscriber />} />
          <Route path="manage-subscriber" element={<ManageSubscriber />} />
          <Route path="change-subscriber/:id" element={<ChangeSubscription />} />

          <Route path="add-subscription-plan" element={<AddSubscriptionPlan />} />
          <Route path="manage-subscription" element={<ManageSubscription />} />
          <Route path="edit-subscription/:id" element={<EditSubscription />} />



          <Route path="addcompany" element={<AddCompany />} />
          <Route path="viewcompany/:companyId" element={<ViewCompany />} />
          <Route path="editcompany/:companyId" element={<EditCompany />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <ThemeProvider>
    <ThemedApp />
  </ThemeProvider>
);

export default App;